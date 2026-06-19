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

  criar({ nome }) {
    if (!nome) {
      const err = new Error('Campo "nome" (apelido) é obrigatório');
      err.status = 400;
      throw err;
    }

    if (nome.length < 3) {
      const err = new Error("O apelido deve ter pelo menos 3 caracteres");
      err.status = 400;
      throw err;
    }

    return autorModel.inserir({ nome });
  },

  atualizar(id, token, dados) {
    if (!token) {
      const err = new Error("Token do autor é obrigatório");
      err.status = 400;
      throw err;
    }
    if (!autorModel.buscarPorId(id)) {
      const err = new Error("Autor não encontrado");
      err.status = 404;
      throw err;
    }
    if (!autorModel.validarToken(id, token)) {
      const err = new Error("Token inválido");
      err.status = 403;
      throw err;
    }
    if (!dados.nome) {
      const err = new Error('Campo "nome" é obrigatório');
      err.status = 400;
      throw err;
    }
    return autorModel.atualizar(id, dados);
  },

  remover(id, token) {
    if (!token) {
      const err = new Error("Token do autor é obrigatório");
      err.status = 400;
      throw err;
    }
    if (!autorModel.buscarPorId(id)) {
      const err = new Error("Autor não encontrado");
      err.status = 404;
      throw err;
    }
    if (!autorModel.validarToken(id, token)) {
      const err = new Error("Token inválido");
      err.status = 403;
      throw err;
    }
    try {
      const removido = autorModel.remover(id);
      if (!removido) {
        const err = new Error("Autor não encontrado");
        err.status = 404;
        throw err;
      }
    } catch (e) {
      if (String(e.message).includes("FOREIGN KEY")) {
        const err = new Error(
          "Não é possível remover um autor que possui receitas vinculadas",
        );
        err.status = 409;
        throw err;
      }
      throw e;
    }
  },
};
