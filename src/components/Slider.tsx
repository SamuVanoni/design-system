import { ReactNode } from 'react';
import * as RS from '@radix-ui/react-slider';
import { cn } from '../lib/cn';
import { useField } from './Field';

/**
 * Slider (wrapper sobre @radix-ui/react-slider).
 * Teclado (setas, Home/End, PageUp/PageDown), arraste e passos vêm do Radix.
 *
 * O valor é sempre um array — com dois valores vira range automaticamente,
 * renderizando dois thumbs.
 *
 * Integra com <Field>: herda id, aria-describedby e disabled.
 *
 * @example
 * <Slider value={[40]} onValueChange={setV} showValue />
 * <Slider value={[20, 80]} onValueChange={setRange} min={0} max={100} step={5} />
 * <Slider value={[v]} onValueChange={setV} formatValue={(n) => `R$ ${n}`} showValue />
 */

type Size = 'sm' | 'md';

interface SliderProps {
  value?: number[];
  defaultValue?: number[];
  onValueChange?: (v: number[]) => void;
  /** Dispara só ao soltar — use para requests, evitando um por pixel arrastado. */
  onValueCommit?: (v: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  size?: Size;
  disabled?: boolean;
  /** Mostra o(s) valor(es) acima do trilho. */
  showValue?: boolean;
  /** Formata o valor exibido e o aria-valuetext. Default: o número cru. */
  formatValue?: (n: number) => string;
  /** Marcas com rótulo abaixo do trilho. */
  marks?: { value: number; label: ReactNode }[];
  label?: ReactNode;
  className?: string;
}

const trackSizes: Record<Size, string> = {
  sm: 'h-1',
  md: 'h-1.5',
};

const thumbSizes: Record<Size, string> = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
};

export function Slider({
  value,
  defaultValue = [0],
  onValueChange,
  onValueCommit,
  min = 0,
  max = 100,
  step = 1,
  size = 'md',
  disabled,
  showValue = false,
  formatValue,
  marks,
  label,
  className,
}: SliderProps) {
  const field = useField();
  const isDisabled = disabled ?? field?.disabled;
  const current = value ?? defaultValue;
  const fmt = formatValue ?? ((n: number) => String(n));

  return (
    <div className={cn('w-full', className)}>
      {(label || showValue) && (
        <div className="mb-3 flex items-baseline justify-between gap-4">
          {label && <span className="text-sm text-text-secondary">{label}</span>}
          {showValue && (
            <span className="text-sm font-medium tabular-nums text-text-primary">
              {current.map(fmt).join(' – ')}
            </span>
          )}
        </div>
      )}

      <RS.Root
        id={field?.id}
        value={value}
        defaultValue={value ? undefined : defaultValue}
        onValueChange={onValueChange}
        onValueCommit={onValueCommit}
        min={min}
        max={max}
        step={step}
        disabled={isDisabled}
        aria-describedby={field?.describedById}
        className={cn(
          'relative flex w-full touch-none select-none items-center',
          isDisabled && 'opacity-40',
        )}
      >
        <RS.Track
          className={cn(
            'relative w-full grow overflow-hidden rounded-full bg-surface-muted',
            trackSizes[size],
          )}
        >
          <RS.Range className="absolute h-full rounded-full bg-primary-500" />
        </RS.Track>

        {current.map((v, i) => (
          <RS.Thumb
            key={i}
            aria-label={current.length > 1 ? (i === 0 ? 'Valor mínimo' : 'Valor máximo') : undefined}
            aria-valuetext={fmt(v)}
            className={cn(
              'block rounded-full border-2 border-primary-500 bg-surface-elevated shadow-sm',
              'transition-transform hover:scale-110',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base',
              !isDisabled && 'cursor-grab active:cursor-grabbing',
              thumbSizes[size],
            )}
          />
        ))}
      </RS.Root>

      {marks && marks.length > 0 && (
        <div className="relative mt-2 h-5">
          {marks.map((m) => (
            <span
              key={m.value}
              className="absolute -translate-x-1/2 text-caption text-text-tertiary"
              style={{ left: `${((m.value - min) / (max - min)) * 100}%` }}
            >
              {m.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
