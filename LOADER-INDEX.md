# Animated Loader Documentation Index

Complete documentation for the animated loader system.

---

## 📚 Documentation Files

### 🚀 Start Here

**[LOADER-QUICK-REFERENCE.md](./LOADER-QUICK-REFERENCE.md)**  
One-page quick reference with common code snippets and props.  
**Read this if:** You want to get started quickly.

**[LOADER-SUMMARY.md](./LOADER-SUMMARY.md)**  
High-level overview of what was created and how to use it.  
**Read this if:** You want a quick overview of the implementation.

---

### 📖 Detailed Guides

**[ANIMATED-LOADER.md](./ANIMATED-LOADER.md)**  
Complete API reference with all components, props, and usage examples.  
**Read this if:** You need detailed information about specific components.

**[LOADER-IMPLEMENTATION.md](./LOADER-IMPLEMENTATION.md)**  
Implementation guide with common use cases and best practices.  
**Read this if:** You're integrating the loader into your application.

---

### 🎨 Visual References

**[LOADER-VISUAL-GUIDE.md](./LOADER-VISUAL-GUIDE.md)**  
ASCII diagrams showing loader appearance, sizes, and animations.  
**Read this if:** You want to understand the visual design.

**[LOADER-COMPARISON.md](./LOADER-COMPARISON.md)**  
Side-by-side comparison with the hero button animation.  
**Read this if:** You want to understand how it matches the hero button.

---

## 🎯 Quick Navigation

### By Task

| What do you want to do? | Read this |
|-------------------------|-----------|
| Get started quickly | [LOADER-QUICK-REFERENCE.md](./LOADER-QUICK-REFERENCE.md) |
| See what was created | [LOADER-SUMMARY.md](./LOADER-SUMMARY.md) |
| Learn all component props | [ANIMATED-LOADER.md](./ANIMATED-LOADER.md) |
| See common use cases | [LOADER-IMPLEMENTATION.md](./LOADER-IMPLEMENTATION.md) |
| Understand the design | [LOADER-VISUAL-GUIDE.md](./LOADER-VISUAL-GUIDE.md) |
| Compare with hero button | [LOADER-COMPARISON.md](./LOADER-COMPARISON.md) |

### By Component

| Component | Documentation |
|-----------|---------------|
| AnimatedLoader | [ANIMATED-LOADER.md](./ANIMATED-LOADER.md#1-animatedloader-base-component) |
| InlineLoader | [ANIMATED-LOADER.md](./ANIMATED-LOADER.md#2-inlineloader) |
| FullPageLoader | [ANIMATED-LOADER.md](./ANIMATED-LOADER.md#3-fullpageloader) |
| LazyImage | [ANIMATED-LOADER.md](./ANIMATED-LOADER.md#4-lazyimage-website-only) |
| PageTransition | [ANIMATED-LOADER.md](./ANIMATED-LOADER.md#5-pagetransition-website-only) |
| useLazyImage | [ANIMATED-LOADER.md](./ANIMATED-LOADER.md#custom-hook-uselazyimage-website-only) |

### By Use Case

| Use Case | Documentation |
|----------|---------------|
| Basic loading state | [LOADER-IMPLEMENTATION.md](./LOADER-IMPLEMENTATION.md#basic-loading-state) |
| Form submission | [LOADER-IMPLEMENTATION.md](./LOADER-IMPLEMENTATION.md#form-submission) |
| Page-level loading | [LOADER-IMPLEMENTATION.md](./LOADER-IMPLEMENTATION.md#page-level-loading-website) |
| Lazy loading images | [LOADER-IMPLEMENTATION.md](./LOADER-IMPLEMENTATION.md#lazy-loading-images-website) |
| Route transitions | [LOADER-IMPLEMENTATION.md](./LOADER-IMPLEMENTATION.md#route-transitions-website) |
| Data dashboard loading | [LOADER-IMPLEMENTATION.md](./LOADER-IMPLEMENTATION.md#data-dashboard-loading) |

---

## 📦 What Was Created

### Components (Both Apps)
- ✅ AnimatedLoader - Base loader component
- ✅ InlineLoader - Smaller variant (sm/md/lg)
- ✅ FullPageLoader - Full-screen overlay

### Website Only
- ✅ LazyImage - Image wrapper with loader
- ✅ PageTransition - Route transition wrapper
- ✅ useLazyImage - Lazy loading hook

### Documentation
- ✅ 6 comprehensive documentation files
- ✅ Test pages for both apps
- ✅ Visual references and examples

---

## 🚀 Getting Started

### 1. View the Test Pages

**Website:**
```bash
cd website && pnpm dev
# Visit: http://localhost:3040/test-loader
```

**Data Dashboard:**
```bash
cd data && pnpm dev
# Visit: http://localhost:4040/test-loader
```

### 2. Read the Quick Reference

Start with [LOADER-QUICK-REFERENCE.md](./LOADER-QUICK-REFERENCE.md) for common code snippets.

### 3. Integrate into Your App

Follow the examples in [LOADER-IMPLEMENTATION.md](./LOADER-IMPLEMENTATION.md).

---

## 🎨 Design Details

### Gradient Colors
```
#026AA2 → #529BCA → #F90020
(Deep Blue) (Light Blue) (Brand Red)
```

### Animation
- **Speed**: 3.5s per rotation
- **Reduced Motion**: 8s per rotation
- **Style**: Smooth clockwise rotation
- **Performance**: GPU-accelerated

### Accessibility
- ✅ ARIA labels and live regions
- ✅ Screen reader support
- ✅ Reduced motion support
- ✅ Keyboard accessible

---

## 📁 File Locations

### Website (`/website`)
```
components/ui/
├── animated-loader.tsx     ← Main components
├── lazy-image.tsx          ← LazyImage component
└── page-transition.tsx     ← PageTransition wrapper

hooks/
└── use-lazy-image.ts       ← useLazyImage hook

app/
├── globals.css             ← Animation keyframes
└── test-loader/page.tsx    ← Test page
```

### Data Dashboard (`/data`)
```
src/
├── components/
│   └── AnimatedLoader.tsx  ← Main components
├── lib/
│   └── utils.ts            ← cn() utility
├── routes/
│   └── test-loader.tsx     ← Test page
├── router.tsx              ← Updated with test route
└── index.css               ← Animation keyframes
```

---

## 💡 Common Patterns

### Pattern 1: Simple Loading State
```tsx
{isLoading ? <InlineLoader size="md" /> : <Content />}
```

### Pattern 2: Loading with Message
```tsx
<InlineLoader size="lg" message="Loading inventory..." />
```

### Pattern 3: Full Page Overlay
```tsx
<FullPageLoader isLoading={isLoading} message="Processing..." />
```

### Pattern 4: Lazy Load Image (Website)
```tsx
<LazyImage src="..." width={1200} height={800} showLoader />
```

### Pattern 5: Button Loading
```tsx
<button disabled={isSubmitting}>
  {isSubmitting ? <AnimatedLoader size={20} /> : "Submit"}
</button>
```

---

## 🎯 Best Practices

1. **Use InlineLoader for small elements** - Buttons, cards, form fields
2. **Use FullPageLoader for major transitions** - Page loads, route changes
3. **Use LazyImage for large images** - Inventory photos, hero images
4. **Provide meaningful messages** - "Loading inventory..." not "Loading..."
5. **Don't overuse** - Too many loaders can feel slow
6. **Test with slow network** - Throttle to 3G to verify UX

---

## 🔧 Customization

### Change Animation Speed
Edit `globals.css` or `index.css`:
```css
.loader-ring {
  animation: shimmer-rotate 2s linear infinite;
}
```

### Change Gradient Colors
Edit the component files:
```tsx
background: "conic-gradient(from var(--gradient-angle, 0deg), 
  #YOUR_COLOR_1 0%, 
  #YOUR_COLOR_2 33%, 
  #YOUR_COLOR_3 66%, 
  #YOUR_COLOR_1 100%)"
```

---

## 🐛 Troubleshooting

### Loader not animating?
- Check browser support (Chrome 85+, Firefox 89+, Safari 15.4+)
- Verify CSS is imported
- Check for CSS conflicts

### Loader not visible?
- Check `isLoading` state is `true`
- Verify z-index (FullPageLoader uses `z-50`)
- Check background color contrast

### LazyImage not loading?
- Verify image URL is valid
- Check Next.js Image domains config
- Look for console errors

**More troubleshooting:** [ANIMATED-LOADER.md](./ANIMATED-LOADER.md#troubleshooting)

---

## 📊 Performance

- **Bundle Size**: ~2KB (minified + gzipped)
- **Animation**: GPU-accelerated (CSS transforms)
- **Render Cost**: Minimal (pure CSS)
- **Browser Support**: Chrome 85+, Firefox 89+, Safari 15.4+

---

## 🎉 Summary

You now have a complete animated loader system that:

✅ Matches your hero button animation  
✅ Works in both website and data dashboard  
✅ Supports multiple use cases  
✅ Is fully accessible  
✅ Is well-documented  
✅ Has test pages for verification  

**Start here:** [LOADER-QUICK-REFERENCE.md](./LOADER-QUICK-REFERENCE.md)

---

## 📞 Documentation Map

```
LOADER-INDEX.md (you are here)
├── LOADER-QUICK-REFERENCE.md ← Start here for quick snippets
├── LOADER-SUMMARY.md ← Overview of what was created
├── ANIMATED-LOADER.md ← Complete API reference
├── LOADER-IMPLEMENTATION.md ← Integration guide
├── LOADER-VISUAL-GUIDE.md ← Visual design reference
└── LOADER-COMPARISON.md ← Comparison with hero button
```

---

**Ready to get started?** Visit the test pages or read the [Quick Reference](./LOADER-QUICK-REFERENCE.md)!
