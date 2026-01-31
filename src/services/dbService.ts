import * as SQLite from 'expo-sqlite';

// Open (or create) the database
const db = SQLite.openDatabaseSync('weather.db');

export const initDatabase = async () => {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS locations (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL);
  `);
};

export const getSavedLocations = async () => {
  return await db.getAllAsync<{ id: number; name: string }>('SELECT * FROM locations');
};


export const saveCity = async (name: string) => {
  // Check limit before saving 
  const countRes = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM locations');
  if (countRes && countRes.count >= 5) {
    alert("Limit reached! Remove a city to add a new one.");
    return false;
  }
  await db.runAsync('INSERT INTO locations (name) VALUES (?)', [name]);
  return true;
};


// Fetch all saved cities
export const getSavedCities = async () => {
  return await db.getAllAsync<{ id: number; name: string }>('SELECT * FROM locations');
};

// Remove a city by ID
export const deleteCity = async (id: number) => {
  await db.runAsync('DELETE FROM locations WHERE id = ?', [id]);
};