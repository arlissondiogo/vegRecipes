import { receitaService } from "../services/receitaService.js";

export const receitaController = {
  async listarTodas(req, res, next) {
    try {
      const { nome, categoriaId, ordenarPor, ordem, limit, offset } = req.query;
      const resultado = receitaService.listarTodas({
        nome,
        categoriaId,
        ordenarPor,
        ordem,
        limit: limit ? Number(limit) : 10,
        offset: offset ? Number(offset) : 0
      });

      res.json(resultado);
    } catch (error) {
      next(error);
    }
  },

  async buscarPorId(req, res, next) {
    try {
      const receita = receitaService.buscarPorId(Number(req.params.id));
      res.json(receita);
    } catch (error) {
      next(error);
    }
  },

  async getEstatisticas(req, res, next) {
    try {
      const stats = receitaService.getEstatisticas();
      res.json(stats);
    } catch (error) {
      next(error);
    }
  },

  async criar(req, res, next) {
    try {
      const nova = receitaService.criar(req.body);
      res.status(201).json(nova);
    } catch (error) {
      next(error);
    }
  },

  async atualizar(req, res, next) {
    try {
      const { id } = req.params;
      const { autorToken, ...dados } = req.body;
      const atualizada = receitaService.atualizar(Number(id), autorToken, dados);
      res.json(atualizada);
    } catch (error) {
      next(error);
    }
  },

  async remover(req, res, next) {
    try {
      const { id } = req.params;
      const { autorToken } = req.body;
      receitaService.remover(Number(id), autorToken);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};
