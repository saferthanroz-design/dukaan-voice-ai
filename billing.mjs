import {append, balanceLabel, customerKey, customerTotals, entryDelta, formatDate, localDay, money} from './ledger.mjs';

const dayFormat = new Intl.DateTimeFormat('en-IN', {timeZone: 'UTC', day: 'numeric', month: 'short', year: 'numeric'});
const formatDay = day => dayFormat.format(new Date(day + 'T00:00:00Z'));

function monthBounds(today) {
  const [year, month] = today.split('-').map(Number);
  const current = today.slice(0, 7) + '-01';
  const previous = new Date(Date.UTC(year, month - 2, 1)).toISOString().slice(0, 10);
  const lastOfPrevious = new Date(Date.UTC(year, month - 1, 0)).toISOString().slice(0, 10);
  return {current, previous, lastOfPrevious};
}

export function accountStatement(entries, request, clock = new Date()) {
  if (!request.name) return {error: 'Include a customer name, for example “Ramesh ka hisaab karo aur bill do”.'};
  const customers = customerTotals(entries);
  let key = customerKey(request.name);
  if (!customers.has(key)) {
    const matching = [...customers.keys()].filter(candidate => candidate.startsWith(key + ' '));
    if (matching.length > 1) return {error: 'More than one customer matches. Use the full name on the ledger.'};
    if (!matching.length) return {error: 'No demo entries found for ' + request.name + '.'};
    [key] = matching;
  }

  const today = localDay(clock);
  const month = monthBounds(today);
  const period = request.period || (today === month.current ? 'previous' : 'all');
  const end = period === 'previous' ? month.lastOfPrevious : today;
  const customerEntries = entries.filter(entry => customerKey(entry.name) === key && localDay(entry.date) <= today)
    .sort((a, b) => Date.parse(a.date) - Date.parse(b.date) || Date.parse(a.recordedAt) - Date.parse(b.recordedAt));
  const start = period === 'previous' ? month.previous : period === 'current' ? month.current
    : customerEntries.length ? localDay(customerEntries[0].date) : today;
  let opening = 0;
  let credits = 0;
  let payments = 0;
  const transactions = [];
  for (const entry of customerEntries) {
    const day = localDay(entry.date);
    if (day < start) {
      opening += entryDelta(entry);
    } else if (day <= end) {
      if (entry.type === 'credit') credits += entry.cents;
      else payments += entry.cents;
      transactions.push({...entry, balance: opening + credits - payments});
    }
  }
  const current = customerEntries.reduce((balance, entry) => balance + entryDelta(entry), 0);
  const range = start === end ? formatDay(end) : formatDay(start) + ' – ' + formatDay(end);
  return {name: customers.get(key).name, period, range, opening, credits, payments, balance: opening + credits - payments,
    current, currentDate: formatDay(today), transactions};
}

export function appendWithMessages(data, entries) {
  const customers = customerTotals(data.entries);
  const knownIds = new Set(data.entries.map(entry => entry.id));
  const created = [];
  for (const entry of entries) {
    if (knownIds.has(entry.id)) continue;
    knownIds.add(entry.id);
    const key = customerKey(entry.name);
    const balance = (customers.get(key)?.balance ?? 0) + entryDelta(entry);
    customers.set(key, {balance});
    const change = entry.type === 'credit' ? 'credit added' : 'payment received';
    const text = 'Dukaan demo update for ' + entry.name + ' · ' + money(entry.cents) + ' ' + change
      + ' on ' + formatDate(entry.date, entry.dateOnly) + ' IST. Ledger balance after this entry: ' + balanceLabel(balance) + '.';
    created.push({...entry, message: text});
  }
  return append(data, created);
}
