import { mkdirSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';

/** One SQLite file holds the notes. Tests pass ':memory:' so they never touch it. */
export function openDb(file = 'data/notes.db') {
  if (file !== ':memory:') mkdirSync('data', { recursive: true });
  const db = new DatabaseSync(file);
  db.exec(`CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    body TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`);
  return db;
}
