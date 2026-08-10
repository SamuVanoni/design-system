import { ReactNode, forwardRef } from 'react';
import * as RS from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../lib/cn';
import { useField } from './Field';

/**
 * Select composicional (Radix Select).
 * Uso:
 *   <Select value={v} onValueChange={setV} placeholder="Escolha...">
 *     <Select.Item value="low">Baixa</Select.Item>
 *     <Select.Item value="med">Média</Select.Item>
 *     <Select.Separator />
 *     <Select.Label>Especiais</Select.Label>
 *     <Select.Item value="urgent">Urgente</Select.Item>
 *   </Select>
 */

type Size = 'sm' | 'md';

interface SelectProps extends Omit<RS.SelectProps, 'children'> {
  children: ReactNode;
  placeholder?: string;
  size?: Size;
  className?: string;
  invalid?: boolean;
  id?: string;
}

const sizes: Record<Size, string> = {
  sm: 'h-8 text-sm px-2.5',
  md: 'h-10 text-base px-3',
};

function SelectRoot({
  children, placeholder, size = 'md', className, invalid, id, disabled, ...rest
}: SelectProps) {
  const field = useField();
  const finalId = id ?? field?.id;
  const isDisabled = disabled ?? field?.disabled;
  const hasError = invalid ?? field?.hasError ?? false;

  return (
    <RS.Root disabled={isDisabled} {...rest}>
      <RS.Trigger
        id={finalId}
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
        <RS.Value placeholder={<span className="text-text-tertiary">{placeholder}</span>} />
        <RS.Icon><ChevronDown className="h-4 w-4 text-text-tertiary" /></RS.Icon>
      </RS.Trigger>

      <RS.Portal>
        <RS.Content
          position="popper"
          sideOffset={6}
          className={cn(
            'z-50 overflow-hidden rounded-md border border-border bg-surface-overlay shadow-lg',
            'text-text-primary min-w-[var(--radix-select-trigger-width)]',
          )}
        >
          <RS.ScrollUpButton className="flex h-6 items-center justify-center text-text-tertiary">
            <ChevronUp className="h-4 w-4" />
          </RS.ScrollUpButton>
          <RS.Viewport className="p-1">
            {children}
          </RS.Viewport>
          <RS.ScrollDownButton className="flex h-6 items-center justify-center text-text-tertiary">
            <ChevronDown className="h-4 w-4" />
          </RS.ScrollDownButton>
        </RS.Content>
      </RS.Portal>
    </RS.Root>
  );
}

interface ItemProps extends Omit<RS.SelectItemProps, 'children'> {
  children: ReactNode;
}

const Item = forwardRef<HTMLDivElement, ItemProps>(function Item(
  { children, className, ...rest }, ref,
) {
  return (
    <RS.Item
      ref={ref}
      className={cn(
        'relative flex select-none items-center gap-2 rounded px-2 py-1.5 pl-7 text-sm outline-none',
        'transition-colors',
        'data-[highlighted]:bg-surface-elevated',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-40',
        className,
      )}
      {...rest}
    >
      <RS.ItemIndicator className="absolute left-1.5">
        <Check className="h-3.5 w-3.5 text-primary-500" />
      </RS.ItemIndicator>
      <RS.ItemText>{children}</RS.ItemText>
    </RS.Item>
  );
});

function SelectLabel({ children }: { children: ReactNode }) {
  return (
    <RS.Label className="px-2 py-1 text-caption uppercase tracking-wide text-text-tertiary">
      {children}
    </RS.Label>
  );
}

function SelectSeparator() {
  return <RS.Separator className="my-1 h-px bg-border-subtle" />;
}

function SelectGroup({ children }: { children: ReactNode }) {
  return <RS.Group>{children}</RS.Group>;
}

export const Select = Object.assign(SelectRoot, {
  Item,
  Label: SelectLabel,
  Separator: SelectSeparator,
  Group: SelectGroup,
});
