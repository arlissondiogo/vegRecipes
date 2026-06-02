import { autorModel } from "../models/autor.js";

export const autorService = {
  listarTodos() {
    return autorModel.listarTodos();
  },

  buscarPorId(id) {
    const autor = autorModel.buscarPorId(id);
    if (!autor) {
      const err = new Error("Autor não encontrado");
      err.status = 404;
      throw err;
    }
    return autor;
  },

  criar({ nome, email }) {
    if (!nome || !email) {
      const err = new Error('Campos "nome" e "email" são obrigatórios');
      err.status = 400;
      throw err;
    }

    if (autorModel.existeEmail(email)) {
      const err = new Error("Já existe um autor com este e-mail");
      err.status = 409;
      throw err;
    }

    return autorModel.inserir({ nome, email });
  },

  atualizar(id, dados) {
    const atualizado = autorModel.atualizar(id, dados);
    if (!atualizado) {
      const err = new Error("Autor não encontrado");
      err.status = 404;
      throw err;
    }
    return atualizado;
  },

  remover(id) {
    const removido = autorModel.remover(id);
    if (!removido) {
      const err = new Error("Autor não encontrado");
      err.status = 404;
      throw err;
    }
  },
};
