import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';

/**
 * Badge
 * - `variant`: cor semântica.
 * - `count`: número. Truncado com `max` (default 99+). Substitui children.
 * - `dot`: pequeno círculo colorido (sem texto).
 */

type Variant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
  count?: number;
  max?: number;
  dot?: boolean;
  icon?: ReactNode;
}

const variants: Record<Variant, string> = {
  default: 'bg-surface-overlay text-text-primary border border-border',
  primary: 'bg-primary-500/15 text-primary-onSoft border border-primary-500/30',
  success: 'bg-success-soft text-success-onSoft border border-success/30',
  warning: 'bg-warning-soft text-warning-onSoft border border-warning/30',
  error:   'bg-error-soft text-error-onSoft border border-error/30',
  info:    'bg-info-soft text-info-onSoft border border-info/30',
};

const dotColors: Record<Variant, string> = {
  default: 'bg-text-tertiary',
  primary: 'bg-primary-500',
  success: 'bg-success',
  warning: 'bg-warning',
  error:   'bg-error',
  info:    'bg-info',
};

export function Badge({
  variant = 'default',
  count,
  max = 99,
  dot = false,
  icon,
  className,
  children,
  ...rest
}: BadgeProps) {
  if (dot) {
    return (
      <span
        role="status"
        className={cn('inline-block h-2 w-2 rounded-full', dotColors[variant], className)}
        {...rest}
      />
    );
  }

  let content: ReactNode = children;
  if (typeof count === 'number') {
    content = count > max ? `${max}+` : String(count);
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5',
        'text-caption font-medium leading-none',
        variants[variant],
        className,
      )}
      {...rest}
    >
      {icon}
      {content}
    </span>
  );
}
