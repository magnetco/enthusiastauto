# Component Inventory

**Project:** Enthusiast Auto Ecommerce Site
**Total Components:** 33 files
**Generated:** 2025-10-14

---

## Component Organization

The application uses a feature-based component organization strategy, grouping related components by functionality.

```
components/
├── cart/              # 8 components - Shopping cart functionality
├── grid/              # 3 components - Product grid layouts
├── icons/             # 1 component  - SVG icons
├── layout/            # 7 components - Site-wide layout
│   ├── navbar/        # 2 components
│   └── search/        # 3 components
├── product/           # 4 components - Product displays
└── [standalone]/      # 10 components - Utility components
```

---

## Cart Components (8 files)

**Location:** `components/cart/`

**Purpose:** Complete shopping cart functionality with optimistic UI updates

| Component              | File                            | Type   | Purpose                             |
| ---------------------- | ------------------------------- | ------ | ----------------------------------- |
| **Add to Cart Button** | `add-to-cart.tsx`               | Client | Add item to cart with loading state |
| **Cart Context**       | `cart-context.tsx`              | Client | Cart state management provider      |
| **Close Cart**         | `close-cart.tsx`                | Client | Close cart drawer button            |
| **Delete Item Button** | `delete-item-button.tsx`        | Client | Remove item from cart               |
| **Edit Quantity**      | `edit-item-quantity-button.tsx` | Client | Increment/decrement item quantity   |
| **Cart Component**     | `index.tsx`                     | Client | Main cart drawer/modal              |
| **Cart Modal**         | `modal.tsx`                     | Client | Cart overlay modal container        |
| **Open Cart**          | `open-cart.tsx`                 | Client | Cart trigger button with item count |

**Key Features:**

- Optimistic UI updates (useOptimistic)
- Real-time cart synchronization with Shopify
- Accessible keyboard navigation
- Loading and error states
- Smooth animations

**Dependencies:**

- Shopify cart mutations
- React hooks (useState, useOptimistic, useTransition)
- Headless UI components

---

## Grid Components (3 files)

**Location:** `components/grid/`

**Purpose:** Flexible product grid layouts

| Component           | File              | Type   | Purpose                       |
| ------------------- | ----------------- | ------ | ----------------------------- |
| **Grid Container**  | `index.tsx`       | Server | Responsive grid wrapper       |
| **Three Item Grid** | `three-items.tsx` | Server | 3-column featured grid layout |
| **Grid Tile**       | `tile.tsx`        | Server | Individual grid item          |

**Layout Patterns:**

- Responsive grid (mobile → tablet → desktop)
- Featured product grids
- Collection product grids
- Masonry-style layouts

**Tailwind Grid Classes:**

- Grid columns: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Gap spacing: `gap-4 lg:gap-6`
- Auto-fit patterns

---

## Icon Components (1 file)

**Location:** `components/icons/`

**Purpose:** Custom SVG icons

| Component | File       | Type   | Purpose        |
| --------- | ---------- | ------ | -------------- |
| **Logo**  | `logo.tsx` | Server | Brand logo SVG |

**Note:** Project also uses Heroicons library for additional icons

---

## Layout Components (7 files)

**Location:** `components/layout/`

**Purpose:** Site-wide navigation, search, and structure

### Navbar (2 files)

**Location:** `components/layout/navbar/`

| Component       | File              | Type   | Purpose                      |
| --------------- | ----------------- | ------ | ---------------------------- |
| **Navbar**      | `index.tsx`       | Server | Main navigation bar          |
| **Mobile Menu** | `mobile-menu.tsx` | Client | Responsive mobile navigation |

**Features:**

- Responsive design (mobile hamburger → desktop nav)
- Logo, menu links, search, cart
- Sticky/fixed positioning
- Accessible navigation

### Search (3 files)

**Location:** `components/layout/search/`

| Component              | File              | Type   | Purpose                    |
| ---------------------- | ----------------- | ------ | -------------------------- |
| **Filter Component**   | `filter.tsx`      | Client | Search filtering UI        |
| **Search Bar**         | `index.tsx`       | Client | Main search input          |
| **Collections Filter** | `collections.tsx` | Server | Collection-based filtering |

**Features:**

- Instant search feedback
- Filter by collections
- URL-based search state
- Accessible search controls

### Other Layout (2 files)

**Location:** `components/layout/`

| Component              | File                     | Type   | Purpose                          |
| ---------------------- | ------------------------ | ------ | -------------------------------- |
| **Footer**             | `footer.tsx`             | Server | Site footer with links           |
| **Product Grid Items** | `product-grid-items.tsx` | Server | Product grid wrapper for layouts |

---

## Product Components (4 files)

**Location:** `components/product/`

**Purpose:** Product display and interaction

| Component               | File                      | Type   | Purpose                     |
| ----------------------- | ------------------------- | ------ | --------------------------- |
| **Product Gallery**     | `gallery.tsx`             | Client | Image carousel/gallery      |
| **Product Description** | `product-description.tsx` | Server | Rich text product details   |
| **Variant Selector**    | `variant-selector.tsx`    | Client | Size/color/option selection |
| **Grid Tile Image**     | `grid-tile-image.tsx`     | Server | Optimized product thumbnail |

**Features:**

- Image galleries with zoom
- Variant selection (size, color, etc.)
- Responsive images (next/image)
- SEO-friendly product data
- Structured data (JSON-LD)

---

## Standalone Components (10 files)

**Location:** `components/` (root)

**Purpose:** Reusable utility components

| Component           | File                  | Type   | Purpose                     |
| ------------------- | --------------------- | ------ | --------------------------- |
| **Carousel**        | `carousel.tsx`        | Client | Generic image carousel      |
| **Label**           | `label.tsx`           | Server | Badge/label component       |
| **Loading Dots**    | `loading-dots.tsx`    | Server | Loading indicator animation |
| **Logo Square**     | `logo-square.tsx`     | Server | Square logo variant         |
| **OpenGraph Image** | `opengraph-image.tsx` | Server | Dynamic OG image generator  |
| **Price**           | `price.tsx`           | Server | Formatted price display     |
| **Prose**           | `prose.tsx`           | Server | Rich text content renderer  |
| **Welcome Toast**   | `welcome-toast.tsx`   | Client | Welcome notification        |

**Common Patterns:**

- Price formatting with currency
- Loading states and skeletons
- Toast notifications
- SEO and social sharing
- Typography and content rendering

---

## Component Types

### Server Components (Default)

**Count:** ~22 components

**Characteristics:**

- Render on server
- No JavaScript sent to client
- Fetch data directly
- SEO-friendly
- Fast initial load

**Examples:**

- Product displays
- Grid layouts
- Footer, navigation menus
- Price formatting

### Client Components

**Count:** ~11 components

**Characteristics:**

- Interactive UI elements
- Event handlers
- State management
- Browser APIs
- Marked with `'use client'`

**Examples:**

- Cart operations
- Search inputs
- Mobile menu
- Variant selectors
- Carousels

---

## Design System

### Styling Approach

**Primary:** Tailwind CSS utility classes

**Patterns:**

- Responsive utilities (`sm:`, `md:`, `lg:`)
- Dark mode support (Tailwind dark mode)
- Custom spacing scale
- Typography plugin

### UI Library

**Headless UI:** Unstyled, accessible components

**Components Used:**

- `<Dialog>` - Modals and overlays
- `<Transition>` - Animations
- `<Menu>` - Dropdown menus
- `<Listbox>` - Select inputs

**Benefits:**

- Fully accessible (ARIA)
- Keyboard navigation
- Screen reader support
- Customizable styling

---

## Component Patterns

### Data Fetching

**Server Components:**

```tsx
// Fetch data directly in component
async function ProductGrid() {
  const products = await getProducts();
  return <div>{products.map(...)}</div>;
}
```

**Client Components:**

```tsx
// Receive data as props
"use client";
function AddToCart({ productId }: { productId: string }) {
  const [pending, startTransition] = useTransition();
  // ... interactive logic
}
```

### Optimistic UI

**Cart Updates:**

```tsx
"use client";
import { useOptimistic } from "react";

function Cart({ items }) {
  const [optimisticItems, addOptimistic] = useOptimistic(items);
  // Show instant feedback before server confirms
}
```

### Composition

**Layout Composition:**

```tsx
// Server Component (outer)
async function ProductPage({ params }) {
  const product = await getProduct(params.handle);

  return (
    <div>
      <ProductGallery images={product.images} /> {/* Client */}
      <ProductDescription html={product.descriptionHtml} /> {/* Server */}
      <AddToCart productId={product.id} /> {/* Client */}
    </div>
  );
}
```

---

## Accessibility

### WCAG Compliance

**Target:** WCAG 2.1 AA

**Features:**

- Semantic HTML
- ARIA labels and roles
- Keyboard navigation
- Focus management
- Screen reader support
- Color contrast

**Headless UI Benefits:**

- Built-in accessibility
- Tested patterns
- Focus trapping
- Escape key handling

---

## Performance Considerations

### Image Optimization

**next/image Component:**

- Automatic format selection (AVIF, WebP)
- Lazy loading by default
- Responsive srcsets
- Blur placeholders

**Usage:**

```tsx
import Image from "next/image";

<Image
  src={product.image}
  alt={product.title}
  width={600}
  height={600}
  priority={aboveFold}
/>;
```

### Code Splitting

- Automatic route-based splitting
- Dynamic imports for heavy components
- Client Components loaded only when needed

### Bundle Size

**Optimization Strategies:**

- Server Components reduce JS bundle
- Tree-shaking unused code
- Minimal client-side JavaScript
- Lazy loading images and components

---

## Testing Recommendations

### Component Testing

**Recommended Tools:**

- **Jest** - Unit testing
- **React Testing Library** - Component tests
- **Playwright** - E2E testing

**Example Tests:**

```typescript
// components/__tests__/price.test.tsx
import { render } from '@testing-library/react';
import Price from '../price';

test('formats USD correctly', () => {
  const { getByText } = render(
    <Price amount="19.99" currencyCode="USD" />
  );
  expect(getByText('$19.99')).toBeInTheDocument();
});
```

### Visual Regression

**Recommended Tools:**

- **Chromatic** - Visual testing
- **Percy** - Screenshot comparisons

---

## Component Maintenance

### Adding New Components

1. **Determine type:** Server or Client Component?
2. **Choose location:** Feature-based directory
3. **Follow patterns:** Use existing components as templates
4. **Add types:** Full TypeScript types
5. **Test:** Write component tests
6. **Document:** Update this inventory

### Naming Conventions

- **Files:** `kebab-case.tsx`
- **Components:** `PascalCase`
- **Props:** `camelCase`
- **Types:** `PascalCase` (e.g., `ProductProps`)

---

## Related Documentation

- **[Architecture](./architecture.md)** - Component architecture patterns
- **[Source Tree](./source-tree-analysis.md)** - File organization
- **[Development Guide](./development-guide.md)** - Component development workflow

---

**Document Version:** 1.0
**Last Updated:** 2025-10-14
