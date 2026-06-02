import { randomUUID } from "crypto";

let receitas = [];
let nextId = 1;

export const receitaModel = {
  listarTodas() {
    return receitas;
  },

  buscarPorId(id) {
    return receitas.find((r) => r.id === id) || null;
  },

  validarCodigo(id, codigo) {
    const receita = receitas.find((r) => r.id === id);
    return receita?.codigoEdicao === codigo;
  },

  inserir({ nome, modoPreparo, tempoPreparo, porcoes, categoriaId, autorId, ingredientes }) {
    const nova = {
      id: nextId++,
      codigoEdicao: randomUUID(),
      nome,
      modoPreparo,
      tempoPreparo: Number(tempoPreparo),
      porcoes: Number(porcoes),
      categoriaId: Number(categoriaId),
      autorId: autorId ? Number(autorId) : null,
      ingredientes: ingredientes || [],
    };
    receitas.push(nova);
    return nova;
  },

  atualizar(id, dados) {
    const idx = receitas.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    receitas[idx] = { ...receitas[idx], ...dados, id };
    return receitas[idx];
  },

  remover(id) {
    const tamanhoAntes = receitas.length;
    receitas = receitas.filter((r) => r.id !== id);
    return receitas.length < tamanhoAntes;
  },
};
