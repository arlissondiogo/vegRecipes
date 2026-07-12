import { state } from "../state.js";
import { receitaService } from "../services/receitaService.js";
import { showToast } from "./toast.js";

function getNomeCategoria(id) {
  const c = state.categorias.find((c) => c.id === Number(id));
  return c ? c.nome : `#${id}`;
}

function getNomeAutor(id) {
  if (!id) return "—";
  const a = state.autores.find((a) => a.id === Number(id));
  return a ? a.nome : `#${id}`;
}

export const receitaView = {
  render() {
    const container = document.getElementById("receitas-list");
    if (!container) return;
    container.innerHTML = "";

    if (state.receitas.length === 0) {
      container.innerHTML = `<p class="text-center text-muted fst-italic py-4">Nenhuma receita cadastrada.</p>`;
      return;
    }

    state.receitas.forEach((r) => {
      const card = document.createElement("div");
      card.className = "receita-card";
      card.dataset.id = r.id;
      card.innerHTML = `
        <div class="receita-header">
          <div>
            <span class="receita-nome">${r.nome}</span>
            <span class="badge-cat ms-2">${getNomeCategoria(r.categoriaId)}</span>
          </div>
          <div class="receita-meta">
            <span title="Tempo de preparo">⏱ ${r.tempoPreparo} min</span>
            <span title="Porções">🍽 ${r.porcoes} porções</span>
            <span title="Autor">✍ ${getNomeAutor(r.autorId)}</span>
          </div>
        </div>
        <p class="receita-modo">${r.modoPreparo}</p>
        ${
          r.ingredientes && r.ingredientes.length > 0
            ? `<ul class="ingredientes-list">${r.ingredientes.map((i) => `<li>${i}</li>`).join("")}</ul>`
            : ""
        }
        <div class="receita-actions">
          <button class="btn-action btn-edit" data-id="${r.id}" title="Editar nome">✏ Editar nome</button>
          <button class="btn-action btn-del-receita" data-id="${r.id}" title="Remover">🗑 Remover</button>
        </div>`;
      container.appendChild(card);
    });

    container.querySelectorAll(".btn-edit").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = Number(btn.dataset.id);
        const receita = state.receitas.find((r) => r.id === id);
        const novoNome = prompt("Novo nome da receita:", receita?.nome || "");
        if (!novoNome || !novoNome.trim()) return;
        const autorToken = prompt(
          "Digite o token do autor desta receita para confirmar a edição:",
        );
        if (!autorToken || !autorToken.trim()) {
          showToast("Edição cancelada: token não informado.", "error");
          return;
        }
        try {
          const atualizada = await receitaService.atualizar(id, autorToken, {
            nome: novoNome.trim(),
          });
          const idx = state.receitas.findIndex((r) => r.id === id);
          if (idx !== -1)
            state.receitas[idx] = {
              ...state.receitas[idx],
              nome: atualizada.nome,
            };
          receitaView.render();
          showToast("Receita atualizada!");
        } catch (e) {
          showToast(e.message, "error");
        }
      });
    });

    container.querySelectorAll(".btn-del-receita").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = Number(btn.dataset.id);
        const receita = state.receitas.find((r) => r.id === id);
        if (!confirm(`Remover "${receita?.nome}"?`)) return;
        const autorToken = prompt(
          "Digite o token do autor desta receita para confirmar a remoção:",
        );
        if (!autorToken || !autorToken.trim()) {
          showToast("Remoção cancelada: token não informado.", "error");
          return;
        }
        try {
          await receitaService.remover(id, autorToken);
          state.receitas = state.receitas.filter((r) => r.id !== id);
          receitaView.render();
          showToast("Receita removida!");
        } catch (e) {
          showToast(e.message, "error");
        }
      });
    });
  },

  bindForm() {
    const form = document.getElementById("form-receita");
    if (!form) return;

    let ingredientes = [];
    const ingList = document.getElementById("ing-list");
    document.getElementById("btn-add-ing")?.addEventListener("click", () => {
      const nome = document.getElementById("ing-nome").value.trim();
      const qtd = document.getElementById("ing-qtd").value.trim();
      const un = document.getElementById("ing-un").value.trim();
      if (!nome || !qtd || !un) {
        showToast(
          "Preencha nome, quantidade e unidade do ingrediente.",
          "error",
        );
        return;
      }
      ingredientes.push({ nome, quantidade: Number(qtd), unidade: un });
      renderIngredientes();
      document.getElementById("ing-nome").value = "";
      document.getElementById("ing-qtd").value = "";
      document.getElementById("ing-un").value = "";
    });

    function renderIngredientes() {
      if (!ingList) return;
      if (ingredientes.length === 0) {
        ingList.innerHTML = "";
        return;
      }
      ingList.innerHTML = ingredientes
        .map(
          (i, idx) =>
            `<span class="ing-tag">${i.quantidade} ${i.unidade} de ${i.nome}
          <button type="button" class="ing-remove" data-idx="${idx}">×</button>
        </span>`,
        )
        .join("");
      ingList.querySelectorAll(".ing-remove").forEach((b) => {
        b.addEventListener("click", () => {
          ingredientes.splice(Number(b.dataset.idx), 1);
          renderIngredientes();
        });
      });
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const autorId = document.getElementById("rec-autor").value;
      if (!autorId) {
        showToast("Selecione o autor da receita.", "error");
        return;
      }

      const autorToken = prompt(
        "Digite o SEU token de autor para cadastrar esta receita em seu nome:",
      );
      if (!autorToken || !autorToken.trim()) {
        showToast("Cadastro cancelado: token do autor não informado.", "error");
        return;
      }

      const dados = {
        nome: document.getElementById("rec-nome").value,
        modoPreparo: document.getElementById("rec-modo").value,
        tempoPreparo: document.getElementById("rec-tempo").value,
        porcoes: document.getElementById("rec-porcoes").value,
        categoriaId: document.getElementById("rec-categoria").value,
        autorId,
        autorToken,
        ingredientes: [...ingredientes],
      };
      try {
        const nova = await receitaService.criar(dados);
        state.receitas.push(nova);
        receitaView.render();
        form.reset();
        ingredientes = [];
        renderIngredientes();
        showToast("Receita criada com sucesso!", "success");
      } catch (e) {
        showToast(e.message, "error");
      }
    });
  },
};
