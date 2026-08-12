import { ReactNode, useState, useMemo } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { Command } from 'cmdk';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { cn } from '../lib/cn';
import { useField } from './Field';

/**
 * Combobox — Select com busca (cmdk + Radix Popover).
 *
 * Uso simples com array de options:
 *   <Combobox
 *     options={[{ value: 'br', label: 'Brasil' }, ...]}
 *     value={v}
 *     onValueChange={setV}
 *     placeholder="Selecione..."
 *     searchPlaceholder="Buscar país..."
 *   />
 *
 * Uso composicional (para grupos, ícones, descrições):
 *   <Combobox.Root value={v} onValueChange={setV} placeholder="...">
 *     <Combobox.Group heading="América do Sul">
 *       <Combobox.Item value="br" label="Brasil" />
 *       <Combobox.Item value="ar" label="Argentina" />
 *     </Combobox.Group>
 *   </Combobox.Root>
 *
 * Integra com <Field>: quando envolto, herda id/aria-describedby/disabled.
 */

// ---------- Tipos ----------

export interface Option {
  value: string;
  /**
   * Aceita ReactNode para casos como bolinha de cor + texto. Se você passar um
   * nó, informe também `searchValue` — o cmdk filtra por texto e não consegue
   * ler dentro de um elemento (sem isso a busca cai no `value`, que costuma ser
   * um id). Com string, `searchValue` é opcional.
   */
  label: ReactNode;
  description?: string;
  disabled?: boolean;
  /** Texto alternativo para busca. Se omitido, a busca usa `label` quando ele é string. */
  searchValue?: string;
}

/**
 * cmdk filtra por texto puro; um label ReactNode não serve como chave de busca.
 * Também é o texto usado em `aria-label` — daí o MultiCombobox reaproveitar.
 */
export function textoDeBusca(label: ReactNode, searchValue: string | undefined, value: string): string {
  if (searchValue) return searchValue;
  return typeof label === 'string' ? label : value;
}

type Size = 'sm' | 'md';

interface RootProps {
  value?: string;
  onValueChange?: (v: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  size?: Size;
  disabled?: boolean;
  invalid?: boolean;
  className?: string;
  children?: ReactNode;
  /** Se passado, o Combobox monta a lista automaticamente. Ignora `children`. */
  options?: Option[];
  /** Largura do popover. Default: iguala o trigger. */
  contentWidth?: 'trigger' | 'auto';
}

const sizes: Record<Size, string> = {
  sm: 'h-8 text-sm px-2.5',
  md: 'h-10 text-base px-3',
};

// ---------- Root ----------

function ComboboxRoot({
  value,
  onValueChange,
  placeholder = 'Selecione…',
  searchPlaceholder = 'Buscar…',
  emptyText = 'Nenhum resultado.',
  size = 'md',
  disabled,
  invalid,
  className,
  children,
  options,
  contentWidth = 'trigger',
}: RootProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const field = useField();
  const finalId = field?.id;
  const isDisabled = disabled ?? field?.disabled;
  const hasError = invalid ?? field?.hasError ?? false;

  // Encontra o label da opção selecionada quando `options` foi passado
  const selectedLabel = useMemo(() => {
    if (!options || !value) return null;
    return options.find((o) => o.value === value)?.label ?? null;
  }, [options, value]);

  const handleSelect = (v: string) => {
    onValueChange?.(v);
    setOpen(false);
    setQuery('');
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          id={finalId}
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-describedby={field?.describedById}
          aria-invalid={hasError || undefined}
          disabled={isDisabled}
          className={cn(
            'inline-flex w-full items-center justify-between gap-2 rounded-md',
            'bg-surface-elevated text-text-primary',
            'border transition-colors duration-fast',
            sizes[size],
            hasError
              ? 'border-error focus:border-error focus:ring-2 focus:ring-error/40'
              : 'border-border focus:border-primary-500 focus:ring-2 focus:ring-primary-500/40',
            'focus:outline-none',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            className,
          )}
        >
          <span className={cn('truncate', !value && 'text-text-tertiary')}>
            {selectedLabel ?? value ?? placeholder}
          </span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 text-text-tertiary" />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          sideOffset={6}
          align="start"
          style={contentWidth === 'trigger' ? { width: 'var(--radix-popover-trigger-width)' } : undefined}
          className={cn(
            'z-50 overflow-hidden rounded-md border border-border bg-surface-overlay shadow-lg',
            'text-text-primary',
          )}
        >
          <Command
            shouldFilter
            filter={(itemValue, search, keywords) => {
              const hay = [itemValue, ...(keywords ?? [])].join(' ').toLowerCase();
              return hay.includes(search.toLowerCase()) ? 1 : 0;
            }}
          >
            <div className="flex items-center gap-2 border-b border-border-subtle px-3">
              <Search className="h-4 w-4 shrink-0 text-text-tertiary" aria-hidden />
              <Command.Input
                value={query}
                onValueChange={setQuery}
                placeholder={searchPlaceholder}
                className={cn(
                  'flex-1 bg-transparent py-2 text-sm outline-none',
                  'placeholder:text-text-tertiary text-text-primary',
                )}
              />
            </div>
            <Command.List className="max-h-64 overflow-y-auto p-1">
              <Command.Empty className="py-4 text-center text-sm text-text-tertiary">
                {emptyText}
              </Command.Empty>

              {options
                ? options.map((opt) => (
                    <ComboboxItemInternal
                      key={opt.value}
                      value={opt.value}
                      label={opt.label}
                      description={opt.description}
                      disabled={opt.disabled}
                      searchValue={opt.searchValue}
                      selected={opt.value === value}
                      onSelect={handleSelect}
                    />
                  ))
                : children /* consumidor usa composição */}
            </Command.List>
          </Command>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

// ---------- Item interno ----------
interface ItemInternalProps extends Option {
  selected: boolean;
  onSelect: (v: string) => void;
}

function ComboboxItemInternal({
  value, label, description, disabled, searchValue, selected, onSelect,
}: ItemInternalProps) {
  return (
    <Command.Item
      value={value}
      keywords={[textoDeBusca(label, searchValue, value)]}
      disabled={disabled}
      onSelect={onSelect}
      className={cn(
        'relative flex select-none items-start gap-2 rounded px-2 py-1.5 pl-7 text-sm outline-none',
        'transition-colors',
        'data-[selected=true]:bg-surface-mutedHover',
        'data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-40',
      )}
    >
      {selected && (
        <Check className="absolute left-1.5 top-2 h-3.5 w-3.5 text-primary-500" aria-hidden />
      )}
      <div className="min-w-0">
        <div className="truncate text-text-primary">{label}</div>
        {description && <div className="mt-0.5 text-caption text-text-tertiary truncate">{description}</div>}
      </div>
    </Command.Item>
  );
}

// ---------- API composicional (para uso avançado) ----------

interface ItemProps extends Option {
  onSelect?: (v: string) => void;
}

function ComboboxItem({ value, label, description, disabled, searchValue, onSelect }: ItemProps) {
  return (
    <Command.Item
      value={value}
      keywords={[textoDeBusca(label, searchValue, value)]}
      disabled={disabled}
      onSelect={() => onSelect?.(value)}
      className={cn(
        'relative flex select-none items-start gap-2 rounded px-2 py-1.5 text-sm outline-none',
        'transition-colors',
        'data-[selected=true]:bg-surface-mutedHover',
        'data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-40',
      )}
    >
      <div className="min-w-0">
        <div className="truncate text-text-primary">{label}</div>
        {description && <div className="mt-0.5 text-caption text-text-tertiary truncate">{description}</div>}
      </div>
    </Command.Item>
  );
}

function ComboboxGroup({ heading, children }: { heading?: ReactNode; children: ReactNode }) {
  return (
    <Command.Group heading={heading as string} className={cn(
      '[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1',
      '[&_[cmdk-group-heading]]:text-caption [&_[cmdk-group-heading]]:uppercase',
      '[&_[cmdk-group-heading]]:tracking-wide [&_[cmdk-group-heading]]:text-text-tertiary',
    )}>
      {children}
    </Command.Group>
  );
}

function ComboboxSeparator() {
  return <Command.Separator className="my-1 h-px bg-border-subtle" />;
}

export const Combobox = Object.assign(ComboboxRoot, {
  Root: ComboboxRoot,
  Item: ComboboxItem,
  Group: ComboboxGroup,
  Separator: ComboboxSeparator,
});
