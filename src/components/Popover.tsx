import { ReactNode } from 'react';
import * as RP from '@radix-ui/react-popover';
import { X } from 'lucide-react';
import { cn } from '../lib/cn';

/**
 * Popover (wrapper sobre @radix-ui/react-popover).
 * Diferente do Dropdown, o conteúdo é livre (form, filtros, mini card).
 *
 * Uso:
 *   <Popover trigger={<Button>Filtros</Button>}>
 *     <Popover.Header title="Filtrar por" onClose />
 *     <div className="p-3 space-y-2">...</div>
 *   </Popover>
 */

type Size = 'sm' | 'md' | 'lg';

interface PopoverProps {
  trigger: ReactNode;
  children: ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  size?: Size;
  open?: boolean;
  onOpenChange?: (o: boolean) => void;
  showArrow?: boolean;
}

const sizes: Record<Size, string> = {
  sm: 'w-56',
  md: 'w-72',
  lg: 'w-96',
};

function PopoverRoot({
  trigger,
  children,
  side = 'bottom',
  align = 'start',
  sideOffset = 6,
  size = 'md',
  open,
  onOpenChange,
  showArrow = false,
}: PopoverProps) {
  return (
    <RP.Root open={open} onOpenChange={onOpenChange}>
      <RP.Trigger asChild>{trigger}</RP.Trigger>
      <RP.Portal>
        <RP.Content
          side={side}
          align={align}
          sideOffset={sideOffset}
          className={cn(
            'z-50 overflow-hidden rounded-md border border-border bg-surface-overlay shadow-lg',
            'text-text-primary',
            sizes[size],
            'data-[state=open]:animate-in data-[state=open]:fade-in',
          )}
        >
          {children}
          {showArrow && <RP.Arrow className="fill-[var(--surface-overlay)]" />}
        </RP.Content>
      </RP.Portal>
    </RP.Root>
  );
}

interface PopoverHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  onClose?: boolean;   // se true, mostra o botão de fechar (usa Popover.Close)
}

function PopoverHeader({ title, description, onClose }: PopoverHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border-subtle px-3 py-2">
      <div className="min-w-0">
        <p className="text-sm font-medium text-text-primary truncate">{title}</p>
        {description && <p className="mt-0.5 text-caption text-text-tertiary">{description}</p>}
      </div>
      {onClose && (
        <RP.Close
          aria-label="Fechar"
          className={cn(
            'inline-flex h-6 w-6 items-center justify-center rounded text-text-tertiary',
            'hover:bg-surface-elevated hover:text-text-primary transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
          )}
        >
          <X className="h-3.5 w-3.5" />
        </RP.Close>
      )}
    </div>
  );
}

function PopoverBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('p-3', className)}>{children}</div>;
}

export const Popover = Object.assign(PopoverRoot, {
  Header: PopoverHeader,
  Body: PopoverBody,
  Close: RP.Close,
});
