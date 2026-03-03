const cache = require('./cache');

const GAS_URL = process.env.GAS_URL;

// Получить все строки из листа
async function getSheet(sheetName) {
  const cached = cache.get(sheetName);
  if (cached) return cached;

  const url = `${GAS_URL}?action=get&sheet=${sheetName}`;
  const res = await fetch(url);
  const json = await res.json();
  if (!json.ok) throw new Error(json.error);

  cache.set(sheetName, json.data);
  return json.data;
}

// Добавить строку
async function addRow(sheetName, row) {
  const res = await fetch(GAS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'add', sheet: sheetName, row })
  });
  const json = await res.json();
  if (!json.ok) throw new Error(json.error);
  cache.invalidate(sheetName);
  return json;
}

// Обновить строку по ID
async function updateRow(sheetName, id, row) {
  const res = await fetch(GAS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'update', sheet: sheetName, id, row })
  });
  const json = await res.json();
  if (!json.ok) throw new Error(json.error);
  cache.invalidate(sheetName);
  return json;
}

// Удалить строку по ID
async function deleteRow(sheetName, id) {
  const res = await fetch(GAS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'delete', sheet: sheetName, id })
  });
  const json = await res.json();
  if (!json.ok) throw new Error(json.error);
  cache.invalidate(sheetName);
  return json;
}

module.exports = { getSheet, addRow, updateRow, deleteRow };
