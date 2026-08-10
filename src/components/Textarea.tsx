import {
  TextareaHTMLAttributes, forwardRef, useEffect, useRef, useImperativeHandle,
} from 'react';
import { cn } from '../lib/cn';
import { useField } from './Field';

/**
 * Textarea
 * - Se `autoResize`, cresce conforme o conteúdo até `maxRows` (default 8).
 * - Se envolto por <Field>, herda id/error/disabled via contexto.
 */

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  autoResize?: boolean;
  maxRows?: number;
  invalid?: boolean;   // força estado de erro fora do <Field>
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { autoResize = false, maxRows = 8, invalid, className, id, disabled, ...rest },
  ref,
) {
  const field = useField();
  const localRef = useRef<HTMLTextAreaElement>(null);
  useImperativeHandle(ref, () => localRef.current as HTMLTextAreaElement);

  const finalId = id ?? field?.id;
  const isDisabled = disabled ?? field?.disabled;
  const hasError = invalid ?? field?.hasError ?? false;

  useEffect(() => {
    if (!autoResize) return;
    const el = localRef.current;
    if (!el) return;
    const resize = () => {
      el.style.height = 'auto';
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight || '20');
      const max = lineHeight * maxRows;
      el.style.height = `${Math.min(el.scrollHeight, max)}px`;
      el.style.overflowY = el.scrollHeight > max ? 'auto' : 'hidden';
    };
    resize();
    el.addEventListener('input', resize);
    return () => el.removeEventListener('input', resize);
  }, [autoResize, maxRows, rest.value]);

  return (
    <textarea
      ref={localRef}
      id={finalId}
      disabled={isDisabled}
      aria-invalid={hasError || undefined}
      aria-describedby={field?.describedById}
      rows={autoResize ? 1 : rest.rows ?? 4}
      className={cn(
        'w-full rounded-md bg-surface-elevated text-text-primary placeholder:text-text-tertiary',
        'border px-3 py-2 transition-colors duration-fast resize-y',
        hasError
          ? 'border-error focus:border-error focus:ring-2 focus:ring-error/40'
          : 'border-border focus:border-primary-500 focus:ring-2 focus:ring-primary-500/40',
        'focus:outline-none',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        className,
      )}
      {...rest}
    />
  );
});
