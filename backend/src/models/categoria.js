let categorias = [];
let nextId = 1;

export const categoriaModel = {
  listarTodas() {
    return categorias;
  },

  buscarPorId(id) {
    return categorias.find((c) => c.id === id) || null;
  },

  existeNome(nome) {
    return categorias.some((c) => c.nome.toLowerCase() === nome.toLowerCase());
  },

  inserir({ nome }) {
    const nova = { id: nextId++, nome };
    categorias.push(nova);
    return nova;
  },

  atualizar(id, dados) {
    const idx = categorias.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    categorias[idx] = { ...categorias[idx], ...dados, id };
    return categorias[idx];
  },

  remover(id) {
    const tamanhoAntes = categorias.length;
    categorias = categorias.filter((c) => c.id !== id);
    return categorias.length < tamanhoAntes;
  },
};
