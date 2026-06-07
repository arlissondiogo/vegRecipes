import { api } from "../api.js";

export const receitaService = {
  async listar() {
    return api.get("/receitas");
  },

  async criar(dados) {
    const { nome, modoPreparo, tempoPreparo, porcoes, categoriaId } = dados;
    if (!nome || !nome.trim()) throw new Error('O campo "nome" é obrigatório.');
    if (!modoPreparo || !modoPreparo.trim()) throw new Error('O "modo de preparo" é obrigatório.');
    if (!tempoPreparo || isNaN(tempoPreparo) || Number(tempoPreparo) <= 0)
      throw new Error('"Tempo de preparo" deve ser um número positivo.');
    if (!porcoes || isNaN(porcoes) || Number(porcoes) <= 0)
      throw new Error('"Porções" deve ser um número positivo.');
    if (!categoriaId) throw new Error('Selecione uma "categoria".');
    return api.post("/receitas", {
      nome: nome.trim(),
      modoPreparo: modoPreparo.trim(),
      tempoPreparo: Number(tempoPreparo),
      porcoes: Number(porcoes),
      categoriaId: Number(categoriaId),
      autorId: dados.autorId ? Number(dados.autorId) : null,
      ingredientes: dados.ingredientes || [],
    });
  },

  async remover(id, codigoEdicao) {
    if (!codigoEdicao || !codigoEdicao.trim())
      throw new Error('O "código de edição" é obrigatório para remover.');
    return api.delete(`/receitas/${id}`, { codigoEdicao: codigoEdicao.trim() });
  },

  async atualizar(id, codigoEdicao, dados) {
    if (!codigoEdicao || !codigoEdicao.trim())
      throw new Error('O "código de edição" é obrigatório para editar.');
    return api.put(`/receitas/${id}`, { codigoEdicao: codigoEdicao.trim(), ...dados });
  },
};
