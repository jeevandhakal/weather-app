import * as SQLite from 'expo-sqlite';

// Open (or create) the database asynchronously (web-safe)
const dbPromise = SQLite.openDatabaseAsync('weather.db');

export const initDatabase = async () => {
  const db = await dbPromise;
  // Some PRAGMA statements may not be supported on WebSQL fallback; ignore failures.
  try {
    await db.execAsync('PRAGMA journal_mode = WAL;');
  } catch {}

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS locations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      lat REAL,
      lon REAL
    );
  `);

  // Ensure columns exist when upgrading from older schema
  try {
    const columns = await db.getAllAsync<{ name: string }>('PRAGMA table_info(locations)');
    const hasLat = columns.some(c => c.name === 'lat');
    const hasLon = columns.some(c => c.name === 'lon');
    if (!hasLat) {
      await db.runAsync('ALTER TABLE locations ADD COLUMN lat REAL');
    }
    if (!hasLon) {
      await db.runAsync('ALTER TABLE locations ADD COLUMN lon REAL');
    }
  } catch {}
};

export const getSavedLocations = async () => {
  const db = await dbPromise;
  return await db.getAllAsync<{ id: number; name: string; lat: number; lon: number }>('SELECT id, name, lat, lon FROM locations');
};

export const saveCity = async (name: string, lat: number, lon: number) => {
  const db = await dbPromise;
  // Check limit before saving 
  const countRes = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM locations');
  if (countRes && countRes.count >= 5) {
    alert("Limit reached! Remove a city to add a new one.");
    return false;
  }
  await db.runAsync('INSERT INTO locations (name, lat, lon) VALUES (?, ?, ?)', [name, lat, lon]);
  return true;
};


// Fetch all saved cities
export const getSavedCities = async () => {
  const db = await dbPromise;
  return await db.getAllAsync<{ id: number; name: string; lat: number ; lon: number }>('SELECT id, name, lat, lon FROM locations');
};

// Remove a city by ID
export const deleteCity = async (id: number) => {
  const db = await dbPromise;
  await db.runAsync('DELETE FROM locations WHERE id = ?', [id]);
};