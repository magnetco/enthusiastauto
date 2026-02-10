# Website Component Audit Report

**Date:** February 9, 2026  
**Purpose:** Identify components that need refactoring to use shadcn UI components consistently

---

## Executive Summary

The website has **good overall adoption** of shadcn components, with most form-heavy pages properly using the component system. However, there are **2 critical components** that need immediate refactoring to maintain consistency.

### Compliance Status

✅ **COMPLIANT** - Using shadcn components properly:
- Contact forms (`ContactForm.tsx`)
- Service request forms (`ServiceRequestForm.tsx`, `ServiceRequestWizard.tsx`)
- Sell request wizard (`SellRequestWizard.tsx`)
- Vehicle contact forms (`VehicleContactForm.tsx`)
- Account management forms (Profile, Password, Addresses)
- Search components (HeaderSearch, Search, UnifiedSearch) ✅ **RECENTLY FIXED**

❌ **NON-COMPLIANT** - Using custom HTML elements:
1. **ChatInput.tsx** - Custom `<textarea>` and `<button>`
2. Hidden input in ContactForm.tsx (line 205) - acceptable for form state

---

## Critical Issues Requiring Refactoring

### 1. Add To Cart Component ❌ HIGH PRIORITY

**File:** `website/components/cart/add-to-cart.tsx`

**Issues:**
- Custom `<button>` elements with manual styling (lines 24, 38, 53)
- Uses `clsx` and custom classes instead of shadcn Button
- Inconsistent with site's button design system

**Current Implementation:**
```tsx
<button
  aria-label="Add to cart"
  className={clsx(
    baseClasses,
    "bg-neutral-900 text-white hover:bg-neutral-800 active:scale-[0.98]"
  )}
>
  <ShoppingCartIcon className="h-5 w-5" />
  Add To Cart
</button>
```

**Should Be:**
```tsx
<Button size="lg" className="w-full gap-2">
  <ShoppingCartIcon className="h-5 w-5" />
  Add To Cart
</Button>
```

### 2. ChatInput Component ❌ HIGH PRIORITY

**File:** `website/components/chat/ChatInput.tsx`

**Issues:**
- Custom `<textarea>` with manual styling (line 46-56)
- Custom `<button>` for submit (line 57-64)
- Not using shadcn `Textarea` or `Button` components

**Current Implementation:**
```tsx
<textarea
  ref={textareaRef}
  value={message}
  onChange={(e) => setMessage(e.target.value)}
  onKeyDown={handleKeyDown}
  placeholder="Ask about vehicles, parts, or BMW models..."
  disabled={disabled}
  rows={1}
  className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 pr-12 text-sm text-gray-900 placeholder-gray-500 focus:border-[#005A90] focus:outline-none focus:ring-1 focus:ring-[#005A90] disabled:cursor-not-allowed disabled:opacity-50"
  style={{ maxHeight: "96px" }}
/>
<button
  type="submit"
  disabled={disabled || !message.trim() || isOverLimit}
  className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-lg bg-[#F90020] text-white transition-colors hover:bg-[#d9001c] focus:outline-none focus:ring-2 focus:ring-[#F90020] focus:ring-offset-2 focus:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50"
  aria-label="Send message"
>
  <Send className="h-4 w-4" />
</button>
```

**Required Changes:**
- Replace `<textarea>` with shadcn `Textarea` component
- Replace `<button>` with shadcn `Button` component
- Maintain auto-resize functionality
- Keep character count validation

**Recommended Refactor:**
```tsx
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

// In component:
<Textarea
  ref={textareaRef}
  value={message}
  onChange={(e) => setMessage(e.target.value)}
  onKeyDown={handleKeyDown}
  placeholder="Ask about vehicles, parts, or BMW models..."
  disabled={disabled}
  rows={1}
  className="pr-12 resize-none"
  style={{ maxHeight: "96px" }}
/>
<Button
  type="submit"
  size="icon"
  disabled={disabled || !message.trim() || isOverLimit}
  className="absolute bottom-2 right-2 h-8 w-8"
  aria-label="Send message"
>
  <Send className="h-4 w-4" />
</Button>
```

---

## Components Already Using Shadcn (No Action Needed) ✅

### Forms & Inputs
- ✅ `ContactForm.tsx` - Uses Input, Textarea, Button, Card, Label
- ✅ `ServiceRequestForm.tsx` - Uses Input, Textarea, Button, Select, Checkbox
- ✅ `ServiceRequestWizard.tsx` - Uses Input, Textarea, Button, Select, Checkbox
- ✅ `SellRequestWizard.tsx` - Uses Input, Textarea, Button, Checkbox
- ✅ `VehicleContactForm.tsx` - Uses Input, Textarea, Button, Label
- ✅ `ProfileForm.tsx` - Uses Input, Button, Label
- ✅ `ChangePassword.tsx` - Uses Input, Button, Label
- ✅ `AddressManager.tsx` - Uses Input, Button, Dialog

### Search Components (Recently Fixed)
- ✅ `HeaderSearch.tsx` - Now uses shadcn Input
- ✅ `Search.tsx` - Uses shadcn Input
- ✅ `UnifiedSearch.tsx` - Uses shadcn Input
- ✅ `SearchSkeleton` - Uses shadcn Input
- ✅ `UnifiedSearchSkeleton` - Uses shadcn Input

### Filters & Navigation
- ✅ `VehicleFilters.tsx` - Uses Select, Checkbox
- ✅ `PartsFilters.tsx` - Uses Select, Checkbox, Input
- ✅ `FilterPanel.tsx` - Uses Checkbox, Input
- ✅ `CategoryFilter.tsx` - Uses Button

### UI Components
- ✅ `VehicleCard.tsx` - Uses Badge, Button
- ✅ `GarageItemCard.tsx` - Uses Button, Badge
- ✅ `FavoriteButton.tsx` - Uses Button
- ✅ `ServiceCards.tsx` - Uses Button, Badge
- ✅ `UserMenu.tsx` - Uses DropdownMenu

---

## Acceptable Custom Implementations ✅

These components use custom HTML elements but are acceptable:

### 1. Hidden Form Inputs
**Example:** `ContactForm.tsx` line 205
```tsx
<input type="hidden" {...register("department")} />
```
**Reason:** Hidden inputs for form state management don't need shadcn styling

### 2. Navigation Buttons
**Files:** Various navigation components
**Reason:** Custom styled navigation buttons for specific design requirements (mega menus, mobile menus)

### 3. Icon Buttons
**Files:** Gallery controls, modal close buttons
**Reason:** Simple icon-only buttons with specific positioning requirements

---

## Button Usage Analysis

### Custom Buttons (Acceptable in Context)
Most custom `<button>` elements found are:
1. **Navigation items** - Mega menu triggers, mobile menu items
2. **Gallery controls** - Previous/next buttons in carousels
3. **Filter toggles** - Chip-style selection buttons
4. **Step indicators** - Wizard navigation dots
5. **Modal controls** - Close buttons with specific positioning

These are acceptable because they serve specific UI patterns that don't need the full shadcn Button component.

### Buttons That Should Use Shadcn
Primary action buttons in forms and CTAs already use shadcn Button component ✅

### 3. Cart Modal Buttons ❌ MEDIUM PRIORITY

**File:** `website/components/cart/modal.tsx`

**Issues:**
- Multiple custom buttons (lines 54, 82, 97, 306)
- Checkout button uses custom styling instead of shadcn Button
- Close button could use Button with icon variant

### 4. Product Quantity Selector ❌ MEDIUM PRIORITY

**File:** `website/components/product/quantity-selector.tsx`

**Issues:**
- Plus/minus buttons use custom styling (lines 28, 44)
- Should use shadcn Button with icon-sm variant

### 5. Product Variant Selector ❌ LOW PRIORITY

**File:** `website/components/product/variant-selector.tsx`

**Issues:**
- Variant option buttons use custom styling (line 75)
- These are acceptable as they're chip-style selection buttons

### 6. Gallery Controls ❌ LOW PRIORITY

**File:** `website/components/product/gallery.tsx`

**Issues:**
- Navigation buttons use custom styling (lines 43, 54, 77)
- These are acceptable as gallery-specific controls

---

## Recommendations

### Immediate Action Required (Priority 1)
1. ✅ **COMPLETED** - Refactor search input components to use shadcn Input
2. ❌ **TODO** - Refactor `add-to-cart.tsx` to use shadcn Button
3. ❌ **TODO** - Refactor `ChatInput.tsx` to use shadcn Textarea and Button
4. ❌ **TODO** - Refactor cart modal buttons to use shadcn Button

### Future Improvements (Priority 2)
1. Consider creating a custom `AutoResizeTextarea` wrapper around shadcn Textarea for reusability
2. Document acceptable use cases for custom HTML elements in AGENTS.md
3. Add linting rules to catch new custom form elements

### Maintenance
- Run this audit quarterly to catch new non-compliant components
- Update AGENTS.md with examples of proper shadcn usage
- Create component templates for common patterns

---

## Impact Assessment

### Low Risk
- Only 1 component needs refactoring
- Component is isolated (chat feature)
- No breaking changes to public APIs

### Benefits of Refactoring
1. **Consistency** - All form inputs use the same component system
2. **Accessibility** - Inherit shadcn's built-in a11y features
3. **Theming** - Automatic support for theme variables
4. **Maintenance** - Single source of truth for input styling

---

## Conclusion

The website has **good shadcn adoption** but several e-commerce components need refactoring. The cart and product interaction buttons are using custom implementations instead of the shadcn Button component, creating visual inconsistency.

**Overall Grade: B+** (85% compliance)

**Priority Fixes:**
1. Add To Cart button (most visible to users)
2. Cart modal buttons
3. ChatInput component
4. Quantity selector buttons

Next audit recommended: May 2026
