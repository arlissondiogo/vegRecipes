import { api } from "../api.js";

export const receitaService = {
  async listar() {
    const resultado = await api.get("/receitas");
    return resultado.dados ?? resultado;
  },

  async criar(dados) {
    const {
      nome,
      modoPreparo,
      tempoPreparo,
      porcoes,
      categoriaId,
      autorId,
      autorToken,
    } = dados;
    if (!nome || !nome.trim()) throw new Error('O campo "nome" é obrigatório.');
    if (!modoPreparo || !modoPreparo.trim())
      throw new Error('O "modo de preparo" é obrigatório.');
    if (!tempoPreparo || isNaN(tempoPreparo) || Number(tempoPreparo) <= 0)
      throw new Error('"Tempo de preparo" deve ser um número positivo.');
    if (!porcoes || isNaN(porcoes) || Number(porcoes) <= 0)
      throw new Error('"Porções" deve ser um número positivo.');
    if (!categoriaId) throw new Error('Selecione uma "categoria".');
    if (!autorId) throw new Error('Selecione o "autor" da receita.');
    if (!autorToken || !autorToken.trim())
      throw new Error(
        'Informe o seu "token de autor" para cadastrar a receita.',
      );
    return api.post("/receitas", {
      nome: nome.trim(),
      modoPreparo: modoPreparo.trim(),
      tempoPreparo: Number(tempoPreparo),
      porcoes: Number(porcoes),
      categoriaId: Number(categoriaId),
      autorId: Number(autorId),
      autorToken: autorToken.trim(),
      ingredientes: (dados.ingredientes || []).map(
        (i) => `${i.quantidade} ${i.unidade} de ${i.nome}`,
      ),
    });
  },

  async remover(id, autorToken) {
    if (!autorToken || !autorToken.trim())
      throw new Error('O "token de autor" é obrigatório para remover.');
    return api.delete(`/receitas/${id}`, { autorToken: autorToken.trim() });
  },

  async atualizar(id, autorToken, dados) {
    if (!autorToken || !autorToken.trim())
      throw new Error('O "token de autor" é obrigatório para editar.');
    return api.put(`/receitas/${id}`, {
      autorToken: autorToken.trim(),
      ...dados,
    });
  },
};
