import { state } from "../state.js";
import { receitaService } from "../services/receitaService.js";
import { showToast } from "./toast.js";

const codigos = {};

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
      const temCodigo = !!codigos[r.id];
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
            ? `<ul class="ingredientes-list">${r.ingredientes.map((i) => `<li>${i.quantidade} ${i.unidade} de ${i.nome}</li>`).join("")}</ul>`
            : ""
        }
        <div class="receita-actions">
          ${
            temCodigo
              ? `<button class="btn-action btn-edit" data-id="${r.id}" title="Editar nome">✏ Editar nome</button>
                 <button class="btn-action btn-del-receita" data-id="${r.id}" title="Remover">🗑 Remover</button>`
              : `<div class="codigo-input-row">
                   <input type="text" class="form-control form-control-sm codigo-field" placeholder="Código de edição…" data-id="${r.id}">
                   <button class="btn-action btn-unlock" data-id="${r.id}">Desbloquear</button>
                 </div>`
          }
        </div>`;
      container.appendChild(card);
    });

    container.querySelectorAll(".btn-unlock").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = Number(btn.dataset.id);
        const input = container.querySelector(`.codigo-field[data-id="${id}"]`);
        const codigo = input?.value?.trim();
        if (!codigo) {
          showToast("Digite o código de edição.", "error");
          return;
        }
        codigos[id] = codigo;
        receitaView.render();
      });
    });

    container.querySelectorAll(".btn-edit").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = Number(btn.dataset.id);
        const receita = state.receitas.find((r) => r.id === id);
        const novoNome = prompt("Novo nome da receita:", receita?.nome || "");
        if (!novoNome || !novoNome.trim()) return;
        try {
          const atualizada = await receitaService.atualizar(id, codigos[id], {
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
          if (
            e.message.toLowerCase().includes("inválido") ||
            e.message.toLowerCase().includes("403")
          ) {
            delete codigos[id];
          }
          showToast(e.message, "error");
          receitaView.render();
        }
      });
    });

    container.querySelectorAll(".btn-del-receita").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = Number(btn.dataset.id);
        const receita = state.receitas.find((r) => r.id === id);
        if (!confirm(`Remover "${receita?.nome}"?`)) return;
        try {
          await receitaService.remover(id, codigos[id]);
          delete codigos[id];
          state.receitas = state.receitas.filter((r) => r.id !== id);
          receitaView.render();
          showToast("Receita removida!");
        } catch (e) {
          if (
            e.message.toLowerCase().includes("inválido") ||
            e.message.toLowerCase().includes("403")
          ) {
            delete codigos[id];
            receitaView.render();
          }
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
      const dados = {
        nome: document.getElementById("rec-nome").value,
        modoPreparo: document.getElementById("rec-modo").value,
        tempoPreparo: document.getElementById("rec-tempo").value,
        porcoes: document.getElementById("rec-porcoes").value,
        categoriaId: document.getElementById("rec-categoria").value,
        autorId: document.getElementById("rec-autor").value || null,
        ingredientes: [...ingredientes],
      };
      try {
        const nova = await receitaService.criar(dados);
        if (nova.codigoEdicao) {
          codigos[nova.id] = nova.codigoEdicao;
          showToast(
            `Receita criada! Código de edição salvo em memória ✓`,
            "success",
          );
        }
        const { codigoEdicao, ...semCodigo } = nova;
        state.receitas.push(semCodigo);
        receitaView.render();
        form.reset();
        ingredientes = [];
        renderIngredientes();
      } catch (e) {
        showToast(e.message, "error");
      }
    });
  },
};
