/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          pressed: 'var(--color-primary-pressed)',
          light: 'var(--color-primary-light)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          light: 'var(--color-secondary-light)',
        },
        surface: 'var(--color-surface)',
        background: 'var(--color-background)',
        // foreground — resolves to the dark text token; .dark class flips to near-white
        foreground: 'var(--color-gray-900)',
        // onyx — rich near-black used for overlays and dark mode bg
        onyx: 'var(--color-gray-900)',
        // ivory — warm off-white, same as page background
        ivory: 'var(--color-background)',
        // coral — alias for primary red (keeps Finished-Sample class names working)
        coral: {
          DEFAULT: 'var(--color-primary)',
          dark: 'var(--color-primary-pressed)',
        },
        // amber — alias for secondary blue (keeps Finished-Sample class names working)
        amber: {
          DEFAULT: 'var(--color-secondary)',
          dark: '#1842C4',
          300: '#335CE3',
          400: 'var(--color-secondary)',
          500: '#1842C4',
          700: '#102B80',
        },
      },
      fontFamily: {
        sans: ['var(--font-family-base)'],
        display: ['var(--font-family-display)'],
        mono: ['var(--font-family-mono)'],
      },
      fontSize: {
        xs: 'var(--font-size-xs)',
        sm: 'var(--font-size-sm)',
        base: 'var(--font-size-base)',
        lg: 'var(--font-size-lg)',
        xl: 'var(--font-size-xl)',
        '2xl': 'var(--font-size-2xl)',
        '3xl': 'var(--font-size-3xl)',
        '4xl': 'var(--font-size-4xl)',
        '5xl': 'var(--font-size-5xl)',
      },
      spacing: {
        0: 'var(--space-0)',
        1: 'var(--space-1)',
        2: 'var(--space-2)',
        3: 'var(--space-3)',
        4: 'var(--space-4)',
        5: 'var(--space-5)',
        6: 'var(--space-6)',
        8: 'var(--space-8)',
        10: 'var(--space-10)',
        12: 'var(--space-12)',
        16: 'var(--space-16)',
        20: 'var(--space-20)',
        24: 'var(--space-24)',
      },
      borderRadius: {
        none: 'var(--radius-none)',
        sm: 'var(--radius-sm)',
        DEFAULT: 'var(--radius-md)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        full: 'var(--radius-full)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        DEFAULT: 'var(--shadow-md)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        inner: 'var(--shadow-inner)',
      },
      transitionDuration: {
        fast: 'var(--duration-fast)',
        DEFAULT: 'var(--duration-normal)',
        slow: 'var(--duration-slow)',
      },
      transitionTimingFunction: {
        'out': 'var(--ease-out)',
        'in-out': 'var(--ease-in-out)',
      },
      zIndex: {
        dropdown: 'var(--z-dropdown)',
        sticky: 'var(--z-sticky)',
        fixed: 'var(--z-fixed)',
        'modal-backdrop': 'var(--z-modal-backdrop)',
        modal: 'var(--z-modal)',
        popover: 'var(--z-popover)',
        tooltip: 'var(--z-tooltip)',
        toast: 'var(--z-toast)',
      },
      minHeight: {
        'touch': 'var(--touch-target-min)',
        'touch-comfortable': 'var(--touch-target-comfortable)',
      },
      minWidth: {
        'touch': 'var(--touch-target-min)',
        'touch-comfortable': 'var(--touch-target-comfortable)',
      },
      backgroundImage: {
        'gradient-match': 'var(--gradient-match)',
        'gradient-match-reverse': 'var(--gradient-match-reverse)',
        'gradient-match-vertical': 'var(--gradient-match-vertical)',
      },
    },
  },
  plugins: [],
}