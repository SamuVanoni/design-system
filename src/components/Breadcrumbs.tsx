import { Fragment, ReactNode } from 'react';
import { ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '../lib/cn';

/**
 * Breadcrumbs — trilha de navegação hierárquica.
 *
 * O último item é sempre a página atual: renderiza como texto (não link) e
 * recebe `aria-current="page"`.
 *
 * Quando a trilha passa de `maxItems`, o miolo colapsa em "…" — o primeiro e os
 * últimos itens continuam visíveis, que é o que orienta o usuário.
 *
 * @example
 * <Breadcrumbs
 *   items={[
 *     { label: 'Início', href: '/', icon: <Home className="h-3.5 w-3.5" /> },
 *     { label: 'Projetos', href: '/projetos' },
 *     { label: 'Acme', href: '/projetos/acme' },
 *     { label: 'Configurações' },
 *   ]}
 * />
 */

export interface Crumb {
  label: ReactNode;
  /** Se ausente (e não for o último), vira botão — use com router client-side. */
  href?: string;
  onClick?: () => void;
  icon?: ReactNode;
}

interface BreadcrumbsProps {
  items: Crumb[];
  /** Acima disso, o miolo colapsa em "…". Default 4. Use 0 para nunca colapsar. */
  maxItems?: number;
  /** Separador custom. Default: chevron. */
  separator?: ReactNode;
  className?: string;
}

const linkCls =
  'rounded px-1 -mx-1 text-text-tertiary transition-colors hover:text-text-primary ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500';

function CrumbContent({ item }: { item: Crumb }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {item.icon}
      {item.label}
    </span>
  );
}

export function Breadcrumbs({ items, maxItems = 4, separator, className }: BreadcrumbsProps) {
  const sep = separator ?? <ChevronRight className="h-3.5 w-3.5 shrink-0 text-text-disabled" aria-hidden />;

  // Colapsa o miolo mantendo o primeiro e os dois últimos.
  const shouldCollapse = maxItems > 0 && items.length > maxItems;
  const rendered: (Crumb | 'ellipsis')[] = shouldCollapse
    ? [items[0], 'ellipsis', ...items.slice(-2)]
    : items;

  return (
    <nav aria-label="Trilha de navegação" className={className}>
      <ol className="flex flex-wrap items-center gap-2 text-sm">
        {rendered.map((item, i) => {
          const isLast = i === rendered.length - 1;

          return (
            <Fragment key={item === 'ellipsis' ? 'ellipsis' : `${i}-${String(item.label)}`}>
              <li className="inline-flex items-center">
                {item === 'ellipsis' ? (
                  <span className="inline-flex items-center px-1 text-text-disabled" title="Itens ocultos">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Itens intermediários ocultos</span>
                  </span>
                ) : isLast ? (
                  <span aria-current="page" className="font-medium text-text-primary">
                    <CrumbContent item={item} />
                  </span>
                ) : item.href ? (
                  <a href={item.href} onClick={item.onClick} className={linkCls}>
                    <CrumbContent item={item} />
                  </a>
                ) : (
                  <button type="button" onClick={item.onClick} className={cn(linkCls, 'cursor-pointer')}>
                    <CrumbContent item={item} />
                  </button>
                )}
              </li>

              {!isLast && <li aria-hidden className="inline-flex items-center">{sep}</li>}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
