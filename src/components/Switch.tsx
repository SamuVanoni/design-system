import { ReactNode, forwardRef } from 'react';
import * as RS from '@radix-ui/react-switch';
import { cn } from '../lib/cn';
import { useField } from './Field';

/**
 * Switch (toggle) — Radix Switch.
 * Diferente do Checkbox, o Switch expressa "ligado / desligado" com efeito imediato.
 *
 * Uso:
 *   <Switch checked={x} onCheckedChange={setX} label="Ativar notificações" />
 */

type Size = 'sm' | 'md';

interface SwitchProps extends Omit<RS.SwitchProps, 'children'> {
  size?: Size;
  label?: ReactNode;
  description?: ReactNode;
  /** Se true, coloca o label à esquerda (útil em linhas de configurações). */
  labelBefore?: boolean;
}

const sizes: Record<Size, { root: string; thumb: string; translate: string }> = {
  sm: { root: 'h-5 w-9',  thumb: 'h-4 w-4', translate: 'data-[state=checked]:translate-x-4' },
  md: { root: 'h-6 w-11', thumb: 'h-5 w-5', translate: 'data-[state=checked]:translate-x-5' },
};

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  { size = 'md', label, description, labelBefore = false, id, disabled, className, ...rest },
  ref,
) {
  const field = useField();
  const finalId = id ?? field?.id;
  const isDisabled = disabled ?? field?.disabled;
  const s = sizes[size];

  const toggle = (
    <RS.Root
      ref={ref}
      id={finalId}
      disabled={isDisabled}
      aria-describedby={field?.describedById}
      className={cn(
        'relative inline-flex shrink-0 items-center rounded-full transition-colors',
        s.root,
        // Off: cinza médio (visível em ambos os temas). On: acento primário.
        'bg-border-strong data-[state=checked]:bg-primary-500',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        className,
      )}
      {...rest}
    >
      <RS.Thumb
        className={cn(
          'block rounded-full bg-neutral-0 shadow-sm transition-transform',
          s.thumb,
          'translate-x-0.5',
          s.translate,
        )}
      />
    </RS.Root>
  );

  if (!label && !description) return toggle;

  const text = (
    <div className="min-w-0">
      {label && (
        <label
          htmlFor={finalId}
          className={cn(
            'block text-sm leading-tight cursor-pointer select-none',
            isDisabled ? 'text-text-disabled cursor-not-allowed' : 'text-text-primary',
          )}
        >
          {label}
        </label>
      )}
      {description && <p className="mt-0.5 text-caption text-text-tertiary">{description}</p>}
    </div>
  );

  return labelBefore ? (
    <div className="flex items-center justify-between gap-3">{text}{toggle}</div>
  ) : (
    <div className="flex items-start gap-2">{toggle}{text}</div>
  );
});
