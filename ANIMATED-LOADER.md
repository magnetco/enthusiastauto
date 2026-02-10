# Animated Loader Component

Beautiful animated loader with rotating gradient border effect, matching the homepage hero button animation.

## Features

- **Rotating Gradient Border**: Uses the same gradient colors as the hero button (#026AA2 → #529BCA → #F90020)
- **Smooth Animation**: 3.5s linear infinite rotation (8s with reduced motion)
- **Multiple Variants**: Full-page, inline, and lazy-loading image support
- **Accessibility**: Includes ARIA labels and respects `prefers-reduced-motion`
- **Performance**: GPU-accelerated with CSS transforms

---

## Components

### 1. AnimatedLoader (Base Component)

The core loader component with customizable size and thickness.

```tsx
import { AnimatedLoader } from "@/components/ui/animated-loader";

<AnimatedLoader 
  size={48} 
  thickness={3} 
  message="Loading content..." 
/>
```

**Props:**
- `size?: number` - Diameter in pixels (default: 48)
- `thickness?: number` - Ring thickness in pixels (default: 3)
- `message?: string` - Optional loading message below spinner
- `className?: string` - Additional CSS classes

---

### 2. InlineLoader

Smaller loader for inline use within components.

```tsx
import { InlineLoader } from "@/components/ui/animated-loader";

<InlineLoader size="md" message="Saving..." />
```

**Props:**
- `size?: "sm" | "md" | "lg"` - Preset sizes (24px, 32px, 48px)
- `message?: string` - Optional loading message
- `className?: string` - Additional CSS classes

**Size Reference:**
- `sm`: 24px diameter, 2px thickness
- `md`: 32px diameter, 2.5px thickness
- `lg`: 48px diameter, 3px thickness

---

### 3. FullPageLoader

Full-screen overlay loader for page transitions and major loading states.

```tsx
import { FullPageLoader } from "@/components/ui/animated-loader";

<FullPageLoader 
  isLoading={isLoading} 
  message="Loading inventory..." 
  overlayOpacity={0.8}
/>
```

**Props:**
- `isLoading: boolean` - Controls visibility
- `message?: string` - Loading message (default: "Loading...")
- `overlayOpacity?: number` - Background opacity 0-1 (default: 0.8)

---

### 4. LazyImage (Website Only)

Next.js Image wrapper with built-in loader for large images.

```tsx
import { LazyImage } from "@/components/ui/lazy-image";

<LazyImage
  src="/vehicles/e46-m3-hero.jpg"
  alt="2006 BMW E46 M3"
  width={1200}
  height={800}
  showLoader
  loaderSize="md"
/>
```

**Props:**
- All Next.js `Image` props except `src`
- `src: string` - Image URL
- `alt: string` - Alt text
- `showLoader?: boolean` - Show loader while loading (default: true)
- `loaderSize?: "sm" | "md" | "lg"` - Loader size
- `containerClassName?: string` - Container CSS classes

---

### 5. PageTransition (Website Only)

Wrapper for smooth page transitions with loader.

```tsx
import { PageTransition } from "@/components/ui/page-transition";

<PageTransition duration={500}>
  <YourPageContent />
</PageTransition>
```

**Props:**
- `children: React.ReactNode` - Page content
- `duration?: number` - Loader display duration in ms (default: 500)

---

## Usage Examples

### Basic Loading State

```tsx
import { InlineLoader } from "@/components/ui/animated-loader";

function MyComponent() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div>
      {isLoading ? (
        <InlineLoader size="md" message="Loading data..." />
      ) : (
        <DataContent />
      )}
    </div>
  );
}
```

---

### Form Submission

```tsx
import { AnimatedLoader } from "@/components/ui/animated-loader";

function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <AnimatedLoader size={20} thickness={2} />
        ) : (
          "Submit"
        )}
      </button>
    </form>
  );
}
```

---

### Page-Level Loading (Website)

```tsx
// app/vehicles/page.tsx
import { FullPageLoader } from "@/components/ui/animated-loader";

export default function VehiclesPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadVehicles().finally(() => setIsLoading(false));
  }, []);

  return (
    <>
      <FullPageLoader 
        isLoading={isLoading} 
        message="Loading inventory..." 
      />
      <VehicleGrid vehicles={vehicles} />
    </>
  );
}
```

---

### Lazy Loading Images (Website)

```tsx
// components/vehicles/VehicleCard.tsx
import { LazyImage } from "@/components/ui/lazy-image";

export function VehicleCard({ vehicle }) {
  return (
    <div className="vehicle-card">
      <LazyImage
        src={vehicle.image}
        alt={vehicle.title}
        width={600}
        height={400}
        showLoader
        loaderSize="md"
        className="rounded-lg"
      />
      <h3>{vehicle.title}</h3>
    </div>
  );
}
```

---

### Route Transitions (Website)

Add to your layout or individual pages:

```tsx
// app/layout.tsx or app/vehicles/layout.tsx
import { PageTransition } from "@/components/ui/page-transition";

export default function Layout({ children }) {
  return (
    <PageTransition duration={500}>
      {children}
    </PageTransition>
  );
}
```

---

### Data Dashboard Loading

```tsx
// data/src/components/ServiceRequestDetail.tsx
import { InlineLoader } from "./AnimatedLoader";

export function ServiceRequestDetail({ id }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="p-6">
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <InlineLoader size="lg" message="Loading request details..." />
        </div>
      ) : (
        <RequestContent />
      )}
    </div>
  );
}
```

---

## Custom Hook: useLazyImage (Website Only)

For advanced lazy loading control:

```tsx
import { useLazyImage } from "@/hooks/use-lazy-image";
import { AnimatedLoader } from "@/components/ui/animated-loader";

function CustomImageComponent({ src, alt }) {
  const { isLoading, isLoaded, error, src: imageSrc } = useLazyImage(src, {
    delay: 200,
    onLoadStart: () => console.log("Loading started"),
    onLoadComplete: () => console.log("Loading complete"),
    onError: (err) => console.error("Load failed", err),
  });

  if (error) return <div>Failed to load image</div>;

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <AnimatedLoader size={48} />
        </div>
      )}
      <img 
        src={imageSrc} 
        alt={alt}
        className={isLoaded ? "opacity-100" : "opacity-0"}
      />
    </div>
  );
}
```

**Hook Options:**
- `delay?: number` - Delay before loading (ms)
- `onLoadStart?: () => void` - Callback when loading starts
- `onLoadComplete?: () => void` - Callback when loading completes
- `onError?: (error: Error) => void` - Callback on error

**Hook Return:**
- `isLoading: boolean` - Whether image is loading
- `isLoaded: boolean` - Whether image loaded successfully
- `error: Error | null` - Error if load failed
- `src: string` - Image source (empty until ready)

---

## Styling

The loader uses CSS custom properties for theming:

### Website
```css
--color-bg-dark-blue-primary: #0a0c10; /* Background */
--color-text-tertiary: #a8adb7; /* Message text */
```

### Data Dashboard
```css
--background: hsl(var(--background)); /* Background */
--muted-foreground: hsl(var(--muted-foreground)); /* Message text */
```

---

## Animation Details

### Gradient Colors
- Start: `#026AA2` (Deep Blue)
- Middle: `#529BCA` (Light Blue)
- End: `#F90020` (Brand Red)

### Timing
- **Normal**: 3.5s linear infinite
- **Reduced Motion**: 8s linear infinite (respects `prefers-reduced-motion`)

### Performance
- Uses `@property` for smooth gradient rotation
- GPU-accelerated with `will-change: transform`
- Automatically optimizes for reduced motion preferences

---

## Accessibility

All loader components include:
- `role="status"` - Announces loading state to screen readers
- `aria-live="polite"` - Non-intrusive updates
- `aria-label` - Descriptive label for assistive tech
- `<span className="sr-only">` - Screen reader only text
- Respects `prefers-reduced-motion` - Slower animation for users who prefer reduced motion

---

## Browser Support

- Modern browsers with CSS `@property` support
- Fallback: Static gradient (no rotation) in older browsers
- All major browsers (Chrome 85+, Firefox 89+, Safari 15.4+, Edge 85+)

---

## File Locations

### Website (Next.js)
- `/website/components/ui/animated-loader.tsx` - Main components
- `/website/components/ui/lazy-image.tsx` - LazyImage component
- `/website/components/ui/page-transition.tsx` - PageTransition wrapper
- `/website/hooks/use-lazy-image.ts` - useLazyImage hook
- `/website/app/globals.css` - Animation keyframes

### Data Dashboard (React)
- `/data/src/components/AnimatedLoader.tsx` - Main components
- `/data/src/lib/utils.ts` - Utility functions
- `/data/src/index.css` - Animation keyframes

---

## Best Practices

1. **Use InlineLoader for small UI elements** - Buttons, form fields, cards
2. **Use FullPageLoader for major transitions** - Page loads, route changes
3. **Use LazyImage for large images** - Inventory photos, hero images
4. **Use PageTransition sparingly** - Only on routes with heavy content
5. **Provide meaningful messages** - Help users understand what's loading
6. **Don't overuse** - Too many loaders can feel slow
7. **Test with slow network** - Throttle to 3G to verify UX

---

## Performance Tips

- LazyImage uses Next.js Image optimization automatically
- Loader animations are GPU-accelerated
- Full-page loaders use backdrop-filter for blur effect
- All animations respect `prefers-reduced-motion`
- Consider using `priority` prop on above-the-fold images

---

## Related Components

- **ShimmerButton** (`/website/components/ui/shimmer-button.tsx`) - Hero button with same gradient animation
- **Button** (`/website/components/ui/button.tsx`) - Standard button component
- **Card** (`/website/components/ui/card.tsx`) - Container for loading states
