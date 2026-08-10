import { ReactNode } from 'react';
import * as RG from '@radix-ui/react-radio-group';
import { cn } from '../lib/cn';
import { useField } from './Field';

/**
 * Radio composicional (Radix RadioGroup).
 * Uso:
 *   <Radio.Group value={v} onValueChange={setV} orientation="vertical">
 *     <Radio.Item value="a" label="Opção A" description="..." />
 *     <Radio.Item value="b" label="Opção B" />
 *   </Radio.Group>
 */

interface GroupProps extends Omit<RG.RadioGroupProps, 'children'> {
  children: ReactNode;
  orientation?: 'vertical' | 'horizontal';
}

function Group({ children, orientation = 'vertical', className, ...rest }: GroupProps) {
  const field = useField();
  return (
    <RG.Root
      className={cn(
        'flex gap-3',
        orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap items-center',
        className,
      )}
      aria-describedby={field?.describedById}
      disabled={rest.disabled ?? field?.disabled}
      {...rest}
    >
      {children}
    </RG.Root>
  );
}

interface ItemProps extends Omit<RG.RadioGroupItemProps, 'children'> {
  label?: ReactNode;
  description?: ReactNode;
}

function Item({ value, label, description, disabled, id, className, ...rest }: ItemProps) {
  const inputId = id ?? `radio-${value}`;
  const dot = (
    <RG.Item
      value={value}
      id={inputId}
      disabled={disabled}
      className={cn(
        'inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full',
        'border border-border-strong bg-surface-elevated transition-colors',
        'data-[state=checked]:border-primary-500',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        className,
      )}
      {...rest}
    >
      <RG.Indicator className="block h-2.5 w-2.5 rounded-full bg-primary-500" />
    </RG.Item>
  );

  if (!label && !description) return dot;

  return (
    <div className="flex items-start gap-2">
      {dot}
      <div className="min-w-0">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'block text-sm leading-tight cursor-pointer select-none',
              disabled ? 'text-text-disabled cursor-not-allowed' : 'text-text-primary',
            )}
          >
            {label}
          </label>
        )}
        {description && <p className="mt-0.5 text-caption text-text-tertiary">{description}</p>}
      </div>
    </div>
  );
}

export const Radio = { Group, Item };
