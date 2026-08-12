import { ReactNode, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Command } from 'cmdk';
import { Search } from 'lucide-react';
import { cn } from '../lib/cn';

/**
 * CommandPalette — dialog global tipo ⌘K.
 *
 * Uso:
 *   const [open, setOpen] = useState(false);
 *   useCommandShortcut(() => setOpen(o => !o));  // ⌘K / Ctrl+K
 *
 *   <CommandPalette open={open} onOpenChange={setOpen}>
 *     <CommandPalette.Group heading="Navegação">
 *       <CommandPalette.Item icon={<Home className="h-4 w-4" />} shortcut="G H" onSelect={() => nav('/')}>
 *         Home
 *       </CommandPalette.Item>
 *     </CommandPalette.Group>
 *     <CommandPalette.Group heading="Ações">
 *       <CommandPalette.Item icon={<Plus className="h-4 w-4" />} onSelect={createProject}>
 *         Novo projeto
 *       </CommandPalette.Item>
 *     </CommandPalette.Group>
 *   </CommandPalette>
 */

interface RootProps {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  placeholder?: string;
  emptyText?: string;
  children: ReactNode;
}

function CommandPaletteRoot({
  open, onOpenChange, placeholder = 'Buscar comandos...', emptyText = 'Nenhum resultado.', children,
}: RootProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-backdrop data-[state=open]:animate-in data-[state=open]:fade-in" />
        <Dialog.Content
          aria-label="Paleta de comandos"
          className={cn(
            'fixed left-1/2 top-[15%] z-50 w-[95vw] max-w-lg -translate-x-1/2',
            'overflow-hidden rounded-lg border border-border bg-surface-overlay shadow-lg',
            'focus:outline-none',
          )}
        >
          <Dialog.Title className="sr-only">Paleta de comandos</Dialog.Title>
          <Command loop>
            <div className="flex items-center gap-2 border-b border-border-subtle px-4">
              <Search className="h-4 w-4 shrink-0 text-text-tertiary" aria-hidden />
              <Command.Input
                autoFocus
                placeholder={placeholder}
                className="flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-text-tertiary text-text-primary"
              />
            </div>
            <Command.List className="max-h-[400px] overflow-y-auto p-2">
              <Command.Empty className="py-6 text-center text-sm text-text-tertiary">
                {emptyText}
              </Command.Empty>
              {children}
            </Command.List>
          </Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function Group({ heading, children }: { heading?: ReactNode; children: ReactNode }) {
  return (
    <Command.Group
      heading={heading as string}
      className={cn(
        '[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1',
        '[&_[cmdk-group-heading]]:text-caption [&_[cmdk-group-heading]]:uppercase',
        '[&_[cmdk-group-heading]]:tracking-wide [&_[cmdk-group-heading]]:text-text-tertiary',
      )}
    >
      {children}
    </Command.Group>
  );
}

interface ItemProps {
  onSelect: () => void;
  children: ReactNode;
  icon?: ReactNode;
  /** Ex.: "⌘ K", "G H", "Ctrl+S". Renderizado à direita. */
  shortcut?: string;
  disabled?: boolean;
  /** Alias adicional para busca. */
  keywords?: string[];
  /** Tone opcional: default | danger. */
  tone?: 'default' | 'danger';
}

function Item({ onSelect, children, icon, shortcut, disabled, keywords, tone = 'default' }: ItemProps) {
  return (
    <Command.Item
      onSelect={onSelect}
      disabled={disabled}
      keywords={keywords}
      className={cn(
        'flex select-none items-center gap-3 rounded px-2 py-2 text-sm outline-none',
        'transition-colors',
        'data-[selected=true]:bg-surface-mutedHover',
        'data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-40',
        // -onSoft, nao a cor base. Ver a nota em HelperText.
        tone === 'danger' && 'text-error-onSoft data-[selected=true]:bg-error-soft',
      )}
    >
      {icon && <span className="shrink-0 text-text-tertiary">{icon}</span>}
      <span className="min-w-0 flex-1 truncate text-text-primary">{children}</span>
      {shortcut && (
        <kbd className="ml-auto shrink-0 rounded border border-border bg-surface-elevated px-1.5 py-0.5 text-caption font-mono text-text-tertiary">
          {shortcut}
        </kbd>
      )}
    </Command.Item>
  );
}

function Separator() {
  return <Command.Separator className="my-2 h-px bg-border-subtle" />;
}

export const CommandPalette = Object.assign(CommandPaletteRoot, {
  Group, Item, Separator,
});

/**
 * useCommandShortcut — registra listener global para ⌘K (Mac) / Ctrl+K (Win/Linux).
 * Passe `key` custom para outros atalhos (ex.: 'p' para ⌘P).
 */
export function useCommandShortcut(handler: (e: KeyboardEvent) => void, key = 'k') {
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === key && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handler(e);
      }
    };
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [handler, key]);
}
