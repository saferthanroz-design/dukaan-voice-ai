import {displayName, normalizeKey} from './commands.mjs';

export const storageKey = 'dukaan-voice-ai-demo-v1';
export const zone = 'Asia/Kolkata';
export const money = cents => new Intl.NumberFormat('en-IN', {
  style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 2,
}).format(cents / 100);

const stamp = new Intl.DateTimeFormat('sv-SE', {
  timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
});
const pretty = new Intl.DateTimeFormat('en-IN', {
  timeZone: zone, day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit',
});
export const toLocalField = date => stamp.format(new Date(date)).replace(' ', 'T');
const prettyDay = new Intl.DateTimeFormat('en-IN', {timeZone: zone, day: 'numeric', month: 'short', year: 'numeric'});
export const formatDate = (date, dateOnly) => (dateOnly ? prettyDay : pretty).format(new Date(date));
export const localDay = date => toLocalField(date).slice(0, 10);
export const customerKey = name => normalizeKey(displayName(name));
export const entryDelta = entry => entry.type === 'credit' ? entry.cents : -entry.cents;

export function fromLocalField(value) {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/u.test(value)) return '';
  const date = new Date(value + ':00+05:30');
  return Number.isFinite(+date) && toLocalField(date) === value ? date.toISOString() : '';
}

export function centsOf(value) {
  const text = String(value).trim();
  if (!/^\d{1,8}(?:\.\d{1,2})?$/u.test(text)) return 0;
  return Math.round(Number(text) * 100);
}

const validName = name => typeof name === 'string' && name.trim().length <= 80 && /\p{L}/u.test(name);
const validType = type => ['credit', 'payment'].includes(type);
const validDate = date => typeof date === 'string' && /^\d{4}-\d{2}-\d{2}T/u.test(date) && Number.isFinite(Date.parse(date));
const validCents = value => Number.isSafeInteger(value) && value > 0 && value <= 9_999_999_999;
const validId = value => typeof value === 'string' && value.length > 0 && value.length <= 150;

function validEntry(entry) {
  return entry && validId(entry.id) && validName(entry.name) && validType(entry.type)
    && validCents(entry.cents) && validDate(entry.date) && validDate(entry.recordedAt);
}

export function emptyDemo(clock = new Date()) {
  const date = new Date(+clock - 3 * 864e5).toISOString();
  const entries = [['Ramesh', 75000], ['Sunita', 45000], ['Lakshmi', 60000]].map(([name, cents], index) => ({
    id: 'sample-' + index, name, cents, type: 'credit', date, recordedAt: date, sample: true,
  }));
  return {version: 1, entries};
}

export function load(storage, clock = new Date()) {
  const stored = storage.getItem(storageKey);
  if (stored === null) return emptyDemo(clock);
  const data = JSON.parse(stored);
  if (data?.version !== 1 || !Array.isArray(data.entries) || !data.entries.every(validEntry)) {
    throw Error('The saved demo data could not be read. Export it from the original browser before trying again.');
  }
  return data;
}

export function prepareEntries(rows, batchId, clock = new Date()) {
  if (!rows.length) throw Error('Add an entry before confirming.');
  return rows.map((row, index) => {
    const name = displayName(row.name);
    const cents = centsOf(row.amount);
    const date = fromLocalField(row.date);
    if (!validName(name) || !validType(row.type) || !cents || !date) {
      throw Error('Check the customer, type, amount (up to 2 decimal places), and date/time for entry ' + (index + 1) + '.');
    }
    return {id: batchId + '-' + index, name, type: row.type, cents, date, recordedAt: clock.toISOString()};
  });
}

export function append(data, entries) {
  const existing = new Set(data.entries.map(entry => entry.id));
  return {...data, entries: [...data.entries, ...entries.filter(entry => !existing.has(entry.id))]};
}

export function customerTotals(entries) {
  const customers = new Map();
  for (const entry of entries) {
    const key = customerKey(entry.name);
    const customer = customers.get(key) ?? {name: entry.name, balance: 0};
    customer.balance += entryDelta(entry);
    if (entry.name.length > customer.name.length) customer.name = entry.name;
    customers.set(key, customer);
  }
  return customers;
}

export function snapshot(entries, window = 'today', clock = new Date()) {
  const day = localDay(+clock - (window === 'yesterday' ? 864e5 : 0));
  let credit = 0;
  let payment = 0;
  let count = 0;
  for (const entry of entries) {
    if (localDay(entry.date) !== day) continue;
    if (entry.type === 'credit') credit += entry.cents;
    else payment += entry.cents;
    count++;
  }
  const outstanding = [...customerTotals(entries).values()].reduce((sum, customer) => sum + Math.max(0, customer.balance), 0);
  return {credit, payment, count, outstanding};
}

export const balanceLabel = value => value < 0 ? money(-value) + ' advance' : money(value);

export function answerQuestion(question, entries, clock = new Date()) {
  const customers = customerTotals(entries);
  const key = normalizeKey(displayName(question.name));
  const matching = customers.get(key);
  if (question.name && ['balance', '', 'payment', 'credit'].includes(question.category) && !matching) {
    return 'No demo entries found for ' + question.name + '. Check the name or try asking for total outstanding.';
  }
  const relevantEntries = matching ? entries.filter(entry => normalizeKey(displayName(entry.name)) === key) : entries;
  const stats = snapshot(relevantEntries, question.window || 'today', clock);
  const dayLabel = question.window === 'yesterday' ? 'Yesterday' : 'Today';
  if (question.category === 'summary' || (question.window && question.category === 'balance' && !matching)) {
    return dayLabel + ' · ' + stats.count + (stats.count === 1 ? ' entry' : ' entries') + '\n'
      + 'Credit added ' + money(stats.credit) + ' · Payments collected ' + money(stats.payment)
      + '\nCurrent outstanding ' + money(stats.outstanding);
  }
  if (question.category === 'payment' || question.category === 'credit') {
    const type = question.category;
    const amount = question.window ? stats[type] : relevantEntries.filter(entry => entry.type === type).reduce((sum, entry) => sum + entry.cents, 0);
    const label = type === 'payment' ? 'Payments collected' : 'Credit added';
    return label + (matching ? ' for ' + matching.name : '') + (question.window ? ' · ' + dayLabel : '') + ' · ' + money(amount);
  }
  if (matching) return matching.name + ' · ' + balanceLabel(matching.balance) + (matching.balance >= 0 ? ' outstanding' : '');
  if (question.total || question.category === 'balance') return 'Total outstanding · ' + money(stats.outstanding) + '.';
  return 'Try “What is Ramesh’s balance?”, “Total outstanding?” or “Today’s summary?”.';
}

export function readBackup(data) {
  if (data?.version === 1 && Array.isArray(data.entries) && data.entries.every(validEntry)) {
    const {entries, legacy} = data;
    if (new Set(entries.map(entry => entry.id)).size !== entries.length) throw Error('This backup has duplicate entry IDs.');
    return {entries, legacy, isOriginal: false};
  }
  if (!Array.isArray(data?.customers)) throw Error('Choose a valid Dukaan JSON backup.');
  const entries = data.customers.flatMap(customer => {
    if (!validName(customer?.name) || !Array.isArray(customer.txns)) throw Error('This backup contains an invalid customer.');
    return customer.txns.map((transaction, index) => {
      const {id, type, amount, date, recordedAt} = transaction ?? {};
      const originalDay = typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/u.test(date) ? fromLocalField(date + 'T00:00') : '';
      const parsedDate = validDate(date) ? date : originalDay || recordedAt;
      const entry = {
        id: 'mvp-' + (id || (customer.id || customer.name) + '-' + index),
        type: {udhaar: 'credit', paid: 'payment'}[type],
        name: customer.name.trim(),
        cents: centsOf(amount),
        date: parsedDate,
        recordedAt: validDate(recordedAt) ? recordedAt : parsedDate,
        ...(originalDay ? {dateOnly: true} : {}),
      };
      if (!validEntry(entry)) throw Error('This backup contains a ledger entry with an invalid amount, type, or date.');
      return entry;
    });
  });
  if (new Set(entries.map(entry => entry.id)).size !== entries.length) throw Error('This backup has duplicate entry IDs.');
  return {entries, legacy: data, isOriginal: true};
}

export function mergeBackup(data, backup) {
  const base = backup.isOriginal ? {...data, entries: data.entries.filter(entry => !entry.sample)} : data;
  const merged = append(base, backup.entries);
  return backup.legacy ? {...merged, legacy: backup.legacy} : merged;
}
