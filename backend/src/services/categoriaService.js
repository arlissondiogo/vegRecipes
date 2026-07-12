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
    if (!dados.nome) {
      const err = new Error('Campo "nome" é obrigatório');
      err.status = 400;
      throw err;
    }
    if (!categoriaModel.buscarPorId(id)) {
      const err = new Error("Categoria não encontrada");
      err.status = 404;
      throw err;
    }
    if (categoriaModel.existeNome(dados.nome)) {
      const existente = categoriaModel.listarTodas().find(
        (c) => c.nome.toLowerCase() === dados.nome.toLowerCase() && c.id !== Number(id)
      );
      if (existente) {
        const err = new Error("Já existe uma categoria com este nome");
        err.status = 409;
        throw err;
      }
    }
    return categoriaModel.atualizar(id, dados);
  },

  remover(id) {
    try {
      const removida = categoriaModel.remover(id);
      if (!removida) {
        const err = new Error("Categoria não encontrada");
        err.status = 404;
        throw err;
      }
    } catch (e) {
      if (String(e.message).includes("FOREIGN KEY")) {
        const err = new Error("Não é possível remover uma categoria que possui receitas vinculadas");
        err.status = 409;
        throw err;
      }
      throw e;
    }
  },
};
