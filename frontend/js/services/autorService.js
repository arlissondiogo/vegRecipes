import { api } from "../api.js";

export const autorService = {
  async listar() {
    return api.get("/autores");
  },

  async criar(dados) {
    const { nome } = dados;
    if (!nome || !nome.trim()) throw new Error('O campo "apelido" é obrigatório.');
    return api.post("/autores", { nome: nome.trim() });
  },

  async remover(id, token) {
    if (!token || !token.trim())
      throw new Error('O "token" é obrigatório para remover este autor.');
    return api.delete(`/autores/${id}`, { token: token.trim() });
  },
};
