import { HTMLAttributes } from 'react';
import { cn } from '../lib/cn';

type Tone = 'default' | 'error' | 'success';

interface HelperTextProps extends HTMLAttributes<HTMLParagraphElement> {
  tone?: Tone;
}

const tones: Record<Tone, string> = {
  default: 'text-text-tertiary',
  error:   'text-error',
  success: 'text-success',
};

export function HelperText({ tone = 'default', className, children, ...rest }: HelperTextProps) {
  return (
    <p className={cn('text-caption', tones[tone], className)} {...rest}>
      {children}
    </p>
  );
}
