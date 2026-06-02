import { autorService } from "../services/autorService.js";

export const autorController = {
  listarTodos(req, res) {
    const autores = autorService.listarTodos();
    res.json(autores);
  },

  buscarPorId(req, res) {
    const autor = autorService.buscarPorId(Number(req.params.id));
    res.json(autor);
  },

  criar(req, res) {
    const novo = autorService.criar(req.body);
    res.status(201).json(novo);
  },

  atualizar(req, res) {
    const atualizado = autorService.atualizar(Number(req.params.id), req.body);
    res.json(atualizado);
  },

  remover(req, res) {
    autorService.remover(Number(req.params.id));
    res.status(204).end();
  },
};
