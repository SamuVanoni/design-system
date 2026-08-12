# Design System — SaaS B2B (Fase 8)

Design system minimalista para aplicações web corporativas B2B. Suporta **dark mode** (padrão) e **light mode**, com toggle persistido em `localStorage`. Distribuído como **CSS Variables + Tailwind config**, permitindo troca de tokens sem rebuild.

Cobertura atual: **Foundations** (cores, tipografia, espaçamento, temas) + **Átomos** (Button, Input, Label, HelperText, Badge) + **Formulários** (Field, Textarea, Checkbox, Radio, Switch, Select, Combobox, MultiCombobox, DatePicker, DateRangePicker, TimePicker) + **Moleculares** (Card, Modal, Dropdown, Tabs) + **Feedback/Overlays** (Toast, Tooltip, Popover, CommandPalette) + **Dados** (Table, DataTable, Pagination) + **Loading** (Skeleton, Spinner, SpinnerOverlay).

---

## Consumindo num SaaS

Este repositório é o **cookbook**: os SaaS instalam ele como pacote, não copiam os componentes. Corrigiu um bug no `Button`? Sobe uma tag e todo mundo herda.

### 1. Instalar

```bash
npm i github:SamuVanoni/design-system#v0.1.0
```

Sempre fixe a tag. Sem ela o npm pega o `main` e um commit no meio de uma refatoração entra direto na sua build.

O pacote é publicado como fonte + `dist` — o `prepare` roda o build no momento da instalação, então não há artefato commitado no repo.

### 2. Tailwind

O tema mora num preset. Como o `package.json` de um app Vite normalmente tem `"type": "module"`, o config precisa ser **`tailwind.config.cjs`**:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('@samuvanoni/design-system/tailwind-preset')],
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './index.html',
    // Sem esta linha os componentes do kit vêm sem estilo.
    './node_modules/@samuvanoni/design-system/dist/**/*.{js,mjs}',
  ],
};
```

E no CSS de entrada:

```css
@import "tailwindcss";
@config "../tailwind.config.cjs";
```

### 3. Raiz da app

```tsx
import '@samuvanoni/design-system/styles/variables.css';
import 'react-day-picker/style.css';
import '@samuvanoni/design-system/styles/day-picker.css';
import './main.css';

import { ThemeProvider, ToastProvider } from '@samuvanoni/design-system';

<ThemeProvider>
  <ToastProvider>
    <App />
  </ToastProvider>
</ThemeProvider>
```

### 4. Usar

```tsx
import { Button, Field, Input, useToast } from '@samuvanoni/design-system';
```

Dentro deste repo os imports são relativos (`../lib/cn`); nos SaaS é sempre o nome do pacote.

### O ciclo de mudança

1. A alteração nasce **aqui**, nunca no SaaS. Consertar direto no consumidor mata o cookbook.
2. Durante a iteração, `npm link` no SaaS para ver ao vivo sem publicar.
3. Estabilizou: commit + `git tag vX.Y.Z` + push.
4. Cada SaaS sobe quando quiser, apontando para a tag nova.

### Armadilhas conhecidas

- **React duplicado**: `react`/`react-dom` são `peerDependencies` de propósito. Se algum dia virarem `dependencies`, o SaaS ganha uma segunda cópia do React e quebra com *Invalid hook call*.
- **Componentes sem estilo**: quase sempre é o `content` do Tailwind sem o glob do `dist`.
- **Animações sumidas**: o `tailwindcss-animate` é registrado pelo preset. Se o SaaS sobrescrever `plugins`, Modal/Toast/Accordion perdem as transições.

---

## Decisões de design

| Decisão | Escolha | Motivo |
|---|---|---|
| Temas | dark (default) + light | Toggle manual via `ThemeProvider`, persistido em localStorage |
| Primária | `#2A7F71` (verdigris) | Acento da marca. Significa **estado** (foco, seleção, aba ativa, switch ligado), não ação |
| Ação sólida | `--action-*`, neutro que inverte por tema | Navy no claro, claro no escuro. Separada da primária justamente para o acento não preencher área grande |
| Texto sobre a primária | branco (v0.6.2) | Era navy quando o acento era o cobre. O verdigris é mais escuro e inverteu a relação: branco 4,80:1, navy 3,41:1 |
| Composição de classe | `tailwind-merge` no `cn` (v0.6.3) | Numa colisão a última vence, e o `className` é sempre o último argumento — antes ele perdia para a variante conforme a ordem do CSS gerado |
| Ação destrutiva | `--danger-*`, vermelho que inverte por tema (v0.7.0) | Mesma razão do `--action-*`: escurecer o vermelho para o rótulo branco passar derruba a silhueta do botão contra o navy do modal (2,87:1) |
| `Button` encaminha ref | `forwardRef` (v0.7.1) | Sem isso ele não servia de gatilho para `Tooltip`/`Dropdown`/`Popover`, e o consumidor copiava a receita da variante num `<button>` na mão — cópia que desanda calada |
| Painel flutuante | `--surface-overlay` = `--surface-elevated` nos **dois** temas (v0.7.3) | Separação vem de **borda + sombra**, não de tom. O overlay claro do escuro (`#353F50`) impedia texto colorido: o item `danger` travava em 3,84:1 |
| Tinta de hover/seleção | sempre o translúcido `--surface-muted-hover` (v0.7.3) | Um tom sólido não sabe sobre o que está empilhado. O realce de item de menu era `bg-surface-elevated` e ficava **invisível no tema claro**, onde painel e elevated são ambos `#FFFFFF` |
| Feedback que desenha | `--fb-*-graphic`, calibrado por tema (v0.7.4) | Barra e anel valem 3:1 da 1.4.11, mas contra o **trilho**, não o card. Verde e âmbar base davam 2,07:1 e 1,95:1 no claro; o próprio acento dava 2,39:1 contra o trilho escuro e o anel padrão sumia |
| Secundária |  `#359C8B` | Rampa herdada; **nenhum componente do kit usa** desde a v0.5.0. Fica disponível para consumidores |
| Tipografia | Inter (carregada pela app, nao pelo kit) | Neutra, otima em tabela e numero — leitura de SaaS B2B serio |
| Ícones | `lucide-react` | Tree-shakeable, 1000+ ícones |
| Grid base | 8px (múltiplos: 4/8/16/24/32/48/64) | Consistência sem excesso |
| Base moleculares | Radix UI | Acessibilidade, focus trap, teclado — de graça |
| Distribuição | CSS Vars + Tailwind | Fonte única de verdade nas vars; utilitários no JSX |

---

## Estrutura do repositório

```
design-system/
├── tokens/
│   ├── colors.json           # inclui semânticos por tema (dark/light)
│   ├── typography.json
│   └── spacing.json
├── src/
│   ├── styles/variables.css  # CSS vars com [data-theme='dark'|'light']
│   ├── theme/
│   │   └── ThemeProvider.tsx # Provider + hook useTheme
│   ├── lib/cn.ts
│   ├── components/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Label.tsx
│   │   ├── HelperText.tsx
│   │   ├── Card.tsx          # composicional (Header/Body/Footer)
│   │   ├── Badge.tsx         # variantes + count + dot
│   │   ├── Modal.tsx         # Radix Dialog
│   │   ├── Dropdown.tsx      # Radix DropdownMenu
│   │   ├── Tabs.tsx          # Radix Tabs (underline)
│   │   ├── Toast.tsx         # Provider + useToast() (Radix Toast)
│   │   ├── Tooltip.tsx       # Radix Tooltip
│   │   ├── Popover.tsx       # Radix Popover
│   │   ├── Field.tsx         # wrapper composicional: label + helper + erro
│   │   ├── Textarea.tsx      # textarea com autoResize opcional
│   │   ├── Checkbox.tsx      # Radix Checkbox (indeterminate)
│   │   ├── Radio.tsx         # Radix RadioGroup (Radio.Group / Radio.Item)
│   │   ├── Switch.tsx        # Radix Switch (sm/md, labelBefore)
│   │   ├── Select.tsx        # Radix Select composicional
│   │   ├── Combobox.tsx      # Select com busca (cmdk + Popover)
│   │   ├── MultiCombobox.tsx # Combobox com múltiplos valores + chips
│   │   ├── DatePicker.tsx    # data única (react-day-picker + Popover)
│   │   ├── DateRangePicker.tsx # intervalo com presets rápidos
│   │   ├── TimePicker.tsx    # hora + minuto (2 Selects), 12h/24h
│   │   ├── CommandPalette.tsx # ⌘K global palette + useCommandShortcut
│   │   ├── DataTable.tsx     # TanStack Table + Table primitives
│   │   ├── Table.tsx         # composicional (Head/Body/Row/Cell/HeadCell/Empty)
│   │   ├── Pagination.tsx    # números + prev/next com truncamento
│   │   ├── Skeleton.tsx      # placeholder animado (shimmer)
│   │   ├── Spinner.tsx       # Spinner + SpinnerOverlay
│   │   ├── ThemeToggle.tsx
│   │   └── index.ts
│   └── examples/App.tsx
├── tailwind.config.js
└── README.md
```

---

## Setup

```bash
npm install react react-dom lucide-react \
  @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-tabs \
  @radix-ui/react-toast @radix-ui/react-tooltip @radix-ui/react-popover \
  @radix-ui/react-checkbox @radix-ui/react-radio-group @radix-ui/react-switch @radix-ui/react-select \
  cmdk react-day-picker date-fns @tanstack/react-table
npm install -D tailwindcss typescript @types/react
npx tailwindcss init
```

Nos entrypoints da app (`main.tsx`), importe os estilos globais **na ordem**:

```tsx
import './styles/variables.css';
import 'react-day-picker/style.css';   // reset do react-day-picker (v9)
import './styles/day-picker.css';       // overrides do DS (obrigatório na ordem: depois do reset)
```

Envolva a árvore com os providers necessários:

```tsx
import { ThemeProvider, ToastProvider } from './components';

<ThemeProvider>
  <ToastProvider>
    <App />
  </ToastProvider>
</ThemeProvider>
```

Substitua o `tailwind.config.js` gerado pelo fornecido neste repo e configure o entrypoint:

```tsx
// src/main.tsx
import ReactDOM from 'react-dom/client';
import App from './examples/App';
import './styles/variables.css';

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
```

CSS de entrada com as diretivas do Tailwind:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## Tema (dark ↔ light)

Envolva a árvore com `<ThemeProvider>` e use `<ThemeToggle />` onde quiser expor o botão.

```tsx
import { ThemeProvider, ThemeToggle, useTheme } from './components';

<ThemeProvider>
  <App />
</ThemeProvider>

// Hook para lógica programática:
const { theme, toggleTheme, setTheme } = useTheme();
```

O provider aplica `data-theme="dark"` ou `data-theme="light"` no `<html>` e persiste em `localStorage['ds-theme']`. Se preferir SSR sem flash inicial, injete um script inline no `<head>` que lê o localStorage antes do React montar.

---

## Tokens semânticos

Prefira **tokens semânticos** em vez de escalas cruas — assim mudar um tom afeta a UI toda de uma vez e ambos os temas ficam consistentes.

| Token | Uso |
|---|---|
| `bg-surface-base` | Fundo raiz do app |
| `bg-surface-elevated` | Cards, inputs, superfícies acima do base |
| `bg-surface-overlay` | Popovers, dropdowns, menus |
| `text-text-primary` | Texto principal |
| `text-text-secondary` | Texto de apoio |
| `text-text-tertiary` | Helpers, captions, placeholders |
| `text-text-disabled` | Elementos desabilitados |
| `border-border` | Borda padrão |
| `border-border-subtle` | Divisores sutis |
| `border-border-strong` | Contornos fortes / seleção |
| `bg-backdrop` | Overlay atrás de modais |
| `bg-action` + `text-text-onAction` | Botão sólido de ação (inverte por tema) |
| `text-text-onPrimary` | Conteúdo sobre `bg-primary-500` — branco desde a v0.6.2 (4,80:1 sobre o verdigris) |
| `bg-danger` + `text-text-onDanger` | Botão destrutivo sólido (inverte por tema, como o `action`) |
| `text-error` / `-success` / `-warning` / `-info` | Cor de **estado**: borda de campo inválido, ponto do Badge, ícone de lixeira. **Nunca carrega texto nem desenha** — valor único para os dois temas, reprova AA em pelo menos um |
| `text-*-onSoft` | A mesma cor quando ela **é texto**, calibrada por tema. Vale sobre qualquer superfície, não só a `-soft` |
| `bg-*-graphic` / `text-*-graphic` | A mesma cor quando ela **desenha** — barra, anel, traço (v0.7.4). Alvo 1.4.11 (≥ 3:1) contra o **trilho**, não contra o card. Inclui `primary-graphic` |
| `text-primary-onSoft` | Acento sobre fundo suave — nunca `text-primary-500` direto, reprova AA no claro |
| `text-text-link` / `text-text-linkHover` | Links (neutros + sublinhado desde a v0.5.0) |

**Fundo de feedback: prefira o translúcido ao `-soft` opaco** — `bg-error/16`, `bg-warning/12`.
No tema escuro os `-soft` viram mancha saturada sobre o navy e reprovavam AA (3,62:1 medido).
Os `bg-*-soft` continuam existindo para quem já os usa.

Cor de status vai por **severidade**: cápsula colorida só em `error` e `warning`; `success` e
`info` são cápsula neutra com marcador. Cor que aparece em toda linha não avisa nada.

---

## Componentes

### Card (composicional)

```tsx
<Card>
  <Card.Header
    title="Assinatura Pro"
    description="Renova em 12/08"
    action={<Badge variant="success">Ativa</Badge>}
  />
  <Card.Body>Conteúdo do card...</Card.Body>
  <Card.Footer>
    <Button variant="ghost" size="sm">Detalhes</Button>
    <Button size="sm">Gerenciar</Button>
  </Card.Footer>
</Card>
```

Prop `interactive` no `Card` adiciona hover + cursor para cards clicáveis.

### Badge

```tsx
<Badge>Default</Badge>
<Badge variant="primary">Beta</Badge>
<Badge variant="success">Ativa</Badge>
<Badge variant="error" count={128} max={99} />  // → "99+"
<Badge dot variant="success" />                 // círculo colorido
<Badge variant="info" icon={<Info className="h-3 w-3" />}>Nova</Badge>
```

Variantes: `default | primary | success | warning | error | info`.
Props especiais: `count`, `max`, `dot`, `icon`.

### Modal

```tsx
const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Abrir</Button>
<Modal
  open={open}
  onOpenChange={setOpen}
  title="Confirmar exclusão"
  description="Essa ação não pode ser desfeita."
  size="md"                 // sm | md | lg
>
  <p>Conteúdo…</p>
  <Modal.Footer>
    <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
    <Button onClick={confirm}>Confirmar</Button>
  </Modal.Footer>
</Modal>
```

Escape para fechar, focus trap, click-outside e ARIA vêm do Radix.

### Dropdown

```tsx
<Dropdown trigger={<Button variant="ghost">Ações</Button>}>
  <Dropdown.Label>Item</Dropdown.Label>
  <Dropdown.Item onSelect={editar}>Editar</Dropdown.Item>
  <Dropdown.Separator />
  <Dropdown.CheckboxItem checked={x} onCheckedChange={setX}>
    Ativar notificações
  </Dropdown.CheckboxItem>
  <Dropdown.Separator />
  <Dropdown.Item tone="danger" onSelect={excluir}>Excluir</Dropdown.Item>
</Dropdown>
```

Props do root: `align` (`start` | `center` | `end`), `sideOffset`.

### Tabs

```tsx
<Tabs defaultValue="overview">
  <Tabs.List>
    <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
    <Tabs.Trigger value="usage">
      Uso <Badge variant="primary" count={5} />
    </Tabs.Trigger>
    <Tabs.Trigger value="settings">Configurações</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="overview">…</Tabs.Content>
  <Tabs.Content value="usage">…</Tabs.Content>
  <Tabs.Content value="settings">…</Tabs.Content>
</Tabs>
```

Estilo underline. Suporta modo controlado (`value` + `onValueChange`) ou não controlado (`defaultValue`).

### Toast

```tsx
import { useToast } from './components';

function SaveButton() {
  const toast = useToast();
  return (
    <Button onClick={async () => {
      try {
        await save();
        toast.success('Salvo!');
      } catch (e) {
        toast.error('Falha ao salvar', { description: String(e), duration: 6000 });
      }
    }}>Salvar</Button>
  );
}
```

API do hook: `toast.default | success | error | warning | info`, cada um recebendo `(title, { description?, duration? })`. Também há `toast.custom({...})` e `toast.dismiss(id)`.
Requer `<ToastProvider>` na raiz. Auto-dismiss em 4s por padrão; toasts se empilham no canto inferior-direito.

### Tooltip

```tsx
<Tooltip content="Salvar (Ctrl+S)">
  <Button>Salvar</Button>
</Tooltip>

<Tooltip content="Ajuda" side="right" delayDuration={100}>
  <IconButton />
</Tooltip>
```

O trigger precisa aceitar `ref` e props (por isso `asChild` internamente). O `Button` do kit serve — ele encaminha ref desde a v0.7.1. Ícone-only? Passe `aria-label` no trigger.

### Popover

Para conteúdo livre (form, filtros, mini-card). Diferente do Dropdown, que é lista de ações.

```tsx
<Popover trigger={<Button>Filtros</Button>} side="bottom" align="start">
  <Popover.Header title="Filtrar por" onClose />
  <Popover.Body>
    <div className="space-y-2">…</div>
    <div className="flex justify-end gap-2 pt-2">
      <Popover.Close asChild><Button variant="ghost" size="sm">Cancelar</Button></Popover.Close>
      <Popover.Close asChild><Button size="sm">Aplicar</Button></Popover.Close>
    </div>
  </Popover.Body>
</Popover>
```

Props: `size` (`sm`/`md`/`lg`), `side`, `align`, `sideOffset`, `showArrow`, controlado via `open`/`onOpenChange`.

### Field (composição de formulário)

`Field` é o wrapper padrão para qualquer input do kit. Ele cuida de label, helper text, mensagem de erro e das ligações ARIA (`id`, `aria-describedby`, `aria-invalid`) automaticamente.

```tsx
<Field label="Prioridade" required helperText="Afeta a ordem na fila." errorText={err}>
  <Select value={v} onValueChange={setV} placeholder="Escolha...">
    <Select.Item value="low">Baixa</Select.Item>
    <Select.Item value="med">Média</Select.Item>
    <Select.Item value="high">Alta</Select.Item>
  </Select>
</Field>
```

Props: `label`, `helperText`, `errorText`, `required`, `disabled`, `hideLabel` (`sr-only`), `htmlFor` (override).

Regra: se `errorText` for passado, o `helperText` é ocultado — só uma mensagem por vez.
Quando `Field` embrulha um input do kit (Textarea/Select/Checkbox/Radio/Switch), ele fornece o `id` e ARIA via contexto — o input pega tudo sozinho. Fora de `Field`, cada primitivo funciona standalone.

### Textarea

```tsx
<Field label="Descrição" helperText="Máx 500 caracteres">
  <Textarea autoResize maxRows={6} value={v} onChange={(e) => setV(e.target.value)} />
</Field>
```

Prop `autoResize` cresce até `maxRows` (default 8) e depois habilita scroll.

### Checkbox

```tsx
<Checkbox
  checked={x}
  onCheckedChange={setX}
  label="Aceito os termos"
  description="Você pode revogar depois."
/>

// Indeterminate (útil para "selecionar todos" parcial):
<Checkbox checked="indeterminate" onCheckedChange={setX} label="Assinar" />
```

### Radio

```tsx
<Radio.Group value={v} onValueChange={setV} orientation="horizontal">
  <Radio.Item value="sm" label="Pequeno" />
  <Radio.Item value="md" label="Médio" />
  <Radio.Item value="lg" label="Grande" />
</Radio.Group>
```

`orientation`: `vertical` (default) ou `horizontal`.

### Switch

```tsx
<Switch
  checked={notify}
  onCheckedChange={setNotify}
  label="Notificações por email"
  description="Receber alertas de status."
  labelBefore    // coloca o label à esquerda, típico de linhas de configurações
/>
```

Tamanhos: `sm` | `md` (default).

### Select

```tsx
<Field label="Prioridade">
  <Select value={v} onValueChange={setV} placeholder="Escolha...">
    <Select.Group>
      <Select.Label>Padrão</Select.Label>
      <Select.Item value="low">Baixa</Select.Item>
      <Select.Item value="med">Média</Select.Item>
    </Select.Group>
    <Select.Separator />
    <Select.Item value="urgent">Urgente</Select.Item>
  </Select>
</Field>
```

Suporta teclado completo (setas, home/end, digitar para filtrar), scroll, grupos, labels, separators. Tamanho: `sm` | `md`.

### Combobox (Select com busca)

Para listas longas onde o usuário precisa filtrar por digitação. Usa `cmdk` (lib do Paco Coursey) + Radix Popover.

```tsx
// Modo simples: passa options e o kit monta a lista
<Field label="País">
  <Combobox
    options={[
      { value: 'br', label: 'Brasil', description: 'América do Sul', searchValue: 'brasil brazil' },
      { value: 'us', label: 'Estados Unidos', searchValue: 'usa eua' },
      { value: 'nz', label: 'Nova Zelândia', disabled: true },
    ]}
    value={v}
    onValueChange={setV}
    placeholder="Selecione..."
    searchPlaceholder="Buscar país..."
  />
</Field>

// Modo composicional: para grupos, ícones, itens complexos
<Combobox.Root value={v} onValueChange={setV}>
  <Combobox.Group heading="América do Sul">
    <Combobox.Item value="br" label="Brasil" />
    <Combobox.Item value="ar" label="Argentina" />
  </Combobox.Group>
  <Combobox.Separator />
  <Combobox.Group heading="Europa">
    <Combobox.Item value="pt" label="Portugal" />
  </Combobox.Group>
</Combobox.Root>
```

Cada `Option` (ou `Combobox.Item`) aceita: `value`, `label`, `description`, `disabled`, `searchValue` (texto alternativo para busca — ex.: "usa" busca "Estados Unidos").

Integra com `Field` (herda id, aria, disabled, hasError). Teclado completo (setas, enter, esc). Empty state customizável via `emptyText`.

### DatePicker

Data única. Combina Radix Popover + `react-day-picker` v9. Estilizado com CSS de `src/styles/day-picker.css` que usa os tokens do DS — funciona automaticamente nos dois temas.

```tsx
<Field label="Data de entrega">
  <DatePicker
    value={date}
    onValueChange={setDate}
    minDate={new Date()}
    maxDate={new Date(2026, 11, 31)}
  />
</Field>
```

Props: `value`, `onValueChange`, `placeholder`, `displayFormat` (default `'dd/MM/yyyy'`), `minDate`, `maxDate`, `size` (`sm`/`md`), `disabled`, `invalid`, `locale` (default `ptBR` do date-fns).

### DateRangePicker

Intervalo com dois meses lado a lado + presets rápidos (Hoje, Últimos 7/30 dias, Este mês, Mês passado, Este ano).

```tsx
const [range, setRange] = useState<DateRange | undefined>({
  from: subDays(new Date(), 6),
  to: new Date(),
});

<Field label="Período">
  <DateRangePicker
    value={range}
    onValueChange={setRange}
    numberOfMonths={2}      // default 2; use 1 para popover mais compacto
    presets                 // true (default) mostra atalhos; pode passar array custom
  />
</Field>
```

Tipo do valor: `DateRange` do `react-day-picker` (`{ from?: Date; to?: Date }`).
Para presets customizados, passe `presets={[{ label: 'Hoje', getValue: () => ({ from: new Date(), to: new Date() }) }]}`.
Passe `presets={false}` para ocultar a coluna lateral.

### MultiCombobox

Combobox aceitando múltiplos valores. Os selecionados aparecem como chips no trigger; excedente vira `+N`.

```tsx
const [values, setValues] = useState<string[]>([]);

<Field label="Países">
  <MultiCombobox
    options={countries}
    value={values}
    onValueChange={setValues}
    placeholder="Escolha países..."
    maxDisplay={3}
  />
</Field>
```

Props extras: `maxDisplay` (chips antes de comprimir), `searchPlaceholder`, `emptyText`. Cada chip tem botão `X` individual e há um botão global de "limpar tudo" ao lado da seta.

### TimePicker

Composto por dois Selects (hora e minuto). Formato 12h com AM/PM ou 24h.

```tsx
const [time, setTime] = useState('09:00');
<TimePicker value={time} onValueChange={setTime} minuteStep={30} />

// 12h
<TimePicker value={time} onValueChange={setTime} format="12h" minuteStep={15} />

// Com segundos
<TimePicker value={time} onValueChange={setTime} showSeconds />
```

Valor sempre no formato 24h `"HH:mm"` (ou `"HH:mm:ss"`) — a conversão para AM/PM é só apresentação.

### CommandPalette (⌘K)

Palette global de busca/ações. Base: `cmdk` + Radix Dialog. Hook `useCommandShortcut` registra o atalho global.

```tsx
const [open, setOpen] = useState(false);
useCommandShortcut(() => setOpen((o) => !o));   // ⌘K no Mac / Ctrl+K no resto

<CommandPalette open={open} onOpenChange={setOpen}>
  <CommandPalette.Group heading="Navegação">
    <CommandPalette.Item icon={<Home className="h-4 w-4" />} shortcut="G H" onSelect={() => nav('/')}>
      Ir para Home
    </CommandPalette.Item>
  </CommandPalette.Group>
  <CommandPalette.Separator />
  <CommandPalette.Group heading="Ações">
    <CommandPalette.Item icon={<Plus className="h-4 w-4" />} shortcut="⌘ N" onSelect={createProject}>
      Novo projeto
    </CommandPalette.Item>
    <CommandPalette.Item icon={<Trash2 className="h-4 w-4" />} tone="danger" onSelect={clearCache}>
      Limpar cache
    </CommandPalette.Item>
  </CommandPalette.Group>
</CommandPalette>
```

`Item` aceita `icon`, `shortcut`, `disabled`, `keywords` (para busca por alias), `tone` (default/danger).

### Table (composicional)

```tsx
<Table>
  <Table.Head>
    <Table.Row>
      <Table.HeadCell>Nome</Table.HeadCell>
      <Table.HeadCell align="right" sort={sortDir} onSort={toggleSort}>Uso</Table.HeadCell>
      <Table.HeadCell>Status</Table.HeadCell>
      <Table.HeadCell width="1%" align="right"><span className="sr-only">Ações</span></Table.HeadCell>
    </Table.Row>
  </Table.Head>
  <Table.Body>
    {rows.length === 0 ? (
      <Table.Empty colSpan={4}>Sem resultados.</Table.Empty>
    ) : rows.map((r) => (
      <Table.Row key={r.id} interactive>
        <Table.Cell className="text-text-primary">{r.name}</Table.Cell>
        <Table.Cell align="right" nowrap>{r.usage}</Table.Cell>
        <Table.Cell><Badge variant="success">Ativo</Badge></Table.Cell>
        <Table.Cell align="right">…</Table.Cell>
      </Table.Row>
    ))}
  </Table.Body>
</Table>
```

- **Sem estado interno de ordenação**: `HeadCell.sort` só renderiza a seta e chama `onSort`. Você reordena os dados no lado da app. Isso mantém o componente enxuto e composicional.
- `Table.Row` aceita `interactive` (hover + cursor) e `selected` (fundo verdigris sutil).
- `Table.Cell` aceita `align` (`left | right | center`), `nowrap`, `truncate`.
- `Table.HeadCell` aceita `sort` (`asc | desc | none`), `align`, `width`.
- Wrapper com scroll horizontal por default (útil em telas pequenas). Desabilite com `scrollable={false}` quando embutido em Card.

### DataTable (TanStack)

Para tabelas com sort, seleção e visibilidade de colunas. Usa `@tanstack/react-table` por baixo e reutiliza as primitives da `Table` do DS para o markup — então o estilo é o mesmo, mas você ganha o motor.

```tsx
const columns = useMemo<ColumnDef<User>[]>(() => [
  { accessorKey: 'name', header: 'Nome' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'status', header: 'Status', enableSorting: false,
    cell: (info) => <Badge>{info.getValue()}</Badge>,
  },
  { accessorKey: 'usage', header: 'Uso',
    meta: { align: 'right' },
    cell: (info) => info.getValue<number>().toLocaleString(),
  },
], []);

<DataTable
  columns={columns}
  data={users}
  enableRowSelection             // injeta coluna de checkbox automaticamente
  enableColumnVisibility         // menu "Colunas" no canto superior direito
  onRowSelectionChange={setSelected}
  onRowClick={(u) => nav(`/users/${u.id}`)}
  loading={loading}
  loadingRows={6}
/>
```

Features:
- **Sort** por clique no header (chame `enableSorting: false` na coluna para desabilitar).
- **Seleção** com checkbox `parent` (indeterminate quando parcial) + linhas com fundo verdigris sutil ao selecionar.
- **Column visibility**: `Dropdown` com checkboxes; passe `meta: { hideFromColumnVisibility: true }` para excluir do menu.
- **Loading**: entrega N linhas de `Skeleton` no formato certo.
- **Empty**: `emptyText` customizável.
- **Alinhamento**: `meta: { align: 'left'|'right'|'center' }` na coluna.
- **Click de linha**: `onRowClick` (aplica hover + cursor).

Quando você não precisar dessas features, continue usando a `Table` composicional — é 10× mais leve.

### Pagination

```tsx
<Pagination
  currentPage={page}
  totalPages={Math.ceil(total / pageSize)}
  onPageChange={setPage}
  showSummary                  // "Mostrando 21–40 de 128"
  pageSize={pageSize}
  totalItems={total}
/>
```

Truncamento com ellipsis: sempre mostra a primeira e a última, mais `siblings` (default 1) ao redor da atual. Se `totalPages <= 1`, o componente esconde os botões e (opcionalmente) mostra só o summary.

### Skeleton

Placeholder animado (shimmer) para conteúdo em carregamento. Cor calibrada por tema; a animação desativa automaticamente quando o usuário preferir `reduced-motion`.

```tsx
// Blocos individuais
<Skeleton height={16} width="60%" />
<Skeleton circle size={40} />
<Skeleton height={200} rounded="lg" />

// Composição típica em card
<div className="space-y-2">
  <Skeleton height={20} width="40%" />
  <Skeleton height={12} />
  <Skeleton height={12} width="80%" />
</div>

// Em Table.Body enquanto carrega
{loading
  ? Array.from({ length: 6 }).map((_, i) => (
      <Table.Row key={i}>
        <Table.Cell><Skeleton height={12} width={140} /></Table.Cell>
        <Table.Cell><Skeleton height={20} width={70} rounded="full" /></Table.Cell>
      </Table.Row>
    ))
  : rows.map(r => <Table.Row key={r.id}>...</Table.Row>)}
```

Props: `width`, `height`, `circle`, `size`, `rounded` (`none|sm|md|lg|full`), `static` (desliga shimmer).

### Spinner

Indicador circular. Por padrão herda cor do texto do pai (`currentColor`), então funciona dentro de botões, células, links.

```tsx
<Spinner />                          // md, cor do texto
<Spinner size="sm" tone="primary" /> // verdigris
<Spinner size="lg" tone="muted" />   // cinza sutil
<Spinner label="Carregando..." />    // adiciona rótulo p/ leitores de tela
```

Tamanhos: `sm | md | lg`. Tones: `default | primary | onPrimary | muted`.

O `Button` do kit já tem `loading` embutido, então dentro de botões você não precisa passar Spinner manual.

### SpinnerOverlay

Cobre um container `relative` com backdrop + spinner centralizado. Útil para "recarregando dados" sem re-renderizar o conteúdo.

```tsx
<div className="relative">
  <Card>...</Card>
  {loading && <SpinnerOverlay label="Gerando relatório" />}
</div>
```

Props: `label`, `size`, `dim` (aplica backdrop, default true).

---

## Padrões de uso

- **Um H1 por página.** `text-h2` para seções, `text-h3` para subseções.
- **Focus visible obrigatório** em todo elemento interativo. Componentes deste kit já implementam.
- **Não invente cores.** Adicione novos tons em `tokens/colors.json` e sincronize com `variables.css`.
- **Sempre teste no light mode** ao criar componente novo — o toggle do exemplo App é o smoke test mais rápido.

---

## Próximas fases (fora do escopo atual)

- Auto light/dark via `prefers-color-scheme` + override manual
- Storybook + testes visuais
- Empty states ilustrados
- Breadcrumbs + Stepper
- Accordion / Collapsible
- Slider / Range slider
- File upload (drag & drop)
- Avatar + AvatarGroup
- ProgressBar + CircularProgress

---

## Referências rápidas

- Tokens fonte: `tokens/*.json`
- Variáveis CSS: `src/styles/variables.css`
- Tailwind: `tailwind.config.js`
- Exemplo: `src/examples/App.tsx`
