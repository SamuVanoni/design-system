import { ReactElement, ReactNode } from 'react';
import { cn } from '../lib/cn';

/**
 * EmptyState — tela vazia ilustrada.
 *
 * Use quando não há dados: lista sem itens, busca sem resultado, erro de
 * carregamento. Sempre ofereça a próxima ação em `action` — um vazio sem saída
 * deixa o usuário travado.
 *
 * As ilustrações são SVG inline pintadas com tokens semânticos, então trocam de
 * cor junto com o tema (nada de PNG que só funciona no dark).
 *
 * @example
 * <EmptyState
 *   illustration="search"
 *   title="Nenhum resultado"
 *   description="Tente remover alguns filtros."
 *   action={<Button onClick={reset}>Limpar filtros</Button>}
 * />
 *
 * @example Ilustração própria
 * <EmptyState illustration={<MinhaArte />} title="..." />
 */

type Preset = 'empty' | 'search' | 'files' | 'error' | 'success';
type Size = 'sm' | 'md' | 'lg';

interface EmptyStateProps {
  /** Preset pronto ou seu próprio nó (SVG, imagem, ícone grande). */
  illustration?: Preset | ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** Botão(ões) da próxima ação. */
  action?: ReactNode;
  /** Conteúdo extra abaixo da ação (ex.: link para a doc). */
  footer?: ReactNode;
  size?: Size;
  /** Remove borda e fundo — para usar dentro de um Card que já tem moldura. */
  bare?: boolean;
  className?: string;
}

const artSizes: Record<Size, string> = {
  sm: 'w-32',
  md: 'w-44',
  lg: 'w-56',
};

const padding: Record<Size, string> = {
  sm: 'px-6 py-8',
  md: 'px-6 py-12',
  lg: 'px-6 py-16',
};

/* ---------- Ilustrações ----------
   Paleta comum: fundo em surface-muted, estrutura em border/border-strong,
   um único acento na cor da marca (ou de feedback) para guiar o olho. */

function ArtEmpty() {
  return (
    <svg viewBox="0 0 200 140" fill="none" className="h-auto w-full" aria-hidden>
      <ellipse cx="100" cy="122" rx="62" ry="9" className="fill-surface-muted" />
      <rect x="52" y="44" width="96" height="66" rx="8" className="fill-surface-elevated stroke-border" strokeWidth="2" />
      <path d="M52 62h96" className="stroke-border" strokeWidth="2" />
      <circle cx="63" cy="53" r="3" className="fill-border-strong" />
      <circle cx="74" cy="53" r="3" className="fill-border-strong" />
      <rect x="66" y="76" width="68" height="7" rx="3.5" className="fill-border" />
      <rect x="66" y="90" width="44" height="7" rx="3.5" className="fill-border" />
      {/* Selo solido: preenchimento -graphic + conteudo -onGraphic, os dois
          invertendo por tema. O primary-500 dava 2,88:1 de silhueta contra o
          card escuro; so trocar o preenchimento derrubaria o "+" branco para
          2,52:1. Ver --text-on-graphic em variables.css. */}
      <circle cx="148" cy="42" r="14" className="fill-primary-graphic" />
      <path d="M148 36v12M142 42h12" className="stroke-text-onGraphic" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function ArtSearch() {
  return (
    <svg viewBox="0 0 200 140" fill="none" className="h-auto w-full" aria-hidden>
      <ellipse cx="100" cy="122" rx="62" ry="9" className="fill-surface-muted" />
      <rect x="40" y="34" width="82" height="72" rx="8" className="fill-surface-elevated stroke-border" strokeWidth="2" />
      <rect x="54" y="50" width="54" height="6" rx="3" className="fill-border" />
      <rect x="54" y="64" width="38" height="6" rx="3" className="fill-border" />
      <rect x="54" y="78" width="46" height="6" rx="3" className="fill-border" />
      {/* -graphic: o cabo da lupa cai direto sobre o card, e o verdigris 500
          dava 2,88:1 contra o navy do tema escuro. */}
      <circle cx="132" cy="74" r="26" className="fill-surface-base stroke-primary-graphic" strokeWidth="4" />
      <path d="M151 93l14 14" className="stroke-primary-graphic" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

function ArtFiles() {
  return (
    <svg viewBox="0 0 200 140" fill="none" className="h-auto w-full" aria-hidden>
      <ellipse cx="100" cy="122" rx="62" ry="9" className="fill-surface-muted" />
      <rect x="58" y="30" width="66" height="82" rx="6" className="fill-surface-elevated stroke-border" strokeWidth="2" transform="rotate(-8 91 71)" />
      <rect x="76" y="30" width="66" height="82" rx="6" className="fill-surface-elevated stroke-border-strong" strokeWidth="2" />
      <rect x="88" y="48" width="42" height="6" rx="3" className="fill-border" />
      <rect x="88" y="62" width="42" height="6" rx="3" className="fill-border" />
      <rect x="88" y="76" width="28" height="6" rx="3" className="fill-border" />
      {/* Mesmo selo do ArtEmpty, mesma razao. */}
      <circle cx="140" cy="98" r="15" className="fill-primary-graphic" />
      <path d="M140 91v14M133 98h14" className="stroke-text-onGraphic" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function ArtError() {
  return (
    <svg viewBox="0 0 200 140" fill="none" className="h-auto w-full" aria-hidden>
      <ellipse cx="100" cy="122" rx="62" ry="9" className="fill-surface-muted" />
      <rect x="46" y="38" width="108" height="68" rx="8" className="fill-surface-elevated stroke-border" strokeWidth="2" />
      <path d="M46 58h108" className="stroke-border" strokeWidth="2" />
      <circle cx="57" cy="48" r="3" className="fill-border-strong" />
      <circle cx="68" cy="48" r="3" className="fill-border-strong" />
      {/* Preenchimento translucido no lugar do -soft opaco, como o README ja
          recomenda: o -soft escuro (#7F1D1D) e vermelho fundo demais, e o
          traco por cima dele travava em 2,66:1 mesmo com o -graphic. Sobre a
          tinta /16 o mesmo traco da 3,91:1 no claro e 3,18:1 no escuro. */}
      <circle cx="100" cy="82" r="20" className="fill-error/16 stroke-error-graphic" strokeWidth="2" />
      <path d="M100 72v12" className="stroke-error-graphic" strokeWidth="3" strokeLinecap="round" />
      <circle cx="100" cy="91" r="2" className="fill-error-graphic" />
    </svg>
  );
}

function ArtSuccess() {
  return (
    <svg viewBox="0 0 200 140" fill="none" className="h-auto w-full" aria-hidden>
      <ellipse cx="100" cy="122" rx="62" ry="9" className="fill-surface-muted" />
      <rect x="52" y="36" width="96" height="72" rx="8" className="fill-surface-elevated stroke-border" strokeWidth="2" />
      <rect x="68" y="54" width="42" height="6" rx="3" className="fill-border" />
      <rect x="68" y="68" width="30" height="6" rx="3" className="fill-border" />
      {/* Mesma troca do ArtError, pelo mesmo motivo. Aqui o traco sobre a
          tinta /16 da 4,38:1 no claro e 4,60:1 no escuro. */}
      <circle cx="100" cy="92" r="22" className="fill-success/16 stroke-success-graphic" strokeWidth="2" />
      <path d="M90 92l7 7 14-14" className="stroke-success-graphic" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const presets: Record<Preset, () => ReactElement> = {
  empty:   ArtEmpty,
  search:  ArtSearch,
  files:   ArtFiles,
  error:   ArtError,
  success: ArtSuccess,
};

export function EmptyState({
  illustration = 'empty',
  title,
  description,
  action,
  footer,
  size = 'md',
  bare = false,
  className,
}: EmptyStateProps) {
  const isPreset = typeof illustration === 'string' && illustration in presets;
  const Art = isPreset ? presets[illustration as Preset] : null;

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        padding[size],
        !bare && 'rounded-lg border border-border bg-surface-elevated',
        className,
      )}
    >
      <div className={cn('mb-5', artSizes[size])}>
        {Art ? <Art /> : illustration}
      </div>

      <h3 className="text-h3 text-text-primary">{title}</h3>

      {description && (
        <p className="mt-2 max-w-sm text-sm text-text-secondary">{description}</p>
      )}

      {action && <div className="mt-6 flex flex-wrap items-center justify-center gap-3">{action}</div>}

      {footer && <div className="mt-4 text-caption text-text-tertiary">{footer}</div>}
    </div>
  );
}
