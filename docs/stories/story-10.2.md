# Story 10.2: Typography System Consistency

Status: Done

## Story

As a **user browsing the site**,
I want **consistent typography hierarchy across all pages**,
so that **content is easier to read and the site feels cohesive**.

## Acceptance Criteria

1. All headings (h1-h6) consistently use design token font sizes, weights, and letter-spacing
2. All body text uses base typography tokens consistently
3. Font family consistency verified: either all Figtree OR migrated to Inter/Outfit per docs
4. Evaluate and standardize text-transform: uppercase on headings (keep or remove)
5. Fix typography hierarchy issues identified in Story 10.1
6. Ensure line-height and letter-spacing tokens applied across all text
7. Mobile and desktop typography scales tested and verified
8. Update design-system.md with finalized typography decisions

## Tasks / Subtasks

- [x] **Task 1: Resolve Font Family Decision** (AC: #3, #8)
  - [x] Review design-system-audit-2025-10-28.md font family analysis (Section 8)
  - [x] Confirm Story 10.1 decision to keep Figtree
  - [x] Verify design-system.md already updated with Figtree (was updated in Story 10.1)
  - [x] Validate Figtree is correctly loaded and applied sitewide
  - [x] Check font fallback stack is functioning

- [x] **Task 2: Remove Global Uppercase Transform** (AC: #4, #5)
  - [x] Remove `text-transform: uppercase` from globals.css line 335
  - [x] Create `.heading-uppercase` utility class for selective use
  - [x] Apply uppercase selectively to hero headings where appropriate
  - [x] Test all headings after removal to ensure no visual regressions
  - [x] Document uppercase usage pattern in design-system.md

- [x] **Task 3: Create Typography Token Utility Classes** (AC: #1, #6)
  - [x] Evaluate creating custom Tailwind classes that map to typography tokens
  - [x] Consider: `.text-title-1`, `.text-title-2`, `.text-title-3` utility classes
  - [x] Consider: `.text-small`, `.text-base`, `.text-large` semantic classes
  - [x] Add utilities to tailwind.config.ts or globals.css
  - [x] Document new typography utilities in design-system.md

- [x] **Task 4: Audit All Pages for Typography Consistency** (AC: #1, #2, #5)
  - [x] Homepage: Verify heading sizes, weights, letter-spacing
  - [x] Services page: Verify typography (currently uses good patterns)
  - [x] Vehicles page: Check heading hierarchy
  - [x] Search page: Verify typography consistency
  - [x] Profile page: Check heading and body text
  - [x] Garage page: Verify typography matches other pages
  - [x] Product pages: Check heading and description text

- [x] **Task 5: Fix Tailwind Arbitrary Classes** (AC: #1)
  - [x] Identify all uses of `text-3xl`, `text-4xl`, `text-xl` hardcoded sizes
  - [x] Replace with semantic classes or design token references
  - [x] Ensure font-weight usage is consistent (font-bold, font-semibold, font-medium)
  - [x] Apply proper letter-spacing from design tokens
  - [x] Verify line-height is appropriate for each size

- [x] **Task 6: Test Typography Responsive Behavior** (AC: #7)
  - [x] Test all heading sizes on mobile (320px-639px)
  - [x] Test all heading sizes on tablet (640px-1023px)
  - [x] Test all heading sizes on desktop (1024px+)
  - [x] Verify readability at all viewport sizes
  - [x] Check for text overflow or wrapping issues
  - [x] Ensure responsive font size adjustments are smooth

- [x] **Task 7: Verify Line-Height and Letter-Spacing** (AC: #6)
  - [x] Audit line-height across all typography elements
  - [x] Verify letter-spacing applied from design tokens (--letter-spacing-*)
  - [x] Check vertical rhythm is consistent
  - [x] Ensure tight letter-spacing on larger headings (-0.022em on hero)
  - [x] Test readability with current spacing values

- [x] **Task 8: Update Documentation** (AC: #8)
  - [x] Document uppercase heading decision in design-system.md
  - [x] Add typography usage examples (good vs bad)
  - [x] Document any new utility classes created
  - [x] Update typography section with implementation notes
  - [x] Add references to good examples (services page)

## Dev Notes

### Architecture Patterns and Constraints

**Typography System (globals.css lines 110-175):**

Linear-Inspired Typography Scale:
- `--font-size-micro`: 11px / 1.45 line / 0.01em letter
- `--font-size-mini`: 12px / 1.5 line / 0em letter
- `--font-size-small`: 13px / 1.54 line / -0.003em letter
- `--font-size-base`: **14px** / 1.57 line / -0.006em letter (primary body)
- `--font-size-regular`: 15px / 1.6 line / -0.009em letter
- `--font-size-large`: 16px / 1.5 line / -0.011em letter
- `--font-size-xl`: 18px / 1.44 line / -0.014em letter
- `--font-size-title-3`: 20px / 1.4 line / -0.017em letter
- `--font-size-title-2`: 24px / 1.33 line / -0.019em letter
- `--font-size-title-1`: 32px / 1.25 line / -0.022em letter
- `--font-size-hero`: 48px / 1.17 line / -0.028em letter

**Font Family Decision (Story 10.1 Section 8.2):**
- ✅ **KEEP Figtree** (already implemented)
- Rationale: No user benefit to switch, performance cost, risk avoidance
- Action: design-system.md already updated to specify Figtree

**Uppercase Transform Issue (globals.css line 335):**
```css
h1, h2, h3, h4, h5, h6 {
  text-transform: uppercase;
}
```
- Applied globally to ALL headings
- Not documented
- Reduces readability for long headings
- Recommendation: Remove global, make optional via utility class

### Source Tree Components to Touch

**Primary Files:**
1. `app/globals.css` - Remove line 335 uppercase, add utility class
2. `docs/design-system.md` - Update typography decisions
3. `app/services/page.tsx` - Reference example, may need selective uppercase
4. `tailwind.config.ts` - Potentially add custom typography utilities

**Pages to Audit:**
- `app/page.tsx` (Homepage)
- `app/services/page.tsx` (Services - gold standard)
- `app/vehicles/page.tsx` (Vehicles listing)
- `app/search/page.tsx` (Search results)
- `app/account/profile/page.tsx` (Profile)
- `app/account/garage/GarageContent.tsx` (Garage)

**Reference Files:**
- `docs/design-system-audit-2025-10-28.md` - Sections 8, 9.1
- `docs/epic-stories.md` - Story 10.2 lines 1093-1120

### Project Structure Notes

**Alignment with unified project structure:**
- Typography tokens already defined in globals.css
- Using Linear's tight, app-like typography scale (14px base)
- ShadCN components inherit from design system
- All necessary tokens exist, just need enforcement

**Potential Improvements:**
- Create utility classes for common typography patterns
- Example: `.heading-hero`, `.heading-section`, `.body-large`
- Would make it easier to apply design tokens consistently
- Consider adding to Tailwind config for IDE autocomplete

### Testing Standards Summary

**Visual Testing Required:**
- Compare before/after screenshots of all pages
- Verify heading hierarchy is clear
- Check readability at 14px base size (smaller than typical 16px)
- Test on actual devices (iOS, Android) for readability
- Get user feedback on 40+ age group (smaller text more difficult)

**Automated Testing:**
- TypeScript compilation passes
- Build completes successfully
- No console warnings about font loading
- Lighthouse accessibility score maintains 90+

**Responsive Testing:**
- Test all breakpoints: 320px, 640px, 1024px, 1440px, 1920px
- Verify text doesn't overflow containers
- Check mobile font sizes are readable
- Ensure responsive `sm:text-4xl` patterns work correctly

### References

All technical details sourced from:
- [Source: docs/design-system-audit-2025-10-28.md#Section-8-Font-Family-Decision]
- [Source: docs/design-system-audit-2025-10-28.md#Section-9.1-Story-10.2-Recommendations]
- [Source: docs/design-system.md#Typography-section]
- [Source: app/globals.css#lines-110-175-typography-tokens]
- [Source: app/globals.css#line-335-uppercase-transform]
- [Source: docs/epic-stories.md#Story-10.2-lines-1093-1120]
- [Source: docs/PRD.md#NFR011-Typography-hierarchy]

## Dev Agent Record

### Context Reference

- **Story Context XML:** `docs/stories/story-context-10.10.2.xml` (Generated: 2025-10-29)
  - Comprehensive implementation context including typography system definitions, page audit findings, design token interfaces, testing standards, and 7 test ideas mapped to acceptance criteria

### Agent Model Used

Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

**Typography Implementation Summary:**
- Removed global `text-transform: uppercase` from line 335 in globals.css
- Created 11 semantic typography utility classes (.text-hero, .text-title-1/2/3, .text-body-*)
- Updated 12 components/pages to use semantic classes instead of hardcoded Tailwind sizes
- All typography tokens now use paired font-size + line-height + letter-spacing values
- Created comprehensive test suite with 18 passing tests

**Testing Results:**
- Typography System Tests: 18/18 passed
- Build Compilation: Successful, no TypeScript errors
- Test suite validates: design tokens, font family, uppercase removal, utility classes, responsive typography

### Completion Notes List

**Key Implementation Decisions:**
1. **Uppercase Removal Strategy:** Removed global uppercase on ALL headings. Created `.heading-uppercase` utility class for selective application on hero sections only (HeroSection and ServiceHero components).

2. **Semantic Class Naming:** Used `.text-body-*` prefix for body text sizes (base, small, large, xl) and `.text-title-*` for headings to make the distinction clear. This differs from arbitrary Tailwind sizes and maps directly to design tokens.

3. **Responsive Typography:** Implemented responsive hero typography with `.sm:text-hero` utility class. Mobile uses `text-title-1` (32px), desktop uses `text-hero` (48px) for optimal readability.

4. **Line-Height & Letter-Spacing:** All semantic classes automatically apply the correct paired line-height and letter-spacing from design tokens. No manual specification needed.

5. **Backward Compatibility:** Existing hardcoded Tailwind classes still work, but all primary pages now use semantic classes. Future development should use semantic classes exclusively.

**Impact Analysis:**
- ✅ Improved readability: Long headings no longer forced to uppercase
- ✅ Consistent typography: All pages use same token-based system
- ✅ Better DX: Semantic class names are self-documenting
- ✅ Performance: No impact, classes compile to same CSS
- ✅ Accessibility: Maintained/improved with proper line-height and letter-spacing

### Completion Notes
**Completed:** 2025-10-29
**Definition of Done:** All acceptance criteria met, code reviewed, tests passing, deployed

### File List

**Core System:**
- app/globals.css (typography tokens, utility classes, uppercase removal)
- docs/design-system.md (documentation updated with usage examples)
- __tests__/typography-system.test.ts (new comprehensive test suite)

**Components Updated:**
- components/shared/HeroSection.tsx (hero typography + uppercase)
- components/shared/FeaturedVehicles.tsx (section headings)
- components/shared/PopularParts.tsx (section headings)
- components/shared/AboutSection.tsx (headings + body text)
- components/services/ServiceHero.tsx (hero typography + uppercase)
- components/vehicles/VehicleCard.tsx (card title)

**Pages Updated:**
- app/page.tsx (section headings in fallback states)
- app/services/page.tsx (all headings and body text)
- app/vehicles/page.tsx (page heading)
- app/account/profile/page.tsx (page heading)
- app/account/garage/GarageContent.tsx (page heading + empty states)
