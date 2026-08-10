import { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { DayPicker } from 'react-day-picker';
import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';
import type { Locale } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/cn';
import { useField } from './Field';

/**
 * DatePicker (single date).
 *
 * Uso:
 *   <DatePicker value={date} onValueChange={setDate} />
 *
 *   <Field label="Data de entrega">
 *     <DatePicker value={date} onValueChange={setDate} placeholder="Selecione..." />
 *   </Field>
 *
 * Integra com <Field>: herda id, aria-describedby, disabled, hasError.
 * O CSS do calendário vive em `src/styles/day-picker.css` — importe uma vez na app.
 */

type Size = 'sm' | 'md';

interface DatePickerProps {
  value?: Date;
  onValueChange?: (d: Date | undefined) => void;
  placeholder?: string;
  /** Formato de exibição no botão. Default: 'dd/MM/yyyy'. */
  displayFormat?: string;
  disabled?: boolean;
  invalid?: boolean;
  minDate?: Date;
  maxDate?: Date;
  size?: Size;
  className?: string;
  /** Locale do date-fns. Default: ptBR. */
  locale?: Locale;
}

const sizes: Record<Size, string> = {
  sm: 'h-8 text-sm px-2.5',
  md: 'h-10 text-base px-3',
};

export function DatePicker({
  value,
  onValueChange,
  placeholder = 'Selecione uma data',
  displayFormat = 'dd/MM/yyyy',
  disabled,
  invalid,
  minDate,
  maxDate,
  size = 'md',
  className,
  locale = ptBR,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const field = useField();
  const finalId = field?.id;
  const isDisabled = disabled ?? field?.disabled;
  const hasError = invalid ?? field?.hasError ?? false;

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
          <span className={cn('truncate', !value && 'text-text-tertiary')}>
            {value ? format(value, displayFormat, { locale }) : placeholder}
          </span>
          <CalendarIcon className="h-4 w-4 shrink-0 text-text-tertiary" />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          sideOffset={6}
          align="start"
          className={cn(
            'z-50 overflow-hidden rounded-md border border-border bg-surface-overlay shadow-lg',
          )}
        >
          <DayPicker
            mode="single"
            selected={value}
            onSelect={(d) => {
              onValueChange?.(d ?? undefined);
              if (d) setOpen(false);
            }}
            disabled={[
              ...(minDate ? [{ before: minDate }] : []),
              ...(maxDate ? [{ after: maxDate }] : []),
            ]}
            locale={locale}
            weekStartsOn={0}
            showOutsideDays
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
