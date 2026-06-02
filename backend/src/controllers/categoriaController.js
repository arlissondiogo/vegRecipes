import { categoriaService } from "../services/categoriaService.js";

export const categoriaController = {
  listarTodas(req, res) {
    const categorias = categoriaService.listarTodas();
    res.json(categorias);
  },

  buscarPorId(req, res) {
    const categoria = categoriaService.buscarPorId(Number(req.params.id));
    res.json(categoria);
  },

  criar(req, res) {
    const nova = categoriaService.criar(req.body);
    res.status(201).json(nova);
  },

  atualizar(req, res) {
    const atualizada = categoriaService.atualizar(
      Number(req.params.id),
      req.body,
    );
    res.json(atualizada);
  },

  remover(req, res) {
    categoriaService.remover(Number(req.params.id));
    res.status(204).end();
  },
};
