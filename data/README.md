# Enthusiast Auto Data Manager

A minimalist CRUD app for managing Neon database tables (Users, Accounts, Sessions, Favorites, Service Requests).

## Features

- **Tab Navigation** - Switch between database tables
- **Sortable Columns** - Click column headers to sort ascending/descending
- **Inline Editing** - Click any editable cell to edit, press Enter to save
- **Version Tracking** - Every edit is logged with old/new values
- **Delete Records** - Remove records with confirmation

## Quick Start

```bash
cd data
pnpm install
pnpm dev
```

This starts:
- Frontend at `http://localhost:4000`
- API server at `http://localhost:4001`

## Environment

The app reads `DATABASE_URL` from:
1. `data/.env` (if exists)
2. `website/.env.local` (fallback)

Make sure your Neon database connection string is set in one of these files.

## Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Express + @neondatabase/serverless
- **Database**: Neon Postgres (shared with main website)

## Tables

| Table | Description | Editable Fields |
|-------|-------------|-----------------|
| Users | User accounts | name, email, image |
| Accounts | OAuth connections | Read-only |
| Sessions | Active sessions | Read-only |
| Favorites | Saved vehicles/products | itemType, itemId, itemHandle |
| Service Requests | Service inquiries | name, email, phone, status |
| Version History | Edit log | Read-only |

## Vehicle Import

The **Vehicle Import** tab provides a UI for mass importing vehicles from CSV to Sanity CMS.

### How to Use

1. Go to the "Vehicle Import" tab
2. Upload a CSV file with vehicle data
3. Review the preview of vehicles to import
4. Click "Import" to start the import process

### CSV Format

The CSV should include these columns:
- `Listing Title` - Vehicle title (e.g., "2020 BMW F87 M2 CS")
- `Slug` - URL-friendly identifier
- `Stock Number` - Last 7 of VIN
- `VIN` - Full vehicle identification number
- `Chassis` - Chassis code (E30, E46, F87, etc.)
- `Mileage` - Current odometer reading
- `Listing Price` - Sale price
- `Signature Shot` - URL to main image
- `Gallery Exterior 1`, `Gallery Interior 1`, etc. - Semicolon-separated image URLs
- `Overview`, `Highlights` - HTML content
- `Current or Sold Inventory?` - "Current Inventory" or "Sold Inventory"

### Environment

Requires `SANITY_API_TOKEN` with write permissions in your environment.

## API Endpoints

```
GET    /api/users                 - List all users
GET    /api/users/:id             - Get single user
PATCH  /api/users/:id             - Update user field
DELETE /api/users/:id             - Delete user

GET    /api/accounts              - List all accounts
DELETE /api/accounts/:id          - Delete account

GET    /api/sessions              - List all sessions
DELETE /api/sessions/:id          - Delete session
DELETE /api/sessions              - Delete expired sessions

GET    /api/favorites             - List all favorites
PATCH  /api/favorites/:id         - Update favorite
DELETE /api/favorites/:id         - Delete favorite

GET    /api/service-requests      - List all service requests
PATCH  /api/service-requests/:id  - Update service request
DELETE /api/service-requests/:id  - Delete service request

GET    /api/versions              - List all version history
GET    /api/versions/:table       - List versions for a table
```

## Scripts

```bash
pnpm dev      # Run both frontend and backend in development
pnpm build    # Build for production
pnpm preview  # Preview production build
pnpm server   # Run only the API server
```

