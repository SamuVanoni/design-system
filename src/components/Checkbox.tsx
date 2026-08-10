import { ReactNode, forwardRef } from 'react';
import * as RC from '@radix-ui/react-checkbox';
import { Check, Minus } from 'lucide-react';
import { cn } from '../lib/cn';
import { useField } from './Field';

/**
 * Checkbox (Radix).
 * - `checked`: true | false | 'indeterminate'
 * - Aceita `label` inline OU pode ser usado com <Field>.
 */

interface CheckboxProps
  extends Omit<RC.CheckboxProps, 'checked' | 'onCheckedChange'> {
  checked?: boolean | 'indeterminate';
  onCheckedChange?: (checked: boolean | 'indeterminate') => void;
  label?: ReactNode;
  description?: ReactNode;
}

export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(function Checkbox(
  { checked, onCheckedChange, label, description, id, disabled, className, ...rest },
  ref,
) {
  const field = useField();
  const finalId = id ?? field?.id;
  const isDisabled = disabled ?? field?.disabled;

  const box = (
    <RC.Root
      ref={ref}
      id={finalId}
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={isDisabled}
      aria-describedby={field?.describedById}
      className={cn(
        'group inline-flex h-5 w-5 shrink-0 items-center justify-center rounded',
        'border border-border-strong bg-surface-elevated transition-colors',
        'data-[state=checked]:bg-primary-500 data-[state=checked]:border-primary-500',
        'data-[state=indeterminate]:bg-primary-500 data-[state=indeterminate]:border-primary-500',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        className,
      )}
      {...rest}
    >
      <RC.Indicator className="text-text-onPrimary">
        {checked === 'indeterminate' ? <Minus className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5" />}
      </RC.Indicator>
    </RC.Root>
  );

  if (!label && !description) return box;

  return (
    <div className="flex items-start gap-2">
      {box}
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
        {description && (
          <p className="mt-0.5 text-caption text-text-tertiary">{description}</p>
        )}
      </div>
    </div>
  );
});
