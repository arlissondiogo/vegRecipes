import { db } from "../db.js";
import { randomUUID } from "crypto";
import { randomBytes } from "crypto";

function paraApi(row) {
  if (!row) return null;
  return {
    id: row.id,
    nome: row.nome,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const autorModel = {
  listarTodos() {
    return db
      .prepare("SELECT * FROM autores ORDER BY nome ASC")
      .all()
      .map(paraApi);
  },

  buscarPorId(id) {
    const row = db
      .prepare("SELECT * FROM autores WHERE id = ?")
      .get(Number(id));
    return paraApi(row);
  },

  validarToken(id, token) {
    const row = db
      .prepare("SELECT 1 FROM autores WHERE id = ? AND token = ?")
      .get(Number(id), token);
    return row !== undefined;
  },

  inserir({ nome }) {
    const token = randomBytes(4).toString("hex").toUpperCase();

    const r = db
      .prepare("INSERT INTO autores (nome, token) VALUES (?, ?)")
      .run(nome, token);

    return {
      ...this.buscarPorId(r.lastInsertRowid),
      token,
    };
  },

  atualizar(id, { nome }) {
    db.prepare(
      "UPDATE autores SET nome = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
    ).run(nome, Number(id));
    return this.buscarPorId(id);
  },

  remover(id) {
    const r = db.prepare("DELETE FROM autores WHERE id = ?").run(Number(id));
    return r.changes > 0;
  },
};
