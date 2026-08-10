import { Children, ReactElement, ReactNode, cloneElement, isValidElement } from 'react';
import * as RA from '@radix-ui/react-avatar';
import { cn } from '../lib/cn';

/**
 * Avatar — imagem de usuário com fallback automático para iniciais.
 * O Radix cuida da máquina de estados de carregamento da imagem: se `src`
 * falhar ou demorar, o fallback entra sozinho (sem imagem quebrada).
 *
 * @example
 * <Avatar name="Ana Souza" src="/ana.jpg" size="md" status="online" />
 * <Avatar name="Bruno Lima" />              // só iniciais
 * <Avatar icon={<Building2 />} size="lg" /> // fallback com ícone
 *
 * @example Empilhados
 * <AvatarGroup max={3} size="sm">
 *   <Avatar name="Ana Souza" />
 *   <Avatar name="Bruno Lima" />
 *   <Avatar name="Carla Dias" />
 *   <Avatar name="Diego Reis" />
 * </AvatarGroup>
 */

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type Status = 'online' | 'offline' | 'busy' | 'away';

export interface AvatarProps {
  /** URL da imagem. Se ausente ou quebrada, cai no fallback. */
  src?: string;
  alt?: string;
  /** Nome completo — vira as iniciais do fallback e o alt padrão. */
  name?: string;
  size?: Size;
  /** Indicador de presença no canto inferior direito. */
  status?: Status;
  /** Fallback customizado quando não há `name` (ex.: ícone de empresa). */
  icon?: ReactNode;
  /** Usado pelo AvatarGroup para separar avatares sobrepostos. */
  ring?: boolean;
  className?: string;
}

const sizes: Record<Size, string> = {
  xs: 'h-6  w-6  text-[0.625rem]',
  sm: 'h-8  w-8  text-caption',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-subtitle',
};

const statusSizes: Record<Size, string> = {
  xs: 'h-1.5 w-1.5',
  sm: 'h-2   w-2',
  md: 'h-2.5 w-2.5',
  lg: 'h-3   w-3',
  xl: 'h-4   w-4',
};

const statusColors: Record<Status, string> = {
  online:  'bg-success',
  offline: 'bg-text-disabled',
  busy:    'bg-error',
  away:    'bg-warning',
};

const statusLabels: Record<Status, string> = {
  online:  'Online',
  offline: 'Offline',
  busy:    'Ocupado',
  away:    'Ausente',
};

const iconSizes: Record<Size, string> = {
  xs: '[&_svg]:h-3   [&_svg]:w-3',
  sm: '[&_svg]:h-3.5 [&_svg]:w-3.5',
  md: '[&_svg]:h-4   [&_svg]:w-4',
  lg: '[&_svg]:h-5   [&_svg]:w-5',
  xl: '[&_svg]:h-6   [&_svg]:w-6',
};

/** "Ana Maria Souza" -> "AS". Ignora conectivos e pega primeira + última palavra. */
function initialsFrom(name: string): string {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter((p) => p.length > 1 || /^[A-ZÀ-Ý]/.test(p));
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Avatar({
  src,
  alt,
  name,
  size = 'md',
  status,
  icon,
  ring = false,
  className,
}: AvatarProps) {
  const label = alt ?? name ?? 'Avatar';

  return (
    <span className={cn('relative inline-flex shrink-0', className)}>
      <RA.Root
        className={cn(
          'inline-flex select-none items-center justify-center overflow-hidden rounded-full',
          'bg-surface-overlay align-middle',
          ring && 'ring-2 ring-surface-base',
          sizes[size],
        )}
      >
        {src && (
          <RA.Image src={src} alt={label} className="h-full w-full object-cover" />
        )}
        <RA.Fallback
          // Sem delay: em listas grandes, piscar o vazio é pior que trocar depois.
          className={cn(
            'flex h-full w-full items-center justify-center font-medium',
            'text-text-secondary',
            iconSizes[size],
          )}
        >
          {name ? initialsFrom(name) : icon ?? '?'}
        </RA.Fallback>
      </RA.Root>

      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full ring-2 ring-surface-base',
            statusSizes[size],
            statusColors[status],
          )}
          role="img"
          aria-label={statusLabels[status]}
        />
      )}
    </span>
  );
}

/* ============================================================
   AvatarGroup
   ============================================================ */

interface AvatarGroupProps {
  children: ReactNode;
  /** Quantos avatares mostrar antes de resumir em "+N". */
  max?: number;
  /** Aplicado a todos os filhos — não repita `size` em cada Avatar. */
  size?: Size;
  className?: string;
}

const overlap: Record<Size, string> = {
  xs: '-ml-1.5',
  sm: '-ml-2',
  md: '-ml-2.5',
  lg: '-ml-3',
  xl: '-ml-4',
};

export function AvatarGroup({ children, max = 4, size = 'md', className }: AvatarGroupProps) {
  const all = Children.toArray(children).filter(isValidElement);
  const visible = all.slice(0, max);
  const hidden = all.length - visible.length;

  return (
    <div className={cn('flex items-center', className)}>
      {visible.map((child, i) => (
        <span key={child.key ?? i} className={i > 0 ? overlap[size] : undefined}>
          {cloneElement(child as ReactElement<AvatarProps>, { size, ring: true })}
        </span>
      ))}

      {hidden > 0 && (
        <span className={overlap[size]}>
          <span
            className={cn(
              'inline-flex items-center justify-center rounded-full font-medium',
              'bg-surface-overlay text-text-secondary ring-2 ring-surface-base',
              sizes[size],
            )}
            aria-label={`Mais ${hidden}`}
          >
            +{hidden}
          </span>
        </span>
      )}
    </div>
  );
}
