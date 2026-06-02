import { categoriaModel } from "../models/categoria.js";

export const categoriaService = {
  listarTodas() {
    return categoriaModel.listarTodas();
  },

  buscarPorId(id) {
    const categoria = categoriaModel.buscarPorId(id);
    if (!categoria) {
      const err = new Error("Categoria não encontrada");
      err.status = 404;
      throw err;
    }
    return categoria;
  },

  criar({ nome }) {
    if (!nome) {
      const err = new Error('Campo "nome" é obrigatório');
      err.status = 400;
      throw err;
    }

    if (categoriaModel.existeNome(nome)) {
      const err = new Error("Já existe uma categoria com este nome");
      err.status = 409;
      throw err;
    }

    return categoriaModel.inserir({ nome });
  },

  atualizar(id, dados) {
    const atualizada = categoriaModel.atualizar(id, dados);
    if (!atualizada) {
      const err = new Error("Categoria não encontrada");
      err.status = 404;
      throw err;
    }
    return atualizada;
  },

  remover(id) {
    const removida = categoriaModel.remover(id);
    if (!removida) {
      const err = new Error("Categoria não encontrada");
      err.status = 404;
      throw err;
    }
  },
};
