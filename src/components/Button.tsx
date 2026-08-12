import { ButtonHTMLAttributes, ReactNode, forwardRef } from 'react';
import { Loader2, Info } from 'lucide-react';
import { cn } from '../lib/cn';

/**
 * Button
 * Variantes:
 *  - primary   (sólido neutro que inverte por tema — navy no claro, claro no escuro.
 *               NÃO usa o acento da marca: desde v0.5.0 ele significa só estado,
 *               não ação. Ver --action-* em variables.css.)
 *  - secondary (contorno neutro, ações alternativas)
 *  - info      (discreta: fundo cinza translúcido + ícone "i" azul — avisos e dicas,
 *               sem competir com primary/secondary. O ícone é injetado automaticamente;
 *               passe `leftIcon` para sobrescrever ou `leftIcon={null}` para remover.)
 *  - ghost     (sem fundo)
 *  - danger    (vermelho sólido, ações destrutivas: excluir/confirmar exclusão)
 * Tamanhos: sm | md | lg
 * Estados nativos: hover, active, focus-visible, disabled + loading.
 *
 * ENCAMINHA REF (desde v0.7.1). É o que permite usá-lo como gatilho de
 * `Tooltip`, `Dropdown`, `Popover` e `Select` do Radix, que posicionam o painel
 * a partir do nó real e por isso exigem ref no filho de `asChild`. Sem isso o
 * consumidor era obrigado a copiar a receita da variante num `<button>` na mão —
 * cópia que desandava calada assim que a variante mudava.
 *
 * @example
 * <Button variant="info" size="sm">Este relatório atualiza a cada 24h</Button>
 * @example
 * <Tooltip content="Mostrar CPF">
 *   <Button variant="secondary" aria-label="Mostrar CPF"><Eye /></Button>
 * </Tooltip>
 */

type Variant = 'primary' | 'secondary' | 'info' | 'ghost' | 'danger';
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
    'bg-action text-text-onAction hover:bg-action-hover active:bg-action-active ' +
    'focus-visible:ring-primary-500',
  secondary:
    'bg-transparent text-text-primary border border-border ' +
    'hover:bg-surface-muted active:bg-surface-mutedHover ' +
    'focus-visible:ring-primary-500',
  info:
    'bg-surface-muted text-text-onMuted font-normal hover:bg-surface-mutedHover active:bg-surface-mutedHover ' +
    'focus-visible:ring-info',
  ghost:
    'bg-transparent text-text-primary hover:bg-surface-elevated active:bg-surface-mutedHover ' +
    'focus-visible:ring-primary-500',
  danger:
    // `bg-danger`, nao `bg-error`: o error e a cor de ESTADO (borda de campo
    // invalido, ponto do Badge) e tem um valor so; o preenchimento destrutivo
    // inverte por tema para nao perder nem o rotulo nem a silhueta.
    // Tambem nao usa mais hover:opacity — mexer na opacidade do botao inteiro
    // desbota o rotulo junto e derruba o contraste no hover.
    'bg-danger text-text-onDanger hover:bg-danger-hover active:bg-danger-active ' +
    'focus-visible:ring-error',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
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
  },
  ref,
) {
  // `info` traz o ícone de informação por padrão — é o que dá a leitura de "aviso".
  const icon =
    leftIcon === undefined && variant === 'info'
      ? <Info className="h-4 w-4 shrink-0 text-info-onSoft" aria-hidden />
      : leftIcon;

  return (
    <button
      ref={ref}
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
});
