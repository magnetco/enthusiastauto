# Enthusiast Auto

BMW specialist e-commerce platform.

## Quick Start

```bash
cd website && pnpm install && pnpm dev    # localhost:3040
cd studio && pnpm install && pnpm dev     # localhost:5040
cd data && pnpm install && pnpm dev       # localhost:4040
```

## Development Ports

| Service | Port | URL |
|---------|------|-----|
| Website (Next.js) | 3040 | http://localhost:3040 |
| Data App (Vite) | 4040 | http://localhost:4040 |
| Data API (Express) | 4041 | http://localhost:4041 |
| Studio (Sanity) | 5040 | http://localhost:5040 |

Port pattern: Base ports spaced by 1000 (3040 → 4040 → 5040).

## Documentation

| File | Purpose | Key Contents |
|------|---------|--------------|
| [BUSINESS.md](context/BUSINESS.md) | Why the website exists | Revenue model, conversion goals, marketing, KPIs |
| [BRAND.md](context/BRAND.md) | How to communicate | Voice, tone, messaging, visual identity |
| [ARCHITECTURE.md](context/ARCHITECTURE.md) | How it's built | Technical design, data flow, integrations |
| [STANDARDS.md](context/STANDARDS.md) | How to build correctly | Code conventions, design tokens, launch checklist |
| [ROUTES.md](context/ROUTES.md) | Where things are | All pages, API endpoints, components |
| [ROADMAP.md](context/ROADMAP.md) | What's happening | Shipped, in progress, planned, known issues |
