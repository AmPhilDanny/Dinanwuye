# Dinanwuye Design System v1

## Overview
Mobile-first design tokens and utilities for the Dinanwuye matchmaking app. Built for **Ionic + React (JavaScript) + Vite**, compatible with Ionic theming, and Cordova-ready.

## Brand Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | `#E4172B` | Primary Red - CTAs, like/heart actions, brand mark |
| `--color-primary-pressed` | `#B00F1F` | Deep Red - pressed state, gradient end |
| `--color-primary-light` | `#FCE4E6` | Light Red - backgrounds, subtle accents |
| `--color-secondary` | `#1B4CE0` | Primary Blue - verification, trust, secondary CTA |
| `--color-secondary-light` | `#E8EDFC` | Light Blue - backgrounds, info states |

## Neutral Scale
`--color-gray-50` through `--color-gray-900` — use for text, borders, surfaces.

## Semantic Colors
- Success: `#34C759` (match confirmed, verified)
- Warning: `#FF9F0A` (pending, attention)
- Error: `#FF3B30` (destructive actions, validation)
- Info: `#1B4CE0` (informational)

## Match Gradient — "It's a Match!"
```css
--gradient-match: linear-gradient(135deg, #E4172B 0%, #1B4CE0 100%);
```
**Usage**: Match screen background, celebration moments, premium badges.

## Typography

### Font Families
- Base: System font stack (San Francisco, Segoe UI, Roboto)
- Display: Same as base
- Mono: SF Mono, Fira Code, Menlo

### Scale (rem, base 16px)
| Token | Size | Use Case |
|-------|------|----------|
| `--font-size-xs` | 0.75rem (12px) | Labels, captions |
| `--font-size-sm` | 0.875rem (14px) | Body small, secondary |
| `--font-size-base` | 1rem (16px) | Body text |
| `--font-size-lg` | 1.125rem (18px) | Body large |
| `--font-size-xl` | 1.25rem (20px) | Headings small |
| `--font-size-2xl` | 1.5rem (24px) | Headings medium |
| `--font-size-3xl` | 1.875rem (30px) | Headings large |
| `--font-size-4xl` | 2.25rem (36px) | Display |
| `--font-size-5xl` | 3rem (48px) | Hero |

### Weights
- Normal: 400
- Medium: 500
- Semibold: 600
- Bold: 700

## Spacing (4px base unit)
`--space-1` (4px) through `--space-24` (96px)

## Border Radius
| Token | Value | Use Case |
|-------|-------|----------|
| `--radius-sm` | 4px | Small elements |
| `--radius-md` | 8px | Default |
| `--radius-lg` | 12px | Cards, modals |
| `--radius-xl` | 16px | Large cards |
| `--radius-2xl` | 24px | Hero sections |
| `--radius-full` | 9999px | Pills, avatars |

## Touch Targets (Mobile-First)
- **Minimum**: 44px (iOS HIG)
- **Comfortable**: 48px (Material Design)

All interactive elements must meet minimum 44×44px.

## Ionic Integration

Design tokens map directly to Ionic's CSS custom properties:

```css
--ion-color-primary: var(--color-primary);
--ion-color-secondary: var(--color-secondary);
--ion-color-success: var(--color-success);
--ion-color-warning: var(--color-warning);
--ion-color-danger: var(--color-danger);
--ion-border-radius: var(--radius-lg);
--ion-grid-column-gutter: var(--space-4);
```

**Ionic components automatically inherit brand colors** — no extra work needed.

## File Structure

```
src/styles/
├── tokens.css      # All design tokens (CSS variables)
├── global.css      # Reset, base styles, utilities, components
└── README.md       # This file
```

## Usage

### In Components
```jsx
// Use CSS variables directly
const styles = {
  background: 'var(--color-primary)',
  color: 'var(--color-white)',
  padding: 'var(--space-4)',
  borderRadius: 'var(--radius-lg)',
};
```

### With Tailwind (if configured)
```html
<div class="bg-primary text-white p-4 rounded-lg">
  Uses design tokens via CSS variables
</div>
```

### Match Gradient
```css
.match-celebration {
  background: var(--gradient-match);
}

/* Or as text gradient */
.match-text {
  background: var(--gradient-match);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

## Dark Mode
Tokens include `@media (prefers-color-scheme: dark)` overrides. Extend as needed.

## Accessibility
- All colors meet WCAG 2.1 AA contrast ratios
- Focus states use `--color-primary` with visible outline
- Touch targets meet minimum 44×44px
- Reduced motion respected via `prefers-reduced-motion`

## Cordova Considerations
- No CSS features that break in WebView
- Scrollbar styles hidden in native builds
- Viewport units work correctly in Cordova WebView
- Safe area insets handled by Ionic components

## Extending
Add new tokens to `tokens.css` following the naming convention:
- Colors: `--color-{category}-{variant}`
- Spacing: `--space-{n}`
- Typography: `--font-size-{size}`, `--font-weight-{weight}`
- Radius: `--radius-{size}`
- Shadows: `--shadow-{size}`

Then add corresponding utilities to `global.css`.