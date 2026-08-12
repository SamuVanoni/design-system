import { ReactNode } from 'react';
import { cn } from '../lib/cn';

/**
 * ProgressBar / CircularProgress — progresso determinado ou indeterminado.
 *
 * Use quando você sabe (ou pode estimar) o quanto falta. Se não sabe e a espera
 * é curta, use `Spinner`; se está carregando um layout inteiro, use `Skeleton`.
 *
 * @example
 * <ProgressBar value={62} label="Enviando arquivos" showValue />
 * <ProgressBar indeterminate label="Processando..." />
 * <CircularProgress value={80} tone="success" showValue />
 */

type Tone = 'primary' | 'success' | 'warning' | 'error' | 'info';
type BarSize = 'sm' | 'md' | 'lg';

/**
 * -graphic, nao a cor base. Barra e anel sao GRAFICO: valem os 3:1 da 1.4.11,
 * e o vizinho que conta nao e o card — e o trilho (`surface-muted`), logo
 * atras. As cores base reprovavam ate esse limite no tema claro (verde 2,07:1
 * e ambar 1,95:1 contra o trilho: a barra praticamente sumia), e o proprio
 * tom padrao reprovava no escuro (verdigris 500 x trilho = 2,39:1).
 * Ver --fb-*-graphic em variables.css.
 */
const barTones: Record<Tone, string> = {
  primary: 'bg-primary-graphic',
  success: 'bg-success-graphic',
  warning: 'bg-warning-graphic',
  error:   'bg-error-graphic',
  info:    'bg-info-graphic',
};

const strokeTones: Record<Tone, string> = {
  primary: 'text-primary-graphic',
  success: 'text-success-graphic',
  warning: 'text-warning-graphic',
  error:   'text-error-graphic',
  info:    'text-info-graphic',
};

const barSizes: Record<BarSize, string> = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

function clampPercent(value: number, max: number): number {
  if (max <= 0) return 0;
  return Math.min(100, Math.max(0, (value / max) * 100));
}

/* ============================================================
   ProgressBar
   ============================================================ */

interface ProgressBarProps {
  /** Valor atual. Ignorado quando `indeterminate`. */
  value?: number;
  max?: number;
  size?: BarSize;
  tone?: Tone;
  label?: ReactNode;
  /** Mostra a porcentagem à direita do label. */
  showValue?: boolean;
  /** Progresso desconhecido — faixa animada percorrendo o trilho. */
  indeterminate?: boolean;
  className?: string;
}

export function ProgressBar({
  value = 0,
  max = 100,
  size = 'md',
  tone = 'primary',
  label,
  showValue = false,
  indeterminate = false,
  className,
}: ProgressBarProps) {
  const percent = clampPercent(value, max);

  return (
    <div className={cn('w-full', className)}>
      {(label || showValue) && (
        <div className="mb-2 flex items-baseline justify-between gap-4">
          {label && <span className="text-sm text-text-secondary">{label}</span>}
          {showValue && !indeterminate && (
            <span className="text-caption font-medium tabular-nums text-text-primary">
              {Math.round(percent)}%
            </span>
          )}
        </div>
      )}

      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        // Indeterminado omite valuenow — é assim que o leitor de tela
        // anuncia "carregando" em vez de uma porcentagem inventada.
        aria-valuenow={indeterminate ? undefined : value}
        aria-label={typeof label === 'string' ? label : undefined}
        className={cn('w-full overflow-hidden rounded-full bg-surface-muted', barSizes[size])}
      >
        {indeterminate ? (
          <div
            className={cn(
              'ds-indeterminate h-full w-1/4 rounded-full animate-progress-indeterminate',
              barTones[tone],
            )}
          />
        ) : (
          <div
            className={cn('h-full rounded-full transition-all duration-base', barTones[tone])}
            style={{ width: `${percent}%` }}
          />
        )}
      </div>
    </div>
  );
}

/* ============================================================
   CircularProgress
   ============================================================ */

interface CircularProgressProps {
  value?: number;
  max?: number;
  /** Diâmetro em px. Default 64. */
  size?: number;
  /** Espessura do traço em px. Default 6. */
  thickness?: number;
  tone?: Tone;
  /** Mostra a porcentagem no centro. */
  showValue?: boolean;
  /** Conteúdo custom no centro (sobrepõe `showValue`). */
  children?: ReactNode;
  label?: string;
  indeterminate?: boolean;
  className?: string;
}

export function CircularProgress({
  value = 0,
  max = 100,
  size = 64,
  thickness = 6,
  tone = 'primary',
  showValue = false,
  children,
  label,
  indeterminate = false,
  className,
}: CircularProgressProps) {
  const percent = clampPercent(value, max);
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  // Indeterminado: arco fixo de ~25% girando.
  const dash = indeterminate ? circumference * 0.25 : (percent / 100) * circumference;

  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={indeterminate ? undefined : value}
      aria-label={label}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className={cn(indeterminate && 'ds-spin animate-spin')}
        aria-hidden
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={thickness}
          className="stroke-surface-muted"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
          // Começa no topo em vez de às 3 horas.
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className={cn(
            'stroke-current',
            strokeTones[tone],
            !indeterminate && 'transition-all duration-base',
          )}
        />
      </svg>

      {(children || (showValue && !indeterminate)) && (
        <span className="absolute inset-0 flex items-center justify-center">
          {children ?? (
            <span className="text-sm font-semibold tabular-nums text-text-primary">
              {Math.round(percent)}%
            </span>
          )}
        </span>
      )}
    </div>
  );
}
