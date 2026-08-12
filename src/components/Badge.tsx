import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';

/**
 * Badge
 * - `variant`: cor semântica.
 * - `count`: número. Truncado com `max` (default 99+). Substitui children.
 * - `dot`: pequeno círculo colorido SOZINHO, sem cápsula nem texto.
 *
 * Cor por severidade (v0.6.0): a cápsula só é colorida quando o estado **exige
 * ação** — `error` e `warning`. `success` e `info` viram cápsula neutra com um
 * marcador colorido, porque "deu certo" e "informativo" não precisam puxar o
 * olho. Antes toda variante pintava um bloco e uma coluna inteira de status
 * ficava colorida, o que fazia um erro real não saltar mais que o resto.
 *
 * As cápsulas coloridas são translúcidas (`/12`, `/16`) em vez dos fundos
 * `-soft` opacos: no tema escuro o `-soft` é um bloco escuro saturado que sobre
 * o navy vira mancha, e o texto em cima dele reprovava AA (3,62:1 no error,
 * 4,07:1 no info). Translúcido compõe com o fundo e passa nos dois temas.
 */

type Variant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
  count?: number;
  max?: number;
  dot?: boolean;
  icon?: ReactNode;
}

const NEUTRA = 'bg-surface-muted text-text-secondary border border-border';

const variants: Record<Variant, string> = {
  default: 'bg-surface-muted text-text-primary border border-border',
  primary: 'bg-primary-500/15 text-primary-onSoft border border-primary-500/30',
  success: NEUTRA,
  info:    NEUTRA,
  warning: 'bg-warning/12 text-warning-onSoft border border-warning/35',
  error:   'bg-error/16 text-error-onSoft border border-error/40',
};

/** Variantes cuja cor vive no marcador; sem ele o tom ficaria ilegível. */
const COM_MARCADOR: ReadonlySet<Variant> = new Set<Variant>([
  'success', 'info', 'warning', 'error',
]);

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

  // Suprime o marcador quando já existe outro elemento à esquerda (ícone) ou
  // quando o badge é um contador — uma bolinha antes de "12" vira ruído.
  const marcador = COM_MARCADOR.has(variant) && typeof count !== 'number' && !icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5',
        'text-caption font-medium leading-none',
        variants[variant],
        className,
      )}
      {...rest}
    >
      {marcador && (
        <span
          className={cn('h-1.5 w-1.5 shrink-0 rounded-full', dotColors[variant])}
          aria-hidden
        />
      )}
      {icon}
      {content}
    </span>
  );
}
