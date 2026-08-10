import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2, Info } from 'lucide-react';
import { cn } from '../lib/cn';

/**
 * Button
 * Variantes:
 *  - primary   (cobre, CTA principal)
 *  - secondary (cobre oxidado, ações alternativas)
 *  - info      (discreta: fundo cinza translúcido + ícone "i" azul — avisos e dicas,
 *               sem competir com primary/secondary. O ícone é injetado automaticamente;
 *               passe `leftIcon` para sobrescrever ou `leftIcon={null}` para remover.)
 *  - ghost     (sem fundo)
 * Tamanhos: sm | md | lg
 * Estados nativos: hover, active, focus-visible, disabled + loading.
 *
 * @example
 * <Button variant="info" size="sm">Este relatório atualiza a cada 24h</Button>
 */

type Variant = 'primary' | 'secondary' | 'info' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const base =
  'inline-flex items-center justify-center gap-2 font-medium rounded-md ' +
  'transition-colors duration-fast ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base ' +
  'disabled:opacity-40 disabled:cursor-not-allowed';

const sizes: Record<Size, string> = {
  sm: 'h-8  px-3 text-sm',
  md: 'h-10 px-4 text-base',
  lg: 'h-12 px-6 text-base',
};

const variants: Record<Variant, string> = {
  primary:
    'bg-primary-500 text-text-onPrimary hover:bg-primary-400 active:bg-primary-600 ' +
    'focus-visible:ring-primary-500',
  secondary:
    'bg-secondary-500 text-text-onSecondary hover:bg-secondary-400 active:bg-secondary-600 ' +
    'focus-visible:ring-secondary-500',
  info:
    'bg-surface-muted text-text-onMuted font-normal hover:bg-surface-mutedHover active:bg-surface-mutedHover ' +
    'focus-visible:ring-info',
  ghost:
    'bg-transparent text-text-primary hover:bg-surface-elevated active:bg-surface-overlay ' +
    'focus-visible:ring-primary-500',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  // `info` traz o ícone de informação por padrão — é o que dá a leitura de "aviso".
  const icon =
    leftIcon === undefined && variant === 'info'
      ? <Info className="h-4 w-4 shrink-0 text-info-onSoft" aria-hidden />
      : leftIcon;

  return (
    <button
      className={cn(base, sizes[size], variants[variant], fullWidth && 'w-full', className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : icon}
      <span>{children}</span>
      {!loading && rightIcon}
    </button>
  );
}
