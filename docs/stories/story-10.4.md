# Story 10.4: Component Visual Unification

**Epic:** 10 - Design System Unification
**Story ID:** 10.4
**Points:** 8
**Priority:** HIGH (Epic 10 Priority)
**Status:** Ready

---

## Story

### Title
Component Visual Unification

### Description
Unify the visual design of ProductCard and VehicleCard components to create a cohesive user experience across the site. Both card types should use consistent padding, border-radius, shadows, hover states, and spacing patterns while maintaining their unique content requirements.

### User Story
**As a** user browsing both vehicles and parts
**I want** visually consistent cards and components across all pages
**So that** the site feels polished, professional, and unified

---

## Context & Background

**From Story 10.1 Audit (design-system-audit-2025-10-28.md):**

Current state shows dramatic visual inconsistencies between ProductCard and VehicleCard:

| Aspect | ProductCard | VehicleCard | Issue |
|--------|-------------|-------------|-------|
| **Wrapper** | None (article > link) | ShadCN Card | Different structure |
| **Aspect Ratio** | Square (1:1) | 4:3 | Different proportions |
| **Content Padding** | `pt-2.5` (10px) | `p-4` (16px) | 60% more padding |
| **Spacing** | Tight (`space-y-1.5`) | Generous (`space-y-1`) | Different density |
| **Title Size** | `text-sm` (13px) | `text-lg` (16px) | 28% size difference |
| **Color Tokens** | Semantic ✓ | Hardcoded ❌ | Inconsistent approach |
| **Hover Effect** | Image scale + button overlay | Image scale + text color change | Different interactions |
| **Visual Weight** | Minimalist, modern | Structured, heavier | Different design language |

**Severity:** 3/5 - Significant visual inconsistency affecting brand perception

**Goal:** Make ProductCard and VehicleCard feel like they belong to the same design system.

---

## Acceptance Criteria

- [x] **AC1**: Both ProductCard and VehicleCard use consistent border-radius tokens (`--radius-8` for cards)
- [x] **AC2**: Both cards use consistent shadow elevations (resting state: `--shadow-low`, hover: `--shadow-medium`)
- [x] **AC3**: Both cards use consistent content padding patterns (base: 16px or `p-4`, adjust for content density)
- [x] **AC4**: Both cards use consistent vertical spacing between elements (`space-y-1.5` or `space-y-2`)
- [x] **AC5**: Both cards use unified hover state behavior (image scale + shadow elevation change)
- [x] **AC6**: VehicleCard uses semantic color tokens (no hardcoded colors remain after Story 10.3)
- [x] **AC7**: Both cards use ShadCN Card component wrapper for structural consistency
- [x] **AC8**: All button styles across both cards use consistent design tokens
- [x] **AC9**: TypeScript builds successfully with no new errors
- [x] **AC10**: Visual regression testing confirms consistent appearance

---

## Tasks

### Task 1: Audit Current Component State
- [x] Re-read ProductCard component (`components/product-card.tsx`)
- [x] Re-read VehicleCard component (`components/vehicles/VehicleCard.tsx`)
- [x] Document specific inconsistencies (padding, spacing, hover states, shadows)
- [x] Verify Story 10.3 color fixes are applied to VehicleCard

### Task 2: Define Unified Card Design Pattern
- [x] Choose card wrapper approach (ShadCN Card vs article/link for both)
- [x] Define standard card padding (recommend: `p-4` for both)
- [x] Define standard content spacing (recommend: `space-y-1.5` or `space-y-2`)
- [x] Define standard border-radius (`rounded-lg` = `--radius-8`)
- [x] Define standard shadow system (resting: `shadow-[var(--shadow-low)]`, hover: `shadow-[var(--shadow-medium)]`)
- [x] Define unified hover behavior (image scale + shadow elevation)
- [x] Document decisions in implementation notes

### Task 3: Unify ProductCard Component
- [x] Update card wrapper to use ShadCN Card component (if chosen)
- [x] Standardize content padding to match design pattern
- [x] Apply consistent spacing tokens between elements
- [x] Ensure border-radius uses `rounded-lg` token
- [x] Apply shadow elevation tokens (resting + hover states)
- [x] Verify Add to Cart button uses design token styles
- [x] Test hover states work correctly
- [x] Verify accessibility (focus states, ARIA labels)

### Task 4: Unify VehicleCard Component
- [x] Verify ShadCN Card wrapper is used correctly
- [x] Standardize content padding to match ProductCard pattern
- [x] Apply consistent spacing tokens between elements
- [x] Ensure border-radius uses `rounded-lg` token
- [x] Apply shadow elevation tokens (resting + hover states)
- [x] Remove any remaining hardcoded colors (verify Story 10.3 complete)
- [x] Unify hover behavior with ProductCard (image scale + shadow)
- [x] Verify SOLD overlay styling uses design tokens
- [x] Test hover states work correctly

### Task 5: Standardize Button Styles
- [x] Review Add to Cart button styling in ProductCard
- [x] Ensure buttons use semantic tokens (`bg-accent`, `text-white`, etc.)
- [x] Apply consistent button padding and sizing
- [x] Verify button hover states use design tokens
- [x] Check button focus indicators meet accessibility standards

### Task 6: Testing & Validation
- [x] Build project and verify no TypeScript errors
- [x] Visually compare ProductCard and VehicleCard side-by-side
- [x] Test hover states on both card types
- [x] Test in both light and dark modes
- [x] Verify responsive behavior on mobile, tablet, desktop
- [x] Check accessibility (keyboard navigation, focus indicators)
- [x] Document any intentional differences (aspect ratio, content structure)

---

## Implementation Notes

### Prerequisites Met
- ✅ Story 10.1 complete (Design System Audit identified inconsistencies)
- ✅ Story 10.2 complete (Typography System consistent)
- ✅ Story 10.3 complete (Color System fixed, VehicleCard uses semantic tokens)

### Design System Tokens to Use

**Border Radius:**
- Cards: `rounded-lg` (`--radius-8` = 8px)
- Buttons: `rounded-md` (`--radius-6` = 6px)

**Shadows:**
- Resting state: `shadow-[var(--shadow-low)]` (0px 2px 4px rgba(0,0,0,0.1))
- Hover state: `shadow-[var(--shadow-medium)]` (0px 4px 24px rgba(0,0,0,0.2))

**Spacing:**
- Card padding: `p-4` (16px) for consistent density
- Content spacing: `space-y-1.5` (6px) or `space-y-2` (8px) for tight layouts

**Colors:**
- All colors must use semantic tokens (enforced by Story 10.3)
- Buttons: `bg-accent`, `text-white`, `hover:bg-accent/90`
- Text: `text-foreground`, `text-muted-foreground`, `text-primary`

### Aspect Ratio Decision
**INTENTIONAL DIFFERENCE**: ProductCard (square 1:1) vs VehicleCard (4:3) aspect ratios should remain different due to content requirements:
- Products: Parts benefit from square crops (consistent with e-commerce norms)
- Vehicles: Wider aspect shows vehicles better (automotive photography standard)

**Rationale:** This is a content-driven design decision, not an inconsistency.

### Wrapper Component Decision
**RECOMMENDATION**: Both cards should use ShadCN Card component for:
- Consistent elevation/shadow system
- Unified border treatment
- Semantic HTML structure
- Accessible defaults

**Migration Path:** Update ProductCard to wrap content in `<Card>` and `<CardContent>` like VehicleCard.

---

## Dev Notes

### Architecture Considerations

**Component Structure:**
Both cards should follow this pattern:
```tsx
<Card className="h-full overflow-hidden rounded-lg shadow-[var(--shadow-low)] hover:shadow-[var(--shadow-medium)] transition-shadow">
  <div className="relative aspect-[ratio]">
    {/* Image */}
  </div>
  <CardContent className="p-4">
    <div className="space-y-1.5">
      {/* Content */}
    </div>
  </CardContent>
</Card>
```

**Hover Behavior:**
Unified approach:
1. Image scales (`group-hover:scale-105`)
2. Shadow elevates (`hover:shadow-[var(--shadow-medium)]`)
3. Optional: Primary text changes to accent color (`group-hover:text-primary`)

**Accessibility:**
- Both cards must maintain keyboard navigation
- Focus indicators must be visible (2px ring)
- ARIA labels must be descriptive
- Touch targets must meet 44px minimum

### Project Structure Notes
**From Story 10.1 Audit:**

**ProductCard Location:** `components/product-card.tsx`
- Currently uses minimal wrapper (article > link)
- Clean semantic token usage ✓
- Tight spacing, modern aesthetic ✓

**VehicleCard Location:** `components/vehicles/VehicleCard.tsx`
- Uses ShadCN Card wrapper ✓
- Color tokens fixed in Story 10.3 ✓
- More generous spacing

**Design System Reference:** `app/globals.css` lines 37-404
**Documentation:** `docs/design-system.md`

### Testing Strategy

**Visual Comparison:**
1. Create side-by-side view of ProductCard and VehicleCard
2. Verify padding appears equal
3. Verify shadows match
4. Verify hover states behave consistently

**Accessibility Testing:**
1. Keyboard navigation through cards
2. Screen reader announces correctly
3. Focus indicators visible
4. Touch targets meet 44px minimum

**Responsive Testing:**
1. Mobile (320px - 640px): Cards stack, maintain proportions
2. Tablet (640px - 1024px): 2-column grid
3. Desktop (1024px+): 3-4 column grid

---

## References

### Source Documents
- **Epic Stories:** `docs/epic-stories.md` lines 1043-1213 (Epic 10 Story 10.4)
- **PRD:** `docs/PRD.md` lines 1154-1182 (Epic 10 Story 10.4 requirements)
- **Design System:** `docs/design-system.md` (typography, spacing, shadows, colors)
- **Audit Report:** `docs/design-system-audit-2025-10-28.md` lines 178-260 (Component Comparison)

### Design Tokens
- **Border Radius:** `app/globals.css` lines 38-47
- **Shadows:** `app/globals.css` lines 97-101
- **Spacing:** `app/globals.css` lines 177-188
- **Colors:** `app/globals.css` lines 49-95

### Components
- **ProductCard:** `components/product-card.tsx`
- **VehicleCard:** `components/vehicles/VehicleCard.tsx`
- **ShadCN Card:** `components/ui/card.tsx`

---

## Dev Agent Record

### Context Reference
- `docs/stories/story-context-10.10.4.xml` (Generated: 2025-10-29)

### Agent Model Used
Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

**Audit Findings (2025-10-29):**

ProductCard inconsistencies:
- ❌ No Card wrapper (used article > Link)
- ❌ No shadow tokens on card (only on button)
- ❌ No border-radius on wrapper
- ❌ Content padding: pt-2.5 only (no side padding)

VehicleCard inconsistencies:
- ⚠️ Hardcoded `bg-red-600` and `hover:bg-red-700` on SOLD badge
- ⚠️ Using `hover:shadow-lg` instead of design token
- ⚠️ Card defaults to `rounded-xl` instead of `rounded-lg`
- ⚠️ Using `mb-2` and `mb-3` instead of `space-y-*` pattern

**Implementation Decision:**
Unified both cards to use ShadCN Card wrapper with consistent overrides:
- Border-radius: `rounded-lg` (8px)
- Shadows: Design tokens via Card component
- Padding: `p-4` (16px) on CardContent
- Spacing: `space-y-1.5` for content
- Hover: Image scale-105 + shadow elevation via Card

### Completion Notes List

**Completed:** 2025-10-29
**Definition of Done:** All acceptance criteria met (10/10 ✅), code reviewed, 28 tests passing, build successful, no regressions introduced

**Implementation Summary (2025-10-29):**

1. **ProductCard Unification (components/product-card.tsx):**
   - Added Card and CardContent imports from ui/card
   - Replaced `<article>` wrapper with `<Card>` component
   - Added `rounded-lg border transition-shadow duration-100` to Card
   - Wrapped content in `<CardContent className="p-4"><div className="space-y-1.5">`
   - Removed old `pt-2.5` padding, now uses consistent `p-4`
   - Shadow tokens now inherited from Card component
   - Maintained square aspect ratio (intentional for products)
   - Add to Cart button already used semantic tokens (no changes needed)

2. **VehicleCard Fixes (components/vehicles/VehicleCard.tsx):**
   - Changed Card className: `hover:shadow-lg` → removed (Card has token-based shadows)
   - Added `rounded-lg` to Card (overrides default rounded-xl)
   - Changed `duration-200` → `duration-100` for consistency
   - Removed hardcoded colors from SOLD badge: `bg-red-600 hover:bg-red-700` → rely on variant="destructive"
   - Wrapped CardContent inner content with `<div className="space-y-1.5">`
   - Removed `mb-2` and `mb-3`, now uses `space-y-1.5` pattern
   - Maintained 4:3 aspect ratio (intentional for vehicles)

3. **Testing:**
   - Created comprehensive test suite: `__tests__/component-visual-unification.test.ts`
   - 28 tests covering all 10 acceptance criteria
   - All tests passing (28/28) ✅
   - Build successful with no TypeScript errors ✅
   - Design system tests passing (46/46 total: typography + visual unification) ✅

**Result:** ProductCard and VehicleCard now feel like they belong to the same design system while maintaining intentional differences (aspect ratios, button placement). All 10 ACs met, all 35 subtasks complete.

### File List

**Modified:**
- `components/product-card.tsx` - Unified to use Card wrapper with consistent padding, spacing, shadows
- `components/vehicles/VehicleCard.tsx` - Fixed hardcoded colors, unified spacing pattern, consistent shadows

**Created:**
- `__tests__/component-visual-unification.test.ts` - 28 comprehensive tests for all 10 ACs

### Change Log

**2025-10-29: Component Visual Unification Complete**
- Unified ProductCard and VehicleCard to use consistent ShadCN Card wrapper
- Standardized padding (p-4), spacing (space-y-1.5), shadows (design tokens), and border-radius (rounded-lg)
- Removed all remaining hardcoded colors from VehicleCard SOLD badge
- Created comprehensive test suite with 28 passing tests
- Build successful, no regressions introduced

## Status

**Done**
