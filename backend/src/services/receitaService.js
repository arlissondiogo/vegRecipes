import { receitaModel } from "../models/receita.js";
import { categoriaModel } from "../models/categoria.js";
import { autorModel } from "../models/autor.js";

export const receitaService = {
  listarTodas(filtros) {
    const total = receitaModel.contarTodas(filtros);
    const dados = receitaModel.listarTodas(filtros);

    return {
      dados,
      paginacao: {
        total,
        limit: filtros.limit || 10,
        offset: filtros.offset || 0,
        paginas: Math.ceil(total / (filtros.limit || 10)),
      },
    };
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

  getEstatisticas() {
    return receitaModel.getEstatisticas();
  },

  criar({
    nome,
    modoPreparo,
    tempoPreparo,
    porcoes,
    categoriaId,
    autorId,
    autorToken,
    ingredientes,
  }) {
    if (
      !nome ||
      !modoPreparo ||
      !tempoPreparo ||
      !porcoes ||
      !categoriaId ||
      !autorId
    ) {
      const err = new Error(
        'Campos "nome", "modoPreparo", "tempoPreparo", "porcoes", "categoriaId" e "autorId" são obrigatórios',
      );
      err.status = 400;
      throw err;
    }

    if (!autorToken) {
      const err = new Error(
        "Token do autor é obrigatório para cadastrar uma receita em seu nome",
      );
      err.status = 400;
      throw err;
    }

    if (!categoriaModel.buscarPorId(Number(categoriaId))) {
      const err = new Error("Categoria informada não existe");
      err.status = 422;
      throw err;
    }

    if (!autorModel.buscarPorId(Number(autorId))) {
      const err = new Error("Autor informado não existe");
      err.status = 422;
      throw err;
    }

    if (!autorModel.validarToken(Number(autorId), autorToken)) {
      const err = new Error(
        "Token do autor inválido: não é possível cadastrar receita em nome de outra pessoa",
      );
      err.status = 403;
      throw err;
    }

    if (Number(tempoPreparo) <= 0) {
      const err = new Error("O tempo de preparo deve ser maior que zero");
      err.status = 400;
      throw err;
    }

    if (Number(porcoes) <= 0) {
      const err = new Error("O número de porções deve ser maior que zero");
      err.status = 400;
      throw err;
    }

    return receitaModel.inserir({
      nome,
      modoPreparo,
      tempoPreparo,
      porcoes,
      categoriaId,
      autorId,
      ingredientes,
    });
  },

  atualizar(id, autorToken, dados) {
    if (!autorToken) {
      const err = new Error("Token do autor é obrigatório");
      err.status = 400;
      throw err;
    }
    if (!receitaModel.validarAutoria(id, autorToken)) {
      const err = new Error("Token inválido: você não é o autor desta receita");
      err.status = 403;
      throw err;
    }

    if (
      dados.categoriaId &&
      !categoriaModel.buscarPorId(Number(dados.categoriaId))
    ) {
      const err = new Error("Categoria informada não existe");
      err.status = 422;
      throw err;
    }

    delete dados.autorId;

    const atualizada = receitaModel.atualizar(id, dados);
    if (!atualizada) {
      const err = new Error("Receita não encontrada");
      err.status = 404;
      throw err;
    }
    return atualizada;
  },

  remover(id, autorToken) {
    if (!autorToken) {
      const err = new Error("Token do autor é obrigatório");
      err.status = 400;
      throw err;
    }
    if (!receitaModel.validarAutoria(id, autorToken)) {
      const err = new Error("Token inválido: você não é o autor desta receita");
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
