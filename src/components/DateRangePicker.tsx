import { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { DayPicker, DateRange } from 'react-day-picker';
import { ptBR } from 'date-fns/locale';
import { format, subDays, startOfMonth, endOfMonth, subMonths, startOfYear } from 'date-fns';
import type { Locale } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/cn';
import { useField } from './Field';

/**
 * DateRangePicker — intervalo de datas.
 *
 * Uso:
 *   <DateRangePicker value={range} onValueChange={setRange} />
 *
 *   const [range, setRange] = useState<DateRange | undefined>({
 *     from: subDays(new Date(), 7),
 *     to: new Date(),
 *   });
 *
 * Presets rápidos (últimos 7/30 dias, este mês, mês passado, este ano) já vêm
 * embutidos na lateral esquerda do popover. Passe `presets={false}` para ocultar.
 */

export type { DateRange };

type Size = 'sm' | 'md';

interface Preset {
  label: string;
  getValue: () => DateRange;
}

interface DateRangePickerProps {
  value?: DateRange;
  onValueChange?: (r: DateRange | undefined) => void;
  placeholder?: string;
  displayFormat?: string;
  disabled?: boolean;
  invalid?: boolean;
  minDate?: Date;
  maxDate?: Date;
  size?: Size;
  className?: string;
  locale?: Locale;
  /** Mostra atalhos ("Últimos 7 dias", etc.). Default true. */
  presets?: boolean | Preset[];
  /** Número de meses lado a lado no calendário. Default 2. */
  numberOfMonths?: number;
}

const sizes: Record<Size, string> = {
  sm: 'h-8 text-sm px-2.5',
  md: 'h-10 text-base px-3',
};

const DEFAULT_PRESETS: Preset[] = [
  { label: 'Hoje',           getValue: () => ({ from: new Date(),                to: new Date() }) },
  { label: 'Últimos 7 dias', getValue: () => ({ from: subDays(new Date(), 6),    to: new Date() }) },
  { label: 'Últimos 30 dias',getValue: () => ({ from: subDays(new Date(), 29),   to: new Date() }) },
  { label: 'Este mês',       getValue: () => ({ from: startOfMonth(new Date()),  to: endOfMonth(new Date()) }) },
  { label: 'Mês passado',    getValue: () => {
      const prev = subMonths(new Date(), 1);
      return { from: startOfMonth(prev), to: endOfMonth(prev) };
  } },
  { label: 'Este ano',       getValue: () => ({ from: startOfYear(new Date()),   to: new Date() }) },
];

function formatRange(r: DateRange | undefined, fmt: string, locale: Locale): string | null {
  if (!r?.from) return null;
  if (!r.to) return format(r.from, fmt, { locale });
  return `${format(r.from, fmt, { locale })} – ${format(r.to, fmt, { locale })}`;
}

export function DateRangePicker({
  value,
  onValueChange,
  placeholder = 'Selecione um intervalo',
  displayFormat = 'dd/MM/yyyy',
  disabled,
  invalid,
  minDate,
  maxDate,
  size = 'md',
  className,
  locale = ptBR,
  presets = true,
  numberOfMonths = 2,
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const field = useField();
  const finalId = field?.id;
  const isDisabled = disabled ?? field?.disabled;
  const hasError = invalid ?? field?.hasError ?? false;

  const presetList = presets === true ? DEFAULT_PRESETS : Array.isArray(presets) ? presets : null;
  const label = formatRange(value, displayFormat, locale);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          id={finalId}
          type="button"
          disabled={isDisabled}
          aria-describedby={field?.describedById}
          aria-invalid={hasError || undefined}
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
          <span className={cn('truncate', !label && 'text-text-tertiary')}>
            {label ?? placeholder}
          </span>
          <CalendarIcon className="h-4 w-4 shrink-0 text-text-tertiary" />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          sideOffset={6}
          align="start"
          className={cn(
            'z-50 flex overflow-hidden rounded-md border border-border bg-surface-overlay shadow-lg',
          )}
        >
          {presetList && (
            <div className="flex w-40 shrink-0 flex-col gap-1 border-r border-border-subtle p-2">
              <p className="px-2 py-1 text-caption uppercase tracking-wide text-text-tertiary">Rápido</p>
              {presetList.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => onValueChange?.(p.getValue())}
                  className={cn(
                    'rounded px-2 py-1.5 text-left text-sm text-text-secondary',
                    'transition-colors hover:bg-surface-elevated hover:text-text-primary',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}

          <DayPicker
            mode="range"
            selected={value}
            onSelect={(r) => onValueChange?.(r ?? undefined)}
            numberOfMonths={numberOfMonths}
            disabled={[
              ...(minDate ? [{ before: minDate }] : []),
              ...(maxDate ? [{ after: maxDate }] : []),
            ]}
            locale={locale}
            weekStartsOn={0}
            components={{
              Chevron: ({ orientation }) =>
                orientation === 'left'
                  ? <ChevronLeft className="h-4 w-4" />
                  : <ChevronRight className="h-4 w-4" />,
            }}
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
