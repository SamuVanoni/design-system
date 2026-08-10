import { ReactNode } from 'react';
import * as RT from '@radix-ui/react-tooltip';
import { cn } from '../lib/cn';

/**
 * Tooltip (wrapper sobre @radix-ui/react-tooltip).
 * Uso:
 *   <Tooltip content="Salvar (Ctrl+S)">
 *     <Button>Salvar</Button>
 *   </Tooltip>
 *
 * IMPORTANTE: envolva a árvore uma vez com <TooltipRootProvider> (ou passe uma
 * árvore que já esteja dentro de uma). Se não fizer, o Radix cria uma nova
 * a cada Tooltip — funciona, mas o `delayDuration` fica isolado por instância.
 */

export const TooltipRootProvider = RT.Provider;

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  delayDuration?: number;   // ms; default 300
  sideOffset?: number;
}

export function Tooltip({
  content,
  children,
  side = 'top',
  align = 'center',
  delayDuration = 300,
  sideOffset = 6,
}: TooltipProps) {
  return (
    <RT.Provider delayDuration={delayDuration} skipDelayDuration={100}>
      <RT.Root>
        <RT.Trigger asChild>{children}</RT.Trigger>
        <RT.Portal>
          <RT.Content
            side={side}
            align={align}
            sideOffset={sideOffset}
            className={cn(
              'z-[60] rounded-md border border-border bg-surface-overlay px-2 py-1',
              'text-xs text-text-primary shadow-md',
              'data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in',
            )}
          >
            {content}
            <RT.Arrow className="fill-[var(--surface-overlay)]" />
          </RT.Content>
        </RT.Portal>
      </RT.Root>
    </RT.Provider>
  );
}
