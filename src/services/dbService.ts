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