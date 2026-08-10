import { ReactNode } from 'react';
import * as RAcc from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import { cn } from '../lib/cn';

/**
 * Accordion (wrapper sobre @radix-ui/react-accordion).
 * Navegação por teclado, aria-expanded e a medição da altura para a animação
 * vêm do Radix.
 *
 * `type="single"` abre um item por vez (use `collapsible` para permitir fechar
 * todos); `type="multiple"` permite vários abertos.
 *
 * @example
 * <Accordion type="single" collapsible defaultValue="billing">
 *   <Accordion.Item value="billing" title="Cobrança" description="Faturas e limites">
 *     <p>Conteúdo livre.</p>
 *   </Accordion.Item>
 *   <Accordion.Item value="team" title="Equipe">
 *     <p>Outro painel.</p>
 *   </Accordion.Item>
 * </Accordion>
 */

type SingleProps = {
  type: 'single';
  value?: string;
  defaultValue?: string;
  onValueChange?: (v: string) => void;
  collapsible?: boolean;
};

type MultipleProps = {
  type: 'multiple';
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (v: string[]) => void;
};

type AccordionProps = (SingleProps | MultipleProps) & {
  children: ReactNode;
  className?: string;
  /** Cada item vira um card separado em vez de uma lista com divisores. */
  separated?: boolean;
};

function AccordionRoot({ children, className, separated = false, ...rest }: AccordionProps) {
  return (
    <RAcc.Root
      {...(rest as RAcc.AccordionSingleProps | RAcc.AccordionMultipleProps)}
      className={cn(
        separated
          // Cada item vira seu próprio card — moldura aplicada nos filhos diretos.
          ? 'space-y-2 [&>*]:overflow-hidden [&>*]:rounded-lg [&>*]:border [&>*]:border-border'
          : 'divide-y divide-border-subtle overflow-hidden rounded-lg border border-border',
        className,
      )}
    >
      {children}
    </RAcc.Root>
  );
}

interface ItemProps {
  value: string;
  title: ReactNode;
  /** Linha de apoio abaixo do título, dentro do gatilho. */
  description?: ReactNode;
  /** Ícone à esquerda do título. */
  icon?: ReactNode;
  /** Conteúdo à direita, antes da seta (ex.: <Badge />). */
  meta?: ReactNode;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
}

function AccordionItem({
  value, title, description, icon, meta, disabled, children, className,
}: ItemProps) {
  return (
    <RAcc.Item
      value={value}
      disabled={disabled}
      className={cn('group overflow-hidden data-[disabled]:opacity-50', className)}
    >
      <RAcc.Header className="flex">
        <RAcc.Trigger
          className={cn(
            'flex flex-1 items-center gap-3 px-5 py-4 text-left',
            'bg-surface-elevated transition-colors',
            'hover:bg-surface-mutedHover',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500',
            'disabled:cursor-not-allowed',
          )}
        >
          {icon && <span className="shrink-0 text-text-tertiary">{icon}</span>}

          <span className="min-w-0 flex-1">
            <span className="block font-medium text-text-primary">{title}</span>
            {description && (
              <span className="mt-0.5 block text-caption text-text-tertiary">{description}</span>
            )}
          </span>

          {meta && <span className="shrink-0">{meta}</span>}

          <ChevronDown
            className={cn(
              'h-4 w-4 shrink-0 text-text-tertiary transition-transform duration-base',
              'group-data-[state=open]:rotate-180',
            )}
            aria-hidden
          />
        </RAcc.Trigger>
      </RAcc.Header>

      <RAcc.Content
        className={cn(
          'ds-accordion-item overflow-hidden bg-surface-elevated',
          'data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up',
        )}
      >
        <div className="px-5 pb-4 pt-0 text-text-secondary">{children}</div>
      </RAcc.Content>
    </RAcc.Item>
  );
}

export const Accordion = Object.assign(AccordionRoot, {
  Item: AccordionItem,
});
