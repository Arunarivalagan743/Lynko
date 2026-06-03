/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--color-background) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
        success: 'rgb(var(--color-success) / <alpha-value>)',
        warning: 'rgb(var(--color-warning) / <alpha-value>)',
        error: 'rgb(var(--color-error) / <alpha-value>)',
        text: 'rgb(var(--color-text) / <alpha-value>)',
        'text-muted': 'rgb(var(--color-text-muted) / <alpha-value>)',

        // Paper Tech Design System Colors
        'surface-dim': '#d8dbd6',
        'surface-bright': '#f8faf5',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f2f4ef',
        'surface-container': '#ecefea',
        'surface-container-high': '#e7e9e4',
        'surface-container-highest': '#e1e3de',
        'on-surface': '#191c1a',
        'on-surface-variant': '#3f4947',
        'inverse-surface': '#2e312e',
        'inverse-on-surface': '#eff1ec',
        outline: '#707977',
        'outline-variant': '#bfc9c6',
        'surface-tint': '#2b6860',
        'on-primary': '#ffffff',
        'primary-container': '#004b44',
        'on-primary-container': '#7ebab0',
        'inverse-primary': '#95d2c8',
        'on-secondary': '#ffffff',
        'secondary-container': '#aeedd5',
        'on-secondary-container': '#316d5b',
        tertiary: '#636037',
        'on-tertiary': '#ffffff',
        'tertiary-container': '#b2ad7d',
        'on-tertiary-container': '#43411b',
        'error-container': '#ffdad6',
        'on-error-container': '#93000a',
      },
      fontFamily: {
        anton: ['Anton', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        space: ['"Space Mono"', 'monospace'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        'page':    ['2.25rem', { lineHeight: '1.1',  letterSpacing: '0.02em' }],   // 36px — page titles
        'section': ['1.25rem', { lineHeight: '1.3',  letterSpacing: '0.04em' }],   // 20px — section headers
        'kpi':     ['3.5rem',  { lineHeight: '1.0',  letterSpacing: '-0.01em' }],  // 56px — KPI numbers
        'display': ['4.5rem',  { lineHeight: '0.95', letterSpacing: '-0.02em' }],  // 72px — hero display
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px #00322d',
        'brutal-lg': '6px 6px 0px 0px #00322d',
        'brutal-sm': '2px 2px 0px 0px #00322d',
        'brutal-xs': '1px 1px 0px 0px #00322d',
        'subtle': '4px 4px 0px 0px #00322d',
        'medium': '6px 6px 0px 0px #00322d',
        'focus': '0 0 0 3px rgba(44, 105, 86, 0.3)',
        'header': '0 1px 0 0 rgba(0, 50, 45, 0.08)',
      },
      borderRadius: {
        none:  '0px',      // explicit sharp — badges, code chips, status tags
        sm:    '4px',      // inputs, small elements
        md:    '8px',      // buttons, fields
        lg:    '12px',     // cards, panels
        card:  '12px',     // semantic card alias
        pill:  '9999px',   // rounded pills
        DEFAULT: '8px',
      },
      transitionDuration: {
        'fast': '100ms',
        'normal': '150ms',
      },
    },
  },
  plugins: [],
}
