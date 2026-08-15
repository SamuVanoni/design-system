# Design System — Guia para Claude Code

Design system React para SaaS B2B. Dark mode (default) + light mode via `data-theme` no `<html>`. Foundation: **CSS Variables + Tailwind config**.

**Antes de escrever qualquer componente novo, leia `COMPONENTS.md`** — provavelmente já existe algo pronto.

---

## Setup obrigatório na raiz da app

```tsx
import './styles/variables.css';
import 'react-day-picker/style.css';
import './styles/day-picker.css';
import { ThemeProvider, ToastProvider } from '@/components';

<ThemeProvider>
  <ToastProvider>
    <App />
  </ToastProvider>
</ThemeProvider>
```

Sem esses providers, `useToast()` explode e o tema não persiste.

**A fonte é responsabilidade da app, não do kit.** O kit declara
`--font-sans: 'Inter', …` mas **não baixa nada** — o `@import` do Google Fonts foi
removido em v0.3.0 porque punha uma requisição de rede bloqueante no caminho crítico de
todo consumidor (e quebrava offline). Em Next, carregue com `next/font`, que auto-hospeda:

```tsx
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
// <html className={inter.variable}> + no CSS: --font-sans: var(--font-inter), system-ui…
```

---

## `className` sobrescreve a variante (desde v0.6.3)

O `cn` interno usa `tailwind-merge`: numa colisão, **a última classe vence**, e o
`className` do consumidor é sempre o último argumento. `<Button variant="ghost"
className="text-error">` agora sai vermelho de verdade.

Antes era um `join(' ')` puro e quem decidia era a ordem no CSS gerado — o `className`
perdia sem avisar. Se você contornou isso com `!important` ou com um wrapper, pode tirar.

Ao acrescentar um passo novo ao preset (`fontSize`, `transitionDuration`, `boxShadow`),
**declare-o também em `src/lib/cn.ts`**. O `tailwind-merge` só conhece a escala padrão do
Tailwind: um `text-body` não declarado é lido como *cor*, e some quando você compõe com
`text-text-primary`. Chave errada no `extend` não dá erro — cria um grupo solto e a classe
volta a não conflitar com nada.

---

## Superfície sólida vs. tinta translúcida (desde v0.7.3)

| Você quer | Use | Por quê |
|---|---|---|
| Fundo de painel flutuante (dropdown, popover, select, tooltip) | `bg-surface-overlay` | Igual ao `elevated` nos dois temas; o que separa é **borda + sombra** |
| Hover, seleção, item realçado, linha de tabela | `bg-surface-mutedHover` | Translúcido: clareia no escuro e escurece no claro, sobre **qualquer** superfície |
| Chip discreto, avatar, badge neutro | `bg-surface-muted` | Idem, mais sutil |

**Nunca use um tom sólido como tinta de interação.** Ele não sabe sobre o que está
empilhado: o realce de item de menu era `bg-surface-elevated` e ficava *invisível no
tema claro*, onde painel e elevated são ambos `#FFFFFF`.

---

## Tokens semânticos — SEMPRE prefira aos escalares

**Nunca faça:** `<div className="bg-neutral-800 text-neutral-50 border border-neutral-700">`
**Faça:** `<div className="bg-surface-elevated text-text-primary border border-border">`

Razão: semânticos mudam sozinhos entre dark/light. Escalares travam a UI em um tema.

### Cores semânticas disponíveis

| Uso | Token |
|---|---|
| Fundo raiz do app | `bg-surface-base` |
| Cards, inputs, superfícies elevadas | `bg-surface-elevated` |
| Popovers, dropdowns, menus | `bg-surface-overlay` |
| Cinza translúcido discreto (avisos, chips) | `bg-surface-muted` / hover `bg-surface-mutedHover` |
| Overlay atrás de modais | `bg-backdrop` |
| Texto principal | `text-text-primary` |
| Texto de apoio | `text-text-secondary` |
| Helpers, captions, placeholders | `text-text-tertiary` |
| Elementos desabilitados | `text-text-disabled` |
| Texto sobre `bg-surface-muted` | `text-text-onMuted` |
| Borda padrão | `border-border` |
| Divisores sutis | `border-border-subtle` |
| Bordas fortes / seleção | `border-border-strong` |

### Feedback (sempre use o par `bg-*-soft` + `text-*-onSoft`)

- Success: `bg-success-soft` + `text-success-onSoft`
- Warning: `bg-warning-soft` + `text-warning-onSoft`
- Error:   `bg-error-soft`   + `text-error-onSoft`
- Info:    `bg-info-soft`    + `text-info-onSoft`
- Primary sobre soft: `text-primary-onSoft` (nunca `text-primary-400/500` direto sobre soft — falha AA no light)

**A cor base (`text-error`, `text-success`, `text-warning`, `text-info`) nunca carrega
texto.** Ela é cor de **estado** — borda de campo inválido, ponto do Badge, barra do
Progress, ícone de lixeira — e tem **um valor só** para os dois temas, então como texto
reprova AA em pelo menos um deles:

| | escuro | claro | com `-onSoft` |
|---|---|---|---|
| `error` | 3,68 ❌ | 3,76 ❌ | 5,01 / 6,47 ✅ |
| `success` | 6,08 ✅ | **2,28 ❌** | 7,95 / 5,02 ✅ |
| `warning` | 6,45 ✅ | **2,15 ❌** | 8,30 / 5,02 ✅ |
| `info` | 3,77 ❌ | 3,68 ❌ | 5,45 / 6,70 ✅ |

O nome `-onSoft` vem da origem, mas o papel do token é **"esta cor de feedback quando
ela é texto"** — vale sobre qualquer superfície, não só a `-soft`.

#### E quando ela desenha: `-graphic` (desde v0.7.4)

Barra de progresso, anel, traço de gráfico não são texto nem estado: são **gráfico**, e
valem a 1.4.11 (≥ 3:1). O limite é mais folgado que os 4,5:1 de texto, mas o **vizinho é
outro** — não é o card, é o trilho (`--surface-muted` composto, quase branco no claro).
A cor base reprovava até esse limite:

| contra o trilho | escuro | claro | com `-graphic` |
|---|---|---|---|
| `primary-500` | **2,39 ❌** | 4,36 ✅ | 4,56 / 4,36 ✅ |
| `success` | 5,04 ✅ | **2,07 ❌** | 5,04 / 4,55 ✅ |
| `warning` | 5,34 ✅ | **1,95 ❌** | 5,34 / 4,56 ✅ |
| `error` | 3,05 ✅ | 3,42 ✅ | 3,05 / 4,39 ✅ |
| `info` | 3,12 ✅ | 3,34 ✅ | 3,12 / 4,69 ✅ |

No escuro o `-graphic` **é** a cor base (o visual não muda); a exceção é o acento, que
sobe do 500 para o 400 — era o tom padrão do `CircularProgress` e o anel sumia contra o
próprio trilho. No claro não existe passo intermediário: o green-600 (`#16A34A`) para em
2,99:1, um décimo abaixo do limite, então o valor gráfico coincide com o `-text`.

Resumo dos três contratos da mesma cor: **base** = estado (borda de campo inválido),
**`-onSoft`** = texto, **`-graphic`** = desenho.

Usam `-graphic` hoje: `ProgressBar`, `CircularProgress`, o ponto de status do `Avatar`, o
marcador do `Badge` e os desenhos do `EmptyState` (v0.7.5).

**Conteúdo por cima de um preenchimento `-graphic` usa `text-text-onGraphic`** (v0.7.7).
Ele fecha o par: como o preenchimento inverte por tema, o conteúdo inverte junto — igual
ao `onAction` e ao `onDanger`. Sem ele o selo sólido do `EmptyState` não tinha saída:
manter o `primary-500` deixava a silhueta em 2,88:1 contra o card escuro, e trocar só o
preenchimento derrubava o "+" branco para 2,52:1. Com o par: silhueta 4,80 / 5,51 e
conteúdo 4,80 / 6,51.

**Quando o desenho fica sobre um fundo de feedback**, o vizinho deixa de ser o card e vira
o próprio fundo — e aí o `-soft` opaco atrapalha: no escuro ele é fundo demais (o traço do
`ArtError` travava em 2,66:1 mesmo com o `-graphic`). Use a tinta translúcida
(`fill-error/16`), que é o que o README já recomendava por outro motivo.

### Botões

- Primary (sólido neutro): `bg-action text-text-onAction`. **Inverte por tema** — navy `#17202E` no claro, `#E2E5E9` no escuro. Um preenchimento navy sobre fundo navy teria 1,4:1 de separação e o botão sumiria; por isso `--action-*` tem valor próprio em cada tema.
- Secondary (contorno neutro): `border border-border bg-transparent text-text-primary`.
- Info (aviso discreto): `bg-surface-muted text-text-onMuted` + ícone `i` em `text-info-onSoft`. Use `<Button variant="info">` — o ícone vem automático.
- Destrutivo (sólido vermelho): `bg-danger text-text-onDanger`. **Inverte por tema** igual ao `action` — `#DC2626` com rótulo branco no claro, `#F87171` com rótulo navy no escuro. Nenhum vermelho único serve: escurecer para o rótulo branco passar derruba a silhueta do botão contra o navy do modal para 2,87:1. Use `<Button variant="danger">`, nunca `bg-error` na mão.

### Qual variante usar (é uma escolha de papel, não de cor)

| Papel na tela | Variante | Regra |
|---|---|---|
| A ação que a pessoa veio fazer | `primary` | **uma por tela ou modal**, sempre a mais à direita |
| Uma alternativa de verdade | `secondary` | só quando existem duas ações reais lado a lado |
| Sair sem fazer nada | `ghost` | Cancelar, Voltar, Fechar |
| Apagar de forma irreversível | `danger` | **sempre dentro de um modal de confirmação** |
| Aviso clicável | `info` | não é ação — é um aviso que por acaso clica |

O sólido mais à direita é sempre o que confirma. No modal destrutivo ele continua
sólido e na mesma posição: muda a cor, não o peso. Um "Excluir" em `ghost` perde a
hierarquia; um "Excluir" em `primary` se disfarça de "Salvar".

Ícone de lixeira em linha de tabela é `ghost` + `text-error` — ele só **abre** o
modal, não apaga nada. Como é ícone, vale o limite de 3:1 e o `text-error` passa.

**Nunca copie a receita de uma variante num `<button>` na mão.** Desde a v0.7.1 o
`Button` encaminha ref, então ele serve de gatilho para `Tooltip`, `Dropdown`,
`Popover` e `Select` — que usam `asChild` e precisam do nó real para posicionar o
painel. Era essa a única razão pela qual valia a pena copiar, e ela acabou. Cópia
de variante desanda calada no dia em que a variante muda.

Botão só-ícone é `<Button variant="…" className="h-10 w-10 p-0" aria-label="…">`.
O `p-0` vence o `px-4` do tamanho porque o `cn` resolve conflito (v0.6.3).
- Sobre `bg-primary-500` use **sempre `text-text-onPrimary`** — nunca um literal (`text-white`, `text-neutral-900`). Desde a v0.6.2 esse token vale branco (4,80:1 sobre o verdigris); enquanto o acento foi o cobre ele valia navy. É exatamente por trocar de valor com o acento que ele existe: quem tinha escrito `text-neutral-900` na mão ficou em 3,41:1 sem perceber.
- Danger é `text-text-onDanger`, não `onPrimary` — o preenchimento ali é `--color-error`, não o acento.

### O acento significa ESTADO, não ação (desde v0.5.0)

`primary-500` é o **verdigris `#2A7F71`** (era o cobre `#C97C1B` até a v0.6.0) e aparece **só**
onde a UI diz *isto está selecionado, ativo ou com foco*: anel de foco, checkbox marcado, radio,
switch ligado, aba ativa, passo atual do Stepper, dia selecionado no calendário, ProgressBar.

**Não use `bg-primary-500` para um botão, um cabeçalho ou um bloco decorativo.** Assim que o
acento volta a preencher área grande, ele deixa de marcar estado e a distinção se perde. Ação
sólida é `bg-action`; texto de link é neutro sublinhado (`text-text-link` + `underline`).

### Cor de status por SEVERIDADE (desde v0.6.0)

Cápsula colorida **só** quando o estado exige ação: `error` e `warning`. `success` e `info` são
cápsula neutra com marcador colorido. Vale para `Badge` no kit e para qualquer pílula que você
criar. Cor que aparece em toda coluna não avisa nada — um vencimento real precisa saltar mais
que um "em dia".

Use os fundos translúcidos (`bg-error/16`, `bg-warning/12`), **não** os `-soft` opacos: no tema
escuro `-soft` é um bloco saturado que sobre o navy vira mancha, e reprovava AA (3,62:1).

### Opacidade em token (`bg-success/10`) exige `tom()` no preset

Todo token de cor passa por `tom()` em `tailwind.preset.cjs`, que devolve `color-mix` quando há
modificador de opacidade. **Se você adicionar um token novo como string `'var(--x)'` crua, os
modificadores de opacidade dele somem do CSS sem erro nenhum** — a classe simplesmente não é
gerada e o elemento fica sem fundo. Foi um bug real: a `StatusPill` ficou sem cápsula por
várias versões.

### Tipografia (classes prontas)

`text-h1` `text-h2` `text-h3` `text-subtitle` `text-body` `text-caption`.
Pesos: `font-normal|medium|semibold|bold`.

### Espaçamento

Múltiplos de 4/8: `p-1 p-2 p-3 p-4 p-5 p-6 p-8 p-10 p-12 p-16 p-20 p-24`. **Nunca** `p-[13px]` ou valores arbitrários.

---

## Regras de composição

- **Formulários**: envolva TODOS os inputs em `<Field label="..." helperText="..." errorText="...">`. Field cuida de id + aria-describedby + aria-invalid via contexto. Todos os primitivos (`Input`, `Textarea`, `Select`, `Combobox`, `MultiCombobox`, `DatePicker`, `DateRangePicker`, `TimePicker`, `Checkbox`, `Radio.Group`, `Switch`) já consomem esse contexto.
- **Tabelas simples** (só markup + hover): use `Table` composicional.
- **Tabelas com sort/seleção/column visibility**: use `DataTable`.
- **Lista curta de opções** (< 8 itens): use `Select`.
- **Lista longa filtrável**: use `Combobox` (single) ou `MultiCombobox` (múltiplo).
- **Menu de ações** (contextual, não é seleção): use `Dropdown`.
- **Feedback transitório** (toast): `useToast()`, nunca componha `<Toast />` manual.
- **Confirmação bloqueante**: `Modal`.
- **Loading dentro de botão**: use `loading` prop do `Button` (não coloque `<Spinner />` manual).
- **Loading de página/card**: `Skeleton` no formato do conteúdo final.
- **Loading sobre container existente**: `SpinnerOverlay` num pai `relative`.
- **Progresso com fim conhecido**: `ProgressBar` (linear) ou `CircularProgress` (compacto/dashboard). Se o fim é desconhecido e a espera é curta, `Spinner`; se está carregando o layout, `Skeleton`.
- **Seções colapsáveis / FAQ**: `Accordion`. `type="single"` para um por vez, `"multiple"` para vários, `separated` para cada item como card.
- **Fluxo multi-passo** (onboarding, checkout): `Stepper`. Só passe `onStepClick` se voltar for permitido.
- **Topo de tela**: `PageHeader` (título + descrição + fila de ações). Não escreva o cabeçalho à mão: é o bloco mais copiado de qualquer app e a cópia derrapa sempre no mesmo ponto — descrição longa ou muitos botões empurram o grupo para uma segunda linha, **colado na esquerda**, longe de onde o olho procura a ação primária. Se faltar algo, ajuste o componente, não a tela.
- **Localização na hierarquia**: `Breadcrumbs` — o último item é a página atual e nunca é link.
- **Valor numérico em faixa**: `Slider` (o valor é sempre `number[]`; dois valores = range). Para número exato digitado, `Input type="number"`.
- **Envio de arquivos**: `FileUpload` dentro de `<Field>`. Ele só coleta e valida — o upload em si fica na sua app.
- **Lista/busca sem resultado**: `EmptyState`, sempre com `action` apontando a próxima ação.
- **Identidade de pessoa**: `Avatar` (`name` já gera as iniciais) e `AvatarGroup` para coleções.

---

## Convenções obrigatórias

1. **Um H1 por página.** Seções usam `text-h2`, subseções `text-h3`.
2. **Focus visible** em todo elemento interativo — os componentes do kit já fazem, mas se criar um custom use `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base`.
3. **Ícones**: sempre `lucide-react`. Tamanho padrão `h-4 w-4` dentro de botões/badges.
4. **TypeScript**: exemplos e componentes novos em `.tsx`.
5. **Não use `localStorage` para estado de UI** exceto para tema (já feito no `ThemeProvider`).

---

## O que NÃO fazer

- Não criar novos tokens de cor sem adicionar em `tokens/colors.json` E `src/styles/variables.css` (dark + light).
- Não usar `dark:` do Tailwind — o kit troca tema via `data-theme`, não via classe `dark`.
- Não instalar libs de UI concorrentes (shadcn, MUI, Chakra). Se falta algo, adicione ao kit.
- Não usar cores hardcoded (`#2A7F71`, `#EF4444`…) no código — sempre via classe Tailwind semântica.
- Não colocar lógica de negócio dentro dos componentes do kit — eles são apresentacionais.

---

## Mapa de arquivos

```
tokens/                   Fonte de verdade dos tokens (JSON, para ferramentas externas)
src/styles/
  variables.css           CSS vars — troca aqui reflete em toda UI
  day-picker.css          Overrides do react-day-picker
src/theme/
  ThemeProvider.tsx       Provider + useTheme
src/lib/cn.ts             Concatenador de classes
src/components/
  index.ts                Re-exports centralizados — importe SEMPRE daqui
  {Component}.tsx         Um arquivo por componente
tailwind.config.js        Consome as CSS vars como classes utilitárias
COMPONENTS.md             Índice compacto de todos os componentes
README.md                 Docs longas com exemplos (NÃO leia todo se puder evitar)
```

---

## Adicionar componente novo

1. Cria `src/components/NovoComponente.tsx` com JSDoc no topo (breve descrição + exemplo).
2. Exporta em `src/components/index.ts`.
3. Adiciona 1 linha em `COMPONENTS.md`.
4. Se introduziu token novo, atualiza `tokens/colors.json` + `variables.css` (dark E light).
5. Se estilo depende de contraste, valida WCAG AA para pares críticos.

---

## Import path canônico

Sempre importe do barrel:
```tsx
import { Button, Field, Combobox, useToast } from '@/components';
```
Nunca importe do arquivo direto (`@/components/Button`) — quebra tree-shaking mental e polui refactors.
