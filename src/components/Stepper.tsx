import { ReactNode } from 'react';
import { Check } from 'lucide-react';
import { cn } from '../lib/cn';

/**
 * Stepper — progresso por etapas em fluxos multi-passo (onboarding, checkout).
 *
 * `current` é o índice (0-based) da etapa ativa. Etapas antes dela contam como
 * concluídas; depois, como pendentes.
 *
 * Passe `onStepClick` só quando a navegação para trás for permitida — sem ele
 * os passos renderizam como texto, não como botão, e não viram alvo de clique.
 *
 * @example
 * <Stepper
 *   current={1}
 *   steps={[
 *     { label: 'Conta', description: 'Dados de acesso' },
 *     { label: 'Workspace' },
 *     { label: 'Equipe' },
 *   ]}
 * />
 */

export interface Step {
  label: ReactNode;
  description?: ReactNode;
  /** Substitui o número do círculo. Ignorado quando a etapa está concluída. */
  icon?: ReactNode;
}

interface StepperProps {
  steps: Step[];
  /** Índice 0-based da etapa atual. */
  current: number;
  orientation?: 'horizontal' | 'vertical';
  /** Habilita clique nas etapas. Recebe o índice. */
  onStepClick?: (index: number) => void;
  /** Permite clicar em etapas futuras. Default: só concluídas e a atual. */
  allowFuture?: boolean;
  className?: string;
}

type State = 'complete' | 'current' | 'upcoming';

const circleStates: Record<State, string> = {
  complete: 'bg-primary-500 text-text-onPrimary border-primary-500',
  current:  'bg-surface-elevated text-primary-onSoft border-primary-500 ring-2 ring-primary-500/30',
  upcoming: 'bg-surface-elevated text-text-tertiary border-border-strong',
};

const labelStates: Record<State, string> = {
  complete: 'text-text-secondary',
  current:  'text-text-primary font-semibold',
  upcoming: 'text-text-tertiary',
};

export function Stepper({
  steps,
  current,
  orientation = 'horizontal',
  onStepClick,
  allowFuture = false,
  className,
}: StepperProps) {
  const isVertical = orientation === 'vertical';

  function stateOf(i: number): State {
    if (i < current) return 'complete';
    if (i === current) return 'current';
    return 'upcoming';
  }

  return (
    <ol
      className={cn(
        isVertical ? 'flex flex-col' : 'flex items-start',
        className,
      )}
      aria-label="Progresso das etapas"
    >
      {steps.map((step, i) => {
        const state = stateOf(i);
        const isLast = i === steps.length - 1;
        const clickable = Boolean(onStepClick) && (allowFuture || i <= current);

        const circle = (
          <span
            className={cn(
              'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
              'border text-sm font-medium transition-colors',
              circleStates[state],
            )}
          >
            {state === 'complete' ? (
              <Check className="h-4 w-4" aria-hidden />
            ) : (
              step.icon ?? i + 1
            )}
          </span>
        );

        const text = (
          <span className={cn('block', isVertical ? 'pb-8' : 'mt-2')}>
            <span className={cn('block text-sm', labelStates[state])}>{step.label}</span>
            {step.description && (
              <span className="mt-0.5 block text-caption text-text-tertiary">{step.description}</span>
            )}
          </span>
        );

        // A linha conectora liga esta etapa à próxima; herda a cor de "concluído".
        const connector = !isLast && (
          <span
            aria-hidden
            className={cn(
              'block transition-colors',
              state === 'complete' ? 'bg-primary-500' : 'bg-border',
              isVertical
                ? 'absolute left-4 top-8 bottom-0 w-px -translate-x-1/2'
                : 'mt-4 h-px flex-1',
            )}
          />
        );

        const body = isVertical ? (
          <span className="flex gap-4">
            {circle}
            {text}
          </span>
        ) : (
          <span className="flex flex-col items-center text-center">
            {circle}
            {text}
          </span>
        );

        return (
          <li
            key={i}
            aria-current={state === 'current' ? 'step' : undefined}
            className={cn(
              'relative',
              isVertical ? 'pb-0' : 'flex flex-1 items-start last:flex-none',
            )}
          >
            {isVertical && connector}

            {clickable ? (
              <button
                type="button"
                onClick={() => onStepClick?.(i)}
                className={cn(
                  'rounded-md text-left transition-opacity hover:opacity-80',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base',
                  !isVertical && 'w-32',
                )}
              >
                {body}
              </button>
            ) : (
              <span className={cn('block', !isVertical && 'w-32')}>{body}</span>
            )}

            {!isVertical && connector}
          </li>
        );
      })}
    </ol>
  );
}
