/** @type {import('tailwindcss').Config} */
// Preset compartilhavel do design system.
// Consome as CSS variables definidas em src/styles/variables.css — trocar um token
// no CSS reflete em toda a UI sem rebuild da config.
//
// Nao declara `content`: quem consome define o proprio (e precisa incluir o dist
// deste pacote, senao as classes dos componentes nao entram no CSS final).
// Ver tailwind.config.js na raiz para o exemplo local.

/**
 * Torna um token CSS-var compativel com os modificadores de opacidade do Tailwind
 * (`bg-success/10`, `border-primary-500/30`).
 *
 * Sem isto o Tailwind DESCARTA a utility em silencio: ele nao consegue injetar
 * alfa num `var()` que guarda um hex, entao a classe simplesmente nao vai parar
 * no CSS e o elemento fica sem fundo/borda nenhum. Foi o que aconteceu com a
 * StatusPill e o CargoChip — pareciam "sem estilo" no tema escuro.
 *
 * A alternativa canonica seria guardar os tokens como triplas de canal
 * ("34 197 94") e usar rgb(var(--x) / <alpha-value>), mas isso obrigaria a
 * reescrever todos os tokens e quebraria quem le a var direto no CSS.
 * `color-mix` resolve mantendo os hex intactos.
 */
const tom = (nome) => ({ opacityValue }) =>
  opacityValue === undefined
    ? `var(${nome})`
    : `color-mix(in srgb, var(${nome}) calc(${opacityValue} * 100%), transparent)`;

module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50:  tom('--color-primary-50'),
          100: tom('--color-primary-100'),
          200: tom('--color-primary-200'),
          300: tom('--color-primary-300'),
          400: tom('--color-primary-400'),
          500: tom('--color-primary-500'),
          600: tom('--color-primary-600'),
          700: tom('--color-primary-700'),
          800: tom('--color-primary-800'),
          900: tom('--color-primary-900'),
          DEFAULT: tom('--color-primary-500'),
        },
        secondary: {
          50:  tom('--color-secondary-50'),
          100: tom('--color-secondary-100'),
          200: tom('--color-secondary-200'),
          300: tom('--color-secondary-300'),
          400: tom('--color-secondary-400'),
          500: tom('--color-secondary-500'),
          600: tom('--color-secondary-600'),
          700: tom('--color-secondary-700'),
          800: tom('--color-secondary-800'),
          900: tom('--color-secondary-900'),
          DEFAULT: tom('--color-secondary-500'),
        },
        neutral: {
          0:   tom('--color-neutral-0'),
          50:  tom('--color-neutral-50'),
          100: tom('--color-neutral-100'),
          200: tom('--color-neutral-200'),
          300: tom('--color-neutral-300'),
          400: tom('--color-neutral-400'),
          500: tom('--color-neutral-500'),
          600: tom('--color-neutral-600'),
          700: tom('--color-neutral-700'),
          800: tom('--color-neutral-800'),
          900: tom('--color-neutral-900'),
          950: tom('--color-neutral-950'),
        },
        // Tokens semânticos: prefira usá-los nos componentes.
        surface: {
          base:       tom('--surface-base'),
          elevated:   tom('--surface-elevated'),
          overlay:    tom('--surface-overlay'),
          muted:      tom('--surface-muted'),
          mutedHover: tom('--surface-muted-hover'),
        },
        border: {
          subtle:  tom('--border-subtle'),
          DEFAULT: tom('--border-default'),
          strong:  tom('--border-strong'),
          focus:   tom('--border-focus'),
        },
        text: {
          primary:      tom('--text-primary'),
          secondary:    tom('--text-secondary'),
          tertiary:     tom('--text-tertiary'),
          disabled:     tom('--text-disabled'),
          inverse:      tom('--text-inverse'),
          onPrimary:    tom('--text-on-primary'),
          onSecondary:  tom('--text-on-secondary'),
          onDanger:     tom('--text-on-danger'),
          onMuted:      tom('--text-on-muted'),
          onAction:     tom('--text-on-action'),
          link:         tom('--text-link'),
          linkHover:    tom('--text-link-hover'),
        },
        // Acao primaria: inverte entre os temas (ver variables.css). Separado do
        // `primary`, que e o acento da marca e significa so estado.
        action: {
          DEFAULT: tom('--action-solid'),
          hover:   tom('--action-solid-hover'),
          active:  tom('--action-solid-active'),
        },
        error:   tom('--color-error'),
        success: tom('--color-success'),
        warning: tom('--color-warning'),
        info:    tom('--color-info'),
        'error-soft':   tom('--color-error-soft'),
        'success-soft': tom('--color-success-soft'),
        'warning-soft': tom('--color-warning-soft'),
        'info-soft':    tom('--color-info-soft'),
        'error-onSoft':   tom('--fb-error-text'),
        'success-onSoft': tom('--fb-success-text'),
        'warning-onSoft': tom('--fb-warning-text'),
        'info-onSoft':    tom('--fb-info-text'),
        'primary-onSoft': tom('--primary-onSoft'),
        backdrop:       tom('--backdrop'),
      },
      // A escala padrao do Tailwind so tem 0,5,10,20,25,30,40,50… — um `/15` ou
      // `/12` NAO gera classe nenhuma, e sem erro. Junto com o `tom()` acima,
      // esta era a segunda metade do bug da StatusPill: mesmo com color-mix, um
      // `bg-primary-500/15` continuaria sumindo por nao existir o passo 15.
      opacity: {
        12: '0.12', 15: '0.15', 16: '0.16', 18: '0.18',
        35: '0.35', 45: '0.45', 55: '0.55', 65: '0.65', 85: '0.85',
      },
      fontFamily: {
        // Aponta pro TOKEN, nao pro nome literal da familia. Loaders que
        // auto-hospedam (next/font) geram um nome com hash e o expoem numa CSS
        // var — fixar 'Inter' aqui faria o utilitario `font-sans` procurar uma
        // familia que nunca foi registrada com esse nome.
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        h1:       ['2.5rem',   { lineHeight: '1.15', fontWeight: '700', letterSpacing: '-0.02em' }],
        h2:       ['2rem',     { lineHeight: '1.2',  fontWeight: '700', letterSpacing: '-0.01em' }],
        h3:       ['1.5rem',   { lineHeight: '1.25', fontWeight: '600', letterSpacing: '-0.01em' }],
        subtitle: ['1.125rem', { lineHeight: '1.4',  fontWeight: '500' }],
        body:     ['1rem',     { lineHeight: '1.5',  fontWeight: '400' }],
        caption:  ['0.75rem',  { lineHeight: '1.4',  fontWeight: '400', letterSpacing: '0.02em' }],
      },
      spacing: {
        1: '0.25rem', 2: '0.5rem',  3: '0.75rem', 4: '1rem',
        5: '1.25rem', 6: '1.5rem',  8: '2rem',    10: '2.5rem',
        12: '3rem',   16: '4rem',   20: '5rem',   24: '6rem',
      },
      borderRadius: {
        sm: '0.25rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
      },
      boxShadow: {
        sm:    'var(--shadow-sm)',
        md:    'var(--shadow-md)',
        lg:    'var(--shadow-lg)',
        focus: 'var(--shadow-focus)',
      },
      transitionDuration: {
        fast: '120ms',
        base: '180ms',
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        spin: {
          to: { transform: 'rotate(360deg)' },
        },
        'accordion-down': {
          from: { height: '0', opacity: '0' },
          to:   { height: 'var(--radix-accordion-content-height)', opacity: '1' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)', opacity: '1' },
          to:   { height: '0', opacity: '0' },
        },
        'progress-indeterminate': {
          '0%':   { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(400%)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.6s linear infinite',
        spin: 'spin 0.9s linear infinite',
        'accordion-down': 'accordion-down 180ms cubic-bezier(0.2, 0, 0, 1)',
        'accordion-up':   'accordion-up 180ms cubic-bezier(0.2, 0, 0, 1)',
        'progress-indeterminate': 'progress-indeterminate 1.4s ease-in-out infinite',
      },
    },
  },
  // Obrigatorio: Toast, Modal, Accordion, Dropdown e Popover usam as utilities
  // animate-in / fade-in / slide-in-from-* deste plugin. Sem ele as classes
  // existem no markup mas nao geram CSS — os componentes aparecem sem transicao.
  plugins: [require('tailwindcss-animate')],
};
