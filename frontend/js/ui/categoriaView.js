import { state } from "../state.js";
import { categoriaService } from "../services/categoriaService.js";
import { showToast } from "./toast.js";

export const categoriaView = {
  render() {
    const tbody = document.getElementById("categorias-tbody");
    if (!tbody) return;
    tbody.innerHTML = "";

    if (state.categorias.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="2" class="text-center text-muted fst-italic py-3">Nenhuma categoria cadastrada.</td>
        </tr>`;
      return;
    }

    state.categorias.forEach((cat) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><span class="badge-cat">${cat.nome}</span></td>
        <td class="text-end">
          <button class="btn-del" data-id="${cat.id}" title="Remover">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
              <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
            </svg>
          </button>
        </td>`;
      tbody.appendChild(tr);
    });

    tbody.querySelectorAll(".btn-del").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = Number(btn.dataset.id);
        if (!confirm("Remover esta categoria?")) return;
        try {
          await categoriaService.remover(id);
          state.categorias = state.categorias.filter((c) => c.id !== id);
          categoriaView.render();
          document.dispatchEvent(new CustomEvent("categorias:updated"));
          showToast("Categoria removida!");
        } catch (e) {
          showToast(e.message, "error");
        }
      });
    });
  },

  populateSelect(selectId) {
    const sel = document.getElementById(selectId);
    if (!sel) return;
    const val = sel.value;
    sel.innerHTML = `<option value="">— Selecione —</option>`;
    state.categorias.forEach((c) => {
      const opt = document.createElement("option");
      opt.value = c.id;
      opt.textContent = c.nome;
      sel.appendChild(opt);
    });
    if (val) sel.value = val;
  },

  bindForm(onCreated) {
    const form = document.getElementById("form-categoria");
    if (!form) return;
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const nome = document.getElementById("cat-nome").value;
      try {
        const nova = await categoriaService.criar({ nome });
        state.categorias.push(nova);
        categoriaView.render();
        document.dispatchEvent(new CustomEvent("categorias:updated"));
        showToast(`Categoria "${nova.nome}" criada!`);
        form.reset();
        if (onCreated) onCreated(nova);
      } catch (e) {
        showToast(e.message, "error");
      }
    });
  },
};
