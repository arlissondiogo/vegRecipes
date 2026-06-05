import { state } from "./state.js";
import { categoriaService } from "./services/categoriaService.js";
import { autorService } from "./services/autorService.js";
import { receitaService } from "./services/receitaService.js";
import { categoriaView } from "./ui/categoriaView.js";
import { autorView } from "./ui/autorView.js";
import { receitaView } from "./ui/receitaView.js";
import { showToast } from "./ui/toast.js";

async function init() {
  try {
    const [cats, auts, recs] = await Promise.all([
      categoriaService.listar(),
      autorService.listar(),
      receitaService.listar(),
    ]);
    state.categorias = cats;
    state.autores = auts;
    state.receitas = recs;
  } catch (e) {
    showToast(
      "Erro ao conectar com a API. Verifique se o backend está rodando.",
      "error",
    );
    console.error(e);
  }

  categoriaView.render();
  autorView.render();
  receitaView.render();

  categoriaView.populateSelect("rec-categoria");
  autorView.populateSelect("rec-autor");

  categoriaView.bindForm();
  autorView.bindForm();
  receitaView.bindForm();

  document.addEventListener("categorias:updated", () => {
    categoriaView.populateSelect("rec-categoria");
  });
  document.addEventListener("autores:updated", () => {
    autorView.populateSelect("rec-autor");
  });
}

init();
