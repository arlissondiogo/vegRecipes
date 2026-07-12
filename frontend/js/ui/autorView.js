import { state } from "../state.js";
import { autorService } from "../services/autorService.js";
import { showToast } from "./toast.js";

export const autorView = {
  render() {
    const tbody = document.getElementById("autores-tbody");
    if (!tbody) return;
    tbody.innerHTML = "";

    if (state.autores.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="2" class="text-center text-muted fst-italic py-3">Nenhum autor cadastrado.</td>
        </tr>`;
      return;
    }

    state.autores.forEach((a) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${a.nome}</td>
        <td class="text-end">
          <button class="btn-del" data-id="${a.id}" title="Remover">
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
        if (!confirm("Remover este autor? Você precisará do token dele."))
          return;
        const token = prompt(
          "Digite o token deste autor para confirmar a remoção:",
        );
        if (!token || !token.trim()) {
          showToast("Remoção cancelada: token não informado.", "error");
          return;
        }
        try {
          await autorService.remover(id, token);
          state.autores = state.autores.filter((a) => a.id !== id);
          autorView.render();
          document.dispatchEvent(new CustomEvent("autores:updated"));
          showToast("Autor removido!");
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
    state.autores.forEach((a) => {
      const opt = document.createElement("option");
      opt.value = a.id;
      opt.textContent = a.nome;
      sel.appendChild(opt);
    });
    if (val) sel.value = val;
  },

  bindForm(onCreated) {
    const form = document.getElementById("form-autor");
    if (!form) return;
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const nome = document.getElementById("autor-nome").value;
      try {
        const novo = await autorService.criar({ nome });

        alert(
          "Conta criada!\n\n" +
            `Apelido: ${novo.nome}\n` +
            `Seu token (GUARDE BEM, ele NÃO será mostrado de novo):\n\n${novo.token}\n\n` +
            "Esse token é o que comprova que as receitas são suas. Sem ele você não " +
            "consegue criar, editar ou remover receitas em seu nome, e não há como recuperá-lo depois.",
        );

        const { token, ...semToken } = novo;
        state.autores.push(semToken);
        autorView.render();
        document.dispatchEvent(new CustomEvent("autores:updated"));
        showToast(`Autor "${novo.nome}" cadastrado!`);
        form.reset();
        if (onCreated) onCreated(semToken);
      } catch (e) {
        showToast(e.message, "error");
      }
    });
  },
};
