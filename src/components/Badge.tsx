import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';

/**
 * Badge
 * - `variant`: cor semântica.
 * - `count`: número. Truncado com `max` (default 99+). Substitui children.
 * - `dot`: pequeno círculo colorido SOZINHO, sem cápsula nem texto.
 * - `solid`: cápsula PREENCHIDA, para o contador que precisa puxar o olho.
 *
 * `solid` existe porque a cápsula translúcida é a resposta certa para status
 * DENTRO de conteúdo (um "Vencido" numa coluna de tabela, onde discrição é o
 * ponto) e a resposta errada para um contador GRUDADO num ícone — sino, aba,
 * item de menu. Ali o badge não descreve uma linha, ele interrompe: fundo pálido
 * com contorno lê como decoração, e o número que ninguém vê não avisa ninguém.
 * Com `count`, o `solid` também aperta a geometria para um círculo de 20px, que
 * é a forma que todo contador quer e que senão cada consumidor rederiva.
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
  solid?: boolean;
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

/**
 * -graphic, nao a cor base. O marcador e um circulo de 8px, e no modo `dot` ele
 * fica sozinho na tela — nao ha rotulo do lado para socorrer, entao carrega o
 * significado inteiro e vale a 1.4.11 (>= 3:1). Reprovavam: success 2,28:1 e
 * warning 2,15:1 no claro, e o `primary` 2,88:1 no escuro (verdigris 500
 * contra o card navy). Ver --fb-*-graphic em variables.css.
 *
 * Serve aos TRES desenhos do componente — o `dot`, o marcador da cápsula e o
 * preenchimento do `solid` — porque nos tres a cor e desenho, nao texto nem
 * estado. Conteudo por cima do preenchimento usa `text-text-onGraphic`, que e o
 * par documentado do `-graphic` (v0.7.7) e inverte junto com ele.
 */
const preenchimentoGrafico: Record<Variant, string> = {
  default: 'bg-text-tertiary',
  primary: 'bg-primary-graphic',
  success: 'bg-success-graphic',
  warning: 'bg-warning-graphic',
  error:   'bg-error-graphic',
  info:    'bg-info-graphic',
};

export function Badge({
  variant = 'default',
  count,
  max = 99,
  dot = false,
  solid = false,
  icon,
  className,
  children,
  ...rest
}: BadgeProps) {
  if (dot) {
    return (
      <span
        role="status"
        className={cn('inline-block h-2 w-2 rounded-full', preenchimentoGrafico[variant], className)}
        {...rest}
      />
    );
  }

  let content: ReactNode = children;
  if (typeof count === 'number') {
    content = count > max ? `${max}+` : String(count);
  }

  // Suprime o marcador quando já existe outro elemento à esquerda (ícone), quando
  // o badge é um contador (uma bolinha antes de "12" vira ruído) ou quando é
  // `solid` — ali a cápsula inteira JÁ É a cor, e o marcador sumiria dentro dela.
  const marcador =
    COM_MARCADOR.has(variant) && typeof count !== 'number' && !icon && !solid;

  // O contador sólido vira círculo: 20px de lado, número centrado, e cresce em
  // largura sozinho quando chega em "9+". `min-w` e não `w` porque "99+" não pode
  // vazar por fora da cápsula.
  const contadorSolido = solid && typeof count === 'number';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5',
        'text-caption font-medium leading-none',
        solid
          ? cn(preenchimentoGrafico[variant], 'text-text-onGraphic font-semibold')
          : variants[variant],
        contadorSolido && 'h-5 min-w-5 justify-center px-1.5',
        className,
      )}
      {...rest}
    >
      {marcador && (
        <span
          className={cn('h-1.5 w-1.5 shrink-0 rounded-full', preenchimentoGrafico[variant])}
          aria-hidden
        />
      )}
      {icon}
      {content}
    </span>
  );
}
