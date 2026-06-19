import { db } from '../db.js';

function paraApi(row) {
  if (!row) return null;
  return {
    id: row.id,
    nome: row.nome,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export const categoriaModel = {
  listarTodas() {
    return db.prepare('SELECT * FROM categorias ORDER BY nome ASC').all().map(paraApi);
  },

  buscarPorId(id) {
    const row = db.prepare('SELECT * FROM categorias WHERE id = ?').get(Number(id));
    return paraApi(row);
  },

  existeNome(nome) {
    const row = db.prepare('SELECT 1 FROM categorias WHERE LOWER(nome) = LOWER(?)').get(nome);
    return row !== undefined;
  },

  inserir({ nome }) {
    const r = db.prepare('INSERT INTO categorias (nome) VALUES (?)').run(nome);
    return this.buscarPorId(r.lastInsertRowid);
  },

  atualizar(id, { nome }) {
    db.prepare('UPDATE categorias SET nome = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(nome, Number(id));
    return this.buscarPorId(id);
  },

  remover(id) {
    const r = db.prepare('DELETE FROM categorias WHERE id = ?').run(Number(id));
    return r.changes > 0;
  }
};
