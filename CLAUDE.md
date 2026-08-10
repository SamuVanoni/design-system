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

### Botões

- Primary (cobre): `bg-primary-500 text-text-onPrimary`
- Secondary (cobre oxidado): `bg-secondary-500 text-text-onSecondary`
- Info (aviso discreto): `bg-surface-muted text-text-onMuted` + ícone `i` em `text-info-onSoft`. Use `<Button variant="info">` — o ícone vem automático.
- Nunca use `text-white` sobre `bg-primary-500` — falha AA. Sempre `text-text-onPrimary`.

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
- Não usar cores hardcoded (`#FF6B1A`) no código — sempre via classe Tailwind semântica.
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
