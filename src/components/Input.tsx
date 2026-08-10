import { InputHTMLAttributes, forwardRef, ReactNode, useId } from 'react';
import { cn } from '../lib/cn';
import { Label } from './Label';
import { HelperText } from './HelperText';

/**
 * Input
 * Estados suportados: default, focus, error, disabled.
 * Composição opcional: label + helper/error text + ícone à esquerda.
 */

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  errorText?: string;
  leftIcon?: ReactNode;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    helperText,
    errorText,
    leftIcon,
    fullWidth = true,
    className,
    id,
    disabled,
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const describedById = errorText ? `${inputId}-error` : helperText ? `${inputId}-help` : undefined;
  const hasError = Boolean(errorText);

  return (
    <div className={cn('flex flex-col gap-1', fullWidth && 'w-full')}>
      {label && (
        <Label htmlFor={inputId} disabled={disabled}>
          {label}
        </Label>
      )}

      <div className="relative">
        {leftIcon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary">
            {leftIcon}
          </span>
        )}

        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          aria-invalid={hasError || undefined}
          aria-describedby={describedById}
          className={cn(
            'h-10 w-full rounded-md bg-surface-elevated text-text-primary placeholder:text-text-tertiary',
            'border transition-colors duration-fast',
            leftIcon ? 'pl-10 pr-3' : 'px-3',
            hasError
              ? 'border-error focus:border-error focus:ring-2 focus:ring-error/40'
              : 'border-border focus:border-primary-500 focus:ring-2 focus:ring-primary-500/40',
            'focus:outline-none',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            className,
          )}
          {...rest}
        />
      </div>

      {hasError ? (
        <HelperText id={`${inputId}-error`} tone="error">
          {errorText}
        </HelperText>
      ) : helperText ? (
        <HelperText id={`${inputId}-help`}>{helperText}</HelperText>
      ) : null}
    </div>
  );
});
