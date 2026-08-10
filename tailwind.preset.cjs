/** @type {import('tailwindcss').Config} */
// Preset compartilhavel do design system.
// Consome as CSS variables definidas em src/styles/variables.css — trocar um token
// no CSS reflete em toda a UI sem rebuild da config.
//
// Nao declara `content`: quem consome define o proprio (e precisa incluir o dist
// deste pacote, senao as classes dos componentes nao entram no CSS final).
// Ver tailwind.config.js na raiz para o exemplo local.

module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50:  'var(--color-primary-50)',
          100: 'var(--color-primary-100)',
          200: 'var(--color-primary-200)',
          300: 'var(--color-primary-300)',
          400: 'var(--color-primary-400)',
          500: 'var(--color-primary-500)',
          600: 'var(--color-primary-600)',
          700: 'var(--color-primary-700)',
          800: 'var(--color-primary-800)',
          900: 'var(--color-primary-900)',
          DEFAULT: 'var(--color-primary-500)',
        },
        secondary: {
          50:  'var(--color-secondary-50)',
          100: 'var(--color-secondary-100)',
          200: 'var(--color-secondary-200)',
          300: 'var(--color-secondary-300)',
          400: 'var(--color-secondary-400)',
          500: 'var(--color-secondary-500)',
          600: 'var(--color-secondary-600)',
          700: 'var(--color-secondary-700)',
          800: 'var(--color-secondary-800)',
          900: 'var(--color-secondary-900)',
          DEFAULT: 'var(--color-secondary-500)',
        },
        neutral: {
          0:   'var(--color-neutral-0)',
          50:  'var(--color-neutral-50)',
          100: 'var(--color-neutral-100)',
          200: 'var(--color-neutral-200)',
          300: 'var(--color-neutral-300)',
          400: 'var(--color-neutral-400)',
          500: 'var(--color-neutral-500)',
          600: 'var(--color-neutral-600)',
          700: 'var(--color-neutral-700)',
          800: 'var(--color-neutral-800)',
          900: 'var(--color-neutral-900)',
          950: 'var(--color-neutral-950)',
        },
        // Tokens semânticos: prefira usá-los nos componentes.
        surface: {
          base:       'var(--surface-base)',
          elevated:   'var(--surface-elevated)',
          overlay:    'var(--surface-overlay)',
          muted:      'var(--surface-muted)',
          mutedHover: 'var(--surface-muted-hover)',
        },
        border: {
          subtle:  'var(--border-subtle)',
          DEFAULT: 'var(--border-default)',
          strong:  'var(--border-strong)',
          focus:   'var(--border-focus)',
        },
        text: {
          primary:      'var(--text-primary)',
          secondary:    'var(--text-secondary)',
          tertiary:     'var(--text-tertiary)',
          disabled:     'var(--text-disabled)',
          inverse:      'var(--text-inverse)',
          onPrimary:    'var(--text-on-primary)',
          onSecondary:  'var(--text-on-secondary)',
          onMuted:      'var(--text-on-muted)',
          link:         'var(--text-link)',
          linkHover:    'var(--text-link-hover)',
        },
        error:   'var(--color-error)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        info:    'var(--color-info)',
        'error-soft':   'var(--color-error-soft)',
        'success-soft': 'var(--color-success-soft)',
        'warning-soft': 'var(--color-warning-soft)',
        'info-soft':    'var(--color-info-soft)',
        'error-onSoft':   'var(--fb-error-text)',
        'success-onSoft': 'var(--fb-success-text)',
        'warning-onSoft': 'var(--fb-warning-text)',
        'info-onSoft':    'var(--fb-info-text)',
        'primary-onSoft': 'var(--primary-onSoft)',
        backdrop:       'var(--backdrop)',
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
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
