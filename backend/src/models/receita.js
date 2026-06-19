import { db } from "../db.js";

function paraApi(row) {
  if (!row) return null;

  const ingredientes = db
    .prepare("SELECT descricao FROM ingredientes WHERE receita_id = ?")
    .all(row.id)
    .map((i) => i.descricao);

  return {
    id: row.id,
    nome: row.nome,
    modoPreparo: row.modo_preparo,
    tempoPreparo: row.tempo_preparo,
    porcoes: row.porcoes,
    categoriaId: row.categoria_id,
    autorId: row.autor_id,
    ingredientes: ingredientes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const receitaModel = {
  listarTodas({
    nome,
    categoriaId,
    ordenarPor,
    ordem = "ASC",
    limit = 10,
    offset = 0,
  } = {}) {
    let query = "SELECT * FROM receitas WHERE 1=1";
    const params = [];

    if (nome) {
      query += " AND nome LIKE ?";
      params.push(`%${nome}%`);
    }

    if (categoriaId) {
      query += " AND categoria_id = ?";
      params.push(Number(categoriaId));
    }

    const colunasPermitidas = ["nome", "tempo_preparo", "created_at"];
    const colunaOrdenacao = colunasPermitidas.includes(ordenarPor)
      ? ordenarPor
      : "id";
    const direcaoOrdem = ordem.toUpperCase() === "DESC" ? "DESC" : "ASC";

    query += ` ORDER BY ${colunaOrdenacao} ${direcaoOrdem}`;
    query += " LIMIT ? OFFSET ?";
    params.push(limit, offset);

    return db
      .prepare(query)
      .all(...params)
      .map(paraApi);
  },

  contarTodas({ nome, categoriaId } = {}) {
    let query = "SELECT COUNT(*) as total FROM receitas WHERE 1=1";
    const params = [];

    if (nome) {
      query += " AND nome LIKE ?";
      params.push(`%${nome}%`);
    }

    if (categoriaId) {
      query += " AND categoria_id = ?";
      params.push(Number(categoriaId));
    }

    return db.prepare(query).get(...params).total;
  },

  buscarPorId(id) {
    const row = db
      .prepare("SELECT * FROM receitas WHERE id = ?")
      .get(Number(id));
    return paraApi(row);
  },

  validarAutoria(id, token) {
    const row = db
      .prepare(
        `
      SELECT 1 FROM receitas r
      JOIN autores a ON a.id = r.autor_id
      WHERE r.id = ? AND a.token = ?
    `,
      )
      .get(Number(id), token);
    return row !== undefined;
  },

  inserir({
    nome,
    modoPreparo,
    tempoPreparo,
    porcoes,
    categoriaId,
    autorId,
    ingredientes,
  }) {
    const r = db
      .prepare(
        `
      INSERT INTO receitas (nome, modo_preparo, tempo_preparo, porcoes, categoria_id, autor_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
      )
      .run(
        nome,
        modoPreparo,
        Number(tempoPreparo),
        Number(porcoes),
        Number(categoriaId),
        Number(autorId),
      );

    const receitaId = r.lastInsertRowid;

    if (ingredientes && ingredientes.length > 0) {
      const insertIng = db.prepare(
        "INSERT INTO ingredientes (receita_id, descricao) VALUES (?, ?)",
      );
      ingredientes.forEach((ing) => insertIng.run(receitaId, ing));
    }

    return this.buscarPorId(receitaId);
  },

  atualizar(id, dados) {
    const atual = this.buscarPorId(id);
    if (!atual) return null;

    const novo = { ...atual, ...dados };

    db.prepare(
      `
      UPDATE receitas 
      SET nome = ?, modo_preparo = ?, tempo_preparo = ?, porcoes = ?, categoria_id = ?, autor_id = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    ).run(
      novo.nome,
      novo.modoPreparo,
      Number(novo.tempoPreparo),
      Number(novo.porcoes),
      Number(novo.categoriaId),
      novo.autorId ? Number(novo.autorId) : null,
      Number(id),
    );

    if (dados.ingredientes) {
      db.prepare("DELETE FROM ingredientes WHERE receita_id = ?").run(
        Number(id),
      );
      const insertIng = db.prepare(
        "INSERT INTO ingredientes (receita_id, descricao) VALUES (?, ?)",
      );
      dados.ingredientes.forEach((ing) => insertIng.run(Number(id), ing));
    }

    return this.buscarPorId(id);
  },

  remover(id) {
    const r = db.prepare("DELETE FROM receitas WHERE id = ?").run(Number(id));
    return r.changes > 0;
  },

  getEstatisticas() {
    const totalReceitas = db
      .prepare("SELECT COUNT(*) as total FROM receitas")
      .get().total;
    const porCategoria = db
      .prepare(
        `
      SELECT c.nome, COUNT(r.id) as total 
      FROM categorias c 
      LEFT JOIN receitas r ON c.id = r.categoria_id 
      GROUP BY c.id
    `,
      )
      .all();
    const mediaTempo = db
      .prepare("SELECT AVG(tempo_preparo) as media FROM receitas")
      .get().media;

    return {
      totalReceitas,
      porCategoria,
      tempoPreparoMedio: Math.round(mediaTempo || 0),
    };
  },
};
