# Development Tools

This directory contains development-only components that help with debugging, testing, and visual inspection of the application.

## Available Tools

### 1. Component Hierarchy Visualizer

**File:** `ComponentHierarchyVisualizer.tsx`

A visual debugging tool that displays animated dashed outlines around DOM elements with color-coding based on nesting depth.

#### Features

- **Color-coded hierarchy levels:**
  - Level 1: Blue (`#3B82F6`)
  - Level 2: Green (`#22C55E`)
  - Level 3: Yellow (`#EAB308`)
  - Level 4: Orange (`#F97316`)
  - Level 5+: Red (`#EF4444`)

- **Animated dashed borders:** SVG-based 1px dashed outlines with smooth animation
- **Component labels:** Small pill-shaped labels showing component/element name and depth level
- **Keyboard shortcut:** Toggle with `Cmd/Ctrl + H`
- **Smart filtering:** Only shows visible elements with reasonable size (>20px)
- **Auto-refresh:** Updates on scroll, resize, and every 2 seconds to catch dynamic content
- **Accessibility:** Respects `prefers-reduced-motion` for animation

#### Usage

The visualizer is automatically included in development mode via `app/layout.tsx`. No additional setup required.

To toggle:
1. Press `Cmd + H` (Mac) or `Ctrl + H` (Windows/Linux)
2. Click the "Component Hierarchy" button in the Dev Tools popout

#### Implementation Details

- Uses SVG for smooth dashed border animation
- Scans DOM tree recursively, calculating depth from `<body>`
- Attempts to extract React component names from internal React properties
- Falls back to element tag + id + class names for labeling
- Excludes script, style, and dev tool elements from visualization
- All outlines and labels are pointer-events-none to avoid interfering with page interaction

---

### 2. Dev Mode Popout

**File:** `DevModePopout.tsx`

A floating popout panel providing quick access to:
- Service status monitoring (Sanity, Shopify, Google OAuth)
- Debug tool toggles (Component Hierarchy Visualizer)
- Complete sitemap with quick navigation links

#### Features

- Floating button in bottom-right corner
- Service health indicators with status dots
- Direct links to external consoles (Google OAuth)
- Expandable sitemap sections
- Auto-refresh service status every 30 seconds

---

### 3. Grid Overlay

**File:** `GridOverlay.tsx`

Displays the 12-column grid system used throughout the site.

#### Features

- 12 columns with 82px width each
- Diagonal hash pattern for padding visualization
- Toggle with `Cmd/Ctrl + G`

---

### 4. Transition Debugger

**File:** `TransitionDebugger.tsx`

Shows visual feedback during page transitions.

#### Features

- Small indicator showing transition state
- Transition counter
- Matches actual transition duration (1400ms)
- Auto-hides when not transitioning

---

## Development Guidelines

### Adding New Dev Tools

1. Create a new component in `components/dev/`
2. Export the component
3. Import and add to `app/layout.tsx` with `isDev` check:

```tsx
{isDev && <YourNewDevTool />}
```

### Best Practices

- Always use `data-dev-tool` attribute to mark dev tool elements
- Use high z-index values (9999+) to ensure visibility
- Make tools pointer-events-none when they shouldn't block interaction
- Add keyboard shortcuts for quick toggling
- Respect `prefers-reduced-motion` for animations
- Include visual indicators when tools are active

### Keyboard Shortcuts

| Shortcut | Tool |
|----------|------|
| `Cmd/Ctrl + H` | Component Hierarchy Visualizer |
| `Cmd/Ctrl + G` | Grid Overlay |

---

## Technical Notes

### Component Hierarchy Visualizer

The visualizer attempts to extract meaningful component names using several strategies:

1. **Data attributes:** Checks for `data-component` attribute
2. **React internals:** Looks for React fiber properties (`__react*`, `_react*`)
3. **Fallback:** Uses element tag + id + first two class names

For best results, consider adding `data-component` attributes to key components:

```tsx
<div data-component="ProductCard">
  {/* component content */}
</div>
```

### Performance Considerations

- DOM scanning is throttled to every 2 seconds
- Scroll and resize handlers use `requestAnimationFrame`
- Only visible elements are processed
- SVG rendering is hardware-accelerated

### Browser Compatibility

All dev tools are tested and working in:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

---

## Troubleshooting

### Hierarchy Visualizer not showing outlines

1. Check that you're in development mode (`NODE_ENV=development`)
2. Verify the visualizer is enabled (press `Cmd/Ctrl + H`)
3. Check browser console for errors
4. Ensure elements have sufficient size (>20px width and height)

### Keyboard shortcuts not working

1. Ensure focus is on the page (not in browser DevTools)
2. Check for conflicting browser extensions
3. Try clicking on the page first to ensure it has focus

### Performance issues

If the visualizer causes lag:
1. Reduce the number of DOM elements on the page
2. Increase the refresh interval in the component
3. Disable the visualizer when not needed

---

## Future Enhancements

Potential improvements for the Component Hierarchy Visualizer:

- [ ] Click to inspect element details
- [ ] Filter by component name or depth level
- [ ] Export hierarchy tree as JSON
- [ ] Highlight parent-child relationships on hover
- [ ] Show component props in tooltip
- [ ] Integration with React DevTools
- [ ] Performance metrics per component
- [ ] Custom color schemes
