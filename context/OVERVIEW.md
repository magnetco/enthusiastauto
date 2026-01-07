# Overview

## What is Enthusiast Auto?

Enthusiast Auto is a BMW specialist based in Cincinnati, Ohio. They buy, sell, and service enthusiast-grade BMWs — focusing on well-maintained examples with service history and proper care.

## The Platform

This codebase contains three applications that power **shop.enthusiastauto.com**:

### 1. Website (`/website`)
The main e-commerce platform combining:
- **Vehicle Inventory** — Browse and inquire about BMWs for sale
- **Parts Store** — Purchase BMW parts, accessories, and merchandise
- **Service Requests** — Request services like cosmetic repair and conditioning
- **User Accounts** — Sign up, favorites ("My Garage"), profile management

### 2. Studio (`/studio`)
Sanity CMS for content team to manage:
- Vehicle listings (specs, photos, pricing)
- Inventory status (current vs sold)
- Featured vehicles

### 3. Data (`/data`)
Admin dashboard for viewing database records:
- User accounts
- Service requests
- Favorites/garage items
- Activity monitoring

## Who Uses This?

**Customers:**
- BMW enthusiasts looking to buy a quality used BMW
- BMW owners shopping for parts and accessories
- Existing customers requesting service appointments

**Staff:**
- Sales team managing vehicle inquiries
- Content team updating vehicle listings in Sanity Studio
- Service team receiving and processing service requests
- Admins reviewing database records in Data app

## Business Model

- **Vehicles**: High-margin sales of curated BMW inventory (managed in Sanity CMS)
- **Parts**: E-commerce via Shopify (headless) with fitment-based filtering
- **Services**: Lead generation for service appointments

## Key Differentiators

1. **Fitment-First Shopping** — Filter parts by your specific BMW model/year
2. **My Garage** — Save favorite vehicles and parts to your account
3. **Unified Experience** — Single platform for inventory, parts, and services
4. **Enthusiast Focus** — Not a generic dealer, specifically for BMW enthusiasts

## External Services

| Service | Purpose |
|---------|---------|
| Shopify | Parts e-commerce (products, cart, checkout) |
| Sanity CMS | Vehicle content management |
| Vercel Postgres (Neon) | User accounts, favorites, service requests |
| Resend | Transactional emails |
| Vercel | Hosting, CDN, serverless functions |
| Google OAuth | Social login |
| Google Cloud (planned) | Maps integration (see note below) |

### Google Cloud / Maps

Google Cloud powers the interactive maps on the **legacy Enthusiast Auto website** (enthusiastauto.com). This includes:
- Store location map on the contact/visit page
- Directions integration

For this new platform (shop.enthusiastauto.com), Google Maps integration is planned for future implementation to maintain feature parity with the legacy site. The Google Cloud account and API keys are already established through the legacy website.

## Project Structure

```
enthusiastauto/
├── context/     # Documentation (you are here)
├── data/        # Admin CRUD app (Express + Vite)
├── studio/      # Sanity CMS Studio
├── website/     # Next.js e-commerce platform
└── .env.local   # Shared environment variables
```

Each application is independent with its own `package.json`. Install and run them separately.
