# Design System

## Brand Colors

### Primary Colors

- **Brand Red** (#D12026) - Primary CTAs (Add to Cart, Checkout)
- **Brand Navy** (#292664) - Dark accent, headings, premium elements
- **Brand Blue** (#529BCA) - Links, active states, info badges
- **Brand Dark** (#141C27) - Darkest text, high contrast elements

### Semantic Colors

- **Success** (#22c55e) - Compatible badges, in stock indicators
- **Warning** (#f59e0b) - Check fitment warnings
- **Error** (#ef4444) - Out of stock, error messages

## Typography

### Fonts

- **Body**: Inter (400, 500, 600, 700)
- **Headings**: Outfit (600, 700)

### Scale

- xs: 12px
- sm: 14px
- base: 16px (body minimum for accessibility)
- lg: 18px
- xl: 20px
- 2xl: 24px
- 3xl: 30px
- 4xl: 36px
- 5xl: 48px

### Line Heights

- Tight: 1.25 (headings)
- Normal: 1.5 (body)
- Relaxed: 1.75 (emphasis)

## Spacing

Base unit: 4px

Common values:

- space-4: 16px
- space-6: 24px
- space-8: 32px
- space-12: 48px

## Border Radius

- sm: 2px (inputs)
- md: 6px (buttons, cards)
- lg: 8px (modals, large cards)
- xl: 12px (product images)
- full: 9999px (pills, badges)

## Shadows (Elevation)

- sm: Product cards (idle)
- md: Product cards (hover), buttons (hover)
- lg: Dropdowns
- xl: Modals
- 2xl: Cart panel

## Animation Timing

- fast: 150ms (buttons, hovers)
- base: 200ms (cards, UI elements)
- slow: 300ms (modals, drawers)
- Easing: cubic-bezier(0.4, 0, 0.2, 1)

## Accessibility Standards

### WCAG 2.1 AA Compliance

- **Color Contrast**: 4.5:1 minimum for body text, 3:1 for UI components
- **Touch Targets**: 44px minimum (WCAG AA), 48px recommended for mobile
- **Focus Indicators**: Visible 2px ring with brand-blue color
- **Keyboard Navigation**: All interactive elements accessible via Tab/Shift+Tab
- **Screen Reader Support**: Semantic HTML, proper ARIA labels
- **Reduced Motion**: Respects prefers-reduced-motion media query

## Dark Mode

Dark mode foundation is prepared with CSS variables for light/dark themes.

All design tokens are defined in `app/globals.css` under the `@theme inline` directive.
