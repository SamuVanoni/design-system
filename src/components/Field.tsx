import { createContext, useContext, useId, ReactNode, HTMLAttributes } from 'react';
import { cn } from '../lib/cn';
import { Label } from './Label';
import { HelperText } from './HelperText';

/**
 * Field — wrapper composicional para inputs.
 *
 * Uso:
 *   <Field label="Prioridade" helperText="Afeta a ordem na fila." required>
 *     <Select ... />
 *   </Field>
 *
 * Fornece via contexto: id, describedById, hasError, disabled — que os
 * primitivos (Textarea, Select, Checkbox, Radio, Switch) consomem via useField.
 *
 * Se `errorText` for passado, o helperText é ocultado.
 */

interface FieldContextValue {
  id: string;
  describedById?: string;
  hasError: boolean;
  disabled: boolean;
  required: boolean;
}

const FieldContext = createContext<FieldContextValue | null>(null);

/** Hook opcional: primitivos podem consumir os atributos ARIA automaticamente. */
export function useField(): FieldContextValue | null {
  return useContext(FieldContext);
}

interface FieldProps extends Omit<HTMLAttributes<HTMLDivElement>, 'id'> {
  label?: ReactNode;
  helperText?: ReactNode;
  errorText?: ReactNode;
  required?: boolean;
  disabled?: boolean;
  hideLabel?: boolean;      // renderiza label para leitores de tela mas oculta visualmente
  htmlFor?: string;         // opcional se você precisar sobrescrever o id auto-gerado
  children: ReactNode;
}

export function Field({
  label,
  helperText,
  errorText,
  required = false,
  disabled = false,
  hideLabel = false,
  htmlFor,
  className,
  children,
  ...rest
}: FieldProps) {
  const autoId = useId();
  const id = htmlFor ?? autoId;
  const hasError = Boolean(errorText);
  const describedById = hasError ? `${id}-error` : helperText ? `${id}-help` : undefined;

  return (
    <FieldContext.Provider value={{ id, describedById, hasError, disabled, required }}>
      <div className={cn('flex flex-col gap-1', className)} {...rest}>
        {label && (
          <Label
            htmlFor={id}
            required={required}
            disabled={disabled}
            className={hideLabel ? 'sr-only' : undefined}
          >
            {label}
          </Label>
        )}
        {children}
        {hasError ? (
          <HelperText id={`${id}-error`} tone="error">{errorText}</HelperText>
        ) : helperText ? (
          <HelperText id={`${id}-help`}>{helperText}</HelperText>
        ) : null}
      </div>
    </FieldContext.Provider>
  );
}
