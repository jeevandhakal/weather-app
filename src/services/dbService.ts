import * as SQLite from 'expo-sqlite';

// Open (or create) the database
const db = SQLite.openDatabaseSync('weather.db');

export const initDatabase = async () => {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS locations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      lat REAL,
      lon REAL
    );
  `);

  // Ensure columns exist when upgrading from older schema
  const columns = await db.getAllAsync<{ name: string }>('PRAGMA table_info(locations)');
  const hasLat = columns.some(c => c.name === 'lat');
  const hasLon = columns.some(c => c.name === 'lon');
  if (!hasLat) {
    await db.runAsync('ALTER TABLE locations ADD COLUMN lat REAL');
  }
  if (!hasLon) {
    await db.runAsync('ALTER TABLE locations ADD COLUMN lon REAL');
  }
};

export const getSavedLocations = async () => {
  return await db.getAllAsync<{ id: number; name: string; lat: number | null; lon: number | null }>('SELECT id, name, lat, lon FROM locations');
};

export const saveCity = async (name: string, lat: number, lon: number) => {
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
  return await db.getAllAsync<{ id: number; name: string; lat: number | null; lon: number | null }>('SELECT id, name, lat, lon FROM locations');
};

// Remove a city by ID
export const deleteCity = async (id: number) => {
  await db.runAsync('DELETE FROM locations WHERE id = ?', [id]);
};