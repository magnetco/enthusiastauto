# Development Guide

**Project:** Enthusiast Auto Ecommerce Site
**Framework:** Next.js 15 (App Router)
**Package Manager:** pnpm
**Generated:** 2025-10-14

---

## Prerequisites

### Required

- **Node.js** - Version 18.x or higher recommended
- **pnpm** - Fast, disk space efficient package manager
  ```bash
  npm install -g pnpm
  ```

### Optional

- **Vercel CLI** - For deployment and environment variable management
  ```bash
  npm install -g vercel
  ```

---

## Environment Setup

### 1. Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Required variables (see `.env.example`):

```env
# Shopify Storefront API
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_token

# Site Configuration
SITE_NAME="Your Store Name"
COMPANY_NAME="Your Company"

# Optional: On-demand Revalidation
SHOPIFY_REVALIDATION_SECRET=your_secret_key
```

**⚠️ Security Warning:** Never commit `.env` file to version control. It contains sensitive API credentials.

### 2. Shopify Setup

This application requires a Shopify store with the Storefront API enabled:

1. Create a Shopify store (or use existing)
2. Enable Storefront API in Shopify Admin
3. Generate Storefront API access token
4. Add credentials to `.env` file

For detailed Shopify configuration, see:

- [Vercel + Shopify Integration Guide](https://vercel.com/docs/integrations/ecommerce/shopify)

---

## Installation

Install all dependencies:

```bash
pnpm install
```

This will install:

- Next.js 15 (React 19)
- TypeScript
- Tailwind CSS
- UI libraries (Headless UI, Heroicons)
- Development tools

---

## Development

### Start Development Server

```bash
pnpm dev
```

The app will run on **[http://localhost:3000](http://localhost:3000)**

Features in dev mode:

- ⚡ **Turbopack** - Fast refresh and instant updates
- 🔄 **Hot Module Replacement** - Changes reflect immediately
- 🐛 **Source Maps** - Easy debugging
- 📊 **Dev Overlay** - Error messages and warnings

### Development URLs

- **Homepage:** http://localhost:3000
- **Product Page:** http://localhost:3000/product/{handle}
- **Search/Collections:** http://localhost:3000/search/{collection}
- **API Revalidation:** http://localhost:3000/api/revalidate

---

## Build & Production

### Build for Production

```bash
pnpm build
```

This command:

1. Compiles TypeScript
2. Bundles React components
3. Optimizes images and assets
4. Generates static pages (ISR)
5. Creates production build in `.next/` directory

### Preview Production Build Locally

```bash
pnpm start
```

Runs the production server on http://localhost:3000

**Note:** Always test the production build before deploying.

---

## Code Quality

### Format Code

```bash
pnpm prettier
```

Automatically formats all files using Prettier with Tailwind CSS plugin.

### Check Formatting

```bash
pnpm prettier:check
```

Verifies code formatting without making changes.

### Run Tests

```bash
pnpm test
```

Currently runs prettier:check. Add additional test suites here.

---

## Project Structure

```
├── app/              # Next.js App Router (pages & API routes)
├── components/       # React UI components
├── lib/             # Utilities and Shopify integration
│   └── shopify/     # Shopify API client
├── fonts/           # Custom fonts (Geist)
├── .env             # Environment variables (not committed)
└── package.json     # Dependencies and scripts
```

For detailed structure analysis, see: [`source-tree-analysis.md`](./source-tree-analysis.md)

---

## Common Development Tasks

### Adding a New Page

1. Create a new directory in `app/`

   ```bash
   mkdir app/about
   ```

2. Add a `page.tsx` file:

   ```tsx
   export default function AboutPage() {
     return <div>About Us</div>;
   }
   ```

3. File-system routing automatically creates `/about` route

### Adding a New Component

1. Create component file in `components/`

   ```tsx
   // components/my-component.tsx
   export function MyComponent() {
     return <div>Hello</div>;
   }
   ```

2. Import and use in pages:
   ```tsx
   import { MyComponent } from "@/components/my-component";
   ```

### Fetching Shopify Data

Use the Shopify client from `lib/shopify`:

```tsx
import { getProduct } from "lib/shopify";

export default async function ProductPage({ params }) {
  const product = await getProduct(params.handle);

  return <div>{product.title}</div>;
}
```

Available Shopify functions:

- `getProduct(handle)` - Fetch single product
- `getProducts()` - Fetch all products
- `getCollection(handle)` - Fetch collection
- `getMenu(handle)` - Fetch navigation menu
- `getCart(cartId)` - Fetch cart
- `addToCart()`, `updateCart()`, `removeFromCart()` - Cart mutations

### On-Demand Revalidation

Trigger cache revalidation when Shopify content changes:

**Webhook endpoint:** `/api/revalidate`

Configure Shopify webhook:

- URL: `https://your-domain.com/api/revalidate?secret=YOUR_SECRET`
- Topic: Product updates, Collection updates
- Format: JSON

---

## Troubleshooting

### Port 3000 Already in Use

Kill the process using port 3000:

```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

Or run on different port:

```bash
PORT=3001 pnpm dev
```

### Build Errors

1. Clear Next.js cache:

   ```bash
   rm -rf .next
   ```

2. Reinstall dependencies:

   ```bash
   rm -rf node_modules
   pnpm install
   ```

3. Check TypeScript errors:
   ```bash
   npx tsc --noEmit
   ```

### Environment Variables Not Loading

- Restart dev server after changing `.env`
- Verify variable names match `.env.example`
- Check for typos in variable names
- Ensure `.env` file is in project root

---

## Performance Tips

### Optimizing Images

Next.js automatically optimizes images when using `next/image`:

```tsx
import Image from "next/image";

<Image
  src={product.image}
  alt={product.title}
  width={600}
  height={600}
  priority // For above-the-fold images
/>;
```

### Server Components vs Client Components

- **Server Components** (default) - Fetch data on server, reduce JS bundle
- **Client Components** - Add `'use client'` for interactivity

Use Server Components whenever possible for better performance.

### Caching Strategy

- **Static Generation** - Build-time rendering (default)
- **Incremental Static Regeneration (ISR)** - Revalidate on-demand
- **Dynamic Rendering** - Real-time data fetching

---

## Next Steps

1. Review [`architecture.md`](./architecture.md) for system design
2. Check [`api-contracts.md`](./api-contracts.md) for Shopify API details _(To be generated)_
3. See [`component-inventory.md`](./component-inventory.md) for UI components _(To be generated)_

---

**For deployment instructions, see:** [`deployment-guide.md`](./deployment-guide.md) _(To be generated)_
