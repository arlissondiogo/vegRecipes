import { categoriaService } from "../services/categoriaService.js";

export const categoriaController = {
  async listarTodas(req, res, next) {
    try {
      const categorias = categoriaService.listarTodas();
      res.json(categorias);
    } catch (e) {
      next(e);
    }
  },

  async buscarPorId(req, res, next) {
    try {
      const categoria = categoriaService.buscarPorId(Number(req.params.id));
      res.json(categoria);
    } catch (e) {
      next(e);
    }
  },

  async criar(req, res, next) {
    try {
      const nova = categoriaService.criar(req.body);
      res.status(201).json(nova);
    } catch (e) {
      next(e);
    }
  },

  async atualizar(req, res, next) {
    try {
      const atualizada = categoriaService.atualizar(
        Number(req.params.id),
        req.body,
      );
      res.json(atualizada);
    } catch (e) {
      next(e);
    }
  },

  async remover(req, res, next) {
    try {
      categoriaService.remover(Number(req.params.id));
      res.status(204).end();
    } catch (e) {
      next(e);
    }
  },
};
