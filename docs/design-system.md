# Design System

**Last Updated:** 2025-10-28 (Synchronized with implementation via Story 10.1 audit)
**Reference Implementation:** `app/globals.css` lines 37-404
**Design Inspiration:** Linear.app, enthusiastauto.com

---

## Overview

The Enthusiast Auto design system uses a **Linear-inspired** approach with tight spacing, precise typography, and a comprehensive dark-first color palette. All design tokens are defined as CSS custom properties in `app/globals.css` and accessed via Tailwind utility classes or `var(--token-name)` syntax.

---

## Brand Colors

### Primary Brand Colors

- **Brand Primary**: #3b82f6 (Blue) - Primary CTAs, links, active states
- **Brand Accent**: #2563eb (Darker blue) - Hover states, emphasis
- **Brand Accent Hover**: #60a5fa (Lighter blue) - Interactive hover feedback

**Note:** The design system uses blue as the primary brand color. Red accents may appear in legacy components but should be migrated to the blue brand palette for consistency.

### Semantic Colors

- **Success**: #4cb782 - Compatible badges, in stock indicators, success states
- **Warning**: #f2c94c - Check fitment warnings, caution alerts
- **Error**: #eb5757 - Out of stock, error messages, destructive actions

### Color Usage (Dark Theme - Primary)

**Text Hierarchy** (4-tier system):
- `--color-text-primary`: #ffffff (Pure white - highest emphasis)
- `--color-text-secondary`: #e5e7eb (Light gray - medium emphasis)
- `--color-text-tertiary`: #a8adb7 (Medium gray - lower emphasis)
- `--color-text-quaternary`: #6b7280 (Darker gray - lowest emphasis)

**Backgrounds** (5-level elevation system):
- `--color-bg-primary`: #141721 (Darkest navy - main background)
- `--color-bg-secondary`: #1f2233 (Lighter navy - cards, elevated surfaces)
- `--color-bg-tertiary`: #1a1d29 (Medium navy - subtle elevation)
- `--color-bg-quaternary`: #252936 (Higher elevation)
- `--color-bg-quinary`: #2a2f3f (Highest elevation)

**Borders** (3-tier system):
- `--color-border-primary`: #2a2f3f (Subtle borders)
- `--color-border-secondary`: #374151 (Medium borders)
- `--color-border-tertiary`: #4b5563 (Prominent borders)

**ShadCN Semantic Tokens** (for components):
- `--background`: #141721 (dark) / #ffffff (light)
- `--foreground`: #ffffff (dark) / #282a30 (light)
- `--card`: #1f2233 (dark) / #f8f8f8 (light)
- `--primary`: #3b82f6 (brand blue)
- `--secondary`: #1a1d29 (dark) / #f4f4f4 (light)
- `--muted`: #1a1d29 (dark) / #f0f0f0 (light)
- `--accent`: #2563eb (darker brand blue)
- `--destructive`: #ef4444 (red)

**Usage Best Practices:**
- ✅ Always use semantic tokens: `text-foreground`, `bg-card`, `border-border`
- ❌ Never hardcode colors: `text-gray-900`, `bg-blue-600`
- ✅ Use `text-muted-foreground` for secondary text
- ✅ Use `text-primary` for links and interactive elements

---

## Typography

### Font Family

- **All Text**: Figtree (variable font, 300-700 weights)
- **Fallback Stack**: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
- **Monospace**: ui-monospace, "SF Mono", "Menlo", "Consolas", monospace

**Loading:** Figtree is loaded via Next.js font optimization from Google Fonts.

**Rationale:** Figtree provides excellent readability at small sizes, supports variable weights for efficient loading, and offers a modern, professional appearance suitable for automotive e-commerce.

### Typography Scale (Linear-inspired)

The typography system uses paired values (font-size + line-height + letter-spacing) for optimal readability:

| Token | Size | Line Height | Letter Spacing | Use Case |
|-------|------|-------------|----------------|----------|
| `--font-size-micro` | 11px | 1.45 (16px) | 0.01em | Labels, metadata |
| `--font-size-mini` | 12px | 1.5 (18px) | 0 | Secondary labels |
| `--font-size-small` | 13px | 1.54 (20px) | -0.003em | Body secondary, captions |
| `--font-size-base` | **14px** | 1.57 (22px) | -0.006em | **Primary body text** |
| `--font-size-regular` | 15px | 1.6 (24px) | -0.009em | Emphasized body |
| `--font-size-large` | 16px | 1.5 (24px) | -0.011em | Subheadings |
| `--font-size-xl` | 18px | 1.44 (26px) | -0.014em | Small titles |
| `--font-size-title-3` | 20px | 1.4 (28px) | -0.017em | Section headings |
| `--font-size-title-2` | 24px | 1.33 (32px) | -0.019em | Page headings |
| `--font-size-title-1` | 32px | 1.25 (40px) | -0.022em | Hero headings |
| `--font-size-hero` | 48px | 1.17 (56px) | -0.028em | Large display (>640px) |

**Base Font Size:** 14px (smaller than typical 16px for tighter, more app-like density inspired by Linear)

### Font Weights

- **Light**: 300 (rare use)
- **Normal**: 400 (body text)
- **Medium**: 500 (emphasis, headings)
- **Semibold**: 600 (strong emphasis, large headings)
- **Bold**: 700 (maximum emphasis)

### Heading Styles

By default, headings (h1-h6) use the font-sans family with medium-to-semibold weights.

**Uppercase Transform:**
- Currently applied globally to ALL headings via `text-transform: uppercase` (globals.css line 335)
- **Recommendation:** Remove global uppercase; apply selectively via utility class for hero sections
- **Status:** To be addressed in Story 10.2 (Typography System Consistency)

**Usage:**
```tsx
// Good - uses design token via Tailwind
<h1 className="text-3xl font-bold text-foreground">

// Better - if custom classes created
<h1 className="text-title-1 font-medium text-foreground">
```

---

## Spacing

**Base Unit:** 4px grid system

The spacing system follows Linear's tight, consistent approach:

### Spacing Scale

| Token | Value | Tailwind | Use Cases |
|-------|-------|----------|-----------|
| `space-1` | 4px | `p-1`, `gap-1` | Micro spacing, tight elements |
| `space-1.5` | 6px | `p-1.5` | Very tight spacing |
| `space-2` | 8px | `p-2` | Element spacing, small gaps |
| `space-3` | 12px | `p-3` | Section gaps, card spacing |
| `space-4` | 16px | `p-4` | Card padding, standard gaps |
| `space-5` | 20px | `p-5` | Comfortable card padding |
| `space-6` | 24px | `p-6` | Section padding |
| `space-8` | 32px | `p-8` | Large spacing |
| `space-10` | 40px | `p-10` | Section spacing |
| `space-12` | 48px | `p-12` | Large section spacing |
| `space-16` | 64px | `p-16` | Page section spacing |
| `space-20` | 80px | `p-20` | Large page sections |
| `space-24` | 96px | `p-24` | Hero sections |

### Common Patterns

- **Card padding**: 16px (`p-4`) or 20px (`p-5`)
- **Section gaps**: 12px (`gap-3`), 16px (`gap-4`)
- **Element spacing**: 8px (`space-2`), 12px (`space-3`)
- **Tight spacing**: 4px (`space-1`), 6px (`space-1.5`)

**Example:**
```tsx
<div className="p-4 space-y-3"> {/* 16px padding, 12px gap between children */}
  <h3>Card Title</h3>
  <p>Card content</p>
</div>
```

---

## Border Radius

| Token | Value | Tailwind | Use Cases |
|-------|-------|----------|-----------|
| `--radius-4` | 4px | `rounded` | Small elements |
| `--radius-6` | 6px | `rounded-md` | Inputs, buttons |
| `--radius-8` | 8px | `rounded-lg` | **Default cards** |
| `--radius-12` | 12px | `rounded-xl` | Large cards |
| `--radius-16` | 16px | `rounded-2xl` | Modals |
| `--radius-24` | 24px | `rounded-3xl` | Hero elements |
| `--radius-32` | 32px | - | Extra large elements |
| `--radius-full` | 9999px | `rounded-full` | Pills, badges, avatars |

**Default:** `--radius` = 8px (rounded-lg)

---

## Shadows (Elevation)

| Token | Value | Use Cases |
|-------|-------|-----------|
| `--shadow-tiny` | 0px 1px 1px rgba(0,0,0,0.09) | Subtle separation |
| `--shadow-low` | 0px 2px 4px rgba(0,0,0,0.1) | Cards at rest |
| `--shadow-medium` | 0px 4px 24px rgba(0,0,0,0.2) | Cards on hover, dropdowns |
| `--shadow-high` | 0px 7px 32px rgba(0,0,0,0.35) | Modals, overlays |

**Usage:**
```tsx
<div className="shadow-[var(--shadow-medium)]">
  Card with medium elevation
</div>
```

---

## Animation Timing

| Token | Value | Use Cases |
|-------|-------|-----------|
| `--duration-instant` | 0s | Immediate changes |
| `--duration-quick` | 0.1s | Quick transitions, button hovers |
| `--duration-base` | 0.25s | Regular transitions, cards |
| `--duration-fade-out` | 0.15s | Highlight fade effects |
| `--ease-default` | cubic-bezier(0.4, 0, 0.2, 1) | Standard easing |

**Example:**
```tsx
<button className="transition-colors duration-[var(--duration-quick)]">
  Quick hover effect
</button>
```

---

## Accessibility Standards

### WCAG 2.1 AA Compliance Requirements

✅ **Color Contrast:**
- Body text: **4.5:1 minimum** (14pt regular or smaller)
- Large text: **3:1 minimum** (18pt+ or 14pt+ bold)
- UI components: **3:1 minimum** (borders, icons, form inputs)

✅ **Focus Indicators:**
- 2px ring with `#5e6ad2` color
- 2px offset from element
- Applied globally to all interactive elements
- Uses `focus-visible` (modern best practice)

✅ **Touch Targets:**
- Minimum: 44px × 44px (WCAG 2.1 AA)
- Recommended: 48px × 48px for mobile

✅ **Keyboard Navigation:**
- All interactive elements accessible via Tab/Shift+Tab
- Logical tab order follows visual hierarchy
- Skip links for main content

✅ **Reduced Motion:**
- Respects `prefers-reduced-motion` media query
- Animations reduced to 0.01ms duration when enabled

### Known Accessibility Issues

⚠️ **CRITICAL (Severity 5/5)** - See Story 10.1 Audit:
- Profile page: Hardcoded gray colors cause contrast failures in dark mode
- Garage page: Expected similar issues
- **Status:** To be fixed in Story 10.3

⚠️ **HIGH (Severity 4/5)**:
- Vehicles page: Hardcoded grays instead of semantic tokens
- VehicleCard component: Hardcoded colors
- **Status:** To be fixed in Story 10.3

---

## Dark Mode

**Primary Theme:** Dark mode (navy/charcoal palette)
**Light Mode:** Available but dark mode is default

**Implementation:**
- All color tokens defined in `app/globals.css` under `:root` (light) and `.dark` (dark)
- Components use semantic tokens (`text-foreground`, `bg-card`) that adapt automatically
- Theme switcher available via system preference

**Best Practice:**
```tsx
// ✅ Good - adapts to theme automatically
<p className="text-foreground bg-card">

// ❌ Bad - hardcoded, breaks in dark mode
<p className="text-gray-900 bg-white">
```

---

## Implementation Notes

### Using Design Tokens

**CSS Custom Properties:**
```css
.my-component {
  color: var(--color-text-primary);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-8);
  box-shadow: var(--shadow-medium);
}
```

**Tailwind Semantic Classes:**
```tsx
<div className="text-foreground bg-card border-border rounded-lg shadow-md">
  Card content
</div>
```

**Component Tokens:**
```tsx
// ShadCN components automatically use design tokens
<Card>
  <CardHeader>
    <CardTitle>Uses foreground color</CardTitle>
  </CardHeader>
</Card>
```

### Do's and Don'ts

✅ **DO:**
- Use semantic tokens: `text-foreground`, `bg-card`, `border-border`
- Use ShadCN components when possible (built with tokens)
- Reference design tokens via `var(--token-name)`
- Test in both light and dark modes
- Follow 4px spacing grid

❌ **DON'T:**
- Hardcode colors: `text-gray-900`, `bg-blue-600`
- Use arbitrary Tailwind values without reason: `text-[#ff0000]`
- Mix spacing systems (stick to 4px grid)
- Skip accessibility testing

### Example: Services Page (Gold Standard)

The services page (`app/services/page.tsx`) demonstrates **excellent design token usage**:

```tsx
<h2 className="text-3xl font-bold text-foreground sm:text-4xl">
  Our Services
</h2>
<p className="text-lg text-muted-foreground">
  Choose the service that best fits your BMW's needs.
</p>
<section className="rounded-lg border bg-card p-8">
  <a href="tel:513-554-1269" className="text-primary hover:underline">
    513-554-1269
  </a>
</section>
```

**Why it's good:**
- All colors use semantic tokens
- No hardcoded values
- Works perfectly in light and dark modes
- Maintains consistency

---

## Reference Architecture

**Design Token Definitions:** `app/globals.css` lines 37-235
**ShadCN Theme Mappings:** `app/globals.css` lines 237-306
**Component Examples:** `app/services/page.tsx` (best practice)
**Audit Documentation:** `docs/design-system-audit-2025-10-28.md`

---

## Changelog

**2025-10-28 - Story 10.1 Synchronization:**
- Updated font family from Inter/Outfit to Figtree (matches implementation)
- Updated brand colors to match globals.css (blue primary instead of red/navy/blue mix)
- Updated typography scale to Linear system (14px base)
- Added comprehensive color token documentation
- Added spacing patterns and usage guidance
- Added shadow elevation system
- Added animation timing tokens
- Added accessibility audit findings
- Added do's/don'ts and best practices
- Added reference to services page as gold standard

**Next Updates:**
- Story 10.2: Typography refinements (uppercase heading decision)
- Story 10.3: Accessibility fixes documented
- Story 10.4: Component visual unification
- Story 10.5: Layout and spacing polish
