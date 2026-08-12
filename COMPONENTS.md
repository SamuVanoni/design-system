# Componentes — Índice Compacto

Todos os componentes se importam de `@/components`. Detalhes em `src/components/{Nome}.tsx` (JSDoc + exemplo no topo) ou seção equivalente do `README.md`.

## Providers (setup na raiz)

| Componente | Onde vive | O que faz |
|---|---|---|
| `ThemeProvider` | `src/theme/ThemeProvider.tsx` | Aplica `data-theme` no html, persiste em localStorage. **Obrigatório** na raiz. |
| `ToastProvider` | `Toast.tsx` | Provider global para `useToast()`. **Obrigatório** se usar toast. |
| `TooltipRootProvider` | `Tooltip.tsx` | Opcional. Compartilha `delayDuration` entre múltiplos tooltips. |

## Átomos

| Componente | Props principais | Arquivo |
|---|---|---|
| `Button` | `variant` (primary/secondary/**info**/ghost/**danger**), `size` (sm/md/lg), `loading`, `leftIcon`, `rightIcon`, `fullWidth`. `primary` = sólido neutro que **inverte por tema** (navy no claro, claro no escuro) — não usa o cobre. `secondary` = contorno neutro. `info` = aviso discreto: fundo cinza translúcido + ícone "i" azul automático. `danger` = vermelho sólido, só para ações destrutivas | `Button.tsx` |
| `Badge` | `variant` (default/primary/success/warning/error/info), `count`, `max`, `dot`, `icon`. **Cor por severidade**: só `error` e `warning` têm cápsula colorida; `success` e `info` são cápsula neutra + marcador. `dot` = bolinha sozinha, sem cápsula | `Badge.tsx` |
| `Label` | `htmlFor`, `required`, `disabled` | `Label.tsx` |
| `HelperText` | `tone` (default/error/success) | `HelperText.tsx` |
| `Skeleton` | `width`, `height`, `circle`, `size`, `rounded`, `static` | `Skeleton.tsx` |
| `Spinner` | `size` (sm/md/lg), `tone` (default/primary/onPrimary/muted), `label` | `Spinner.tsx` |
| `SpinnerOverlay` | `label`, `size`, `dim` — usa em pai `relative` | `Spinner.tsx` |
| `Avatar` | `src`, `name` (gera iniciais), `size` (xs→xl), `status` (online/offline/busy/away), `icon`. Fallback automático se `src` falhar | `Avatar.tsx` |
| `AvatarGroup` | `max` (antes do "+N"), `size` — aplica size em todos os filhos | `Avatar.tsx` |
| `ProgressBar` | `value`, `max`, `size` (sm/md/lg), `tone`, `label`, `showValue`, `indeterminate` | `Progress.tsx` |
| `CircularProgress` | `value`, `size` (px), `thickness`, `tone`, `showValue`, `children` (centro custom), `indeterminate` | `Progress.tsx` |

## Formulários

| Componente | Props principais | Arquivo |
|---|---|---|
| `Field` | `label`, `helperText`, `errorText`, `required`, `disabled`, `hideLabel` — **wrapper padrão de qualquer input** | `Field.tsx` |
| `Input` | Herda `<input>` + `label`, `errorText`, `helperText`, `leftIcon`, `fullWidth` | `Input.tsx` |
| `Textarea` | Herda `<textarea>` + `autoResize`, `maxRows`, `invalid` | `Textarea.tsx` |
| `Checkbox` | `checked` (bool ou `'indeterminate'`), `label`, `description` | `Checkbox.tsx` |
| `Radio.Group` / `Radio.Item` | Group: `value`, `onValueChange`, `orientation`. Item: `value`, `label`, `description` | `Radio.tsx` |
| `Switch` | `checked`, `size` (sm/md), `label`, `description`, `labelBefore` | `Switch.tsx` |
| `Select` | `value`, `onValueChange`, `placeholder`, `size`. Sub: `Select.Item`, `Select.Group`, `Select.Label`, `Select.Separator` | `Select.tsx` |
| `Combobox` | Select com busca. `options: Option[]`, `value`, `searchPlaceholder`, `emptyText`. Sub: `Combobox.Item`, `Combobox.Group`. **`Option.label` aceita `ReactNode`** (bolinha de cor, ícone) — nesse caso passe `searchValue` com o texto, senão a busca cai no `value` | `Combobox.tsx` |
| `MultiCombobox` | Combobox múltiplo. `value: string[]`, `maxDisplay` (chips visíveis antes de "+N") | `MultiCombobox.tsx` |
| `DatePicker` | `value: Date`, `onValueChange`, `minDate`, `maxDate`, `displayFormat`, `locale` | `DatePicker.tsx` |
| `DateRangePicker` | `value: DateRange`, `presets` (default true), `numberOfMonths` (default 2) | `DateRangePicker.tsx` |
| `TimePicker` | `value: "HH:mm"`, `minuteStep`, `format` (12h/24h), `showSeconds` | `TimePicker.tsx` |
| `Slider` | `value: number[]` (2 valores = range), `min`, `max`, `step`, `size`, `showValue`, `formatValue`, `marks`, `onValueCommit` | `Slider.tsx` |
| `FileUpload` | `value: File[]`, `onValueChange`, `accept`, `multiple`, `maxSize` (bytes), `maxFiles`, `hint`. Drag & drop + clique | `FileUpload.tsx` |

## Moleculares

| Componente | Props principais | Arquivo |
|---|---|---|
| `Card` | Sub: `Card.Header` (title, description, action), `Card.Body`, `Card.Footer`. Root: `interactive` | `Card.tsx` |
| `Modal` | `open`, `onOpenChange`, `title`, `description`, `size` (sm/md/lg). Sub: `Modal.Footer`. Trava em `max-h-[90vh]`: cabeçalho fixo, corpo rolável (classe `modal-body`), footer sticky | `Modal.tsx` |
| `Dropdown` | `trigger`, `align`. Sub: `Dropdown.Item` (com `tone` danger), `Dropdown.CheckboxItem`, `Dropdown.Label`, `Dropdown.Separator` | `Dropdown.tsx` |
| `Tabs` | `defaultValue` ou `value`+`onValueChange`. Sub: `Tabs.List`, `Tabs.Trigger`, `Tabs.Content` | `Tabs.tsx` |
| `Popover` | `trigger`, `side`, `align`, `size`, `showArrow`. Sub: `Popover.Header` (com `onClose`), `Popover.Body`, `Popover.Close` | `Popover.tsx` |
| `Tooltip` | `content`, `side`, `align`, `delayDuration`. Trigger via children (precisa aceitar ref). | `Tooltip.tsx` |
| `Accordion` | `type` (single/multiple), `collapsible`, `separated`. Sub: `Accordion.Item` (`value`, `title`, `description`, `icon`, `meta`, `disabled`) | `Accordion.tsx` |
| `Breadcrumbs` | `items: Crumb[]` (`label`, `href?`, `onClick?`, `icon?`), `maxItems` (default 4, `0` desliga o colapso), `separator` | `Breadcrumbs.tsx` |
| `Stepper` | `steps: Step[]`, `current` (0-based), `orientation`, `onStepClick`, `allowFuture` | `Stepper.tsx` |
| `EmptyState` | `illustration` (empty/search/files/error/success ou nó custom), `title`, `description`, `action`, `footer`, `size`, `bare` | `EmptyState.tsx` |

## Feedback / Overlays

| Componente / Hook | Como usar | Arquivo |
|---|---|---|
| `useToast()` | `toast.success/error/warning/info/default(title, { description, duration })` — auto-dismiss, canto inferior-direito | `Toast.tsx` |
| `CommandPalette` | `<CommandPalette open onOpenChange>` com `CommandPalette.Group` + `CommandPalette.Item` (icon, shortcut, tone) | `CommandPalette.tsx` |
| `useCommandShortcut(handler, key?)` | Registra atalho global. Default: `k` (⌘K / Ctrl+K) | `CommandPalette.tsx` |

## Dados

| Componente | Quando usar | Props principais | Arquivo |
|---|---|---|---|
| `Table` | Markup simples com hover | Sub: `Table.Head`, `Table.Body`, `Table.Row` (interactive, selected), `Table.HeadCell` (sort, align, width), `Table.Cell` (align, nowrap, truncate), `Table.Empty` | `Table.tsx` |
| `DataTable` | Sort / seleção / column visibility | `columns: ColumnDef[]`, `data`, `enableRowSelection`, `enableColumnVisibility`, `onRowSelectionChange`, `onRowClick`, `loading`, `loadingRows` | `DataTable.tsx` |
| `Pagination` | Paginação clássica | `currentPage`, `totalPages`, `onPageChange`, `siblings` (default 1), `showSummary` + `pageSize` + `totalItems` | `Pagination.tsx` |

## Utilidades / Hooks

| Nome | O que faz | Arquivo |
|---|---|---|
| `useTheme()` | `{ theme, setTheme, toggleTheme }` | `theme/ThemeProvider.tsx` |
| `useField()` | Consumir contexto de `<Field>` em componentes custom | `Field.tsx` |
| `cn(...classes)` | Concatenador de classes (drop-in do clsx) | `lib/cn.ts` |
| `ThemeToggle` | Botão pronto sol/lua | `ThemeToggle.tsx` |

## Types exportados

`ComboboxOption` · `DateRange` · `AvatarProps` · `Crumb` · `Step`

Helper exportado: `formatBytes(bytes)` (de `FileUpload.tsx`).

---

## Padrões rápidos de referência

**Form com validação:**
```tsx
<Field label="Email" required errorText={err} helperText="Não compartilhamos.">
  <Input type="email" value={v} onChange={e => setV(e.target.value)} />
</Field>
```

**Confirmação:**
```tsx
<Modal open={o} onOpenChange={setO} title="Excluir?" description="Ação irreversível.">
  <p>Confirma exclusão de {n} itens?</p>
  <Modal.Footer>
    <Button variant="ghost" onClick={() => setO(false)}>Cancelar</Button>
    <Button onClick={confirm}>Confirmar</Button>
  </Modal.Footer>
</Modal>
```

**Async com feedback:**
```tsx
const toast = useToast();
<Button loading={saving} onClick={async () => {
  setSaving(true);
  try { await save(); toast.success('Salvo!'); }
  catch (e) { toast.error('Falha', { description: String(e) }); }
  finally { setSaving(false); }
}}>Salvar</Button>
```

**Dashboard filter row:**
```tsx
<Card>
  <Card.Body>
    <div className="grid gap-4 md:grid-cols-3">
      <Field label="País"><Combobox options={countries} value={c} onValueChange={setC} /></Field>
      <Field label="Período"><DateRangePicker value={r} onValueChange={setR} numberOfMonths={1} /></Field>
      <Field label="Status"><MultiCombobox options={statuses} value={s} onValueChange={setS} /></Field>
    </div>
  </Card.Body>
</Card>
```
