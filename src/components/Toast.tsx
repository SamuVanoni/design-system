import {
  createContext, useCallback, useContext, useMemo, useRef, useState, ReactNode,
} from 'react';
import * as RToast from '@radix-ui/react-toast';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '../lib/cn';

/**
 * Toast — provider global + hook.
 *
 * Setup (uma vez, na raiz):
 *   <ToastProvider>
 *     <App />
 *   </ToastProvider>
 *
 * Uso em qualquer componente descendente:
 *   const toast = useToast();
 *   toast.success('Salvo!');
 *   toast.error('Falha ao salvar', { description: 'Tente novamente.' });
 *   toast.custom({ title: '...', description: '...', variant: 'info', duration: 6000 });
 */

type Variant = 'default' | 'success' | 'error' | 'warning' | 'info';

interface ToastOptions {
  description?: string;
  duration?: number;   // ms; default 4000
  variant?: Variant;
}

interface ToastItem {
  id: number;
  title: string;
  description?: string;
  variant: Variant;
  duration: number;
}

interface ToastApi {
  default: (title: string, opts?: Omit<ToastOptions, 'variant'>) => void;
  success: (title: string, opts?: Omit<ToastOptions, 'variant'>) => void;
  error:   (title: string, opts?: Omit<ToastOptions, 'variant'>) => void;
  warning: (title: string, opts?: Omit<ToastOptions, 'variant'>) => void;
  info:    (title: string, opts?: Omit<ToastOptions, 'variant'>) => void;
  custom:  (t: { title: string } & ToastOptions) => void;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

const variantIcon: Record<Variant, ReactNode> = {
  default: null,
  success: <CheckCircle2 className="h-4 w-4 text-success-onSoft" />,
  error:   <XCircle className="h-4 w-4 text-error-onSoft" />,
  warning: <AlertTriangle className="h-4 w-4 text-warning-onSoft" />,
  info:    <Info className="h-4 w-4 text-info-onSoft" />,
};

const variantAccent: Record<Variant, string> = {
  default: 'border-border',
  success: 'border-success/40',
  error:   'border-error/40',
  warning: 'border-warning/40',
  info:    'border-info/40',
};

export function ToastProvider({
  children,
  swipeDirection = 'right',
}: {
  children: ReactNode;
  swipeDirection?: 'right' | 'left' | 'up' | 'down';
}) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const push = useCallback((t: Omit<ToastItem, 'id'>) => {
    idRef.current += 1;
    setItems((prev) => [...prev, { ...t, id: idRef.current }]);
  }, []);

  const dismiss = useCallback(
    (id: number) => setItems((prev) => prev.filter((t) => t.id !== id)),
    [],
  );

  const api = useMemo<ToastApi>(() => {
    const make = (variant: Variant) =>
      (title: string, opts: Omit<ToastOptions, 'variant'> = {}) =>
        push({ title, description: opts.description, duration: opts.duration ?? 4000, variant });
    return {
      default: make('default'),
      success: make('success'),
      error:   make('error'),
      warning: make('warning'),
      info:    make('info'),
      custom: ({ title, description, variant = 'default', duration = 4000 }) =>
        push({ title, description, variant, duration }),
      dismiss,
    };
  }, [push, dismiss]);

  return (
    <ToastContext.Provider value={api}>
      <RToast.Provider swipeDirection={swipeDirection}>
        {children}
        {items.map((t) => (
          <RToast.Root
            key={t.id}
            duration={t.duration}
            onOpenChange={(open) => { if (!open) dismiss(t.id); }}
            className={cn(
              'grid grid-cols-[auto_1fr_auto] items-start gap-3',
              'rounded-md border bg-surface-elevated p-3 shadow-lg',
              'text-text-primary',
              variantAccent[t.variant],
              'data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:slide-in-from-right-4',
              'data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:slide-out-to-right-4',
            )}
          >
            <div className="pt-0.5">{variantIcon[t.variant] ?? <span className="block h-4 w-4" />}</div>
            <div className="min-w-0">
              <RToast.Title className="text-sm font-medium truncate">{t.title}</RToast.Title>
              {t.description && (
                <RToast.Description className="mt-0.5 text-caption text-text-tertiary">
                  {t.description}
                </RToast.Description>
              )}
            </div>
            <RToast.Close
              aria-label="Fechar"
              className={cn(
                'inline-flex h-6 w-6 items-center justify-center rounded text-text-tertiary',
                'hover:bg-surface-overlay hover:text-text-primary transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
              )}
            >
              <X className="h-3.5 w-3.5" />
            </RToast.Close>
          </RToast.Root>
        ))}
        <RToast.Viewport
          className={cn(
            'fixed bottom-0 right-0 z-[100] flex max-h-screen w-[380px] max-w-[100vw] flex-col gap-2 p-4',
            'outline-none',
          )}
        />
      </RToast.Provider>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast deve ser usado dentro de <ToastProvider>');
  return ctx;
}
