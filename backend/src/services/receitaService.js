import { receitaModel } from "../models/receita.js";
import { categoriaModel } from "../models/categoria.js";
import { autorModel } from "../models/autor.js";

export const receitaService = {
  listarTodas() {
    return receitaModel.listarTodas();
  },

  buscarPorId(id) {
    const receita = receitaModel.buscarPorId(id);
    if (!receita) {
      const err = new Error("Receita não encontrada");
      err.status = 404;
      throw err;
    }
    return receita;
  },

  criar({ nome, modoPreparo, tempoPreparo, porcoes, categoriaId, autorId, ingredientes }) {
    if (!nome || !modoPreparo || !tempoPreparo || !porcoes || !categoriaId) {
      const err = new Error(
        'Campos "nome", "modoPreparo", "tempoPreparo", "porcoes" e "categoriaId" são obrigatórios',
      );
      err.status = 400;
      throw err;
    }

    if (!categoriaModel.buscarPorId(Number(categoriaId))) {
      const err = new Error("Categoria informada não existe");
      err.status = 422;
      throw err;
    }

    if (autorId && !autorModel.buscarPorId(Number(autorId))) {
      const err = new Error("Autor informado não existe");
      err.status = 422;
      throw err;
    }

    return receitaModel.inserir({ nome, modoPreparo, tempoPreparo, porcoes, categoriaId, autorId, ingredientes });
  },

  atualizar(id, codigoEdicao, dados) {
    if (!codigoEdicao) {
      const err = new Error("Código de edição é obrigatório");
      err.status = 400;
      throw err;
    }
    if (!receitaModel.validarCodigo(id, codigoEdicao)) {
      const err = new Error("Código de edição inválido");
      err.status = 403;
      throw err;
    }
    const atualizada = receitaModel.atualizar(id, dados);
    if (!atualizada) {
      const err = new Error("Receita não encontrada");
      err.status = 404;
      throw err;
    }
    return atualizada;
  },

  remover(id, codigoEdicao) {
    if (!codigoEdicao) {
      const err = new Error("Código de edição é obrigatório");
      err.status = 400;
      throw err;
    }
    if (!receitaModel.validarCodigo(id, codigoEdicao)) {
      const err = new Error("Código de edição inválido");
      err.status = 403;
      throw err;
    }
    const removida = receitaModel.remover(id);
    if (!removida) {
      const err = new Error("Receita não encontrada");
      err.status = 404;
      throw err;
    }
  },
};
