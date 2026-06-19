import { autorService } from "../services/autorService.js";

export const autorController = {
  async listarTodos(req, res, next) {
    try {
      const autores = autorService.listarTodos();
      res.json(autores);
    } catch (e) {
      next(e);
    }
  },

  async buscarPorId(req, res, next) {
    try {
      const autor = autorService.buscarPorId(Number(req.params.id));
      res.json(autor);
    } catch (e) {
      next(e);
    }
  },

  async criar(req, res, next) {
    try {
      const novo = autorService.criar(req.body);
      res.status(201).json(novo);
    } catch (e) {
      next(e);
    }
  },

  async atualizar(req, res, next) {
    try {
      const { token, ...dados } = req.body;
      const atualizado = autorService.atualizar(
        Number(req.params.id),
        token,
        dados,
      );
      res.json(atualizado);
    } catch (e) {
      next(e);
    }
  },

  async remover(req, res, next) {
    try {
      const { token } = req.body;
      autorService.remover(Number(req.params.id), token);
      res.status(204).end();
    } catch (e) {
      next(e);
    }
  },
};
