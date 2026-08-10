import { Loader2 } from 'lucide-react';
import { cn } from '../lib/cn';

/**
 * Spinner — indicador de carregamento circular.
 *
 * Uso:
 *   <Spinner />                      // md, cor herda do texto (currentColor)
 *   <Spinner size="sm" tone="primary" />
 *   <Spinner label="Carregando..." /> // adiciona texto visualmente oculto para SR
 *
 * O componente propriamente dito não centraliza — use como filho de qualquer
 * container flex/grid. Cor por padrão é `currentColor` (herda do texto do pai).
 */

type Size = 'sm' | 'md' | 'lg';
type Tone = 'default' | 'primary' | 'onPrimary' | 'muted';

interface SpinnerProps {
  size?: Size;
  tone?: Tone;
  /** Rótulo p/ leitores de tela. Se omitido, o role="status" continua ativo. */
  label?: string;
  className?: string;
}

const sizes: Record<Size, string> = {
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-6 w-6',
};

const tones: Record<Tone, string> = {
  default:    'text-text-primary',
  primary:    'text-primary-500',
  onPrimary:  'text-text-onPrimary',
  muted:      'text-text-tertiary',
};

export function Spinner({ size = 'md', tone = 'default', label, className }: SpinnerProps) {
  return (
    <span role="status" aria-live="polite" className={cn('inline-flex', className)}>
      <Loader2
        aria-hidden
        className={cn('animate-spin ds-spin', sizes[size], tones[tone])}
      />
      {label && <span className="sr-only">{label}</span>}
    </span>
  );
}

/**
 * SpinnerOverlay — sobrepõe um Card/Section com um spinner centralizado.
 * Uso: coloque como filho absoluto de um container `relative`.
 *
 *   <div className="relative">
 *     ...conteúdo...
 *     {loading && <SpinnerOverlay label="Carregando dados" />}
 *   </div>
 */
interface OverlayProps {
  label?: string;
  size?: Size;
  className?: string;
  /** Se true, escurece o container (usa backdrop token). */
  dim?: boolean;
}

export function SpinnerOverlay({ label = 'Carregando', size = 'lg', className, dim = true }: OverlayProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'absolute inset-0 z-10 flex items-center justify-center rounded-[inherit]',
        dim && 'bg-backdrop',
        className,
      )}
    >
      <Spinner size={size} tone="primary" label={label} />
    </div>
  );
}
