import { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes, ReactNode } from 'react';
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';
import { cn } from '../lib/cn';

/**
 * Table composicional (baseada em <table> nativo, sem dependências).
 *
 * Uso:
 *   <Table>
 *     <Table.Head>
 *       <Table.Row>
 *         <Table.HeadCell>Nome</Table.HeadCell>
 *         <Table.HeadCell align="right">Uso</Table.HeadCell>
 *         <Table.HeadCell sort="asc" onSort={...}>Data</Table.HeadCell>
 *       </Table.Row>
 *     </Table.Head>
 *     <Table.Body>
 *       {rows.map(r => (
 *         <Table.Row key={r.id}>
 *           <Table.Cell>{r.name}</Table.Cell>
 *           <Table.Cell align="right">{r.usage}</Table.Cell>
 *           <Table.Cell>{r.date}</Table.Cell>
 *         </Table.Row>
 *       ))}
 *     </Table.Body>
 *   </Table>
 *
 * Ordenação real fica no lado da app — o `HeadCell` só renderiza a UI
 * (seta + click handler) e você muda os dados.
 */

interface TableProps extends HTMLAttributes<HTMLTableElement> {
  /** Envolve em wrapper com scroll horizontal (útil em telas pequenas). */
  scrollable?: boolean;
}

function TableRoot({ scrollable = true, className, ...rest }: TableProps) {
  const table = (
    <table
      className={cn(
        'w-full caption-bottom border-collapse text-sm',
        'text-text-secondary',
        className,
      )}
      {...rest}
    />
  );
  if (!scrollable) return table;
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-border bg-surface-elevated">
      {table}
    </div>
  );
}

function TableHead({ className, ...rest }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn(
        'bg-surface-elevated text-text-tertiary',
        'border-b border-border',
        className,
      )}
      {...rest}
    />
  );
}

function TableBody({ className, ...rest }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody
      className={cn(
        // Divisores sutis entre linhas
        '[&>tr]:border-b [&>tr]:border-border-subtle last:[&>tr]:border-b-0',
        className,
      )}
      {...rest}
    />
  );
}

interface RowProps extends HTMLAttributes<HTMLTableRowElement> {
  /** Marca a linha como selecionada (fundo levemente acobreado). */
  selected?: boolean;
  /** Adiciona hover + cursor pointer. */
  interactive?: boolean;
}

function TableRow({ selected, interactive, className, ...rest }: RowProps) {
  return (
    <tr
      data-selected={selected || undefined}
      className={cn(
        'transition-colors',
        interactive && 'cursor-pointer hover:bg-surface-overlay/40',
        selected && 'bg-primary-500/10',
        className,
      )}
      {...rest}
    />
  );
}

type Align = 'left' | 'right' | 'center';
const alignClass: Record<Align, string> = {
  left: 'text-left',
  right: 'text-right',
  center: 'text-center',
};

interface HeadCellProps extends ThHTMLAttributes<HTMLTableCellElement> {
  align?: Align;
  /** Se definido, mostra seta de ordenação clícavel. */
  sort?: 'asc' | 'desc' | 'none';
  onSort?: () => void;
  /** Largura fixa em px, %, rem, etc. Vira `style.width`. */
  width?: string | number;
}

function TableHeadCell({
  align = 'left', sort, onSort, width, className, children, ...rest
}: HeadCellProps) {
  const sortable = sort !== undefined;
  const icon =
    sort === 'asc' ? <ChevronUp className="h-3.5 w-3.5" /> :
    sort === 'desc' ? <ChevronDown className="h-3.5 w-3.5" /> :
    sortable ? <ChevronsUpDown className="h-3.5 w-3.5 opacity-60" /> : null;

  return (
    <th
      scope="col"
      style={width ? { width } : undefined}
      aria-sort={sort === 'asc' ? 'ascending' : sort === 'desc' ? 'descending' : undefined}
      className={cn(
        'px-4 py-3 text-caption font-medium uppercase tracking-wide',
        alignClass[align],
        className,
      )}
      {...rest}
    >
      {sortable ? (
        <button
          type="button"
          onClick={onSort}
          className={cn(
            'inline-flex items-center gap-1.5 uppercase tracking-wide',
            'text-text-tertiary hover:text-text-primary transition-colors',
            'focus-visible:outline-none focus-visible:text-text-primary',
          )}
        >
          {children}
          {icon}
        </button>
      ) : (
        children
      )}
    </th>
  );
}

interface CellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  align?: Align;
  /** Impede quebra de linha (útil para colunas de ID, data). */
  nowrap?: boolean;
  /** Trunca com ellipsis se estourar. Requer `maxWidth` para funcionar bem. */
  truncate?: boolean;
}

function TableCell({
  align = 'left', nowrap, truncate, className, ...rest
}: CellProps) {
  return (
    <td
      className={cn(
        'px-4 py-3 text-text-secondary align-middle',
        alignClass[align],
        nowrap && 'whitespace-nowrap',
        truncate && 'truncate',
        className,
      )}
      {...rest}
    />
  );
}

function TableCaption({ className, ...rest }: HTMLAttributes<HTMLTableCaptionElement>) {
  return <caption className={cn('mt-2 text-caption text-text-tertiary', className)} {...rest} />;
}

/** Placeholder para estados vazios dentro da tabela (span colspan automático). */
interface EmptyProps { colSpan: number; children: ReactNode; className?: string }
function TableEmpty({ colSpan, children, className }: EmptyProps) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className={cn('px-4 py-10 text-center text-text-tertiary', className)}
      >
        {children}
      </td>
    </tr>
  );
}

export const Table = Object.assign(TableRoot, {
  Head: TableHead,
  Body: TableBody,
  Row: TableRow,
  HeadCell: TableHeadCell,
  Cell: TableCell,
  Caption: TableCaption,
  Empty: TableEmpty,
});
