let autores = [];
let nextId = 1;

export const autorModel = {
  listarTodos() {
    return autores;
  },

  buscarPorId(id) {
    return autores.find((a) => a.id === id) || null;
  },

  existeEmail(email) {
    return autores.some((a) => a.email === email);
  },

  inserir({ nome, email }) {
    const novo = { id: nextId++, nome, email };
    autores.push(novo);
    return novo;
  },

  atualizar(id, dados) {
    const idx = autores.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    autores[idx] = { ...autores[idx], ...dados, id };
    return autores[idx];
  },

  remover(id) {
    const tamanhoAntes = autores.length;
    autores = autores.filter((a) => a.id !== id);
    return autores.length < tamanhoAntes;
  },
};
