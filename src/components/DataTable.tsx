import { useEffect, useMemo, useState, ReactNode } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type VisibilityState,
  type RowSelectionState,
} from '@tanstack/react-table';
import { Columns, Check } from 'lucide-react';
import { cn } from '../lib/cn';
import { Table } from './Table';
import { Checkbox } from './Checkbox';
import { Dropdown } from './Dropdown';
import { Button } from './Button';
import { Skeleton } from './Skeleton';

/**
 * DataTable — wrapper sobre @tanstack/react-table usando as primitives da Table.
 *
 * Features:
 *  - Sort por coluna (clique no header).
 *  - Seleção de linhas via checkbox (habilitável).
 *  - Menu de visibilidade de colunas (habilitável).
 *  - Empty state + loading state (skeleton).
 *
 * Uso:
 *   const columns = useMemo<ColumnDef<User>[]>(() => [
 *     { accessorKey: 'name', header: 'Nome' },
 *     { accessorKey: 'email', header: 'Email' },
 *     { accessorKey: 'usage', header: 'Uso', meta: { align: 'right' } },
 *   ], []);
 *
 *   <DataTable
 *     columns={columns}
 *     data={users}
 *     enableRowSelection
 *     enableColumnVisibility
 *     onRowSelectionChange={setSelected}
 *   />
 *
 * A coluna de seleção é injetada automaticamente quando enableRowSelection=true.
 * Para desabilitar sort de uma coluna: passe `enableSorting: false` na coluna.
 * Para alinhamento: `meta: { align: 'left' | 'right' | 'center' }`.
 */

// Estende ColumnMeta para tipar `align`
declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    align?: 'left' | 'right' | 'center';
    /** Se true, oculta a coluna do menu de visibilidade. */
    hideFromColumnVisibility?: boolean;
  }
}

interface Props<TData> {
  columns: ColumnDef<TData, any>[];
  data: TData[];
  loading?: boolean;
  loadingRows?: number;
  emptyText?: ReactNode;
  enableRowSelection?: boolean;
  enableColumnVisibility?: boolean;
  onRowSelectionChange?: (selectedRows: TData[]) => void;
  /** Callback ao clicar em uma linha (aplica hover + cursor). */
  onRowClick?: (row: TData) => void;
  className?: string;
  /** Passa scrollable=false para tabela dentro de Card. */
  scrollable?: boolean;
}

export function DataTable<TData>({
  columns: userColumns,
  data,
  loading = false,
  loadingRows = 6,
  emptyText = 'Nenhum resultado.',
  enableRowSelection = false,
  enableColumnVisibility = false,
  onRowSelectionChange,
  onRowClick,
  className,
  scrollable = true,
}: Props<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  // Injeta coluna de checkbox quando enableRowSelection
  const columns = useMemo<ColumnDef<TData, any>[]>(() => {
    if (!enableRowSelection) return userColumns;
    const selectionColumn: ColumnDef<TData, any> = {
      id: '__select__',
      enableSorting: false,
      meta: { hideFromColumnVisibility: true },
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected()
              ? true
              : table.getIsSomePageRowsSelected()
              ? 'indeterminate'
              : false
          }
          onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
          aria-label="Selecionar todas as linhas"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(v) => row.toggleSelected(!!v)}
          aria-label={`Selecionar linha ${row.index + 1}`}
        />
      ),
    };
    return [selectionColumn, ...userColumns];
  }, [enableRowSelection, userColumns]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, rowSelection, columnVisibility },
    onSortingChange: setSorting,
    onRowSelectionChange: (updater) => {
      setRowSelection((prev) => {
        const next = typeof updater === 'function' ? updater(prev) : updater;
        return next;
      });
    },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection,
  });

  // Notifica o consumidor quando a seleção mudar
  useSelectionSync(table, rowSelection, onRowSelectionChange);

  const visibleCols = table.getVisibleFlatColumns().length;

  return (
    <div className={cn('space-y-3', className)}>
      {enableColumnVisibility && (
        <div className="flex justify-end">
          <Dropdown
            align="end"
            trigger={
              <Button variant="ghost" size="sm" leftIcon={<Columns className="h-4 w-4" />}>
                Colunas
              </Button>
            }
          >
            <Dropdown.Label>Visibilidade</Dropdown.Label>
            {table.getAllLeafColumns()
              .filter((c) => !(c.columnDef.meta?.hideFromColumnVisibility))
              .map((column) => (
                <Dropdown.CheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(v) => column.toggleVisibility(!!v)}
                >
                  <span className="flex items-center gap-2">
                    {column.getIsVisible() && <Check className="h-3.5 w-3.5 opacity-0" />}
                    {typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id}
                  </span>
                </Dropdown.CheckboxItem>
              ))}
          </Dropdown>
        </div>
      )}

      <Table scrollable={scrollable}>
        <Table.Head>
          {table.getHeaderGroups().map((hg) => (
            <Table.Row key={hg.id}>
              {hg.headers.map((header) => {
                const align = header.column.columnDef.meta?.align;
                const canSort = header.column.getCanSort();
                const sortDir = header.column.getIsSorted() as 'asc' | 'desc' | false;
                return (
                  <Table.HeadCell
                    key={header.id}
                    align={align}
                    sort={canSort ? (sortDir || 'none') : undefined}
                    onSort={canSort ? header.column.getToggleSortingHandler() as () => void : undefined}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </Table.HeadCell>
                );
              })}
            </Table.Row>
          ))}
        </Table.Head>
        <Table.Body>
          {loading ? (
            Array.from({ length: loadingRows }).map((_, i) => (
              <Table.Row key={`sk-${i}`}>
                {table.getVisibleFlatColumns().map((c) => (
                  <Table.Cell key={c.id}><Skeleton height={12} width="70%" /></Table.Cell>
                ))}
              </Table.Row>
            ))
          ) : table.getRowModel().rows.length === 0 ? (
            <Table.Empty colSpan={visibleCols}>{emptyText}</Table.Empty>
          ) : (
            table.getRowModel().rows.map((row) => (
              <Table.Row
                key={row.id}
                selected={row.getIsSelected()}
                interactive={Boolean(onRowClick)}
                onClick={onRowClick ? () => onRowClick(row.original) : undefined}
              >
                {row.getVisibleCells().map((cell) => (
                  <Table.Cell key={cell.id} align={cell.column.columnDef.meta?.align}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Table.Cell>
                ))}
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table>
    </div>
  );
}

// Efeito colateral: propaga seleção via callback quando muda.
// Precisa ser useEffect, não useMemo: o callback é do consumidor e normalmente
// faz setState. Rodar isso durante o render dispara o aviso do React
// "Cannot update a component while rendering a different component".
function useSelectionSync<TData>(
  table: ReturnType<typeof useReactTable<TData>>,
  rowSelection: RowSelectionState,
  cb?: (rows: TData[]) => void,
) {
  useEffect(() => {
    if (!cb) return;
    const selected = table.getSelectedRowModel().rows.map((r) => r.original);
    cb(selected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowSelection]);
}
