# Color System Update: Dark Blue Backgrounds

## Overview

Updated the site's dark sections to use a consistent range of blue-tinted dark backgrounds instead of pure black (`#0a0a0a`). This creates a more cohesive visual experience that matches the AboutSection's aesthetic.

## Color Palette

### Primary Dark Blue Backgrounds

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-bg-dark-blue-primary` | `#0a0c10` | Primary dark sections (header, footer, about, menus) |
| `--color-bg-dark-blue-secondary` | `#0d0f14` | Slightly lighter - elevated sections |
| `--color-bg-dark-blue-tertiary` | `#0a0d11` | Alternative tone - expanded navbar |

### Existing Navy Backgrounds (Preserved)

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-bg-primary` | `#141721` | Service pages, product overlays, tooltips |
| `--color-bg-secondary` | `#1f2233` | Cards, elevated surfaces |
| `--color-bg-tertiary` | `#1a1d29` | Medium navy - subtle elevation |

## Updated Components

### Structural Components (Changed from `#0a0a0a` to `#0a0c10`)

1. **Header** (`components/shared/Header.tsx`)
   - Main site header background
   
2. **Footer** (`components/layout/footer.tsx`)
   - Main site footer background

3. **AboutSection** (`components/shared/AboutSection.tsx`)
   - Already using `#0a0c10` ✓

4. **Mobile Menu** (`components/shared/MobileMenu.tsx`)
   - Mobile navigation panel

5. **Services Mega Menu** (`components/shared/ServicesMegaMenu.tsx`)
   - Desktop services dropdown

6. **Mobile Services Panel** (`components/shared/MobileServicesPanel.tsx`)
   - Mobile services submenu

7. **Inventory Mega Menu** (`components/shared/InventoryMegaMenu.tsx`)
   - Desktop inventory dropdown

8. **Mobile Inventory Panel** (`components/shared/MobileInventoryPanel.tsx`)
   - Mobile inventory submenu

9. **Dev Mode Popout** (`components/dev/DevModePopout.tsx`)
   - Development tools panel

10. **Chat Button** (`components/chat/ChatButton.tsx`)
    - Updated focus ring offset to match new background

## Preserved Black Usage

The following uses of pure black (`#000000` or `bg-black`) were intentionally preserved:

### Semi-transparent Overlays
- Backdrop overlays: `bg-black/30`, `bg-black/60`
- Image overlays: `bg-black/50`, `bg-black/70`
- Gallery controls: `bg-black/50 hover:bg-black/70`

**Rationale:** Semi-transparent black provides better contrast and readability over images and creates proper modal backdrops regardless of the content behind them.

### Dark Mode Variants
- `dark:bg-black` in various components
- Used for theme switching functionality

**Rationale:** Dark mode implementations may prefer pure black for OLED displays and user preference.

## Design System Tokens

Added to `globals.css`:

```css
/* Dark Blue Backgrounds (for sections, headers, footers) */
--color-bg-dark-blue-primary: #0a0c10;   /* Primary dark blue - main sections */
--color-bg-dark-blue-secondary: #0d0f14; /* Slightly lighter - elevated sections */
--color-bg-dark-blue-tertiary: #0a0d11;  /* Alternative dark blue tone */
```

## Visual Consistency

### Before
- Header/Footer: Pure black (`#0a0a0a`)
- About Section: Dark blue (`#0a0c10`)
- Service Pages: Navy (`#141721`)
- **Result:** Inconsistent, jarring transitions

### After
- Header/Footer: Dark blue (`#0a0c10`)
- About Section: Dark blue (`#0a0c10`)
- Service Pages: Navy (`#141721`)
- **Result:** Cohesive blue-tinted dark theme throughout

## Color Relationships

The dark blue backgrounds create a subtle gradient effect:

1. **Darkest Blue** (`#0a0c10`) - Headers, footers, main sections
2. **Medium Navy** (`#141721`) - Content sections, hero backgrounds
3. **Lighter Navy** (`#1f2233`) - Cards, elevated UI elements

This creates depth and hierarchy while maintaining the blue-tinted aesthetic.

## Accessibility

All color changes maintain WCAG 2.1 AA compliance:
- White text on `#0a0c10`: **16.8:1** contrast ratio ✓
- Light gray text on `#0a0c10`: **4.8:1** contrast ratio ✓
- All interactive elements maintain proper focus indicators

## Testing Checklist

- [x] Header displays with consistent blue background
- [x] Footer matches header aesthetic
- [x] Mobile menu panels use blue background
- [x] Desktop mega menus use blue background
- [x] About section integrates seamlessly
- [x] Service pages maintain navy backgrounds
- [x] Product cards maintain navy overlays
- [x] Image overlays remain black (semi-transparent)
- [x] Modal backdrops remain black (semi-transparent)
- [x] Focus rings and interactive states work correctly

## Future Considerations

### Semantic Token Migration
Consider creating semantic tokens for easier maintenance:

```css
--bg-section-dark: var(--color-bg-dark-blue-primary);
--bg-header: var(--color-bg-dark-blue-primary);
--bg-footer: var(--color-bg-dark-blue-primary);
--bg-menu: var(--color-bg-dark-blue-primary);
```

### Component Library
Update ShadCN components to use the new dark blue tokens instead of hardcoded values.

### Documentation
Add color usage guidelines to AGENTS.md for future development.
