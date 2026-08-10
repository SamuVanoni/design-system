import { DragEvent, ReactNode, useId, useRef, useState } from 'react';
import { UploadCloud, File as FileIcon, X, AlertCircle } from 'lucide-react';
import { cn } from '../lib/cn';
import { useField } from './Field';

/**
 * FileUpload — dropzone com drag & drop + seleção pelo explorador.
 *
 * Componente controlado: você guarda os `File[]` e passa de volta em `value`.
 * Ele não faz upload — só coleta e valida. A chamada de rede fica na sua app.
 *
 * Acessibilidade: a zona é um <label> ligado a um <input type="file"> real, então
 * clique, foco por teclado e Enter/Espaço funcionam nativamente — sem handler custom.
 *
 * @example
 * const [files, setFiles] = useState<File[]>([]);
 * <Field label="Anexos" helperText="PDF ou PNG, até 5MB cada.">
 *   <FileUpload
 *     value={files}
 *     onValueChange={setFiles}
 *     accept=".pdf,.png"
 *     multiple
 *     maxSize={5 * 1024 * 1024}
 *   />
 * </Field>
 */

interface FileUploadProps {
  value?: File[];
  onValueChange?: (files: File[]) => void;
  /** Mesma sintaxe do input nativo: ".pdf,.png" ou "image/*". */
  accept?: string;
  multiple?: boolean;
  /** Tamanho máximo por arquivo, em bytes. */
  maxSize?: number;
  /** Quantidade máxima de arquivos. */
  maxFiles?: number;
  disabled?: boolean;
  /** Texto de apoio dentro da zona. Default: derivado de accept/maxSize. */
  hint?: ReactNode;
  className?: string;
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const n = bytes / Math.pow(1024, i);
  return `${n >= 10 || i === 0 ? Math.round(n) : n.toFixed(1)} ${units[i]}`;
}

export function FileUpload({
  value = [],
  onValueChange,
  accept,
  multiple = false,
  maxSize,
  maxFiles,
  disabled,
  hint,
  className,
}: FileUploadProps) {
  const field = useField();
  const autoId = useId();
  const inputId = field?.id ?? autoId;
  const isDisabled = disabled ?? field?.disabled ?? false;

  const [dragging, setDragging] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  // dragenter/dragleave disparam para cada filho; contamos a profundidade
  // para não desligar o destaque ao passar por cima do texto interno.
  const dragDepth = useRef(0);

  function accepts(file: File): boolean {
    if (!accept) return true;
    return accept.split(',').map((s) => s.trim().toLowerCase()).some((rule) => {
      if (!rule) return false;
      if (rule.endsWith('/*')) return file.type.toLowerCase().startsWith(rule.slice(0, -1));
      if (rule.startsWith('.')) return file.name.toLowerCase().endsWith(rule);
      return file.type.toLowerCase() === rule;
    });
  }

  function ingest(incoming: FileList | null) {
    if (!incoming || incoming.length === 0) return;

    const problems: string[] = [];
    const ok: File[] = [];

    for (const file of Array.from(incoming)) {
      if (!accepts(file)) {
        problems.push(`${file.name}: tipo não aceito.`);
        continue;
      }
      if (maxSize && file.size > maxSize) {
        problems.push(`${file.name}: excede ${formatBytes(maxSize)}.`);
        continue;
      }
      ok.push(file);
    }

    let next = multiple ? [...value, ...ok] : ok.slice(0, 1);

    if (maxFiles && next.length > maxFiles) {
      problems.push(`Máximo de ${maxFiles} arquivo(s). Os excedentes foram ignorados.`);
      next = next.slice(0, maxFiles);
    }

    setErrors(problems);
    onValueChange?.(next);
  }

  function remove(index: number) {
    onValueChange?.(value.filter((_, i) => i !== index));
    setErrors([]);
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    dragDepth.current = 0;
    setDragging(false);
    if (isDisabled) return;
    ingest(e.dataTransfer.files);
  }

  const defaultHint = [
    accept ? accept.replace(/,/g, ', ') : null,
    maxSize ? `até ${formatBytes(maxSize)}` : null,
  ].filter(Boolean).join(' · ');

  return (
    <div className={cn('w-full', className)}>
      <div
        onDragEnter={(e) => {
          e.preventDefault();
          dragDepth.current += 1;
          if (!isDisabled) setDragging(true);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={(e) => {
          e.preventDefault();
          dragDepth.current -= 1;
          if (dragDepth.current <= 0) setDragging(false);
        }}
        onDrop={onDrop}
        className={cn(
          'rounded-lg border-2 border-dashed transition-colors',
          'focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2 focus-within:ring-offset-surface-base',
          dragging
            ? 'border-primary-500 bg-primary-500/10'
            : 'border-border-strong bg-surface-muted hover:border-primary-500',
          isDisabled && 'pointer-events-none opacity-40',
          field?.hasError && !dragging && 'border-error',
        )}
      >
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={isDisabled}
          aria-describedby={field?.describedById}
          className="sr-only"
          onChange={(e) => {
            ingest(e.target.files);
            // Permite reenviar o mesmo arquivo após remover.
            e.target.value = '';
          }}
        />

        <label
          htmlFor={inputId}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center gap-2 px-6 py-10 text-center',
            isDisabled && 'cursor-not-allowed',
          )}
        >
          <UploadCloud
            className={cn('h-8 w-8', dragging ? 'text-primary-500' : 'text-text-tertiary')}
            aria-hidden
          />
          <span className="text-sm text-text-primary">
            {dragging ? (
              'Solte para anexar'
            ) : (
              <>
                <span className="font-medium text-primary-onSoft">Clique para escolher</span>
                {' ou arraste até aqui'}
              </>
            )}
          </span>
          {(hint ?? defaultHint) && (
            <span className="text-caption text-text-tertiary">{hint ?? defaultHint}</span>
          )}
        </label>
      </div>

      {errors.length > 0 && (
        <ul className="mt-2 space-y-1" role="alert">
          {errors.map((msg, i) => (
            <li key={i} className="flex items-start gap-2 text-caption text-error">
              <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden />
              {msg}
            </li>
          ))}
        </ul>
      )}

      {value.length > 0 && (
        <ul className="mt-3 space-y-2">
          {value.map((file, i) => (
            <li
              key={`${file.name}-${i}`}
              className="flex items-center gap-3 rounded-md border border-border bg-surface-elevated px-3 py-2"
            >
              <FileIcon className="h-4 w-4 shrink-0 text-text-tertiary" aria-hidden />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm text-text-primary">{file.name}</span>
                <span className="block text-caption text-text-tertiary">{formatBytes(file.size)}</span>
              </span>
              <button
                type="button"
                onClick={() => remove(i)}
                aria-label={`Remover ${file.name}`}
                className={cn(
                  'inline-flex h-7 w-7 shrink-0 items-center justify-center rounded',
                  'text-text-tertiary transition-colors hover:bg-surface-mutedHover hover:text-text-primary',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                )}
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
