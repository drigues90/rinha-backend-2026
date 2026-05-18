const fs = require('fs');
const path = require('path');
const lancedb = require('@lancedb/lancedb');

const DB_DIR = path.join(__dirname, '../../data/lancedb');
const TABLE_NAME = 'fraud_reference';
const VECTOR_DIMENSIONS = 14;

let initPromise = null;
let tableRef = null;

function sanitizeVector(vector, expectedLength = VECTOR_DIMENSIONS) {
  if (!Array.isArray(vector) || vector.length !== expectedLength) {
    return null;
  }

  const numeric = vector.map((value) => Number(value));
  const allFinite = numeric.every((value) => Number.isFinite(value));
  return allFinite ? numeric : null;
}

function loadReferenceDataset() {
  const referencesPath = path.join(__dirname, '../example-references.json');

  try {
    const raw = fs.readFileSync(referencesPath, 'utf8');
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((item, index) => {
        const vector = sanitizeVector(item && item.vector);
        if (!vector) {
          return null;
        }
        const label = typeof item.label === 'string' ? item.label : '';
        return {
          id: item && item.id ? item.id : `ref-${index + 1}`,
          vector,
          label
        };
      })
      .filter(Boolean);
  } catch (error) {
    return [];
  }
}

async function resolveQueryResults(query) {
  if (query && typeof query.execute === 'function') {
    return query.execute();
  }
  if (query && typeof query.toArray === 'function') {
    return query.toArray();
  }
  return [];
}

async function isTableEmpty(table) {
  try {
    const probe = new Array(VECTOR_DIMENSIONS).fill(0);
    const query = table.search(probe).limit(1);
    const results = await resolveQueryResults(query);
    return !Array.isArray(results) || results.length === 0;
  } catch (error) {
    return false;
  }
}

async function openOrCreateTable(db) {
  try {
    return await db.openTable(TABLE_NAME);
  } catch (error) {
    const seedRows = loadReferenceDataset();
    return db.createTable(TABLE_NAME, seedRows);
  }
}

async function initLanceDb() {
  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    fs.mkdirSync(DB_DIR, { recursive: true });
    const db = await lancedb.connect(DB_DIR);
    const table = await openOrCreateTable(db);

    const seedRows = loadReferenceDataset();
    if (seedRows.length > 0 && (await isTableEmpty(table))) {
      await table.add(seedRows);
    }

    tableRef = table;
    return tableRef;
  })();

  return initPromise;
}

async function queryNearestNeighbors(vector, topK) {
  const sanitized = sanitizeVector(vector);
  if (!sanitized) {
    throw new Error('Invalid feature vector');
  }

  const table = tableRef || (await initLanceDb());
  const query = table.search(sanitized).limit(topK);
  const results = await resolveQueryResults(query);

  return Array.isArray(results) ? results : [];
}

module.exports = {
  initLanceDb,
  queryNearestNeighbors,
  VECTOR_DIMENSIONS
};
