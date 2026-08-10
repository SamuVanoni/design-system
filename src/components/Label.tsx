import { LabelHTMLAttributes } from 'react';
import { cn } from '../lib/cn';

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  disabled?: boolean;
  required?: boolean;
}

export function Label({ disabled, required, className, children, ...rest }: LabelProps) {
  return (
    <label
      className={cn(
        'text-sm font-medium',
        disabled ? 'text-text-disabled' : 'text-text-secondary',
        className,
      )}
      {...rest}
    >
      {children}
      {required && <span className="ml-1 text-primary-500" aria-hidden>*</span>}
    </label>
  );
}
