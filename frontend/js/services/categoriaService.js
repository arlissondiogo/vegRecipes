import { api } from "../api.js";

export const categoriaService = {
  async listar() {
    return api.get("/categorias");
  },

  async criar(dados) {
    const { nome } = dados;
    if (!nome || !nome.trim()) throw new Error('O campo "nome" é obrigatório.');
    return api.post("/categorias", { nome: nome.trim() });
  },

  async remover(id) {
    return api.delete(`/categorias/${id}`);
  },

  async atualizar(id, dados) {
    return api.put(`/categorias/${id}`, dados);
  },
};
