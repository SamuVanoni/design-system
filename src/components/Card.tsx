import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';

/**
 * Card composicional.
 * Uso:
 *   <Card>
 *     <Card.Header title="..." description="..." action={...} />
 *     <Card.Body>...</Card.Body>
 *     <Card.Footer>...</Card.Footer>
 *   </Card>
 */

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

function CardRoot({ className, interactive, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-surface-elevated shadow-sm',
        interactive &&
          'transition-colors duration-fast hover:border-border-strong focus-within:border-primary-500 cursor-pointer',
        className,
      )}
      {...rest}
    />
  );
}

// Omit do `title` nativo: o do DOM e string, aqui aceita ReactNode.
interface CardHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}

function CardHeader({ title, description, action, className, children, ...rest }: CardHeaderProps) {
  return (
    <div
      className={cn(
        'flex items-start justify-between gap-4 border-b border-border-subtle px-6 py-4',
        className,
      )}
      {...rest}
    >
      <div className="min-w-0 flex-1">
        {title && <h3 className="text-h3 text-text-primary truncate">{title}</h3>}
        {description && (
          <p className="mt-1 text-caption text-text-tertiary">{description}</p>
        )}
        {children}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

function CardBody({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('px-6 py-4 text-text-secondary', className)} {...rest} />;
}

function CardFooter({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex items-center justify-end gap-2 border-t border-border-subtle px-6 py-3',
        className,
      )}
      {...rest}
    />
  );
}

export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
});
