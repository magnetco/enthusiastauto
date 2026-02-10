# Context Documentation

This directory contains all project context, documentation, and reference materials for the Enthusiast Auto Group platform.

---

## Directory Structure

```
context/
├── README.md                    # This file - documentation index
├── architecture.md              # System architecture and technical design
├── brand.md                     # Brand voice, positioning, and guidelines
├── business.md                  # Business model and revenue streams
├── buyer-behavior.md            # User behavior and purchase patterns
├── client.md                    # Client information and requirements
├── components.md                # Component documentation and API reference
├── icp.md                       # Ideal Customer Profile
├── roadmap.md                   # Product roadmap and future plans
├── routes.md                    # Application routes and navigation
├── standards.md                 # Code standards and conventions
└── reports/
    ├── implementation-feb-2026.md   # February 2026 implementations
    └── project-overview-feb-2026.md # Project status overview
```

---

## Quick Navigation

### For Developers

| Document | Purpose | When to Read |
|----------|---------|--------------|
| [architecture.md](./architecture.md) | System design, tech stack, data flow | Starting development, architecture decisions |
| [standards.md](./standards.md) | Code conventions, best practices | Before writing code |
| [components.md](./components.md) | Component API and usage | Using/creating components |
| [routes.md](./routes.md) | Route structure and patterns | Adding new routes |

### For Designers

| Document | Purpose | When to Read |
|----------|---------|--------------|
| [brand.md](./brand.md) | Brand voice, colors, typography | All design work |
| [buyer-behavior.md](./buyer-behavior.md) | User behavior patterns | UX/UI decisions |
| [icp.md](./icp.md) | Target audience profiles | User research, personas |

### For Business/Product

| Document | Purpose | When to Read |
|----------|---------|--------------|
| [business.md](./business.md) | Revenue model, metrics | Business planning |
| [roadmap.md](./roadmap.md) | Feature roadmap | Sprint planning |
| [client.md](./client.md) | Client requirements | Project scope |
| [reports/](./reports/) | Implementation reports | Status updates |

---

## Document Summaries

### architecture.md

**System Architecture & Technical Design**

- Dual-CMS strategy (Sanity + Shopify)
- Data ownership and responsibilities
- Hybrid rendering strategy (ISR, SSR, SSG)
- Caching strategy and revalidation
- Database schema (Prisma + Postgres)
- API routes and endpoints
- External service integrations

**Key Topics:**
- Next.js 15 App Router patterns
- Sanity CMS integration
- Shopify Storefront API
- Vercel Postgres with Prisma
- NextAuth.js authentication

### brand.md

**Brand Voice & Guidelines**

- Brand positioning: "The Leading BMW Preservation Facility"
- Voice attributes: Knowledgeable, Enthusiast-First, Confident, Approachable
- Tone by context (marketing, product, transactional)
- Writing style and CTAs
- Color system and design tokens
- Typography and spacing

**Key Topics:**
- Brand voice guidelines
- Color palette and semantic tokens
- Typography system
- Content writing standards

### business.md

**Business Model & Revenue**

- Revenue streams (vehicles, parts, services)
- User segments and conversion goals
- Pricing strategy
- Performance metrics
- Growth opportunities

**Key Topics:**
- Vehicle sales model
- Parts e-commerce
- Service lead generation
- Conversion optimization

### buyer-behavior.md

**User Behavior & Patterns**

- User journey mapping
- Purchase decision factors
- Content consumption patterns
- Mobile vs desktop behavior
- Search and discovery patterns

**Key Topics:**
- Vehicle buyer behavior
- Parts shopper patterns
- Service customer journey
- Seller/consignment flow

### client.md

**Client Information**

- Client background
- Project requirements
- Stakeholder information
- Communication preferences
- Success criteria

### components.md

**Component Documentation**

Complete API reference for all custom components:

- **Animated Loader System** - Loading states and transitions
- **Chassis Icons** - Visual inventory filtering
- **Vehicle Components** - VDP components (hero, gallery, specs, etc.)
- **Shared Components** - Cross-feature components

**Key Topics:**
- Component props and usage
- Common patterns
- Accessibility features
- Performance optimization
- Testing guidelines

### icp.md

**Ideal Customer Profile**

- Target audience demographics
- Psychographics and motivations
- Pain points and needs
- Purchase behavior
- Marketing channels

### roadmap.md

**Product Roadmap**

- Completed features
- In-progress work
- Planned features
- Future enhancements
- Technical debt

### routes.md

**Application Routes**

- Public pages
- Protected routes (account)
- API endpoints
- Route patterns
- Navigation structure

### standards.md

**Code Standards & Conventions**

- TypeScript guidelines
- React/Next.js patterns
- CSS/Tailwind conventions
- File organization
- Naming conventions
- Testing standards

---

## Reports

### implementation-feb-2026.md

**February 2026 Implementation Report**

Comprehensive summary of all features implemented in February 2026:

1. **VDP Redesign** - Complete vehicle detail page overhaul
2. **Sanity CMS Page Management** - CMS control for all static pages
3. **Animated Loader System** - Consistent loading UX
4. **Chassis Icons Filter** - Visual inventory filtering
5. **Blog Import** - Content migration from production

**Status:** All implementations complete and documented

### project-overview-feb-2026.md

**Project Status Overview**

High-level project status, metrics, and progress tracking.

---

## How to Use This Documentation

### For New Team Members

1. Start with [client.md](./client.md) - Understand the project
2. Read [brand.md](./brand.md) - Learn the brand voice
3. Review [architecture.md](./architecture.md) - Understand the tech stack
4. Study [standards.md](./standards.md) - Learn code conventions
5. Browse [components.md](./components.md) - Familiarize with components

### For Feature Development

1. Check [roadmap.md](./roadmap.md) - Verify feature priority
2. Review [routes.md](./routes.md) - Plan route structure
3. Reference [components.md](./components.md) - Reuse existing components
4. Follow [standards.md](./standards.md) - Maintain code quality
5. Update [reports/](./reports/) - Document implementation

### For Design Work

1. Reference [brand.md](./brand.md) - Brand guidelines
2. Review [buyer-behavior.md](./buyer-behavior.md) - User insights
3. Check [icp.md](./icp.md) - Target audience
4. Study [components.md](./components.md) - Existing patterns

### For Business Decisions

1. Review [business.md](./business.md) - Revenue model
2. Check [roadmap.md](./roadmap.md) - Feature priorities
3. Read [reports/](./reports/) - Implementation status
4. Reference [icp.md](./icp.md) - Customer insights

---

## Maintenance

### Updating Documentation

**When to Update:**
- New features implemented → Update [reports/](./reports/)
- New components created → Update [components.md](./components.md)
- Routes added/changed → Update [routes.md](./routes.md)
- Architecture changes → Update [architecture.md](./architecture.md)
- Brand guidelines change → Update [brand.md](./brand.md)
- Standards evolve → Update [standards.md](./standards.md)

**How to Update:**
1. Edit the relevant markdown file
2. Keep formatting consistent
3. Update table of contents if needed
4. Add date stamps for major changes
5. Commit with descriptive message

### Documentation Standards

- Use clear, concise language
- Include code examples where helpful
- Keep tables for structured data
- Use headings for navigation
- Add links between related docs
- Include "Last Updated" dates

---

## Related Documentation

### Project Root

- [AGENTS.md](../AGENTS.md) - AI agent guidance (comprehensive project guide)
- [README.md](../README.md) - Project README

### App-Specific

- `website/README.md` - Next.js website documentation
- `studio/README.md` - Sanity Studio documentation
- `data/README.md` - Data dashboard documentation

### Scripts

- `scripts/README.md` - Utility scripts documentation

---

## Contributing

When adding new documentation:

1. **Choose the right location:**
   - General context → `context/`
   - Implementation reports → `context/reports/`
   - App-specific → respective app directory
   - Temporary notes → Use app-specific docs or delete after consolidation

2. **Follow naming conventions:**
   - Use kebab-case: `my-document.md`
   - Be descriptive: `implementation-feb-2026.md` not `impl.md`
   - Date reports: `report-feb-2026.md`

3. **Keep it organized:**
   - Don't create files in project root
   - Use existing structure
   - Link related documents
   - Update this README when adding new docs

4. **Maintain quality:**
   - Clear headings and structure
   - Code examples with syntax highlighting
   - Tables for structured data
   - Links to related content

---

## Quick Reference

### Most Referenced Documents

1. **[AGENTS.md](../AGENTS.md)** - Comprehensive project guide
2. **[components.md](./components.md)** - Component API reference
3. **[standards.md](./standards.md)** - Code conventions
4. **[brand.md](./brand.md)** - Brand guidelines
5. **[architecture.md](./architecture.md)** - System design

### Recent Updates

- **Feb 10, 2026** - Created implementation report for February 2026
- **Feb 10, 2026** - Consolidated component documentation
- **Feb 10, 2026** - Organized scattered markdown files

---

## Support

For questions about documentation:

1. Check this README for navigation
2. Search within relevant documents
3. Review [AGENTS.md](../AGENTS.md) for comprehensive guidance
4. Check app-specific READMEs
5. Review recent reports in [reports/](./reports/)

---

**Last Updated:** February 10, 2026  
**Maintained By:** Development Team
