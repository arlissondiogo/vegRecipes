import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, "..", "banco.db");

export const db = new DatabaseSync(dbPath);

db.exec("PRAGMA foreign_keys = ON;");

export function initializeDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS categorias (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL UNIQUE,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS autores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      token TEXT UNIQUE NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS receitas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      modo_preparo TEXT NOT NULL,
      tempo_preparo INTEGER NOT NULL,
      porcoes INTEGER NOT NULL,
      categoria_id INTEGER NOT NULL,
      autor_id INTEGER NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (categoria_id) REFERENCES categorias(id),
      FOREIGN KEY (autor_id) REFERENCES autores(id)
    );

    CREATE TABLE IF NOT EXISTS ingredientes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      receita_id INTEGER NOT NULL,
      descricao TEXT NOT NULL,
      FOREIGN KEY (receita_id) REFERENCES receitas(id) ON DELETE CASCADE
    );
  `);
}
