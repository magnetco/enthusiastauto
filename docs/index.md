# Project Documentation Index

**Project:** Enthusiast Auto Ecommerce Site
**Type:** Next.js 15 SSR Web Application (Monolith)
**Generated:** 2025-10-14

---

## 👋 Welcome

This is the **primary documentation hub** for the Enthusiast Auto Ecommerce Site. All project documentation is organized and accessible from this index.

**🎯 Start Here:** New to the project? Begin with [Project Overview](./project-overview.md)

---

## 📋 Quick Reference

### Project Overview

- **Type:** Web Application (E-commerce Storefront)
- **Architecture:** Monolithic SSR Application
- **Primary Language:** TypeScript
- **Framework:** Next.js 15 (App Router)
- **Tech Stack:** React 19 + Tailwind CSS + Shopify API

### Repository Structure

```
enthusiastauto-1/
├── app/              # Next.js App Router (pages & API)
├── components/       # React UI components (33 files)
├── lib/shopify/      # Shopify API integration (12 files)
├── fonts/           # Custom fonts (Geist)
└── docs/            # This documentation
```

### Entry Points

- **Homepage:** `app/page.tsx`
- **Root Layout:** `app/layout.tsx`
- **Shopify Client:** `lib/shopify/index.ts`
- **Next.js Config:** `next.config.ts`

---

## 📚 Generated Documentation

### Overview & Planning

- **[Project Overview](./project-overview.md)** - Executive summary, tech stack, project purpose
  - Quick project introduction
  - Tech stack summary
  - Project statistics
  - Getting started guide

### Architecture & Design

- **[Architecture Documentation](./architecture.md)** - Complete system architecture

  - Executive summary
  - Technology stack details
  - Architecture patterns (SSR, Server Components)
  - Data architecture (Shopify GraphQL)
  - API design
  - Component architecture
  - Deployment architecture (Vercel)
  - Testing strategy
  - Performance considerations
  - Security guidelines

- **[Source Tree Analysis](./source-tree-analysis.md)** - Annotated directory structure
  - Complete project tree
  - Directory purposes and entry points
  - Integration points
  - Component organization
  - File counts and statistics

### Component & Code

- **[Component Inventory](./component-inventory.md)** - UI component catalog

  - 33 React components documented
  - Component organization (cart, grid, layout, product)
  - Server vs Client components
  - Design system and patterns
  - Accessibility features
  - Performance considerations

- **[API Contracts](./api-contracts.md)** - Shopify Storefront GraphQL API

  - Complete API reference (queries, mutations, fragments)
  - Request/response examples with TypeScript types
  - Authentication and error handling
  - Caching strategy and revalidation
  - 10 queries + 4 mutations documented

- **[Data Models](./data-models.md)** - TypeScript type definitions
  - All data model types documented
  - Shopify raw types vs application types
  - Type transformation patterns
  - GraphQL connection types
  - Runtime validation recommendations

### Development & Operations

- **[Development Guide](./development-guide.md)** - Setup and development workflow

  - Prerequisites and installation
  - Environment setup (.env configuration)
  - Development server (pnpm dev)
  - Build & production preview
  - Code quality tools (Prettier)
  - Common development tasks
  - Troubleshooting guide
  - Performance tips

- **[Deployment Guide](./deployment-guide.md)** - Production deployment
  - Complete Vercel deployment guide (3 methods)
  - Environment variable setup
  - Custom domain configuration
  - Shopify webhook integration
  - Performance optimization
  - Monitoring and troubleshooting

### Project Management

- **[Workflow Status](./bmm-workflow-status.md)** - BMad workflow tracking
  - Current phase and progress
  - Planned workflow journey
  - Next steps and recommendations

---

## 📖 Existing Documentation

### Core Project Files

- **[README.md](../README.md)** - Next.js Commerce template documentation

  - Overview of Next.js Commerce
  - Supported providers (Shopify, BigCommerce, etc.)
  - Running locally instructions
  - Vercel + Shopify integration guide

- **[License](../license.md)** - License information

### Configuration Files

- **[package.json](../package.json)** - Dependencies and npm scripts
- **[tsconfig.json](../tsconfig.json)** - TypeScript configuration
- **[next.config.ts](../next.config.ts)** - Next.js configuration
- **[.env.example](../.env.example)** - Environment variables template

---

## 🚀 Getting Started

### For New Developers

**Step 1: Read the Overview**
→ [Project Overview](./project-overview.md)

**Step 2: Understand the Architecture**
→ [Architecture Documentation](./architecture.md)

**Step 3: Setup Development Environment**
→ [Development Guide](./development-guide.md)

**Step 4: Explore the Codebase**
→ [Source Tree Analysis](./source-tree-analysis.md)

**Step 5: Learn the Components**
→ [Component Inventory](./component-inventory.md)

### For AI-Assisted Development

**Primary Reference:** This index + Architecture documentation

**Best Documents for Context:**

1. `architecture.md` - Complete system design
2. `source-tree-analysis.md` - File structure and locations
3. `component-inventory.md` - UI components and patterns
4. `development-guide.md` - Development workflow

**When Planning PRDs:**

- Reference brownfield architecture patterns
- Review existing component library
- Understand Shopify API constraints
- Consider Server Component patterns

### Quick Commands

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm start

# Format code
pnpm prettier

# Run tests
pnpm test
```

---

## 🔍 Find What You Need

### By Topic

**Architecture & Design**

- Overall system design → [Architecture](./architecture.md)
- Directory structure → [Source Tree](./source-tree-analysis.md)
- Component patterns → [Component Inventory](./component-inventory.md)

**Development**

- Setup & installation → [Development Guide](./development-guide.md)
- Environment variables → [Development Guide](./development-guide.md#environment-setup)
- Build & deployment → [Deployment Guide](./deployment-guide.md)

**API & Data**

- Shopify integration → [Architecture](./architecture.md#api-design)
- GraphQL queries → [API Contracts](./api-contracts.md)
- Data models → [Data Models](./data-models.md)

**Components**

- UI component catalog → [Component Inventory](./component-inventory.md)
- Cart components → [Component Inventory](./component-inventory.md#cart-components-8-files)
- Layout components → [Component Inventory](./component-inventory.md#layout-components-7-files)

### By File Type

**Markdown Documentation:** `docs/*.md`
**TypeScript Source:** `app/**/*.tsx`, `components/**/*.tsx`, `lib/**/*.ts`
**Configuration:** `*.config.ts`, `*.json`
**Styles:** `app/globals.css`, Tailwind utility classes

---

## 📊 Documentation Coverage

### ✅ Generated (9 files)

- Project Overview
- Architecture Documentation
- Source Tree Analysis
- Component Inventory
- Development Guide
- API Contracts
- Data Models
- Deployment Guide
- Workflow Status

### Coverage: 100%

All core documentation has been generated. The documentation suite is **complete** and ready for use.

---

## 🔧 Maintaining This Documentation

### When to Update

- **New features added** → Update Component Inventory
- **Architecture changes** → Update Architecture Documentation
- **New dependencies** → Update Development Guide
- **Deployment changes** → Update Deployment Guide
- **API changes** → Update API Contracts

### How to Regenerate

**Full Regeneration:**

```bash
# Run document-project workflow
/bmad:analyst:document-project
# Choose: Re-scan entire project
```

**Deep Dive (specific area):**

```bash
# Run document-project workflow
/bmad:analyst:document-project
# Choose: Deep-dive into specific area
# Specify: components/, lib/shopify/, etc.
```

---

## 🤝 Contributing

**Before Contributing:**

1. Read [Architecture Documentation](./architecture.md)
2. Review [Development Guide](./development-guide.md)
3. Check [Component Inventory](./component-inventory.md) for existing patterns
4. Follow TypeScript strict mode
5. Use Prettier for code formatting

**Recommended Workflow:**

1. Create feature branch from `main`
2. Develop with `pnpm dev`
3. Format code with `pnpm prettier`
4. Test production build with `pnpm build && pnpm start`
5. Create pull request

---

## 📞 Support & Resources

### External Resources

- **Next.js Docs:** https://nextjs.org/docs
- **React Server Components:** https://react.dev/reference/rsc/server-components
- **Shopify Storefront API:** https://shopify.dev/docs/api/storefront
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Vercel Deployment:** https://vercel.com/docs

### Internal Resources

- **Workflow Status:** [bmm-workflow-status.md](./bmm-workflow-status.md)
- **BMad Method:** See `bmad/` directory for workflow system

---

## 📝 Document Metadata

**Documentation Version:** 1.0
**Last Generated:** 2025-10-14
**Scan Level:** Deep (source code analysis)
**Generated Files:** 9
**Total Documentation Pages:** 12 (including existing)

**Workflow State:** [project-scan-report.json](./project-scan-report.json)

---

**🎯 Ready to Build?** Start with the [Development Guide](./development-guide.md)

**🏗️ Planning Features?** Review [Architecture Documentation](./architecture.md) first

**🔍 Need Component Help?** Check [Component Inventory](./component-inventory.md)
