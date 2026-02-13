# Testing Page Transitions

Guide for testing the page transition system in development and production.

---

## Quick Start

### Development Mode

1. **Start the dev server:**
   ```bash
   cd website
   npm run dev
   ```

2. **Open browser:**
   Navigate to `http://localhost:3040`

3. **Look for the debugger:**
   A small indicator appears in the bottom-right corner showing transition status

4. **Test navigation:**
   Click any link to see the transition effect

---

## Visual Indicators

### Transition Debugger (Dev Only)

The `TransitionDebugger` component shows:

- **Green pulsing dot:** Transition is active
- **Gray dot:** Ready for next transition
- **Transition count:** Number of transitions since page load

**Location:** Bottom-right corner of the screen

---

## Test Scenarios

### 1. Basic Navigation

**Test:** Homepage → Vehicles

**Expected behavior:**
1. Homepage sections fade out sequentially (hero → featured → services)
2. Brief pause during content swap
3. Vehicle page sections fade in sequentially (hero → filters → grid)
4. Total time: ~1.2 seconds

**What to check:**
- ✅ Smooth fade animations
- ✅ No content flashing
- ✅ No layout shifts
- ✅ Proper stagger timing

### 2. Complex Pages

**Test:** Vehicles → Vehicle Detail

**Expected behavior:**
1. Vehicle grid fades out element by element
2. Vehicle detail page fades in (gallery → specs → description → CTA)
3. Images load smoothly without blocking transition

**What to check:**
- ✅ Large images don't cause jank
- ✅ Transition completes even with slow images
- ✅ Stagger effect visible on grid items

### 3. Fast Navigation

**Test:** Rapid clicking between pages

**Expected behavior:**
1. Each navigation triggers a new transition
2. Previous transition is interrupted gracefully
3. No animation artifacts or stuck states

**What to check:**
- ✅ No overlapping animations
- ✅ Proper cleanup between transitions
- ✅ Debugger count increments correctly

### 4. Back/Forward Navigation

**Test:** Use browser back/forward buttons

**Expected behavior:**
1. Transitions work the same as link clicks
2. Content is restored from cache quickly
3. Smooth animation in both directions

**What to check:**
- ✅ Back button triggers transition
- ✅ Forward button triggers transition
- ✅ No duplicate content during transition

### 5. Reduced Motion

**Test:** Enable "Reduce motion" in OS settings

**macOS:** System Settings → Accessibility → Display → Reduce motion
**Windows:** Settings → Ease of Access → Display → Show animations

**Expected behavior:**
1. Transitions are disabled completely
2. Page changes are instant
3. No animation artifacts

**What to check:**
- ✅ No fade animations
- ✅ Instant page changes
- ✅ No opacity or transform changes

---

## Performance Testing

### Chrome DevTools

1. **Open DevTools:** `Cmd/Ctrl + Shift + I`
2. **Go to Performance tab**
3. **Start recording**
4. **Navigate between pages**
5. **Stop recording**

**What to check:**

- **FPS:** Should stay at 60fps during transition
- **Layout shifts:** Minimal or zero layout recalculations
- **Paint events:** Smooth, no large paint operations
- **JavaScript execution:** Minimal blocking during animation

### Lighthouse

1. **Open DevTools**
2. **Go to Lighthouse tab**
3. **Run audit** (Performance + Accessibility)

**Target scores:**

| Metric | Target | Notes |
|--------|--------|-------|
| Performance | ≥ 90 | With transitions enabled |
| Accessibility | ≥ 90 | Including reduced motion |
| LCP | < 2.5s | Largest Contentful Paint |
| CLS | < 0.1 | Cumulative Layout Shift |

---

## Browser Testing

### Desktop Browsers

Test in each browser:

- [ ] **Chrome** (latest)
- [ ] **Firefox** (latest)
- [ ] **Safari** (latest)
- [ ] **Edge** (latest)

**What to check:**
- Transition timing is consistent
- No visual glitches
- Smooth animations at 60fps
- Reduced motion works

### Mobile Browsers

Test on real devices:

- [ ] **iOS Safari** (iPhone)
- [ ] **Chrome Mobile** (Android)
- [ ] **Samsung Internet** (Android)

**What to check:**
- Transitions work on touch navigation
- Performance is smooth (no jank)
- No layout issues on small screens
- Battery impact is minimal

---

## Accessibility Testing

### Keyboard Navigation

1. **Tab through links** on homepage
2. **Press Enter** to navigate
3. **Observe transition**

**What to check:**
- ✅ Focus is preserved during transition
- ✅ Focus ring remains visible
- ✅ Tab order is correct after transition
- ✅ Skip-to-content link works

### Screen Readers

Test with:
- **macOS:** VoiceOver (`Cmd + F5`)
- **Windows:** NVDA (free download)
- **iOS:** VoiceOver (Settings → Accessibility)

**What to check:**
- ✅ Page title is announced after transition
- ✅ No duplicate announcements
- ✅ Content is accessible during transition
- ✅ No focus traps

### Motion Sensitivity

1. **Enable "Reduce motion"** in OS settings
2. **Navigate between pages**
3. **Verify instant page changes**

**What to check:**
- ✅ No animations play
- ✅ Content changes instantly
- ✅ No opacity transitions
- ✅ No transform animations

---

## Common Issues

### Issue: Transitions Not Visible

**Symptoms:**
- Pages change instantly
- No fade animations
- Debugger shows "Ready" immediately

**Possible causes:**
1. CSS not loaded correctly
2. `template.tsx` not in correct location
3. React hydration error
4. Reduced motion enabled

**How to fix:**
1. Check browser console for errors
2. Verify `app/template.tsx` exists
3. Check Network tab for `globals.css`
4. Disable reduced motion in OS settings

### Issue: Janky Animations

**Symptoms:**
- Choppy fade effect
- FPS drops during transition
- Visible stuttering

**Possible causes:**
1. Heavy JavaScript execution
2. Large unoptimized images
3. Too many DOM elements
4. Browser extensions interfering

**How to fix:**
1. Optimize images with `next/image`
2. Reduce page complexity
3. Check Performance tab in DevTools
4. Disable browser extensions
5. Test in Incognito mode

### Issue: Content Flashing

**Symptoms:**
- Brief flash of new content
- Overlapping content
- Duplicate elements visible

**Possible causes:**
1. React hydration mismatch
2. CSS conflicts
3. Async content loading
4. State management issue

**How to fix:**
1. Check for hydration errors in console
2. Verify CSS specificity
3. Ensure content is ready before render
4. Test with React DevTools

### Issue: Transitions Too Slow

**Symptoms:**
- Transitions feel sluggish
- Users wait too long
- Navigation feels unresponsive

**Possible causes:**
1. Too many elements staggering
2. Base durations too long
3. Heavy page content
4. Slow network

**How to fix:**
1. Reduce stagger delays in CSS
2. Decrease base durations
3. Simplify page structure
4. Optimize content loading

---

## Debugging Tools

### React DevTools

**Install:** Chrome/Firefox extension

**How to use:**
1. Open DevTools
2. Go to "Components" tab
3. Find `PageTransition` component
4. Inspect state and props

**What to check:**
- `isTransitioning` state
- `displayChildren` content
- `pathname` changes
- Effect cleanup

### Chrome Performance Monitor

**How to open:**
1. Open DevTools
2. Press `Cmd/Ctrl + Shift + P`
3. Type "Show Performance Monitor"
4. Press Enter

**What to watch:**
- CPU usage during transition
- FPS (should stay at 60)
- DOM nodes count
- JS heap size

### Network Throttling

**How to enable:**
1. Open DevTools
2. Go to Network tab
3. Select throttling profile (e.g., "Fast 3G")
4. Test transitions

**What to check:**
- Transitions still smooth
- Content loads progressively
- No blocking requests
- Proper loading states

---

## Automated Testing

### Playwright Example

```typescript
import { test, expect } from '@playwright/test';

test('page transition works', async ({ page }) => {
  // Navigate to homepage
  await page.goto('http://localhost:3040');
  
  // Click a link
  await page.click('a[href="/vehicles"]');
  
  // Wait for transition to complete
  await page.waitForTimeout(1500);
  
  // Verify new page loaded
  await expect(page).toHaveURL(/.*vehicles/);
  await expect(page.locator('h1')).toContainText('Vehicles');
});

test('respects reduced motion', async ({ page }) => {
  // Enable reduced motion
  await page.emulateMedia({ reducedMotion: 'reduce' });
  
  // Navigate
  await page.goto('http://localhost:3040');
  await page.click('a[href="/vehicles"]');
  
  // Verify instant navigation (no transition delay)
  await page.waitForTimeout(100);
  await expect(page).toHaveURL(/.*vehicles/);
});
```

### Cypress Example

```javascript
describe('Page Transitions', () => {
  it('should animate between pages', () => {
    cy.visit('http://localhost:3040');
    
    // Click link
    cy.contains('Vehicles').click();
    
    // Wait for transition
    cy.wait(1500);
    
    // Verify navigation
    cy.url().should('include', '/vehicles');
    cy.contains('h1', 'Vehicles').should('be.visible');
  });
  
  it('should handle rapid navigation', () => {
    cy.visit('http://localhost:3040');
    
    // Rapid clicks
    cy.contains('Vehicles').click();
    cy.wait(200);
    cy.contains('Services').click();
    cy.wait(200);
    cy.contains('Blog').click();
    
    // Verify final destination
    cy.wait(1500);
    cy.url().should('include', '/blog');
  });
});
```

---

## Production Testing

### Pre-Deployment Checklist

Before deploying to production:

- [ ] All test scenarios pass
- [ ] Performance metrics meet targets
- [ ] Accessibility tests pass
- [ ] Cross-browser testing complete
- [ ] Mobile testing complete
- [ ] Reduced motion works correctly
- [ ] No console errors
- [ ] Lighthouse scores ≥ 90

### Post-Deployment Monitoring

After deploying:

1. **Monitor Core Web Vitals:**
   - LCP (Largest Contentful Paint)
   - FID (First Input Delay)
   - CLS (Cumulative Layout Shift)

2. **Check Error Tracking:**
   - No JavaScript errors related to transitions
   - No React hydration errors
   - No animation-related warnings

3. **Gather User Feedback:**
   - Survey users about navigation experience
   - Monitor bounce rates
   - Check session duration

4. **A/B Testing (Optional):**
   - Test with/without transitions
   - Measure engagement metrics
   - Analyze user preferences

---

## Rollback Plan

If issues arise in production:

### Quick Disable

Remove `template.tsx`:

```bash
cd website/app
rm template.tsx
```

Then redeploy. This immediately disables transitions.

### Partial Disable

Disable for specific routes:

```tsx
// app/admin/template.tsx
export default function AdminTemplate({ children }) {
  return <>{children}</>;
}
```

### CSS-Only Disable

Comment out animations in `globals.css`:

```css
/* Temporarily disable transitions */
.page-transition-exit,
.page-transition-enter {
  animation: none !important;
  opacity: 1 !important;
  transform: none !important;
}
```

---

## Support

For issues or questions:

1. Check this testing guide
2. Review `docs/PAGE_TRANSITIONS.md`
3. Check browser console for errors
4. Test in Incognito mode
5. Verify reduced motion settings
6. Contact development team

---

## Resources

- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [CSS Animations MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations)
- [WCAG Motion Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html)
- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)
- [Lighthouse Documentation](https://developer.chrome.com/docs/lighthouse/)
