# Animated Loader - Quick Reference Card

One-page reference for the animated loader components.

---

## 📦 Import Statements

### Website (Next.js)
```tsx
import { AnimatedLoader, InlineLoader, FullPageLoader } from "@/components/ui/animated-loader";
import { LazyImage } from "@/components/ui/lazy-image";
import { PageTransition } from "@/components/ui/page-transition";
import { useLazyImage } from "@/hooks/use-lazy-image";
```

### Data Dashboard (React)
```tsx
import { AnimatedLoader, InlineLoader, FullPageLoader } from "../components/AnimatedLoader";
```

---

## 🎯 Components at a Glance

| Component | Size | Use Case | Example |
|-----------|------|----------|---------|
| `AnimatedLoader` | Custom | Base loader | `<AnimatedLoader size={48} thickness={3} />` |
| `InlineLoader` | sm/md/lg | Inline loading | `<InlineLoader size="md" message="Loading..." />` |
| `FullPageLoader` | 64px | Full-page overlay | `<FullPageLoader isLoading={true} />` |
| `LazyImage` | Variable | Image loading | `<LazyImage src="..." width={1200} height={800} />` |
| `PageTransition` | - | Route transitions | `<PageTransition>{children}</PageTransition>` |

---

## 📏 Size Reference

```tsx
// Preset sizes (InlineLoader)
<InlineLoader size="sm" />  // 24px, 2px border
<InlineLoader size="md" />  // 32px, 2.5px border
<InlineLoader size="lg" />  // 48px, 3px border

// Custom sizes (AnimatedLoader)
<AnimatedLoader size={32} thickness={2} />
<AnimatedLoader size={48} thickness={3} />
<AnimatedLoader size={64} thickness={4} />
```

---

## 💻 Common Code Snippets

### 1. Basic Loading State
```tsx
{isLoading ? (
  <InlineLoader size="md" message="Loading..." />
) : (
  <Content />
)}
```

### 2. Button with Loader
```tsx
<button disabled={isSubmitting}>
  {isSubmitting ? (
    <>
      <AnimatedLoader size={20} thickness={2} />
      <span>Submitting...</span>
    </>
  ) : (
    "Submit"
  )}
</button>
```

### 3. Full Page Loading
```tsx
const [isLoading, setIsLoading] = useState(true);

return (
  <>
    <FullPageLoader isLoading={isLoading} message="Loading data..." />
    <YourContent />
  </>
);
```

### 4. Lazy Load Image (Website)
```tsx
<LazyImage
  src="/vehicles/e46-m3.jpg"
  alt="BMW E46 M3"
  width={1200}
  height={800}
  showLoader
  loaderSize="lg"
/>
```

### 5. Page Transition (Website)
```tsx
// In layout.tsx or page.tsx
<PageTransition duration={500}>
  <YourPageContent />
</PageTransition>
```

### 6. Centered in Container
```tsx
<div className="flex items-center justify-center h-64">
  <InlineLoader size="lg" message="Loading..." />
</div>
```

---

## 🎨 Props Reference

### AnimatedLoader
```tsx
interface AnimatedLoaderProps {
  size?: number;           // Diameter in pixels (default: 48)
  thickness?: number;      // Border thickness (default: 3)
  message?: string;        // Optional message below loader
  className?: string;      // Additional CSS classes
}
```

### InlineLoader
```tsx
interface InlineLoaderProps {
  size?: "sm" | "md" | "lg";  // Preset sizes
  message?: string;            // Optional message
  className?: string;          // Additional CSS classes
}
```

### FullPageLoader
```tsx
interface FullPageLoaderProps {
  isLoading: boolean;          // Controls visibility
  message?: string;            // Loading message (default: "Loading...")
  overlayOpacity?: number;     // Background opacity 0-1 (default: 0.8)
}
```

### LazyImage (Website)
```tsx
interface LazyImageProps extends Omit<ImageProps, "src"> {
  src: string;                 // Image URL
  alt: string;                 // Alt text
  showLoader?: boolean;        // Show loader while loading (default: true)
  loaderSize?: "sm" | "md" | "lg";  // Loader size
  containerClassName?: string; // Container CSS classes
}
```

### PageTransition (Website)
```tsx
interface PageTransitionProps {
  children: React.ReactNode;   // Page content
  duration?: number;            // Loader duration in ms (default: 500)
}
```

---

## 🎨 Gradient Colors

```tsx
#026AA2  →  #529BCA  →  #F90020
(Deep Blue) (Light Blue) (Brand Red)
```

---

## ⚡ Performance Tips

1. **Use InlineLoader for small elements** - Lighter than AnimatedLoader
2. **Lazy load large images** - Use LazyImage for 1200px+ images
3. **Limit FullPageLoader use** - Only for major transitions
4. **Provide meaningful messages** - Help users understand what's loading
5. **Test with slow network** - Throttle to 3G to verify UX

---

## ♿ Accessibility

All loaders include:
- ✅ `role="status"` - Announces loading state
- ✅ `aria-live="polite"` - Non-intrusive updates
- ✅ `aria-label` - Descriptive labels
- ✅ Screen reader text - Hidden visual text
- ✅ Reduced motion support - Slower animation (8s)

---

## 🧪 Test Pages

### Website
```bash
pnpm dev
# Visit: http://localhost:3040/test-loader
```

### Data Dashboard
```bash
pnpm dev
# Visit: http://localhost:4040/test-loader
```

---

## 🎯 Decision Tree

**Need to show loading state?**

→ **Small element (button, card)?**
  - Yes → Use `InlineLoader` (sm/md)
  - No ↓

→ **Large image?**
  - Yes → Use `LazyImage` (website only)
  - No ↓

→ **Full page transition?**
  - Yes → Use `FullPageLoader` or `PageTransition`
  - No ↓

→ **Custom size/placement?**
  - Yes → Use `AnimatedLoader`

---

## 🔧 Customization

### Change Animation Speed
```css
/* In globals.css or index.css */
.loader-ring {
  animation: shimmer-rotate 2s linear infinite; /* Faster */
}
```

### Change Colors
```tsx
// In component file
background: "conic-gradient(from var(--gradient-angle, 0deg), 
  #YOUR_COLOR_1 0%, 
  #YOUR_COLOR_2 33%, 
  #YOUR_COLOR_3 66%, 
  #YOUR_COLOR_1 100%)"
```

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `LOADER-QUICK-REFERENCE.md` | This file - quick reference |
| `LOADER-SUMMARY.md` | High-level overview |
| `ANIMATED-LOADER.md` | Complete API reference |
| `LOADER-IMPLEMENTATION.md` | Implementation guide |
| `LOADER-VISUAL-GUIDE.md` | Visual reference |
| `LOADER-COMPARISON.md` | Comparison with hero button |

---

## 🚨 Common Mistakes

### ❌ Don't Do This
```tsx
// Using raw size without units
<div style={{ width: 48 }}>  // Missing 'px'

// Forgetting to handle loading state
<LazyImage src="..." />  // No fallback if image fails

// Too many loaders
<InlineLoader />
<InlineLoader />
<InlineLoader />  // Feels slow!
```

### ✅ Do This Instead
```tsx
// Proper sizing
<div style={{ width: '48px' }}>

// Handle loading and error states
{isLoading ? <InlineLoader /> : error ? <ErrorMessage /> : <Content />}

// Single loader for section
{isLoading ? <InlineLoader /> : <AllContent />}
```

---

## 💡 Pro Tips

1. **Combine with Suspense** (React 18+)
   ```tsx
   <Suspense fallback={<InlineLoader size="lg" />}>
     <LazyComponent />
   </Suspense>
   ```

2. **Debounce loading state** - Avoid flashing for fast loads
   ```tsx
   const [showLoader, setShowLoader] = useState(false);
   
   useEffect(() => {
     const timer = setTimeout(() => setShowLoader(isLoading), 200);
     return () => clearTimeout(timer);
   }, [isLoading]);
   ```

3. **Progressive loading** - Show skeleton first, then loader
   ```tsx
   {isInitialLoad ? <Skeleton /> : isLoading ? <InlineLoader /> : <Content />}
   ```

---

## 📞 Quick Help

**Loader not animating?**
- Check browser support (Chrome 85+, Firefox 89+, Safari 15.4+)
- Verify CSS is imported

**Loader not visible?**
- Check `isLoading` state
- Verify z-index (FullPageLoader uses z-50)
- Check background color contrast

**LazyImage not loading?**
- Verify image URL
- Check Next.js Image domains config
- Look for console errors

---

## ✨ Summary

```tsx
// Most common usage
import { InlineLoader } from "@/components/ui/animated-loader";

{isLoading ? (
  <InlineLoader size="md" message="Loading..." />
) : (
  <YourContent />
)}
```

**That's it!** You're ready to use the animated loader throughout your application.
