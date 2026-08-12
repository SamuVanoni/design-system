import { HTMLAttributes } from 'react';
import { cn } from '../lib/cn';

type Tone = 'default' | 'error' | 'success';

interface HelperTextProps extends HTMLAttributes<HTMLParagraphElement> {
  tone?: Tone;
}

/**
 * `-onSoft`, nao a cor base. `--color-error` e `--color-success` sao cores de
 * ESTADO (borda de campo invalido, ponto, barra) e tem UM valor para os dois
 * temas — como texto elas reprovam AA em pelo menos um deles:
 *   error   3,68:1 no escuro | 3,76:1 no claro
 *   success 6,08:1 no escuro | 2,28:1 no claro  <- verde sobre branco e o pior
 * Os `-onSoft` sao os mesmos tons calibrados por tema para carregar texto:
 *   error   5,01 / 6,47      success 7,95 / 5,02
 * O nome diz "onSoft" por causa da origem, mas o papel do token e "esta cor de
 * feedback quando ela e TEXTO" — vale sobre qualquer superficie, nao so a soft.
 */
const tones: Record<Tone, string> = {
  default: 'text-text-tertiary',
  error:   'text-error-onSoft',
  success: 'text-success-onSoft',
};

export function HelperText({ tone = 'default', className, children, ...rest }: HelperTextProps) {
  return (
    <p className={cn('text-caption', tones[tone], className)} {...rest}>
      {children}
    </p>
  );
}
