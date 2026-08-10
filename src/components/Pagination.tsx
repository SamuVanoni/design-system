import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/cn';

/**
 * Pagination (controlado).
 *
 * Uso:
 *   <Pagination
 *     currentPage={page}
 *     totalPages={Math.ceil(total / pageSize)}
 *     onPageChange={setPage}
 *     showSummary                        // "Mostrando 21–40 de 128"
 *     pageSize={pageSize}
 *     totalItems={128}
 *   />
 *
 * Estratégia de truncação:
 *  - Sempre mostra primeira e última página.
 *  - Mostra `siblings` (default 1) antes/depois da página atual.
 *  - Ellipsis quando há lacuna > 1 página.
 */

type Item = number | 'ellipsis';

interface PaginationProps {
  currentPage: number;               // 1-based
  totalPages: number;
  onPageChange: (page: number) => void;
  siblings?: number;                 // default 1
  showSummary?: boolean;             // exige `pageSize` e `totalItems`
  pageSize?: number;
  totalItems?: number;
  className?: string;
}

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

function buildPages(current: number, total: number, siblings: number): Item[] {
  // 7 slots: 1, ellipsis?, ...siblings..., current, ...siblings..., ellipsis?, total
  const totalNumbers = siblings * 2 + 5;
  if (total <= totalNumbers) return range(1, total);

  const left = Math.max(current - siblings, 2);
  const right = Math.min(current + siblings, total - 1);
  const showLeftEllipsis = left > 2;
  const showRightEllipsis = right < total - 1;

  const items: Item[] = [1];
  if (showLeftEllipsis) items.push('ellipsis');
  else if (left === 2) { /* no gap */ }
  items.push(...range(left, right));
  if (showRightEllipsis) items.push('ellipsis');
  items.push(total);
  return items;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblings = 1,
  showSummary = false,
  pageSize,
  totalItems,
  className,
}: PaginationProps) {
  if (totalPages <= 1) {
    // Ainda mostra o summary se pedido
    return showSummary && totalItems ? (
      <div className={cn('text-caption text-text-tertiary', className)}>
        {summaryText(currentPage, pageSize ?? totalItems, totalItems)}
      </div>
    ) : null;
  }

  const pages = buildPages(currentPage, totalPages, siblings);
  const go = (p: number) => {
    const next = Math.min(Math.max(p, 1), totalPages);
    if (next !== currentPage) onPageChange(next);
  };

  return (
    <nav
      aria-label="Paginação"
      className={cn('flex items-center justify-between gap-4', className)}
    >
      {showSummary && pageSize && totalItems ? (
        <p className="text-caption text-text-tertiary">
          {summaryText(currentPage, pageSize, totalItems)}
        </p>
      ) : <span />}

      <ul className="flex items-center gap-1">
        <li>
          <PageButton
            aria-label="Página anterior"
            disabled={currentPage === 1}
            onClick={() => go(currentPage - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </PageButton>
        </li>

        {pages.map((p, i) =>
          p === 'ellipsis' ? (
            <li key={`e-${i}`} className="px-1 text-text-tertiary" aria-hidden>…</li>
          ) : (
            <li key={p}>
              <PageButton
                aria-label={`Página ${p}`}
                aria-current={p === currentPage ? 'page' : undefined}
                active={p === currentPage}
                onClick={() => go(p)}
              >
                {p}
              </PageButton>
            </li>
          ),
        )}

        <li>
          <PageButton
            aria-label="Próxima página"
            disabled={currentPage === totalPages}
            onClick={() => go(currentPage + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </PageButton>
        </li>
      </ul>
    </nav>
  );
}

function summaryText(page: number, pageSize: number, total: number) {
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  return `Mostrando ${start}–${end} de ${total}`;
}

interface PageButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

function PageButton({ active, className, children, ...rest }: PageButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex h-8 min-w-[2rem] items-center justify-center rounded-md px-2',
        'text-sm font-medium transition-colors',
        active
          ? 'bg-primary-500 text-text-onPrimary'
          : 'text-text-secondary hover:bg-surface-overlay hover:text-text-primary',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base',
        'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
