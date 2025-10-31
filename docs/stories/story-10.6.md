# Story 10.6: Homepage Hero Enhancement

**Epic:** 10 - Design System Unification (Extension)
**Story ID:** 10.6
**Points:** 5
**Priority:** MEDIUM
**Status:** Draft

---

## Story

### Title
Homepage Hero Enhancement

### Description
Transform the homepage hero section to be more impactful, dynamic, and engaging. Increase visual prominence with a larger hero area, more dramatic background imagery, stronger headline hierarchy, and clearer value proposition that emphasizes the BMW preservation focus.

### User Story
**As a** potential customer visiting the homepage
**I want** an impactful, visually engaging hero section that immediately communicates the brand's BMW specialization
**So that** I understand the unique value proposition and feel motivated to explore inventory

---

## Context & Background

**User Request:**
Reference design shows "THE LEADING BMW PRESERVATION FACILITY" with full-height hero, dramatic BMW M3 background, and single prominent "View Inventory" CTA.

**Current State (components/shared/HeroSection.tsx):**
- Modest heading: "Your BMW Enthusiast Destination"
- Medium padding: `py-16 sm:py-20 lg:py-24` (64px to 96px)
- Low-opacity background image (opacity-20)
- Generic value proposition
- Two CTAs (Browse Vehicles, Shop Parts) - splits focus

**Target State (Reference Design):**
- Bold, impactful headline emphasizing BMW specialization
- Larger hero section (full viewport height or near-full)
- More prominent background imagery with better contrast
- Clear, compelling value proposition
- Stronger visual hierarchy
- Single primary CTA or clearer CTA hierarchy

**Severity:** 2/5 - Enhancement to improve conversion and brand perception

**Prerequisites Met:**
- ✅ Epic 10 complete (consistent design system foundation)
- ✅ Typography system consistent (Story 10.2)
- ✅ Layout patterns established (Story 10.5)

---

## Acceptance Criteria

- [ ] **AC1**: Hero section height increased to create more visual impact (min-height of 70-90vh recommended)
- [ ] **AC2**: Headline updated to emphasize BMW specialization with stronger, more compelling copy
- [ ] **AC3**: Background image opacity and contrast improved for more dramatic presentation while maintaining text readability (WCAG AA 4.5:1 minimum)
- [ ] **AC4**: Value proposition copy refined to clearly communicate unique BMW preservation/enthusiast focus
- [ ] **AC5**: CTA hierarchy clarified - either single prominent CTA or clear primary/secondary distinction
- [ ] **AC6**: Typography scale increased for hero text (use text-hero utility and larger subheadline sizes)
- [ ] **AC7**: Responsive behavior maintained - hero scales appropriately on mobile/tablet/desktop
- [ ] **AC8**: Design system tokens used consistently (no hardcoded values)

---

## Tasks

### Task 1: Analyze Reference Design & Current Implementation
- [ ] Review reference screenshot for exact design patterns
- [ ] Measure current hero section dimensions and padding
- [ ] Identify specific improvements: height, typography, imagery, CTAs
- [ ] Note accessibility requirements for increased image opacity

### Task 2: Update Hero Section Height & Layout
- [ ] Increase section height to `min-h-[70vh] lg:min-h-[85vh]` or similar
- [ ] Adjust vertical centering to work with larger height
- [ ] Update padding to maintain proper spacing at larger scale
- [ ] Test responsive behavior on mobile (avoid excessive height on small screens)

### Task 3: Enhance Typography & Copy
- [ ] Update headline to emphasize BMW specialization (e.g., "The Leading BMW Preservation Facility")
- [ ] Increase headline size using larger design tokens (text-hero on mobile, even larger on desktop)
- [ ] Refine subheadline copy to highlight specialization and expertise
- [ ] Ensure letter-spacing and line-height create proper visual hierarchy
- [ ] Apply heading-uppercase utility for visual impact if appropriate

### Task 4: Improve Background Image Presentation
- [ ] Increase background image opacity from 20% to 30-40% range
- [ ] Adjust gradient overlay to maintain text contrast (test with WCAG checker)
- [ ] Consider adding subtle vignette or directional gradient for text legibility
- [ ] Ensure image remains performant (use appropriate image optimization)
- [ ] Test contrast ratios on all text (minimum 4.5:1 for WCAG AA)

### Task 5: Refine CTA Strategy
- [ ] Decide on single primary CTA ("View Inventory") or clear primary/secondary hierarchy
- [ ] If keeping two CTAs, increase size and visual prominence of primary
- [ ] Update button sizing to lg or xl for hero context
- [ ] Ensure adequate spacing between CTAs and surrounding content
- [ ] Test CTA visibility against enhanced background image

### Task 6: Testing & Validation
- [ ] Visual regression test - compare before/after screenshots
- [ ] Accessibility test - verify WCAG AA contrast on all text with enhanced background
- [ ] Responsive test - verify hero works on mobile (375px), tablet (768px), desktop (1440px+)
- [ ] Performance test - ensure hero loads quickly and doesn't cause CLS
- [ ] Build verification - `npm run build` succeeds

---

## Implementation Notes

### Design System References

**Typography Tokens (from globals.css):**
- Hero headline: `text-hero` (--text-hero: 60px/64px/0.015em) or larger custom size
- Subheadline: `text-title-1` or `text-title-2`
- Body text: `text-body-large` or `text-body-xl`

**Spacing System (4px grid):**
- Hero padding: `py-20 sm:py-24 lg:py-32` (80px → 96px → 128px)
- Content spacing: `space-y-6` or `space-y-8`

**Layout Patterns:**
- Container: `max-w-screen-2xl` (established in Story 10.5)
- Responsive padding: `px-4 sm:px-6 lg:px-8`

### Reference Design Analysis

**Key Elements from Screenshot:**
- Headline: "THE LEADING BMW PRESERVATION FACILITY" (all caps, bold, large)
- Subtext: "We are a very specialized automotive business that exclusively focuses on BMW..."
- CTA: "View Inventory →" (single, prominent)
- Background: Dramatic BMW M3 image, darker with text overlay
- Height: Appears to be 70-80% of viewport height

### Proposed Copy (User to Approve)

**Headline (Option 1 - Reference Style):**
"THE LEADING BMW PRESERVATION FACILITY"

**Headline (Option 2 - Alternative):**
"YOUR BMW ENTHUSIAST DESTINATION"

**Subheadline (Reference Style):**
"We are a very specialized automotive business that exclusively focuses on BMW. Our full-service facility caters to the needs of enthusiasts around the world."

**Subheadline (Alternative):**
"Curated BMW vehicles for sale and premium parts for the ultimate driving machine. Hand-picked inventory from a facility dedicated to BMW preservation."

### Accessibility Considerations

**With Increased Background Opacity:**
- Background opacity: Test 30%, 35%, 40% and measure contrast
- Gradient overlay: May need to strengthen (from-background/90 → from-background/95)
- Text shadow: Consider adding stronger drop-shadow for additional contrast
- Fallback: Ensure background color provides sufficient contrast if image fails to load

**Target Contrast Ratios:**
- Headline: Minimum 4.5:1 (WCAG AA Large Text)
- Body text: Minimum 4.5:1 (WCAG AA Normal Text)
- CTA buttons: Minimum 3:1 (WCAG AA UI Components)

### Technical Implementation Notes

**Current HeroSection.tsx:**
```tsx
<section className="relative w-full overflow-hidden bg-background">
  <div className="absolute inset-0 z-0">
    <div className="h-full w-full bg-cover bg-center bg-no-repeat opacity-20" />
    <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/85 to-background" />
  </div>
  <div className="relative z-10 mx-auto max-w-screen-2xl px-4 py-16 sm:px-5 sm:py-20 lg:px-6 lg:py-24">
    {/* Content */}
  </div>
</section>
```

**Proposed Changes:**
```tsx
<section className="relative w-full overflow-hidden bg-background min-h-[70vh] lg:min-h-[85vh] flex items-center">
  <div className="absolute inset-0 z-0">
    <div className="h-full w-full bg-cover bg-center bg-no-repeat opacity-35" />
    <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/90 to-background" />
  </div>
  <div className="relative z-10 mx-auto max-w-screen-2xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
    {/* Enhanced content with larger typography */}
  </div>
</section>
```

---

## Dev Notes

### Files to Modify
- `components/shared/HeroSection.tsx` - Hero component implementation

### Testing Strategy

**Visual Testing:**
1. Screenshot before/after comparison
2. Test on multiple viewport sizes (375px, 768px, 1440px, 1920px)
3. Verify text hierarchy feels impactful and clear

**Accessibility Testing:**
1. Use browser DevTools contrast checker on all text
2. Verify keyboard navigation works (focus states visible)
3. Test with screen reader (headline and CTAs announced correctly)

**Performance Testing:**
1. Lighthouse score - should maintain 90+ performance
2. CLS (Cumulative Layout Shift) - hero should not cause layout shift
3. LCP (Largest Contentful Paint) - hero image loads efficiently

---

## References

### Source Documents
- **User Request:** Screenshot reference showing BMW M3 hero with "THE LEADING BMW PRESERVATION FACILITY"
- **Current Implementation:** `components/shared/HeroSection.tsx` lines 1-62
- **Design System:** `docs/design-system.md` (typography, layout patterns from Epic 10)
- **Typography Tokens:** `app/globals.css` lines 110-175, 328-375

### Design Inspiration
- Reference screenshot: Full-height hero, dramatic BMW image, bold headline, single CTA
- enthusiastauto.com: Brand aesthetic and messaging reference

---

## Dev Agent Record

### Context Reference

<!-- Context will be generated via story-context workflow -->

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

<!-- To be added during implementation -->

### Completion Notes List

<!-- To be added during implementation -->

### File List

<!-- To be added during implementation -->

---

## Change Log

**2025-10-29:** Story 10.6 created - Homepage Hero Enhancement (Extension of Epic 10). Requirement: Make hero bigger, more dynamic, and engaging based on reference design showing full-height hero with BMW specialization messaging.

---

## Status

**Draft** - Awaiting review and approval
