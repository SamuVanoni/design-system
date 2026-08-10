import { CSSProperties, HTMLAttributes } from 'react';
import { cn } from '../lib/cn';

/**
 * Skeleton — placeholder animado para conteúdo em carregamento.
 *
 * Uso:
 *   <Skeleton width="60%" height={16} />
 *   <Skeleton circle size={40} />
 *   <div className="space-y-2">
 *     <Skeleton height={20} width="40%" />
 *     <Skeleton height={12} />
 *     <Skeleton height={12} width="80%" />
 *   </div>
 *
 * Cor calibrada por tema via CSS var (`--skeleton-base` / `--skeleton-shine`).
 * Animação desativa automaticamente quando o usuário preferir reduced-motion.
 */

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  width?: number | string;
  height?: number | string;
  /** Atalho: círculo de tamanho `size` (usa width=height=size, rounded-full). */
  circle?: boolean;
  size?: number | string;
  /** Desliga a animação de shimmer (usa cor fixa). */
  static?: boolean;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
}

const roundedClass = {
  none: 'rounded-none',
  sm:   'rounded-sm',
  md:   'rounded-md',
  lg:   'rounded-lg',
  full: 'rounded-full',
} as const;

export function Skeleton({
  width,
  height,
  circle = false,
  size,
  static: isStatic = false,
  rounded = 'md',
  className,
  style,
  ...rest
}: SkeletonProps) {
  const finalWidth  = circle ? size ?? width ?? 40 : width;
  const finalHeight = circle ? size ?? height ?? 40 : height ?? '1rem';
  const shape = circle ? 'rounded-full' : roundedClass[rounded];

  const inline: CSSProperties = {
    width: typeof finalWidth === 'number' ? `${finalWidth}px` : finalWidth,
    height: typeof finalHeight === 'number' ? `${finalHeight}px` : finalHeight,
    backgroundColor: 'var(--skeleton-base)',
    ...(isStatic
      ? {}
      : {
          backgroundImage:
            'linear-gradient(90deg, transparent 0%, var(--skeleton-shine) 50%, transparent 100%)',
          backgroundSize: '200% 100%',
        }),
    ...style,
  };

  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      className={cn('inline-block align-middle', shape, !isStatic && 'ds-shimmer animate-shimmer', className)}
      style={inline}
      {...rest}
    />
  );
}
