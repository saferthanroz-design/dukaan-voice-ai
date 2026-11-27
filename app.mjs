import {examples, interpret} from './commands.mjs';
import {
  storageKey, zone, money, toLocalField, formatDate, load, emptyDemo, prepareEntries,
  customerTotals, snapshot, balanceLabel, answerQuestion, readBackup, mergeBackup,
} from './ledger.mjs';
import {accountStatement, appendWithMessages} from './billing.mjs';

const $ = id => document.getElementById(id);
const command = $('command');
const language = $('language');
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let data;
let drafts = [];
let backup = null;
let recognition = null;
let saving = false;
let statementRequest = null;

function notice(id, message = '', error = false) {
  const target = $(id);
  target.textContent = message;
  target.hidden = !message;
  target.classList.toggle('error', error);
}

function node(tag, className, text) {
  const item = document.createElement(tag);
  if (className) item.className = className;
  if (text !== undefined) item.textContent = text;
  return item;
}

function renderLedger() {
  const stats = snapshot(data.entries);
  $('outstanding').textContent = money(stats.outstanding);
  $('credit').textContent = money(stats.credit);
  $('payment').textContent = money(stats.payment);

  const customers = [...customerTotals(data.entries).values()].sort((a, b) => b.balance - a.balance || a.name.localeCompare(b.name));
  $('customer-count').textContent = customers.length + (customers.length === 1 ? ' customer' : ' customers');
  const customerItems = customers.map(({name, balance}) => {
    const item = node('li');
    const person = node('div', 'person');
    person.append(node('span', 'avatar', Array.from(name)[0].toUpperCase()), node('span', '', name));
    person.firstChild.setAttribute('aria-hidden', 'true');
    item.append(person, node('span', 'money', balanceLabel(balance)));
    return item;
  });
  $('customers').replaceChildren(...(customerItems.length ? customerItems : [node('li', 'empty', 'No customer entries yet.')]));

  const activity = [...data.entries].reverse().sort((a, b) => Date.parse(b.date) - Date.parse(a.date)).slice(0, 8).map(entry => {
    const credit = entry.type === 'credit';
    const item = node('li');
    const detail = node('div');
    detail.append(node('div', 'entry-name', entry.name));
    const date = formatDate(entry.date, entry.dateOnly);
    const meta = node('div', 'entry-meta', (entry.sample ? 'Sample ' : '') + (credit ? 'credit' : 'payment') + ' · ' + date);
    detail.append(meta);
    item.append(detail, node('span', credit ? 'money' : 'money positive', (credit ? '+' : '−') + money(entry.cents)));
    return item;
  });
  $('activity').replaceChildren(...(activity.length ? activity : [node('li', 'empty', 'Confirmed entries will appear here.')]));
  renderMessages();
  if (statementRequest) renderStatement(statementRequest);
}

function renderMessages() {
  const recent = data.entries.filter(entry => typeof entry.message === 'string').reverse()
    .sort((a, b) => Date.parse(b.recordedAt) - Date.parse(a.recordedAt)).slice(0, 5);
  const items = recent.map(entry => {
    const item = node('li');
    const content = node('details');
    content.append(node('summary', '', entry.name + ' · ' + money(entry.cents) + (entry.type === 'credit' ? ' credit' : ' payment')));
    content.append(node('p', 'muted', entry.message));
    const copy = node('button', 'button secondary', 'Copy message');
    copy.type = 'button';
    copy.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(entry.message);
        notice('message-status', 'Message copied.');
      } catch {
        notice('message-status', 'Select the message text to copy it.', true);
      }
    });
    content.append(copy);
    item.append(content);
    return item;
  });
  $('messages').replaceChildren(...(items.length ? items : [node('li', 'empty', 'Confirm a credit or payment to create a message preview.')]));
}

function renderStatement(request, focus = false) {
  const statement = accountStatement(data.entries, request);
  if (statement.error) {
    closeStatement();
    notice('status', statement.error, true);
    return;
  }
  statementRequest = {...request, period: statement.period};
  $('statement').hidden = false;
  $('statement-customer').textContent = statement.name;
  $('statement-range').textContent = statement.range;
  $('statement-period').value = statement.period;
  const totals = [
    ['Opening balance', balanceLabel(statement.opening)],
    ['Credit added', money(statement.credits)],
    ['Payments received', money(statement.payments)],
    ['Statement balance', balanceLabel(statement.balance)],
  ];
  if (statement.period === 'previous') totals.push(['Balance on ' + statement.currentDate, balanceLabel(statement.current)]);
  $('statement-totals').replaceChildren(...totals.map(([label, amount]) => {
    const total = node('div', label === 'Statement balance' ? 'statement-due' : '');
    total.append(node('dt', '', label), node('dd', '', amount));
    return total;
  }));
  const rows = statement.transactions.map(entry => {
    const row = node('tr');
    row.append(node('td', '', formatDate(entry.date, entry.dateOnly)),
      node('td', '', entry.type === 'credit' ? money(entry.cents) : '—'),
      node('td', '', entry.type === 'payment' ? money(entry.cents) : '—'),
      node('td', '', balanceLabel(entry.balance)));
    return row;
  });
  if (!rows.length) {
    const row = node('tr');
    const cell = node('td', 'muted', 'No credit or payments in this period.');
    cell.colSpan = 4;
    row.append(cell);
    rows.push(row);
  }
  $('statement-entries').replaceChildren(...rows);
  if (focus) $('statement-title').focus();
}

function closeStatement() {
  statementRequest = null;
  $('statement').hidden = true;
}

function readLocal() {
  try {
    data = load(localStorage);
    notice('backup-status');
  } catch {
    data ??= emptyDemo();
    notice('backup-status', 'Saved data is unavailable. Updates are paused until browser storage can be read.', true);
  }
  renderLedger();
}

function updateClock() {
  const today = new Date();
  $('today').dateTime = toLocalField(today).slice(0, 10);
  $('today').textContent = new Intl.DateTimeFormat('en-IN', {
    timeZone: zone, weekday: 'short', day: 'numeric', month: 'long', year: 'numeric',
  }).format(today) + ' · IST';
}

function renderExamples() {
  command.placeholder = examples[language.value][0];
  $('examples').replaceChildren(...examples[language.value].map((example, index) => {
    const button = node('button', 'example', ['Two customers', 'Record a payment', 'Ask a balance', 'Get a bill'][index]);
    button.type = 'button';
    button.addEventListener('click', () => {
      command.value = example;
      runCommand();
    });
    return button;
  }));
}

function field(label, key, input) {
  const wrapper = node('label', '', label);
  input.name = key;
  input.required = true;
  wrapper.append(input);
  return wrapper;
}

function renderDrafts(focus = false) {
  $('review').hidden = !drafts.length;
  $('review-count').textContent = drafts.length + (drafts.length === 1 ? ' entry' : ' entries');
  const items = drafts.map((row, index) => {
    const entry = node('fieldset', 'draft');
    entry.append(node('legend', '', 'Entry ' + (index + 1)));
    if (row.issue) entry.append(node('p', 'row-note', row.issue));
    const grid = node('div', 'draft-grid');
    const name = node('input');
    name.maxLength = 80;
    name.autocomplete = 'off';
    name.value = row.name;
    const type = node('select');
    const choices = ['', 'credit', 'payment'];
    type.replaceChildren(...choices.map((value, selectedIndex) => new Option(['Choose type', 'Credit given', 'Payment received'][selectedIndex], value)));
    type.value = row.type;
    const amount = node('input');
    amount.type = 'number';
    amount.inputMode = 'decimal';
    amount.step = '.01';
    amount.min = '.01';
    amount.max = '99999999.99';
    amount.value = row.amount;
    const date = node('input');
    date.type = 'datetime-local';
    date.value = row.date;
    grid.append(field('Customer', 'name', name), field('Type', 'type', type), field('Amount (₹)', 'amount', amount), field('Date and time (IST)', 'date', date));
    grid.addEventListener('input', event => {
      row[event.target.name] = event.target.value;
      notice('review-status');
    });
    entry.append(grid);
    const actions = node('div', 'draft-actions');
    const remove = node('button', 'remove', 'Remove entry');
    remove.type = 'button';
    remove.setAttribute('aria-label', 'Remove entry ' + (index + 1));
    remove.addEventListener('click', () => {
      drafts.splice(index, 1);
      renderDrafts(drafts.length > 0);
      if (!drafts.length) {
        notice('status', 'Draft discarded.');
        command.focus();
      }
    });
    actions.append(remove);
    entry.append(actions);
    return entry;
  });
  $('drafts').replaceChildren(...items);
  if (focus) $('review-title').focus();
}

function runCommand() {
  const text = command.value.trim();
  notice('status');
  if (!text) {
    notice('status', 'Type or dictate a transaction or ledger question.', true);
    command.focus();
    return;
  }
  const result = interpret(text, language.value);
  if (result.statement) {
    closeStatement();
    readLocal();
    $('answer').hidden = true;
    renderStatement(result.statement, true);
    return;
  }
  if (result.question) {
    closeStatement();
    readLocal();
    $('answer-text').textContent = answerQuestion(result.question, data.entries);
    $('answer').hidden = false;
    $('answer-title').focus();
    return;
  }
  if (!result.rows.length) {
    notice('status', 'Try a customer name and an amount, or choose an example.', true);
    return;
  }
  if (drafts.length) {
    notice('status', 'Confirm or discard the current review before starting a new batch.', true);
    $('review-title').focus();
    return;
  }
  $('answer').hidden = true;
  closeStatement();
  notice('review-status');
  const date = toLocalField(new Date());
  drafts = result.rows.map(row => ({...row, date}));
  renderDrafts(true);
}

async function persist(update) {
  const change = () => {
    const next = update(load(localStorage));
    localStorage.setItem(storageKey, JSON.stringify(next));
    data = next;
    renderLedger();
  };
  if (navigator.locks) await navigator.locks.request(storageKey, change);
  else change();
}

$('command-form').addEventListener('submit', event => {
  event.preventDefault();
  runCommand();
});
$('statement-period').addEventListener('change', event => {
  if (statementRequest) renderStatement({...statementRequest, period: event.target.value});
});
$('print-statement').addEventListener('click', () => window.print());
command.addEventListener('keydown', event => {
  if (event.key === 'Enter' && (event.ctrlKey || event.metaKey) && !event.isComposing) {
    event.preventDefault();
    runCommand();
  }
});
language.addEventListener('change', renderExamples);

$('review-form').addEventListener('submit', event => event.preventDefault());
$('confirm').addEventListener('click', async () => {
  if (saving || !drafts.length || !$('review-form').reportValidity()) return;
  saving = true;
  $('confirm').disabled = true;
  try {
    const entries = prepareEntries(drafts, crypto.randomUUID());
    await persist(current => appendWithMessages(current, entries));
    notice('status', 'Simulated update confirmed. ' + entries.length + (entries.length === 1 ? ' entry saved' : ' entries saved') + ' in this browser.');
    notice('backup-status');
    $('answer').hidden = true;
    drafts = [];
    renderDrafts();
    command.value = '';
    command.focus();
  } catch (error) {
    notice('review-status', error.message || 'The demo update could not be saved.', true);
  } finally {
    saving = false;
    $('confirm').disabled = false;
  }
});

$('discard').addEventListener('click', () => {
  if (saving) return;
  drafts = [];
  renderDrafts();
  notice('review-status');
  notice('status', 'Draft discarded.');
  command.focus();
});

function micState(active) {
  $('mic').setAttribute('aria-pressed', String(active));
  $('mic-text').textContent = active ? 'Stop listening' : 'Speak';
}

$('mic').addEventListener('click', () => {
  if (recognition) {
    recognition.stop();
    return;
  }
  if (!SpeechRecognition) {
    notice('status', 'Browser speech recognition is unavailable. Use your keyboard microphone, Wispr Flow, or type your command.', true);
    command.focus();
    return;
  }
  try {
    const session = new SpeechRecognition();
    recognition = session;
    session.lang = language.value;
    session.continuous = false;
    session.interimResults = false;
    session.onstart = () => {
      micState(true);
      notice('status', 'Listening in ' + language.selectedOptions[0].textContent + '…');
    };
    let heard = false;
    let failed = false;
    session.onresult = event => {
      command.value = Array.from(event.results, result => result[0].transcript).join(' ').slice(0, command.maxLength);
      heard = true;
      notice('status', 'Transcript ready. Check it, then select Interpret command.');
      command.focus();
    };
    session.onerror = () => {
      failed = true;
      notice('status', 'Speech recognition could not capture audio. Check microphone access or use keyboard dictation, Wispr Flow, or typing.', true);
    };
    session.onend = () => {
      recognition = null;
      micState(false);
      if (!heard && !failed) notice('status', 'Listening stopped. You can try again or type a command.');
    };
    session.start();
  } catch {
    recognition = null;
    micState(false);
    notice('status', 'The microphone could not start. You can still dictate with your keyboard or type.', true);
  }
});

function clearImport() {
  backup = null;
  $('import-review').hidden = true;
  $('import-file').value = '';
}

$('import-button').addEventListener('click', () => $('import-file').click());
$('import-file').addEventListener('change', async () => {
  const file = $('import-file').files[0];
  clearImport();
  if (!file) return;
  notice('backup-status');
  try {
    if (file.size > 4_000_000) throw Error('Choose a backup smaller than 4 MB.');
    backup = readBackup(JSON.parse(await file.text()));
    const count = backup.entries.length;
    $('import-summary').textContent = count + (count === 1 ? ' ledger entry' : ' ledger entries') + ' in this file. '
      + (backup.isOriginal ? 'This replaces the sample entries and keeps your confirmed demo entries.' : 'This adds entries with new IDs to the demo ledger.');
    $('import-review').hidden = false;
    $('import-confirm').focus();
  } catch (error) {
    notice('backup-status', error instanceof SyntaxError ? 'This file is not valid JSON.' : error.message, true);
  }
});
$('import-cancel').addEventListener('click', () => {
  clearImport();
  notice('backup-status', 'Import cancelled.');
  $('import-button').focus();
});
$('import-confirm').addEventListener('click', async () => {
  if (!backup || saving) return;
  saving = true;
  const pending = backup;
  $('import-confirm').disabled = true;
  try {
    await persist(current => mergeBackup(current, pending));
    clearImport();
    $('answer').hidden = true;
    notice('backup-status', 'Demo backup imported. Existing confirmed entries were kept.');
    $('import-button').focus();
  } catch {
    notice('backup-status', 'The backup could not be saved in this browser.', true);
  } finally {
    $('import-confirm').disabled = false;
    saving = false;
  }
});
$('export-button').addEventListener('click', () => {
  try {
    const stored = load(localStorage);
    const file = new Blob([JSON.stringify(stored, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(file);
    const link = node('a');
    link.href = url;
    link.download = 'dukaan-demo-' + toLocalField(new Date()).slice(0, 10) + '.json';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    notice('backup-status', 'Demo backup downloaded.');
  } catch {
    notice('backup-status', 'Saved demo data could not be exported.', true);
  }
});
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    updateClock();
    readLocal();
  }
});
window.addEventListener('storage', event => {
  if (event.key === storageKey || event.key === null) readLocal();
});

updateClock();
renderExamples();
readLocal();
