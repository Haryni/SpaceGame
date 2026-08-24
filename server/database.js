import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, 'space_academy.db');
const verboseSqlite = sqlite3.verbose();

const db = new verboseSqlite.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite database at:', dbPath);
  }
});

// Initialize database schema
db.serialize(() => {
  // Cadets table
  db.run(`
    CREATE TABLE IF NOT EXISTS cadets (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      avatar TEXT NOT NULL,
      score INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Progress table
  db.run(`
    CREATE TABLE IF NOT EXISTS progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cadet_id TEXT NOT NULL,
      module_id TEXT NOT NULL,
      completed INTEGER DEFAULT 0,
      score INTEGER DEFAULT 0,
      badge_unlocked INTEGER DEFAULT 0,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(cadet_id) REFERENCES cadets(id),
      UNIQUE(cadet_id, module_id)
    )
  `);

  // Certificates table
  db.run(`
    CREATE TABLE IF NOT EXISTS certificates (
      id TEXT PRIMARY KEY,
      cadet_id TEXT NOT NULL,
      rocket_name TEXT NOT NULL,
      rocket_color TEXT NOT NULL,
      issued_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(cadet_id) REFERENCES cadets(id)
    )
  `);
});

export default db;
