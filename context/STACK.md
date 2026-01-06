# Tech Stack

Detailed technology reference for the Enthusiast Auto platform.

## Applications Overview

| App | Port | Stack | Purpose |
|-----|------|-------|---------|
| **website** | 3000 | Next.js 15 | Main e-commerce platform |
| **studio** | 3333 | Sanity v3 | Vehicle content management |
| **data** | 4000 | Express + Vite + React | Admin database viewer |

## Website Stack

### Core Framework

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15.3.x | React framework with App Router |
| React | 19.0.0 | UI library |
| TypeScript | 5.8.x | Type safety |

### Styling

| Technology | Purpose |
|------------|---------|
| Tailwind CSS 4 | Utility-first CSS |
| ShadCN UI | Radix-based component primitives |
| Radix UI | Accessible component primitives |
| clsx | Conditional class names |
| tailwind-merge | Merge Tailwind classes |

### Data Layer

| Technology | Purpose |
|------------|---------|
| Sanity CMS | Vehicle content (listings, images, specs) |
| Shopify Storefront API | Parts e-commerce (products, cart, checkout) |
| Vercel Postgres (Neon) | User data, favorites, service requests |
| Prisma 7 | Database ORM |

### Authentication

| Technology | Purpose |
|------------|---------|
| NextAuth.js 5 (beta) | Authentication framework |
| @auth/prisma-adapter | Database session storage |
| bcryptjs | Password hashing |

Supported providers:
- Email/password (credentials)
- Google OAuth
- Facebook OAuth (planned)

### Email

| Technology | Purpose |
|------------|---------|
| Resend | Transactional email API |
| React Email | Email templates |

### Search

| Technology | Purpose |
|------------|---------|
| Fuse.js | Client-side fuzzy search |

### Forms

| Technology | Purpose |
|------------|---------|
| React Hook Form | Form state management |
| Zod | Schema validation |
| @hookform/resolvers | Zod integration |

### Testing

| Technology | Purpose |
|------------|---------|
| Vitest | Unit/integration testing |
| Playwright | E2E testing |
| Testing Library | Component testing |
| happy-dom | DOM simulation |

## Studio Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Sanity | 3.68.x | CMS framework |
| @sanity/vision | 3.68.x | GROQ query tool |
| React | 18.x | UI (Sanity requirement) |

## Data App Stack

| Technology | Purpose |
|------------|---------|
| Express | API server |
| Vite | Frontend build tool |
| React 18 | UI library |
| Tailwind CSS 3 | Styling |
| @neondatabase/serverless | Database connection |
| tsx | TypeScript execution |
| concurrently | Run server + client together |

## Development Tools

| Technology | Purpose |
|------------|---------|
| pnpm | Package manager |
| Prettier | Code formatting |
| ESLint | Linting |

## Hosting & Deployment

| Service | Purpose |
|---------|---------|
| Vercel | Website hosting, CDN, serverless |
| Vercel Postgres (Neon) | Database |
| Sanity.io | Studio hosting |
| GitHub | Source control |

## Rendering Strategies (Website)

| Page Type | Strategy | Revalidation |
|-----------|----------|--------------|
| Vehicle listings | ISR | 60s + webhook |
| Vehicle detail | ISR | 60s + webhook |
| Product listings | SSG | Shopify webhook |
| Product detail | SSG + ISR | 300s + webhook |
| User dashboard | SSR | N/A |
| Search results | Client-side | N/A |

## Key Dependencies

### Website
```json
{
  "next": "15.3.x",
  "react": "19.0.0",
  "typescript": "5.8.x",
  "tailwindcss": "4.x",
  "@prisma/client": "7.x",
  "next-auth": "5.0.0-beta.x",
  "next-sanity": "11.x",
  "fuse.js": "7.x",
  "react-hook-form": "7.x",
  "zod": "3.x",
  "resend": "6.x"
}
```

### Studio
```json
{
  "sanity": "3.68.x",
  "@sanity/vision": "3.68.x",
  "react": "18.x"
}
```

### Data
```json
{
  "express": "4.x",
  "vite": "6.x",
  "react": "18.x",
  "@neondatabase/serverless": "0.10.x"
}
```

## Environment Variables

All apps read from `.env.local` at project root. Key variables:

| Variable | Used By | Purpose |
|----------|---------|---------|
| `POSTGRES_PRISMA_URL` | website, data | Database connection (pooled) |
| `DATABASE_URL` | website | Database connection (direct) |
| `SHOPIFY_*` | website | Shopify API credentials |
| `NEXT_PUBLIC_SANITY_*` | website | Sanity project config |
| `SANITY_STUDIO_*` | studio | Sanity studio config |
| `NEXTAUTH_*` | website | Auth configuration |
| `RESEND_API_KEY` | website | Email sending |
| `GOOGLE_*` | website | OAuth credentials |
