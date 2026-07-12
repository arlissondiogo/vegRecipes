# Relatório de Avaliação Heurística — Projeto 1 (VegRecipes)

Autor: Árlisson Diôgo
Data: 12/07/2026
Score Lighthouse (Acessibilidade): 96 / 100 (testei tanto em Mobile quanto em Desktop, mas teve o mesmo resultado)

---

## Problema 1

- Onde: Aba "Autores" → formulário de cadastro (`autorView.js`, `bindForm`)
- O que observei: o token do autor é exibido uma única vez em um `alert()` nativo do navegador. Se o usuário fechar o alerta sem copiar manualmente o texto, o token é perdido para sempre — e sem ele não é possível criar, editar ou remover receitas em seu nome. Existe inclusive uma classe `.btn-copy` já pronta no `style.css`, mas ela não é usada em lugar nenhum do JS, sugerindo uma funcionalidade de "copiar token" que ficou incompleta.
- Heurística violada: #5 Prevenção de erros
- Gravidade: 4
- Correção proposta: substituir o `alert()` por um modal customizado com o token em um campo de texto (`readonly`) e um botão "Copiar" usando `navigator.clipboard.writeText()`, reaproveitando o `.btn-copy` já existente no CSS. O modal só deve poder ser fechado após confirmação explícita ("Copiei meu token").
- Evidência: evidencias/print-token-alert.png

## Problema 2

- Onde: Toda a aplicação — botões de submeter formulário e de remover (Receitas, Categorias, Autores)
- O que observei: nenhum botão é desabilitado nem mostra spinner/texto de carregamento durante a chamada `fetch`. A tela permanece com aparência "normal" e clicável enquanto a requisição está em andamento, permitindo múltiplos cliques e possíveis requisições duplicadas.
- Heurística violada: #1 Visibilidade do status
- Gravidade: 3
- Correção proposta: desabilitar o botão (`disabled = true`) e trocar seu texto para algo como "Salvando..." no início do `try`, revertendo no `finally`, em todos os `bindForm`/handlers de remoção.
- Evidência: evidencias/print-sem-loading.png (DevTools → Network mostra a requisição "autores" com status "Pending" — em andamento — enquanto o botão "Cadastrar" na tela permanece com aparência normal, ativo e sem qualquer indicação de carregamento)

## Problema 3

- Onde: `#receitas-list`, `#categorias-tbody`, `#autores-tbody` (containers atualizados via `innerHTML`)
- O que observei: essas regiões são reescritas dinamicamente pelo JavaScript a cada `render()`, mas nenhuma delas possui `aria-live="polite"`. Um leitor de tela não é avisado quando uma receita, categoria ou autor é criado/removido — a mudança acontece "em silêncio" para quem usa tecnologia assistiva.
- Heurística violada: acessibilidade / item específico de SPA
- Gravidade: 3
- Correção proposta: adicionar `aria-live="polite"` nos três containers no `index.html` (ex: `<div id="receitas-list" aria-live="polite">`).
- Evidência: evidencias/print-sem-aria-live.png (DevTools → Elements, `<tbody id="autores-tbody">` selecionado e buscado — mostra apenas o atributo `id`, sem `aria-live`)

## Problema 4

- Onde: `autorView.js`, `categoriaView.js`, `receitaView.js` — após remover um item da lista
- O que observei: ao remover um autor, categoria ou receita, a função `render()` reconstrói toda a lista/tabela do zero (`tbody.innerHTML = ""`), e nenhum `.focus()` é chamado em seguida no código. Testando manualmente por teclado: logo após a remoção, o foco não fica em nenhum elemento visível (nenhum contorno aparece na tela). Ao apertar Tab novamente, o foco pula automaticamente para o botão de remover (lixeira) do próximo item da lista — não por uma decisão do código (não há `.focus()` algum nos arquivos), mas por um comportamento padrão do navegador, que tenta realocar o foco quando o elemento focado é removido do DOM. Isso é preocupante porque o foco acaba pousando justamente em cima de outra ação destrutiva (excluir), sem que o usuário tenha escolhido ir para ali — um posicionamento de foco não intencional e potencialmente perigoso, ao invés de um lugar neutro definido propositalmente pela aplicação (como o título da seção).
- Heurística violada: #6 Reconhecer em vez de lembrar / item específico de SPA (gestão de foco)
- Gravidade: 3
- Correção proposta: após remover um item, mover o foco explicitamente para um elemento estável e neutro — por exemplo o título da seção (`<h2 class="section-title">`, com `tabindex="-1"`) ou uma mensagem de confirmação da remoção — chamando `.focus()` manualmente no callback de sucesso, em vez de deixar o navegador decidir sozinho.
- Evidência: teste manual de navegação por teclado (sem print) — após remover um autor pela lixeira usando o teclado (Tab até o botão + Enter), o foco ficou sem elemento visível na tela. Ao apertar Tab novamente, o foco pulou automaticamente para o botão de remover (lixeira) do próximo item da lista, comportamento padrão do navegador diante da ausência de gestão de foco no código.

## Problema 5

- Onde: `autorView.js` (remoção de autor), `receitaView.js` (edição e remoção de receita)
- O que observei: para confirmar ações sensíveis (remover autor, editar/remover receita), a aplicação usa `confirm()` e `prompt()` nativos do navegador para pedir o token. Esses diálogos quebram completamente a identidade visual do site (fontes, cores, layout definidos no `style.css` são ignorados) e têm comportamento inconsistente entre navegadores.
- Heurística violada: #4 Consistência e padrões
- Gravidade: 2
- Correção proposta: substituir `prompt()`/`confirm()` por um modal HTML próprio (Bootstrap Modal, já que a lib está no projeto) com campo de senha/token estilizado e botões "Confirmar"/"Cancelar".
- Evidência: evidencias/print-confirm-nativo.png (mostra o `confirm()` padrão do navegador — "Remover esta categoria?" — completamente destoante do design verde/creme do site; nota-se inclusive que o app já possui um sistema de toast estilizado próprio, tornando ainda mais evidente que o confirm/prompt nativos são desnecessários)

## Problema 6

- Onde: `index.html` — bloco "Ingredientes" do formulário de nova receita (`#ing-nome`, `#ing-qtd`, `#ing-un`)
- O que observei: o bloco tem um `<label class="form-label">Ingredientes</label>` genérico acima dos três campos, mas ele não possui atributo `for` e não está associado a nenhum input específico. Os três campos individuais (`ing-nome`, `ing-qtd`, `ing-un`) não têm `<label for="...">` próprio — dependem apenas do `placeholder` ("Ingrediente", "Qtd", "Unidade") pra indicar sua função, diferente dos demais campos do formulário (ex: "Nome da receita", que tem `<label for="rec-nome">` individual). Isso viola o checklist de inspeção visual da atividade ("todo campo de formulário tem um `<label>`, não só placeholder").
- Heurística violada: acessibilidade
- Gravidade: 2
- Correção proposta: adicionar um `<label for="ing-nome">`, `<label for="ing-qtd">` e `<label for="ing-un">` individuais para cada campo, podendo usar a classe `visually-hidden` do Bootstrap se o rótulo visível quebrar o layout compacto da linha de ingredientes.
- Evidência: evidencias/print-labels-ingredientes.png (DevTools → Elements mostra o `<input id="ing-nome">` com apenas `placeholder`, sem `for`/`id` ligando-o ao `<label>Ingredientes</label>` do grupo, que é genérico)

## Problema 7

- Onde: botões de remoção (ícone de lixeira SVG) em `autorView.js` e `categoriaView.js`
- O que observei: os botões usam apenas o atributo `title="Remover"` para indicar sua função. `title` não é lido de forma confiável por leitores de tela e só aparece visualmente em hover com mouse, não ajudando quem navega por teclado ou toque.
- Heurística violada: acessibilidade
- Gravidade: 2
- Correção proposta: adicionar `aria-label="Remover autor"` / `aria-label="Remover categoria"` diretamente no `<button>`.
- Evidência: evidencias/print-btn-sem-aria-label.png (DevTools → Elements mostra `<button class="btn-del" data-id="6" title="Remover">` — apenas `title`, sem `aria-label`)

## Problema 8

- Onde: `index.html` — navegação por abas (`#mainTab`, `.tab-pane`)
- O que observei: inspecionando o DOM renderizado (não o HTML estático), constatei que o Bootstrap já injeta via JavaScript, em tempo de execução, os atributos `role="tab"`, `aria-selected` e `tabindex` nos botões, e `role="tabpanel"` nos painéis — então essa parte já funciona. Porém, mesmo no DOM renderizado, os botões não recebem `aria-controls` apontando para o painel correspondente, e os painéis (`.tab-pane`) não recebem `aria-labelledby` apontando de volta para o botão da aba. Essa associação bidirecional não é feita automaticamente pelo Bootstrap e precisa ser escrita manualmente no HTML.
- Heurística violada: acessibilidade
- Gravidade: 2
- Correção proposta: adicionar `aria-controls="tab-categorias"` (etc.) em cada `<button>` de aba e `aria-labelledby="<id-do-botão>"` em cada `.tab-pane` correspondente, completando a associação ARIA entre aba e painel.
- Evidência: evidencias/print-abas-aria.png (DevTools → Elements, DOM renderizado do botão "Categorias": `role="tab"`, `aria-selected="false"`, `tabindex="-1"` já presentes via Bootstrap, mas sem `aria-controls`)

## Problema 9

- Onde: aplicação como um todo (detectado pelo Lighthouse, categoria Accessibility)
- O que observei: o Lighthouse apontou "Background and foreground colors do not have a sufficient contrast ratio" — a única falha automática encontrada (score 96/100, testado em Mobile e Desktop). O texto mais provável é `--text-muted: #7a7065` sobre `--cream: #f7f3ec`, usado em `.form-label`, `.text-muted`, `.receita-meta` e `.receita-modo`.
- Heurística violada: acessibilidade (item C do checklist técnico — "contraste texto/fundo")
- Gravidade: 2
- Correção proposta: escurecer `--text-muted` (ex: `#5c5347`) até atingir pelo menos 4.5:1 de contraste com `--cream`, validando no WebAIM Contrast Checker; reexecutar o Lighthouse para confirmar 100/100.
- Evidência: evidencias/lighthouse-mobile.png e evidencias/lighthouse-desktop.png (relatório do Lighthouse, categoria Accessibility, score 96/100, item "Background and foreground colors do not have a sufficient contrast ratio")

---

## Resumo

- Total de problemas: 9
- Problemas de gravidade 3–4 (prioritários): 4 (Problemas 1, 2, 3 e 4)
- Score de acessibilidade: 96 / 100
- Os 3 que vou corrigir primeiro no E7:
  1. Token de autor sem forma segura de copiar (Problema 1 — gravidade 4)
  2. Loading state ausente em todas as ações (Problema 2)
  3. `aria-live` nas listas dinâmicas (Problema 3)
