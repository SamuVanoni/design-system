import { ReactNode } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '../lib/cn';

/**
 * Modal (wrapper sobre @radix-ui/react-dialog).
 * Acessibilidade (focus trap, escape, aria) vem do Radix.
 * Uso:
 *   <Modal open={o} onOpenChange={setO} title="..." description="...">
 *     <p>Conteúdo</p>
 *     <Modal.Footer>...botões...</Modal.Footer>
 *   </Modal>
 *
 * Altura: o container trava em max-h-[90vh] e só o corpo rola — cabeçalho fica
 * fixo (shrink-0) e o Modal.Footer gruda no rodapé (sticky). Sem isso um modal
 * de formulário longo empurra os botões para fora da viewport.
 * O corpo carrega a classe `modal-body` como gancho: quem consome pode estilizar
 * a scrollbar por CSS sem precisar de prop nova.
 */

type Size = 'sm' | 'md' | 'lg';

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  size?: Size;
  children: ReactNode;
  hideCloseButton?: boolean;
}

const sizes: Record<Size, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
};

function ModalRoot({
  open,
  onOpenChange,
  title,
  description,
  size = 'md',
  children,
  hideCloseButton,
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 z-40 bg-backdrop data-[state=open]:animate-in data-[state=open]:fade-in"
        />
        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-50 flex max-h-[90vh] w-[95vw] -translate-x-1/2 -translate-y-1/2 flex-col',
            'rounded-lg border border-border bg-surface-elevated shadow-lg',
            'focus:outline-none',
            sizes[size],
          )}
        >
          <div className="flex shrink-0 items-start justify-between gap-4 border-b border-border-subtle px-6 py-4">
            <div className="min-w-0 flex-1">
              <Dialog.Title className="text-h3 text-text-primary truncate">{title}</Dialog.Title>
              {description && (
                <Dialog.Description className="mt-1 text-caption text-text-tertiary">
                  {description}
                </Dialog.Description>
              )}
            </div>
            {!hideCloseButton && (
              <Dialog.Close
                aria-label="Fechar"
                className={cn(
                  'inline-flex h-8 w-8 items-center justify-center rounded-md text-text-tertiary',
                  'hover:bg-surface-mutedHover hover:text-text-primary transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                )}
              >
                <X className="h-4 w-4" />
              </Dialog.Close>
            )}
          </div>
          <div className="modal-body min-h-0 flex-1 overflow-y-auto px-6 py-4 text-text-secondary">
            {children}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function ModalFooter({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'sticky bottom-0 mt-6 -mx-6 -mb-4 flex justify-end gap-2 border-t border-border-subtle bg-surface-elevated px-6 py-3',
        className,
      )}
    >
      {children}
    </div>
  );
}

export const Modal = Object.assign(ModalRoot, { Footer: ModalFooter });
