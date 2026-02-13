# Page Transitions

Smooth, element-by-element page transitions for the Enthusiast Auto Group website.

---

## Overview

The page transition system provides a modern, fluid navigation experience with staggered fade animations. When users navigate between pages, content fades out element-by-element, then new content fades in with the same staggered effect.

**Total transition time:** <1.4 seconds
- **Fade out:** 0.5s base + up to 0.3s stagger (capped at 0.8s total)
- **Fade in:** 0.6s base + up to 0.4s stagger (capped at 1.0s total)

---

## Architecture

### Components

| File | Purpose |
|------|---------|
| `components/ui/page-transition.tsx` | Main transition component with animation logic |
| `app/template.tsx` | Root template that wraps all pages |
| `app/globals.css` | CSS animations and keyframes |

### How It Works

1. **Detection:** Component detects route changes via `usePathname()`
2. **Fade Out:** Current page elements fade out with staggered delays (30ms per element)
3. **Content Swap:** New page content is loaded into the DOM
4. **Fade In:** New elements fade in with staggered delays (40ms per element)
5. **Cleanup:** Animation classes and styles are removed

### Performance Optimizations

- **Stagger Limit:** Maximum 10 elements for stagger calculation (prevents overly long transitions)
- **Duration Caps:** Fade out capped at 800ms, fade in at 1000ms
- **GPU Acceleration:** Uses `transform` and `opacity` for hardware-accelerated animations
- **Will-Change:** Applied during animations, removed after completion
- **RequestAnimationFrame:** Ensures smooth DOM updates

---

## Implementation

### Basic Setup

The transition system is already configured at the root level via `app/template.tsx`:

```tsx
import { PageTransition } from 'components/ui/page-transition';

export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
```

This automatically applies transitions to **all pages** in the application.

### Page Structure

For optimal transitions, structure your pages with clear top-level sections:

```tsx
// Good: Clear sections for staggered animation
export default function Page() {
  return (
    <>
      <PageHero />
      <FeaturedSection />
      <ContentGrid />
      <CallToAction />
    </>
  );
}

// Also works: Single wrapper
export default function Page() {
  return (
    <div className="container">
      {/* Content */}
    </div>
  );
}
```

### Disabling Transitions

To disable transitions for specific pages, create a page-specific `template.tsx`:

```tsx
// app/admin/template.tsx
export default function AdminTemplate({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```

---

## CSS Animations

### Animation Classes

| Class | Purpose | Duration |
|-------|---------|----------|
| `.page-transition-exit` | Fade out current content | 0.5s + stagger |
| `.page-transition-enter` | Fade in new content | 0.6s + stagger |

### Custom Properties

| Property | Default | Purpose |
|----------|---------|---------|
| `--transition-fade-out` | 0.5s | Exit animation duration |
| `--transition-fade-in` | 0.6s | Enter animation duration |
| `--transition-stagger-out` | 30ms | Exit stagger delay per element |
| `--transition-stagger-in` | 40ms | Enter stagger delay per element |
| `--stagger-index` | Dynamic | Element index for stagger calculation |

### Customizing Animations

To adjust transition timing, modify the CSS variables in `globals.css`:

```css
@theme inline {
  /* Faster transitions */
  --transition-fade-out: 0.3s;
  --transition-fade-in: 0.4s;
  --transition-stagger-out: 20ms;
  --transition-stagger-in: 30ms;
}
```

To change animation style, modify the keyframes:

```css
/* Example: Slide from right instead of vertical movement */
@keyframes pageTransitionFadeIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
```

---

## Accessibility

### Reduced Motion Support

The transition system respects `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  .page-transition-exit,
  .page-transition-enter {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}
```

Users with motion sensitivity see instant page changes without animations.

### Focus Management

- Focus is preserved during transitions
- Skip-to-content link remains accessible
- Keyboard navigation works throughout transitions

---

## Browser Support

| Feature | Support |
|---------|---------|
| CSS Custom Properties | All modern browsers |
| CSS Animations | All modern browsers |
| `will-change` | All modern browsers |
| `requestAnimationFrame` | All modern browsers |

**Fallback:** Browsers without support show instant page changes (graceful degradation).

---

## Performance Considerations

### Best Practices

1. **Keep page structures simple:** Fewer top-level elements = faster transitions
2. **Optimize images:** Use `next/image` with proper sizing
3. **Prefetch routes:** Next.js Link components automatically prefetch
4. **Avoid layout shifts:** Use fixed dimensions where possible

### Performance Metrics

Target metrics with transitions enabled:

| Metric | Target |
|--------|--------|
| Time to Interactive (TTI) | < 3.5s |
| First Contentful Paint (FCP) | < 1.5s |
| Cumulative Layout Shift (CLS) | < 0.1 |

### Monitoring

Monitor transition performance in production:

```javascript
// Add to analytics
performance.mark('transition-start');
// ... transition occurs ...
performance.mark('transition-end');
performance.measure('page-transition', 'transition-start', 'transition-end');
```

---

## Troubleshooting

### Transitions Not Working

1. **Check template.tsx exists** at `app/template.tsx`
2. **Verify CSS is loaded** - check `globals.css` includes transition styles
3. **Inspect console** for React hydration errors
4. **Test in production build** - dev mode may behave differently

### Transitions Too Slow

1. **Reduce stagger delays** in CSS variables
2. **Decrease base durations** (fade-out, fade-in)
3. **Simplify page structure** - fewer top-level elements
4. **Check for heavy components** that slow rendering

### Janky Animations

1. **Optimize images** - use proper formats and sizes
2. **Reduce JavaScript execution** during transitions
3. **Check for layout recalculations** in DevTools Performance tab
4. **Ensure GPU acceleration** - verify `transform` and `opacity` are used

### Content Flashing

1. **Verify `displayChildren` state** is updating correctly
2. **Check for CSS conflicts** with transition classes
3. **Ensure proper cleanup** of animation classes
4. **Test with React DevTools** to inspect component lifecycle

---

## Examples

### Homepage to Vehicle Page

```
1. User clicks vehicle card link
2. Homepage sections fade out (hero → featured → grid)
3. Content swaps to vehicle detail page
4. Vehicle page sections fade in (hero → gallery → specs → CTA)
Total: ~1.2s
```

### Parts to Product Detail

```
1. User clicks product card
2. Parts grid fades out
3. Product detail loads
4. Product sections fade in (images → details → add-to-cart)
Total: ~1.0s
```

---

## Future Enhancements

Potential improvements for future iterations:

- [ ] **Shared element transitions** - Animate specific elements between pages
- [ ] **Loading states** - Show skeleton loaders during transitions
- [ ] **Direction-aware animations** - Different animations for back/forward
- [ ] **Per-route customization** - Custom transition styles per page type
- [ ] **Transition events** - Expose hooks for analytics and custom logic

---

## Related Documentation

- [Next.js App Router](https://nextjs.org/docs/app)
- [CSS Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations)
- [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)
- [WCAG Motion Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html)
