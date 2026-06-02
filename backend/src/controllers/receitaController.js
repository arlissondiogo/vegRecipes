import { receitaService } from "../services/receitaService.js";

function semCodigo({ codigoEdicao, ...resto }) {
  return resto;
}

export const receitaController = {
  listarTodas(req, res) {
    const receitas = receitaService.listarTodas();
    res.json(receitas.map(semCodigo));
  },

  buscarPorId(req, res) {
    const receita = receitaService.buscarPorId(Number(req.params.id));
    res.json(semCodigo(receita));
  },

  criar(req, res) {
    const nova = receitaService.criar(req.body);
    res.status(201).json(nova); // devolve COM codigoEdicao só no POST
  },

  atualizar(req, res) {
    const { codigoEdicao, ...dados } = req.body;
    const atualizada = receitaService.atualizar(Number(req.params.id), codigoEdicao, dados);
    res.json(semCodigo(atualizada));
  },

  remover(req, res) {
    const { codigoEdicao } = req.body;
    receitaService.remover(Number(req.params.id), codigoEdicao);
    res.status(204).end();
  },
};
