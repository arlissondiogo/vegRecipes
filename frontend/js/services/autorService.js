import { api } from "../api.js";

export const autorService = {
  async listar() {
    return api.get("/autores");
  },

  async criar(dados) {
    const { nome, email } = dados;
    if (!nome || !nome.trim()) throw new Error('O campo "nome" é obrigatório.');
    if (!email || !email.trim()) throw new Error('O campo "e-mail" é obrigatório.');
    return api.post("/autores", { nome: nome.trim(), email: email.trim() });
  },

  async remover(id) {
    return api.delete(`/autores/${id}`);
  },
};
