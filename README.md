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

### Project Documentation

| File | Purpose | Key Contents |
|------|---------|--------------|
| [AGENTS.md](AGENTS.md) | AI agent guidance | Project overview, tech stack, standards, brand voice |
| [BUSINESS.md](context/business.md) | Why the website exists | Revenue model, conversion goals, marketing, KPIs |
| [BRAND.md](context/brand.md) | How to communicate | Voice, tone, messaging, visual identity |
| [ARCHITECTURE.md](context/architecture.md) | How it's built | Technical design, data flow, integrations |
| [STANDARDS.md](context/standards.md) | How to build correctly | Code conventions, design tokens, launch checklist |
| [ROUTES.md](context/routes.md) | Where things are | All pages, API endpoints, components |
| [ROADMAP.md](context/roadmap.md) | What's happening | Shipped, in progress, planned, known issues |

### Component Documentation

#### Animated Loader
Beautiful rotating gradient loader matching the homepage hero button animation.

| File | Purpose |
|------|---------|
| [LOADER-INDEX.md](LOADER-INDEX.md) | **Start here** - Documentation index and navigation |
| [LOADER-QUICK-REFERENCE.md](LOADER-QUICK-REFERENCE.md) | Quick reference with common code snippets |
| [LOADER-SUMMARY.md](LOADER-SUMMARY.md) | High-level overview of implementation |
| [ANIMATED-LOADER.md](ANIMATED-LOADER.md) | Complete API reference for all components |
| [LOADER-IMPLEMENTATION.md](LOADER-IMPLEMENTATION.md) | Integration guide with use cases |
| [LOADER-VISUAL-GUIDE.md](LOADER-VISUAL-GUIDE.md) | Visual design reference with diagrams |
| [LOADER-COMPARISON.md](LOADER-COMPARISON.md) | Comparison with hero button animation |

**Test Pages:**
- Website: http://localhost:3040/test-loader
- Data Dashboard: http://localhost:4040/test-loader
