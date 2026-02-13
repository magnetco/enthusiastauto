# Component Hierarchy Visualizer - Usage Guide

## Overview

The Component Hierarchy Visualizer is a new development tool that displays color-coded animated outlines around DOM elements based on their nesting depth. This helps you visualize the component structure and hierarchy of your application.

## Features

### Color-Coded Hierarchy Levels

The visualizer uses different colors for each level of nesting:

| Level | Color | Hex Code | Usage |
|-------|-------|----------|-------|
| 1 | 🔵 Blue | `#3B82F6` | Top-level components (directly under body) |
| 2 | 🟢 Green | `#22C55E` | Second-level components |
| 3 | 🟡 Yellow | `#EAB308` | Third-level components |
| 4 | 🟠 Orange | `#F97316` | Fourth-level components |
| 5+ | 🔴 Red | `#EF4444` | Fifth-level and deeper components |

### Visual Elements

1. **Animated Dashed Outlines**: Each component gets a 1px dashed border with rounded corners (4px radius) that animates smoothly
2. **Component Labels**: Small pill-shaped labels appear above each component showing:
   - Component/element name
   - Depth level (L1, L2, L3, etc.)

### Smart Filtering

The visualizer only shows:
- Elements with width and height > 20px
- Elements currently visible in the viewport
- Non-script, non-style elements
- Elements outside the dev tools themselves

## How to Use

### Method 1: Keyboard Shortcut (Recommended)

Press `Cmd + H` (Mac) or `Ctrl + H` (Windows/Linux) to toggle the visualizer on/off.

### Method 2: Dev Tools Popout

1. Click the floating Dev Tools button (bottom-right corner with code icon)
2. In the "Debug Tools" section, click "Component Hierarchy"
3. The visualizer will toggle on/off

## What You'll See

When enabled, you'll see:

1. **Indicator Badge** (bottom-left): Shows the visualizer is active with a color legend
2. **Dashed Outlines**: Animated borders around each component
3. **Labels**: Component names with depth levels

Example visualization:

```
┌─────────────────────────────────────────┐
│ Header · L1 (Blue outline)              │
│  ┌────────────────────────────────────┐ │
│  │ DesktopNavbar · L2 (Green outline)│ │
│  │  ┌──────────────────────────────┐  │ │
│  │  │ NavLink · L3 (Yellow outline)│  │ │
│  │  └──────────────────────────────┘  │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

## Component Name Detection

The visualizer attempts to show meaningful component names using this priority:

1. **Data attribute**: `data-component="ComponentName"`
2. **React internals**: Extracted from React fiber properties
3. **Fallback**: Element tag + id + class names (e.g., `div#main.container`)

### Pro Tip: Adding Custom Labels

For better visualization, add `data-component` attributes to your key components:

```tsx
// Before
<div className="product-card">
  {/* content */}
</div>

// After (shows "ProductCard" in visualizer)
<div className="product-card" data-component="ProductCard">
  {/* content */}
</div>
```

## Performance

The visualizer is optimized for performance:

- Updates on scroll/resize using `requestAnimationFrame`
- Periodic refresh every 2 seconds for dynamic content
- Only processes visible elements
- Hardware-accelerated SVG rendering
- Respects `prefers-reduced-motion` accessibility setting

## Use Cases

### 1. Understanding Component Structure

Quickly see how deeply nested your components are and identify potential refactoring opportunities.

### 2. Debugging Layout Issues

Visualize which components are taking up space and how they're nested.

### 3. Identifying Over-Nesting

Red outlines (Level 5+) indicate deeply nested components that might benefit from flattening.

### 4. Component Boundaries

See exactly where one component ends and another begins.

### 5. Learning the Codebase

New developers can quickly understand the component hierarchy without reading code.

## Troubleshooting

### Visualizer not appearing

1. Ensure you're in development mode (`NODE_ENV=development`)
2. Check that the dev server is running
3. Press `Cmd/Ctrl + H` to toggle on
4. Check browser console for errors

### Labels are cut off

Labels are automatically truncated to fit within the component width (max 200px). Hover or zoom to see full names.

### Too many outlines

This is normal for complex pages. Focus on specific sections or use the keyboard shortcut to toggle on/off as needed.

### Performance issues

If the visualizer causes lag:
1. Reduce page complexity
2. Toggle off when not needed
3. Close other browser tabs

## Technical Details

### Implementation

- **Framework**: React 19 with Next.js 15
- **Rendering**: SVG-based outlines with CSS animations
- **DOM Scanning**: Recursive tree traversal from `<body>`
- **Update Strategy**: Event-driven (scroll/resize) + periodic polling

### Files

- `website/components/dev/ComponentHierarchyVisualizer.tsx` - Main component
- `website/components/dev/DevModePopout.tsx` - Control panel
- `website/app/layout.tsx` - Integration point

### Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)

## Examples

### Typical Homepage Hierarchy

```
Level 1 (Blue):
  - Header
  - Main
  - Footer

Level 2 (Green):
  - DesktopNavbar (in Header)
  - HeroSection (in Main)
  - FeaturedVehicles (in Main)
  - ServicesSection (in Main)

Level 3 (Yellow):
  - NavLinks (in DesktopNavbar)
  - HeroContent (in HeroSection)
  - VehicleCard (in FeaturedVehicles)

Level 4 (Orange):
  - Button (in NavLinks)
  - Image (in VehicleCard)

Level 5+ (Red):
  - Icon (in Button)
  - Text (in Image caption)
```

## Best Practices

1. **Use Sparingly**: Toggle on when debugging, off when developing
2. **Add Data Attributes**: For key components you frequently inspect
3. **Watch for Red**: Deep nesting (5+ levels) may indicate refactoring opportunities
4. **Combine with DevTools**: Use alongside React DevTools for full debugging power
5. **Share Screenshots**: Visual hierarchy is great for team discussions

## Future Enhancements

Planned features:
- Click to inspect element details
- Filter by component name or depth
- Export hierarchy as JSON
- Highlight parent-child relationships on hover
- Integration with React DevTools

## Feedback

If you encounter issues or have suggestions, please:
1. Check the browser console for errors
2. Verify you're on the latest development build
3. Document the issue with screenshots
4. Share feedback with the development team

---

**Happy Debugging! 🎨**
