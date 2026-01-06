# Enthusiast Auto

BMW specialist e-commerce platform combining vehicle inventory and parts shopping. This README serves both humans and AI assistants.

## Quick Start

```bash
cd website && pnpm install && pnpm dev    # Website at localhost:3000
cd studio && pnpm install && pnpm dev     # Sanity Studio at localhost:3333
cd data && pnpm install && pnpm dev       # Data Admin at localhost:4000
```

## Context

Read these files in order. Start with OVERVIEW, then read what's relevant to your task.

| Order | File | Purpose |
|-------|------|---------|
| 1 | [context/OVERVIEW.md](context/OVERVIEW.md) | Start here — what Enthusiast Auto is, who we serve |
| 2 | [context/ARCHITECTURE.md](context/ARCHITECTURE.md) | Technical architecture, data models, API design |
| 3 | [context/STACK.md](context/STACK.md) | Detailed tech stack reference |
| 4 | [context/ROADMAP.md](context/ROADMAP.md) | What's shipped, in progress, and planned |

## Tech Stack

- **Next.js 15** (App Router) — server components by default
- **React 19** — UI
- **TypeScript** — strict types
- **Tailwind CSS 4** — styling
- **Prisma 7** — database ORM
- **Sanity CMS** — vehicle content management
- **Shopify** — parts e-commerce (headless)
- **NextAuth.js 5** — authentication
- **Resend** — transactional email

## Project Layout

```
enthusiastauto/
├── context/              # Documentation (read first)
│   ├── OVERVIEW.md       # What this is
│   ├── ARCHITECTURE.md   # Technical deep-dive
│   ├── STACK.md          # Tech stack details
│   └── ROADMAP.md        # What's shipped/planned
├── data/                 # Admin CRUD app (Express + Vite + React)
│   ├── server/           # Express API server
│   ├── src/              # React frontend
│   └── package.json
├── studio/               # Sanity CMS Studio (standalone)
│   ├── sanity.config.ts
│   ├── schemas/
│   └── package.json
├── website/              # Next.js application (main platform)
│   ├── app/              # Pages and API routes
│   ├── components/       # React components
│   ├── lib/              # Business logic
│   ├── prisma/           # Database schema
│   └── package.json
├── .env.local            # Shared environment variables
└── README.md
```

## Applications

### Website (`:3000`)
The main e-commerce platform. Next.js 15 with App Router.

```bash
cd website
pnpm install
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm prisma studio  # Database GUI
```

### Studio (`:3333`)
Sanity CMS for managing vehicle inventory.

```bash
cd studio
pnpm install
pnpm dev          # Start Sanity Studio
pnpm deploy       # Deploy to Sanity.io
```

### Data (`:4000`)
Admin CRUD app for viewing/managing database records (users, favorites, service requests).

```bash
cd data
pnpm install
pnpm dev          # Starts Express API + Vite frontend
```

## Environment Variables

The `.env.local` at the project root contains all shared credentials. Each app reads from it:

- **website/**: Symlinks to `../.env.local`
- **studio/**: Has its own `.env.local` with `SANITY_STUDIO_` prefix
- **data/**: Reads `DATABASE_URL` for Neon connection

See the root `.env.local` for all required variables with documentation.

## Code Style

**Components:**
- Server Components by default
- `'use client'` only when needed
- TypeScript strict mode

**Naming:**

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | VehicleCard |
| Files | kebab-case | vehicle-card.tsx |
| Functions | camelCase | getVehicles |

## Key Directories

**website/app/** — Pages and API routes (App Router)

**website/components/** — React components
- `ui/` — ShadCN primitives
- `shared/` — Shared components
- `vehicles/` — Vehicle-specific
- `cart/` — Shopping cart
- `account/` — User account

**website/lib/** — Business logic
- `auth/` — NextAuth configuration
- `db/` — Prisma client
- `sanity/` — Sanity client for data fetching
- `shopify/` — Shopify API
- `search/` — Search implementation

**studio/** — Sanity Studio
- `schemas/` — Vehicle content schema
- `lib/` — Utilities and templates

**data/** — Admin Dashboard
- `server/` — Express API routes
- `src/` — React components

## Scripts

### Vehicle Import (`website/scripts/import-vehicles.ts`)
Mass import vehicles from CSV to Sanity CMS. Used for initial inventory migration.

```bash
cd website
npx tsx scripts/import-vehicles.ts
```

**Requirements:**
- CSV file: `Enthusiast Auto - Inventories (1).csv` in website root
- `SANITY_API_TOKEN` in `.env.local` (with write permissions)

**Features:**
- Parses CSV and creates Sanity vehicle documents
- Downloads and uploads images (signature, gallery, etc.)
- Converts HTML content to Portable Text
- Skips already-imported vehicles (by slug)
- Maps chassis codes, engine codes, colors

**Alternatively:** Use the Data Manager at `localhost:4000` → Vehicle Import tab for a UI-based import.

## Deployment

**Website (Vercel):**
- Preview deployments for PRs
- Production on main branch
- Root directory: `website`

**Studio (Sanity.io):**
- `cd studio && pnpm deploy`

**Data App:**
- Deploy separately or run locally for admin access

## Decision Rules

1. **Server Components over Client** — hydrate only what needs interactivity
2. **Existing patterns over new** — check existing code first
3. **Simple over clever** — clear code wins

## Don't

- Add packages without asking
- Create abstractions for one-time use
- Use `'use client'` without good reason
- Skip TypeScript types
