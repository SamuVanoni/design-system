import { useState, useMemo } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { Command } from 'cmdk';
import { Check, ChevronsUpDown, Search, X } from 'lucide-react';
import { cn } from '../lib/cn';
import { useField } from './Field';
import type { Option } from './Combobox';

/**
 * MultiCombobox — Select com múltiplos valores + busca.
 *
 * Uso:
 *   const [values, setValues] = useState<string[]>([]);
 *   <MultiCombobox
 *     options={countries}
 *     value={values}
 *     onValueChange={setValues}
 *     placeholder="Escolha países..."
 *     maxDisplay={3}   // além disso mostra "+N"
 *   />
 */

type Size = 'sm' | 'md';

interface Props {
  options: Option[];
  value: string[];
  onValueChange: (v: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  /** Máximo de chips visíveis antes de comprimir para "+N". Default 3. */
  maxDisplay?: number;
  size?: Size;
  disabled?: boolean;
  invalid?: boolean;
  className?: string;
}

const sizes: Record<Size, string> = {
  sm: 'min-h-8 text-sm px-2 py-1',
  md: 'min-h-10 text-base px-2 py-1.5',
};

export function MultiCombobox({
  options,
  value,
  onValueChange,
  placeholder = 'Selecione…',
  searchPlaceholder = 'Buscar…',
  emptyText = 'Nenhum resultado.',
  maxDisplay = 3,
  size = 'md',
  disabled,
  invalid,
  className,
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const field = useField();
  const finalId = field?.id;
  const isDisabled = disabled ?? field?.disabled;
  const hasError = invalid ?? field?.hasError ?? false;

  const selectedSet = useMemo(() => new Set(value), [value]);
  const selectedOptions = useMemo(
    () => options.filter((o) => selectedSet.has(o.value)),
    [options, selectedSet],
  );

  const toggle = (v: string) => {
    onValueChange(
      selectedSet.has(v) ? value.filter((x) => x !== v) : [...value, v],
    );
  };

  const remove = (v: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onValueChange(value.filter((x) => x !== v));
  };

  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onValueChange([]);
  };

  const visible = selectedOptions.slice(0, maxDisplay);
  const overflow = selectedOptions.length - visible.length;

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
            'group flex w-full items-center gap-1 rounded-md',
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
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1">
            {selectedOptions.length === 0 ? (
              <span className="text-text-tertiary">{placeholder}</span>
            ) : (
              <>
                {visible.map((opt) => (
                  <span
                    key={opt.value}
                    className={cn(
                      'inline-flex items-center gap-1 rounded-full',
                      'bg-primary-500/15 text-primary-onSoft border border-primary-500/30',
                      'px-2 py-0.5 text-caption font-medium leading-none',
                    )}
                  >
                    {opt.label}
                    <span
                      role="button"
                      tabIndex={-1}
                      aria-label={`Remover ${opt.label}`}
                      onClick={(e) => remove(opt.value, e)}
                      className="ml-0.5 rounded p-0.5 hover:bg-primary-500/20"
                    >
                      <X className="h-3 w-3" />
                    </span>
                  </span>
                ))}
                {overflow > 0 && (
                  <span className="text-caption text-text-tertiary">+{overflow}</span>
                )}
              </>
            )}
          </div>

          <div className="flex items-center gap-1">
            {selectedOptions.length > 0 && !isDisabled && (
              <span
                role="button"
                tabIndex={-1}
                aria-label="Limpar seleção"
                onClick={clearAll}
                className="rounded p-1 text-text-tertiary hover:bg-surface-overlay hover:text-text-primary"
              >
                <X className="h-3.5 w-3.5" />
              </span>
            )}
            <ChevronsUpDown className="h-4 w-4 shrink-0 text-text-tertiary" />
          </div>
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          sideOffset={6}
          align="start"
          style={{ width: 'var(--radix-popover-trigger-width)' }}
          className={cn(
            'z-50 overflow-hidden rounded-md border border-border bg-surface-overlay shadow-lg',
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
                className="flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-text-tertiary text-text-primary"
              />
            </div>
            <Command.List className="max-h-64 overflow-y-auto p-1">
              <Command.Empty className="py-4 text-center text-sm text-text-tertiary">
                {emptyText}
              </Command.Empty>
              {options.map((opt) => {
                const selected = selectedSet.has(opt.value);
                return (
                  <Command.Item
                    key={opt.value}
                    value={opt.value}
                    keywords={opt.searchValue ? [opt.searchValue, opt.label] : [opt.label]}
                    disabled={opt.disabled}
                    onSelect={() => toggle(opt.value)}
                    className={cn(
                      'relative flex select-none items-start gap-2 rounded px-2 py-1.5 pl-7 text-sm outline-none',
                      'transition-colors',
                      'data-[selected=true]:bg-surface-elevated',
                      'data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-40',
                    )}
                  >
                    {selected && (
                      <Check className="absolute left-1.5 top-2 h-3.5 w-3.5 text-primary-500" aria-hidden />
                    )}
                    <div className="min-w-0">
                      <div className="truncate text-text-primary">{opt.label}</div>
                      {opt.description && (
                        <div className="mt-0.5 text-caption text-text-tertiary truncate">{opt.description}</div>
                      )}
                    </div>
                  </Command.Item>
                );
              })}
            </Command.List>
          </Command>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
