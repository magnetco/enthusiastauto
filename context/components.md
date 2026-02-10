# Component Documentation

Comprehensive documentation for all custom components in the Enthusiast Auto platform.

---

## Table of Contents

1. [Animated Loader System](#animated-loader-system)
2. [Chassis Icons](#chassis-icons)
3. [Vehicle Components](#vehicle-components)
4. [Shared Components](#shared-components)

---

## Animated Loader System

Beautiful rotating gradient loader matching the homepage hero button animation.

### Design Specifications

**Gradient Colors:**
- `#026AA2` → Deep Blue
- `#529BCA` → Light Blue
- `#F90020` → Brand Red

**Animation:**
- Speed: 3.5s per rotation (8s with reduced motion)
- Style: Smooth clockwise rotation
- Performance: GPU-accelerated

**Size Variants:**

| Size | Diameter | Thickness | Use Case |
|------|----------|-----------|----------|
| sm   | 24px     | 2px       | Buttons, small cards |
| md   | 32px     | 2.5px     | Cards, modals |
| lg   | 48px     | 3px       | Page sections |
| xl   | 64px     | 4px       | Full-page overlays |

### Components

#### AnimatedLoader (Base)

Core loader component with customizable size and thickness.

**Location:** 
- Website: `website/components/ui/animated-loader.tsx`
- Data: `data/src/components/AnimatedLoader.tsx`

**Props:**
```typescript
interface AnimatedLoaderProps {
  size?: number;        // Diameter in pixels (default: 48)
  thickness?: number;   // Ring thickness (default: 3)
  message?: string;     // Optional message below spinner
  className?: string;   // Additional CSS classes
}
```

**Usage:**
```tsx
import { AnimatedLoader } from "@/components/ui/animated-loader";

<AnimatedLoader 
  size={48} 
  thickness={3} 
  message="Loading content..." 
/>
```

#### InlineLoader

Smaller loader for inline use within components.

**Props:**
```typescript
interface InlineLoaderProps {
  size?: "sm" | "md" | "lg";  // Preset sizes
  message?: string;            // Optional message
  className?: string;          // Additional CSS classes
}
```

**Usage:**
```tsx
import { InlineLoader } from "@/components/ui/animated-loader";

<InlineLoader size="md" message="Saving..." />
```

#### FullPageLoader

Full-screen overlay loader for page transitions.

**Props:**
```typescript
interface FullPageLoaderProps {
  isLoading: boolean;          // Controls visibility
  message?: string;            // Loading message
  overlayOpacity?: number;     // Background opacity 0-1
}
```

**Usage:**
```tsx
import { FullPageLoader } from "@/components/ui/animated-loader";

<FullPageLoader 
  isLoading={isLoading} 
  message="Loading inventory..." 
/>
```

#### LazyImage (Website Only)

Next.js Image wrapper with built-in loader.

**Props:**
```typescript
interface LazyImageProps extends Omit<ImageProps, "src"> {
  src: string;                 // Image URL
  alt: string;                 // Alt text
  showLoader?: boolean;        // Show loader (default: true)
  loaderSize?: "sm" | "md" | "lg";
  containerClassName?: string;
}
```

**Usage:**
```tsx
import { LazyImage } from "@/components/ui/lazy-image";

<LazyImage
  src="/vehicles/e46-m3.jpg"
  alt="BMW E46 M3"
  width={1200}
  height={800}
  showLoader
  loaderSize="md"
/>
```

#### PageTransition (Website Only)

Wrapper for smooth page transitions.

**Props:**
```typescript
interface PageTransitionProps {
  children: React.ReactNode;
  duration?: number;  // Loader duration in ms (default: 500)
}
```

**Usage:**
```tsx
import { PageTransition } from "@/components/ui/page-transition";

<PageTransition duration={500}>
  <YourPageContent />
</PageTransition>
```

### Common Patterns

#### Basic Loading State
```tsx
{isLoading ? (
  <InlineLoader size="md" message="Loading..." />
) : (
  <Content />
)}
```

#### Form Submission
```tsx
<button disabled={isSubmitting}>
  {isSubmitting ? (
    <AnimatedLoader size={20} thickness={2} />
  ) : (
    "Submit"
  )}
</button>
```

#### Lazy Load Images
```tsx
<LazyImage
  src={vehicle.image}
  alt={vehicle.title}
  width={1200}
  height={800}
  showLoader
  loaderSize="lg"
/>
```

### Accessibility

All loader components include:
- ✅ `role="status"` for screen readers
- ✅ `aria-live="polite"` for non-intrusive updates
- ✅ `aria-label` for descriptive labels
- ✅ Respects `prefers-reduced-motion`
- ✅ Screen reader only text

### Files

**Website:**
```
components/ui/
├── animated-loader.tsx
├── lazy-image.tsx
└── page-transition.tsx

hooks/
└── use-lazy-image.ts

app/
├── globals.css (animations)
└── test-loader/page.tsx (demo)
```

**Data Dashboard:**
```
src/
├── components/
│   └── AnimatedLoader.tsx
├── lib/
│   └── utils.ts
├── routes/
│   └── test-loader.tsx (demo)
└── index.css (animations)
```

---

## Chassis Icons

Visual BMW chassis icons for inventory filtering.

### Overview

Replaces plain checkboxes with visual chassis silhouettes, making it easier for users to identify and select BMW chassis types.

### Component

**Location:** `website/components/vehicles/ChassisIcon.tsx`

**Props:**
```typescript
interface ChassisIconProps {
  chassis: string;      // e.g., "E30", "F87"
  className?: string;   // Optional styling
}
```

**Usage:**
```tsx
import { ChassisIcon } from "@/components/vehicles/ChassisIcon";

<ChassisIcon chassis="E30" />
```

### Features

- ✅ Visual chassis silhouettes
- ✅ Responsive grid layout (2-3 columns)
- ✅ Hover effects and transitions
- ✅ Selected state indicators (blue border + dot)
- ✅ Multiple selection support
- ✅ Fallback to text if icon missing
- ✅ Mobile-friendly

### Icon Specifications

- **Format:** AVIF
- **Dimensions:** 80x40px
- **Naming:** Lowercase chassis code (e.g., `e30.avif`)
- **Location:** `website/public/chassis-icons/`

### Available Icons

| Chassis | Status | File |
|---------|--------|------|
| E24 | ✅ | e24.avif |
| E26 | ✅ | e26.avif |
| E28 | ⏳ | e28.avif |
| E30 | ⏳ | e30.avif |
| E31 | ⏳ | e31.avif |
| E34 | ⏳ | e34.avif |
| E36 | ⏳ | e36.avif |
| E39 | ⏳ | e39.avif |
| E46 | ⏳ | e46.avif |
| E60 | ⏳ | e60.avif |
| E82 | ⏳ | e82.avif |
| E9X | ⏳ | e9x.avif |
| F8X | ⏳ | f8x.avif |
| F87 | ⏳ | f87.avif |
| G8X | ⏳ | g8x.avif |
| Z3 | ⏳ | z3.avif |
| Z4 | ⏳ | z4.avif |
| Z8 | ⏳ | z8.avif |
| SAV | ⏳ | sav.avif |
| Other | ⏳ | other.avif |

### Filter Integration

**Location:** `website/components/vehicles/VehicleFilters.tsx`

The chassis filter displays as a responsive grid of clickable icon cards:
- Visual BMW chassis silhouettes
- Hover effects
- Selected state indicators
- Responsive layout (2-3 columns)
- Maintains all existing filter functionality

### Download Instructions

Icons need to be manually downloaded from enthusiastauto.com:

1. Open https://www.enthusiastauto.com/inventory
2. Open DevTools (F12) → Network tab → Filter by "avif"
3. Right-click each chassis icon → "Open in new tab"
4. Save as `{chassis-code}.avif` to `website/public/chassis-icons/`

---

## Vehicle Components

Components for the Vehicle Detail Page (VDP).

### VehicleHero

Main hero section with image carousel and navigation.

**Location:** `website/components/vehicles/VehicleHero.tsx`

**Features:**
- 16:9 aspect ratio image carousel
- Keyboard navigation (arrow keys)
- Sticky tab navigation
- Favorite button integration
- Social share dropdown
- "New" badge for vehicles < 21 days old
- "Inquire Now" button with scroll-to-form
- Fully responsive

**Props:**
```typescript
interface VehicleHeroProps {
  vehicle: {
    title: string;
    price: number;
    images: Array<{ url: string; alt: string }>;
    _createdAt: string;
    slug: string;
  };
}
```

### VehicleHeroClient

Client wrapper for VehicleHero to handle favorites.

**Location:** `website/components/vehicles/VehicleHeroClient.tsx`

**Props:**
```typescript
interface VehicleHeroClientProps {
  vehicle: Vehicle;
  initialIsFavorite?: boolean;
}
```

### VehicleSpecsSection

Dark-themed specifications section with highlights and specs grid.

**Location:** `website/components/vehicles/VehicleSpecsSection.tsx`

**Features:**
- Dark navy background (#141721)
- Parallax effect
- Two-column layout: Highlights + Specs Grid
- Portable Text rendering
- Template-based fallback content
- Mobile responsive (stacks vertically)

**Props:**
```typescript
interface VehicleSpecsSectionProps {
  highlights?: PortableTextBlock[];
  specs: {
    year?: number;
    make?: string;
    model?: string;
    chassis?: string;
    mileage?: number;
    transmission?: string;
    exterior?: string;
    interior?: string;
    engine?: string;
  };
}
```

### VehicleGallerySection

4-column image gallery with lazy loading.

**Location:** `website/components/vehicles/VehicleGallerySection.tsx`

**Features:**
- 4-column grid (2 mobile, 3 tablet, 4 desktop)
- Lazy loading: Initial 8 images, load more in batches
- Click to open fullscreen lightbox
- Keyboard navigation in fullscreen
- Progressive image loading with LQIP

**Props:**
```typescript
interface VehicleGallerySectionProps {
  images: Array<{
    url: string;
    alt: string;
    lqip?: string;
  }>;
}
```

### VehicleDocumentation

Documentation viewer with radio sidebar.

**Location:** `website/components/vehicles/VehicleDocumentation.tsx`

**Features:**
- Radio button sidebar for document type selection
- Document types: Manuals, Keys, Window Sticker, Service Records, Accessories, Tools
- Image preview area
- Download functionality
- Mobile responsive (stacks vertically)

**Props:**
```typescript
interface VehicleDocumentationProps {
  documentation: Array<{
    type: string;
    image?: { url: string; alt: string };
    file?: { url: string };
  }>;
}
```

### VehicleFAQs

FAQ accordion with inquiry form.

**Location:** `website/components/vehicles/VehicleFAQs.tsx`

**Features:**
- "Ask a Question" form at top
- Accordion-style FAQ list
- Combines vehicle-specific + global FAQs
- Default FAQs shown if none provided
- Mobile responsive

**Props:**
```typescript
interface VehicleFAQsProps {
  vehicleSlug: string;
  vehicleTitle: string;
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
}
```

### OtherCarsSection

Similar vehicles recommendations.

**Location:** `website/components/vehicles/OtherCarsSection.tsx`

**Features:**
- Shows similar vehicles (same chassis code)
- Uses existing VehicleCard component
- 3-column grid (1 mobile, 2 tablet, 3 desktop)
- Horizontal scroll on mobile

**Props:**
```typescript
interface OtherCarsSectionProps {
  vehicles: Vehicle[];
}
```

### OverviewSection

Vehicle overview with rich text content.

**Location:** `website/components/vehicles/OverviewSection.tsx`

**Features:**
- Clean, readable typography
- Portable Text rendering
- Support for headings, lists, links, emphasis
- White background section

**Props:**
```typescript
interface OverviewSectionProps {
  overview?: PortableTextBlock[];
}
```

### HistorySection

Vehicle history display.

**Location:** `website/components/vehicles/HistorySection.tsx`

**Features:**
- Simple text rendering
- Gray background
- Whitespace-preserved formatting

**Props:**
```typescript
interface HistorySectionProps {
  history?: string;
}
```

---

## Shared Components

### SectionRenderer

Dynamic section rendering for Sanity CMS pages.

**Location:** `website/components/shared/SectionRenderer.tsx`

**Features:**
- Maps section component names to React components
- Renders sections based on Sanity page data
- Supports background colors and padding
- Enable/disable sections
- Sort order support

**Props:**
```typescript
interface SectionRendererProps {
  sections: Array<{
    _key: string;
    sectionId: string;
    componentName: string;
    prompt: string;
    settings: {
      enabled: boolean;
      backgroundColor?: string;
      padding?: string;
      sortOrder?: number;
    };
  }>;
}
```

**Usage:**
```tsx
import { SectionList } from "@/components/shared/SectionRenderer";

<SectionList sections={page.sections} />
```

**Component Map:**

Add new components to the map:
```tsx
const COMPONENT_MAP = {
  FeaturedVehicles,
  ServicesSection,
  AboutStorySection,
  // Add more components here
};
```

---

## Best Practices

### Component Development

1. **Server Components by Default** - Only use `'use client'` when necessary
2. **Type Safety** - Use TypeScript strict mode, no `any` without justification
3. **Composition** - Prefer composition over prop drilling
4. **Accessibility** - WCAG 2.1 AA compliance, keyboard navigation
5. **Performance** - Lazy load images, optimize animations

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Component files | PascalCase | `ProductCard.tsx` |
| Exports | Named, matching file | `export function ProductCard()` |
| Props interface | `[Component]Props` | `interface ProductCardProps` |
| Utility files | kebab-case | `format-price.ts` |

### File Organization

```
components/
├── ui/              # Primitives (button, card, input)
├── shared/          # Cross-feature (carousels, modals)
├── layout/          # Structure (navbar, footer)
├── vehicles/        # Vehicle-specific components
├── cart/            # Cart components
├── favorites/       # Favorites components
├── account/         # Account components
└── search/          # Search components
```

### Props & Types

```typescript
// Extend HTML element props
interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

// Prefer children over render props
function Card({ children, className }: CardProps) {
  return <div className={cn('card', className)}>{children}</div>;
}
```

---

## Testing

### Test Pages

**Animated Loader:**
- Website: http://localhost:3040/test-loader
- Data Dashboard: http://localhost:4040/test-loader

**Vehicle Detail Page:**
- Website: http://localhost:3040/vehicles/[slug]

**Chassis Filter:**
- Website: http://localhost:3040/vehicles

### Testing Checklist

Before deploying components:

- [ ] Test on multiple screen sizes (mobile, tablet, desktop)
- [ ] Verify keyboard navigation works
- [ ] Check accessibility with screen reader
- [ ] Test with slow network (throttle to 3G)
- [ ] Verify error states and fallbacks
- [ ] Check loading states
- [ ] Test with real data
- [ ] Verify responsive layout
- [ ] Check browser compatibility
- [ ] Test dark mode (if applicable)

---

## Performance

### Optimization Tips

1. **Use InlineLoader for small elements** - Lighter than full AnimatedLoader
2. **Lazy load large images** - Use LazyImage for 1200px+ images
3. **Limit FullPageLoader use** - Only for major transitions
4. **Provide meaningful messages** - Help users understand what's loading
5. **Test with slow network** - Throttle to 3G to verify UX

### Bundle Sizes

| Component | Size (gzipped) |
|-----------|----------------|
| AnimatedLoader | ~2KB |
| ChassisIcon | ~1KB |
| VehicleHero | ~5KB |
| LazyImage | ~3KB |

---

## Support

For component issues:

1. Check browser console for errors
2. Verify props are correct
3. Check file paths and imports
4. Review component documentation
5. Test with simplified example
6. Check browser compatibility

---

**Last Updated:** February 10, 2026
