# Technical Specification: Epic 3 - Vehicle Inventory Integration

**Project:** Enthusiast Auto Ecommerce Site - Phase 2
**Epic:** Epic 3 - Vehicle Inventory Integration
**Author:** Mike
**Date Created:** 2025-10-21
**Status:** Ready for Implementation
**Dependencies:** solution-architecture.md, PRD.md Phase 2, epic-stories.md

---

## Executive Summary

This technical specification provides implementation details for Epic 3: Vehicle Inventory Integration, which establishes Sanity CMS as the vehicle content platform and creates browsable vehicle inventory with rich media galleries. This epic consists of 6 stories totaling 37 points and serves as the foundation for the unified platform expansion.

**Key Components:**
- Sanity CMS integration with Next.js 15 App Router
- Vehicle schema with 18 fields supporting 10-30 images per vehicle
- ISR (Incremental Static Regeneration) with 60-second revalidation
- Webhook-driven on-demand revalidation for real-time status updates
- CSV import script for migrating existing vehicle inventory
- Editor-friendly Sanity Studio workflows

**Architecture References:**
- Solution Architecture §3.1 Database Schema (Sanity):line_number:484-603
- Solution Architecture §2.2 SSR Strategy (ISR):line_number:129-209
- Solution Architecture §3.3 Data Migrations Strategy:line_number:675-748

---

## Story 3.1: Sanity CMS Setup & Configuration

### Implementation Overview

**Objective:** Integrate Sanity CMS with Next.js application to enable vehicle content management through a headless CMS.

**Effort:** 5 points
**Priority:** Must Have (blocks all other Epic 3 stories)

### Technical Requirements

#### 1. Dependencies Installation

```bash
# Install Sanity packages
pnpm add @sanity/client@3.62.0 next-sanity@9.12.0
pnpm add -D @sanity/cli@3.62.0

# Install Sanity Studio (separate deployment)
npx @sanity/cli@3.62.0 init --project-id <from-dashboard> --dataset production
```

#### 2. Project Structure

```
enthusiastauto-1/
├── sanity/                         # Sanity Studio (separate app)
│   ├── sanity.config.ts           # Studio configuration
│   ├── sanity.cli.ts              # CLI configuration
│   ├── schemas/
│   │   ├── index.ts               # Schema exports
│   │   └── vehicle.ts             # Vehicle schema (Story 3.2)
│   └── package.json               # Studio dependencies
├── lib/
│   └── sanity/
│       ├── client.ts              # Sanity client instance
│       ├── queries.ts             # GROQ queries
│       └── config.ts              # Shared config
└── .env.local
    ├── NEXT_PUBLIC_SANITY_PROJECT_ID
    ├── NEXT_PUBLIC_SANITY_DATASET
    └── SANITY_API_TOKEN           # Read/write token
```

#### 3. Sanity Client Configuration

**File:** `lib/sanity/config.ts`

```typescript
export const sanityConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-10-21', // Use current date (YYYY-MM-DD)
  useCdn: false, // Disable CDN for fresh data (ISR handles caching)
};
```

**File:** `lib/sanity/client.ts`

```typescript
import { createClient } from '@sanity/client';
import { sanityConfig } from './config';

export const sanity = createClient({
  ...sanityConfig,
  token: process.env.SANITY_API_TOKEN, // For mutations in webhooks
  perspective: 'published', // Only fetch published documents
});

// Read-only client for server components (no token needed)
export const sanityReadOnly = createClient({
  ...sanityConfig,
  useCdn: true, // Can use CDN for read-only operations
});
```

#### 4. Sanity Studio Configuration

**File:** `sanity/sanity.config.ts`

```typescript
import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { visionTool } from '@sanity/vision'; // GROQ query tool
import { schemas } from './schemas';

export default defineConfig({
  name: 'enthusiast-auto-studio',
  title: 'Enthusiast Auto Content Manager',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

  plugins: [
    deskTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Vehicles')
              .child(
                S.documentTypeList('vehicle')
                  .title('All Vehicles')
                  .filter('_type == "vehicle"')
                  .defaultOrdering([{ field: 'createdAt', direction: 'desc' }])
              ),
          ]),
    }),
    visionTool(), // Query playground for debugging
  ],

  schema: {
    types: schemas,
  },

  // Custom branding
  studio: {
    components: {
      logo: () => <h2>Enthusiast Auto</h2>,
    },
  },
});
```

#### 5. Environment Variables

**Required in `.env.local`:**

```bash
# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID="your-project-id"      # From sanity.io dashboard
NEXT_PUBLIC_SANITY_DATASET="production"              # Use "staging" for dev
SANITY_API_TOKEN="sk_test_xxx"                       # Create in API settings with Editor role
SANITY_WEBHOOK_SECRET="random-secret-string"         # For webhook signature verification
```

**Required in `sanity/.env`:**

```bash
SANITY_STUDIO_PROJECT_ID="your-project-id"
SANITY_STUDIO_DATASET="production"
```

#### 6. Deployment Setup

**Sanity Studio Deployment:**

```bash
# Deploy Sanity Studio to Sanity's hosted service
cd sanity
pnpm install
pnpm sanity deploy

# Access at: https://enthusiast-auto.sanity.studio
```

**Vercel Environment Variables:**
- Add all Sanity env vars to Vercel dashboard
- Ensure `SANITY_API_TOKEN` is added as a secret

#### 7. CORS Configuration

**In Sanity Dashboard (sanity.io/manage):**
- Add `https://shop.enthusiastauto.com` to allowed origins
- Add `http://localhost:3000` for development
- Enable credentials if needed

### Acceptance Criteria Validation

- [ ] Sanity Studio installed and configured locally
- [ ] Sanity project created with production dataset
- [ ] Sanity client configured in Next.js app for data fetching
- [ ] Sanity Studio deployed and accessible at custom URL
- [ ] Environment variables configured for all environments
- [ ] Sanity API authentication working (test with basic query)
- [ ] Sanity Studio customized with Enthusiast Auto branding

### Testing Requirements

**Manual Testing:**
1. Run Sanity Studio locally: `cd sanity && pnpm dev`
2. Create a test document to verify Studio functionality
3. Fetch document from Next.js app using Sanity client
4. Verify CORS settings allow Studio access from deployed URL

**Automated Testing:**
```typescript
// __tests__/lib/sanity/client.test.ts
import { sanity } from '@/lib/sanity/client';

describe('Sanity Client', () => {
  it('should connect to Sanity project', async () => {
    const result = await sanity.fetch('*[_type == "vehicle"][0]');
    expect(result).toBeDefined();
  });

  it('should have correct project configuration', () => {
    expect(sanity.config().projectId).toBe(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
    expect(sanity.config().dataset).toBe('production');
  });
});
```

### Implementation Notes

**Best Practices:**
- Use `useCdn: false` in main client for fresh data (ISR handles caching at Next.js level)
- Store API token securely (never commit to Git)
- Use separate datasets for staging/production
- Enable Vision plugin only in development (remove for production Studio)

**Common Pitfalls:**
- Forgetting to add CORS origins breaks Studio preview
- Using CDN with ISR can cause stale data issues
- API token needs "Editor" role to handle webhook mutations

---

## Story 3.2: Vehicle Schema & Data Models

### Implementation Overview

**Objective:** Define comprehensive vehicle schemas in Sanity Studio to manage all vehicle information in a structured, editor-friendly way.

**Effort:** 8 points
**Priority:** Must Have (blocks Stories 3.3-3.6)

### Schema Design

#### Vehicle Document Schema

**File:** `sanity/schemas/vehicle.ts`

```typescript
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'vehicle',
  title: 'Vehicle',
  type: 'document',
  fields: [
    // Basic Information
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'e.g., "2005 BMW E46 M3 Competition Package"',
      validation: (Rule) => Rule.required().min(10).max(100),
    }),

    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      description: 'Auto-generated from title (click Generate)',
      options: {
        source: 'title',
        maxLength: 96,
        slugify: (input) =>
          input
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, ''),
      },
      validation: (Rule) => Rule.required(),
    }),

    // Vehicle Details
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      description: 'Model year',
      validation: (Rule) =>
        Rule.required()
          .min(1980)
          .max(new Date().getFullYear() + 1)
          .integer(),
    }),

    defineField({
      name: 'make',
      title: 'Make',
      type: 'string',
      initialValue: 'BMW',
      options: {
        list: [{ title: 'BMW', value: 'BMW' }],
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'model',
      title: 'Model',
      type: 'string',
      description: 'E.g., E46, E90, F30, X3, X5',
      validation: (Rule) => Rule.required().max(50),
    }),

    defineField({
      name: 'trim',
      title: 'Trim',
      type: 'string',
      description: 'E.g., M3, 330i, xDrive, Competition Package',
      validation: (Rule) => Rule.max(50),
    }),

    defineField({
      name: 'vin',
      title: 'VIN',
      type: 'string',
      description: 'Vehicle Identification Number (17 characters)',
      validation: (Rule) =>
        Rule.length(17).regex(/^[A-HJ-NPR-Z0-9]{17}$/, {
          name: 'VIN',
          invert: false,
        }),
    }),

    defineField({
      name: 'mileage',
      title: 'Mileage',
      type: 'number',
      description: 'Current odometer reading (miles)',
      validation: (Rule) => Rule.required().min(0).integer(),
    }),

    defineField({
      name: 'price',
      title: 'Price (USD)',
      type: 'number',
      description: 'Asking price in US dollars',
      validation: (Rule) => Rule.required().min(0).precision(2),
    }),

    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      description: 'Current availability status',
      options: {
        list: [
          { title: 'Current - Available for Sale', value: 'current' },
          { title: 'Sold', value: 'sold' },
          { title: 'Pending Sale', value: 'pending' },
        ],
        layout: 'radio',
      },
      initialValue: 'current',
      validation: (Rule) => Rule.required(),
    }),

    // Specifications
    defineField({
      name: 'specifications',
      title: 'Specifications',
      type: 'object',
      fields: [
        { name: 'engine', title: 'Engine', type: 'string', description: 'E.g., 3.2L S54 I6' },
        { name: 'transmission', title: 'Transmission', type: 'string', description: 'E.g., 6-Speed Manual' },
        { name: 'drivetrain', title: 'Drivetrain', type: 'string', options: { list: ['RWD', 'AWD', 'FWD'] } },
        { name: 'exteriorColor', title: 'Exterior Color', type: 'string' },
        { name: 'interiorColor', title: 'Interior Color', type: 'string' },
        { name: 'doors', title: 'Doors', type: 'number' },
        { name: 'seats', title: 'Seats', type: 'number' },
      ],
    }),

    // Features
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      description: 'Notable features and options',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),

    // Images
    defineField({
      name: 'images',
      title: 'Photo Gallery',
      type: 'array',
      description: 'Upload 10-30 high-quality images',
      validation: (Rule) => Rule.required().min(5).max(50),
      of: [
        {
          type: 'image',
          options: {
            hotspot: true, // Enables focal point selection
          },
          fields: [
            {
              name: 'caption',
              title: 'Caption',
              type: 'string',
              description: 'Optional image description for accessibility',
            },
            {
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              description: 'Required for accessibility',
              validation: (Rule) => Rule.required(),
            },
          ],
        },
      ],
    }),

    // Content
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      description: 'Detailed vehicle description and condition notes',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Heading 2', value: 'h2' },
            { title: 'Heading 3', value: 'h3' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
            ],
          },
        },
      ],
    }),

    // Service History
    defineField({
      name: 'serviceHistory',
      title: 'Service History',
      type: 'array',
      description: 'Documented service records',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'date', title: 'Date', type: 'date' },
            { name: 'type', title: 'Service Type', type: 'string', options: { list: ['Maintenance', 'Repair', 'Inspection', 'Modification'] } },
            { name: 'mileage', title: 'Mileage at Service', type: 'number' },
            { name: 'description', title: 'Description', type: 'text', rows: 3 },
            { name: 'cost', title: 'Cost (USD)', type: 'number' },
          ],
          preview: {
            select: {
              date: 'date',
              type: 'type',
              description: 'description',
            },
            prepare({ date, type, description }) {
              return {
                title: `${type} - ${date}`,
                subtitle: description,
              };
            },
          },
        },
      ],
    }),

    // SEO Fields
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      description: 'Search engine optimization settings',
      fields: [
        {
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          description: 'Override default title for SEO (max 60 chars)',
          validation: (Rule) => Rule.max(60),
        },
        {
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          description: 'Override default description for SEO (max 160 chars)',
          rows: 3,
          validation: (Rule) => Rule.max(160),
        },
      ],
    }),

    // Metadata
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    }),

    defineField({
      name: 'soldAt',
      title: 'Sold At',
      type: 'datetime',
      description: 'Automatically set when status changes to "sold"',
      readOnly: true,
    }),
  ],

  preview: {
    select: {
      title: 'title',
      year: 'year',
      model: 'model',
      price: 'price',
      status: 'status',
      image: 'images.0',
    },
    prepare({ title, year, model, price, status, image }) {
      return {
        title: title || `${year} BMW ${model}`,
        subtitle: `$${price?.toLocaleString()} - ${status}`,
        media: image,
      };
    },
  },
});
```

#### Schema Index

**File:** `sanity/schemas/index.ts`

```typescript
import vehicle from './vehicle';

export const schemas = [vehicle];
```

### Validation Rules

**Business Logic Validations:**
1. **VIN Validation:** Must be exactly 17 characters, alphanumeric (excluding I, O, Q)
2. **Year Validation:** Must be between 1980 and current year + 1
3. **Price Validation:** Must be positive, supports cents (2 decimal precision)
4. **Image Gallery:** Minimum 5 images, maximum 50 images (supports 10-30 recommended)
5. **Slug Uniqueness:** Sanity automatically enforces unique slugs

**Field Dependencies:**
- When `status` changes to "sold", automatically set `soldAt` timestamp (requires custom action)

### Acceptance Criteria Validation

- [ ] Vehicle schema includes all 18 required fields
- [ ] Specifications schema covers engine, transmission, drivetrain, colors
- [ ] Service history schema supports date, type, mileage, description, cost
- [ ] Photo gallery supports 10-30 images with captions and alt text
- [ ] SEO fields available for meta title and description
- [ ] Rich text editor working for vehicle description
- [ ] Reference fields ready for future compatible parts linking
- [ ] Validation rules enforce required fields and data integrity

### Implementation Notes

**Image Upload Optimization:**
```typescript
// In sanity.config.ts, configure image upload settings
export default defineConfig({
  // ... other config
  plugins: [
    // ... other plugins
  ],
  form: {
    image: {
      assetSources: (previousSources) => {
        return previousSources.filter((source) => source.name !== 'unsplash');
      },
    },
  },
});
```

**Auto-populate `soldAt` timestamp:**
```typescript
// sanity/schemas/vehicle.ts - Add custom action
import { useEffect } from 'react';

// This would be a document action in Sanity Studio
export function autoSetSoldDate(props) {
  const { draft, published } = props;

  useEffect(() => {
    if (draft?.status === 'sold' && !draft.soldAt) {
      // Trigger patch to set soldAt
      props.patch.execute([{ set: { soldAt: new Date().toISOString() } }]);
    }
  }, [draft?.status]);

  return null;
}
```

---

## Story 3.3: Vehicle Listing Page

### Implementation Overview

**Objective:** Create a responsive vehicle listing page that displays all available vehicles in a grid with filtering and sorting capabilities.

**Effort:** 8 points
**Priority:** Must Have
**Dependencies:** Story 3.2 (vehicle schema must exist)

### Page Architecture

**Route:** `/app/vehicles/page.tsx`

**Rendering Strategy:** ISR (Incremental Static Regeneration) with 60-second revalidation

### Implementation

**File:** `app/vehicles/page.tsx`

```typescript
import { sanity } from '@/lib/sanity/client';
import { vehicleListQuery } from '@/lib/sanity/queries';
import { VehicleGrid } from '@/components/vehicles/VehicleGrid';
import { VehicleFilters } from '@/components/vehicles/VehicleFilters';

export const revalidate = 60; // ISR: revalidate every 60 seconds

interface SearchParams {
  model?: string;
  minPrice?: string;
  maxPrice?: string;
  minYear?: string;
  maxYear?: string;
  status?: 'current' | 'sold' | 'pending';
}

export default async function VehiclesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // Build GROQ filter based on search params
  const filters = buildFilters(searchParams);

  const vehicles = await sanity.fetch(vehicleListQuery, filters);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">BMW Vehicles for Sale</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <VehicleFilters initialFilters={searchParams} />
        </aside>

        <main className="lg:col-span-3">
          {vehicles.length > 0 ? (
            <VehicleGrid vehicles={vehicles} />
          ) : (
            <EmptyState filters={searchParams} />
          )}
        </main>
      </div>
    </div>
  );
}

function buildFilters(params: SearchParams) {
  const conditions = ['_type == "vehicle"'];

  if (params.status) {
    conditions.push(`status == "${params.status}"`);
  } else {
    conditions.push('status == "current"'); // Default: show only current vehicles
  }

  if (params.model) {
    conditions.push(`model == "${params.model}"`);
  }

  if (params.minPrice) {
    conditions.push(`price >= ${params.minPrice}`);
  }

  if (params.maxPrice) {
    conditions.push(`price <= ${params.maxPrice}`);
  }

  if (params.minYear) {
    conditions.push(`year >= ${params.minYear}`);
  }

  if (params.maxYear) {
    conditions.push(`year <= ${params.maxYear}`);
  }

  return { filter: conditions.join(' && ') };
}
```

**File:** `lib/sanity/queries.ts`

```typescript
export const vehicleListQuery = `
  *[$filter] | order(createdAt desc) {
    _id,
    title,
    year,
    make,
    model,
    trim,
    price,
    mileage,
    status,
    "slug": slug.current,
    "heroImage": images[0]{
      asset->{
        url,
        metadata {
          lqip,
          dimensions
        }
      },
      alt,
      caption
    },
    specifications {
      exteriorColor,
      transmission,
      drivetrain
    }
  }
`;
```

**File:** `components/vehicles/VehicleGrid.tsx` (Client Component)

```typescript
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

interface Vehicle {
  _id: string;
  title: string;
  year: number;
  model: string;
  price: number;
  mileage: number;
  status: 'current' | 'sold' | 'pending';
  slug: string;
  heroImage: {
    asset: { url: string; metadata: { lqip: string } };
    alt: string;
  };
  specifications: {
    exteriorColor?: string;
    transmission?: string;
  };
}

export function VehicleGrid({ vehicles }: { vehicles: Vehicle[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {vehicles.map((vehicle) => (
        <VehicleCard key={vehicle._id} vehicle={vehicle} />
      ))}
    </div>
  );
}

function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const isSold = vehicle.status === 'sold';

  return (
    <Link href={`/vehicles/${vehicle.slug}`}>
      <Card className={`hover:shadow-lg transition-shadow ${isSold ? 'opacity-60' : ''}`}>
        <CardHeader className="p-0 relative">
          <Image
            src={vehicle.heroImage.asset.url}
            alt={vehicle.heroImage.alt}
            width={400}
            height={300}
            className="w-full h-64 object-cover rounded-t-lg"
            placeholder="blur"
            blurDataURL={vehicle.heroImage.asset.metadata.lqip}
          />

          {isSold && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-t-lg">
              <Badge variant="destructive" className="text-xl px-6 py-2">
                SOLD
              </Badge>
            </div>
          )}
        </CardHeader>

        <CardContent className="p-4">
          <h3 className="text-xl font-semibold mb-2">{vehicle.title}</h3>

          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>{vehicle.mileage.toLocaleString()} miles</span>
            <span>{vehicle.specifications.transmission}</span>
          </div>

          {vehicle.specifications.exteriorColor && (
            <p className="text-sm text-muted-foreground">
              {vehicle.specifications.exteriorColor}
            </p>
          )}
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <p className="text-2xl font-bold text-primary">
            ${vehicle.price.toLocaleString()}
          </p>
        </CardFooter>
      </Card>
    </Link>
  );
}
```

**File:** `components/vehicles/VehicleFilters.tsx` (Client Component)

```typescript
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const BMW_MODELS = ['E30', 'E36', 'E46', 'E90', 'E92', 'F30', 'F80', 'G80', 'X3', 'X5', 'Z4'];

export function VehicleFilters({ initialFilters }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState(initialFilters);

  const applyFilters = () => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value.toString());
    });

    router.push(`/vehicles?${params.toString()}`);
  };

  const clearFilters = () => {
    setFilters({});
    router.push('/vehicles');
  };

  return (
    <div className="space-y-6 bg-card p-6 rounded-lg border">
      <h2 className="text-2xl font-semibold">Filters</h2>

      <div className="space-y-2">
        <Label htmlFor="model">Model</Label>
        <Select
          value={filters.model}
          onValueChange={(value) => setFilters({ ...filters, model: value })}
        >
          <SelectTrigger id="model">
            <SelectValue placeholder="All Models" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Models</SelectItem>
            {BMW_MODELS.map((model) => (
              <SelectItem key={model} value={model}>
                {model}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Price Range</Label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ''}
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ''}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Year Range</Label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={filters.minYear || ''}
            onChange={(e) => setFilters({ ...filters, minYear: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Max"
            value={filters.maxYear || ''}
            onChange={(e) => setFilters({ ...filters, maxYear: e.target.value })}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={applyFilters} className="flex-1">
          Apply Filters
        </Button>
        <Button onClick={clearFilters} variant="outline">
          Clear
        </Button>
      </div>
    </div>
  );
}
```

### Acceptance Criteria Validation

- [ ] Vehicle listing page accessible at /vehicles route
- [ ] Vehicles display in responsive grid (1-col mobile, 2-col tablet, 3-col desktop)
- [ ] Each card shows: hero image, year/make/model, price, mileage, status badge
- [ ] Filtering works: model, year range, price range, status
- [ ] Sorting implemented (price, year, mileage, recently added)
- [ ] Loading states for data fetching (Next.js Suspense)
- [ ] Empty state when no vehicles match filters
- [ ] Sold vehicles distinguished with overlay/badge

### Performance Optimization

**Image Optimization:**
- Use Next.js Image component with Sanity LQIP (Low Quality Image Placeholder)
- Lazy load images below the fold
- Responsive image sizing based on viewport

**ISR Configuration:**
```typescript
export const revalidate = 60; // Revalidate every 60 seconds
```

**Caching Strategy:**
- ISR pre-renders page at build time
- Background revalidation every 60 seconds
- Webhook triggers on-demand revalidation (Story 3.5)

---

## Story 3.4: Vehicle Detail Page with Photo Gallery

### Implementation Overview

**Objective:** Create comprehensive vehicle detail pages with full-screen photo galleries and complete vehicle information.

**Effort:** 8 points
**Priority:** Must Have
**Dependencies:** Story 3.3 (listing page provides navigation)

### Page Architecture

**Route:** `/app/vehicles/[slug]/page.tsx`

**Rendering Strategy:** ISR with generateStaticParams (pre-render top 50, generate others on-demand)

### Implementation

**File:** `app/vehicles/[slug]/page.tsx`

```typescript
import { sanity } from '@/lib/sanity/client';
import { vehicleDetailQuery } from '@/lib/sanity/queries';
import { VehicleGallery } from '@/components/vehicles/VehicleGallery';
import { VehicleSpecs } from '@/components/vehicles/VehicleSpecs';
import { VehicleDescription } from '@/components/vehicles/VehicleDescription';
import { ServiceHistory } from '@/components/vehicles/ServiceHistory';
import { ContactInquiry } from '@/components/shared/ContactInquiry';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const revalidate = 60; // ISR: revalidate every 60 seconds

// Pre-render top 50 vehicles at build time
export async function generateStaticParams() {
  const vehicles = await sanity.fetch(`
    *[_type == "vehicle" && status == "current"][0...50] {
      "slug": slug.current
    }
  `);

  return vehicles.map((v) => ({ slug: v.slug }));
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }): Promise<Metadata> {
  const vehicle = await sanity.fetch(vehicleDetailQuery, { slug: params.slug });

  if (!vehicle) return {};

  const metaTitle = vehicle.seo?.metaTitle || `${vehicle.title} - Enthusiast Auto`;
  const metaDescription =
    vehicle.seo?.metaDescription ||
    `${vehicle.year} ${vehicle.make} ${vehicle.model} - ${vehicle.mileage.toLocaleString()} miles - $${vehicle.price.toLocaleString()}. View photos and details.`;

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      images: [vehicle.images[0]?.asset.url],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [vehicle.images[0]?.asset.url],
    },
  };
}

export default async function VehicleDetailPage({ params }) {
  const vehicle = await sanity.fetch(vehicleDetailQuery, { slug: params.slug });

  if (!vehicle) {
    notFound();
  }

  const isSold = vehicle.status === 'sold';

  // Generate schema.org structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Vehicle',
    name: vehicle.title,
    vehicleModelDate: vehicle.year,
    brand: {
      '@type': 'Brand',
      name: vehicle.make,
    },
    model: vehicle.model,
    mileageFromOdometer: {
      '@type': 'QuantitativeValue',
      value: vehicle.mileage,
      unitCode: 'SMI',
    },
    vehicleIdentificationNumber: vehicle.vin,
    vehicleTransmission: vehicle.specifications?.transmission,
    driveWheelConfiguration: vehicle.specifications?.drivetrain,
    color: vehicle.specifications?.exteriorColor,
    offers: {
      '@type': 'Offer',
      price: vehicle.price,
      priceCurrency: 'USD',
      availability: isSold
        ? 'https://schema.org/SoldOut'
        : 'https://schema.org/InStock',
    },
    image: vehicle.images.map((img) => img.asset.url),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Vehicles', href: '/vehicles' },
            { label: vehicle.title },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <VehicleGallery images={vehicle.images} title={vehicle.title} />

            <div className="mt-8">
              <h1 className="text-4xl font-bold mb-4">{vehicle.title}</h1>

              {isSold && (
                <Badge variant="destructive" className="text-lg px-4 py-2 mb-4">
                  SOLD
                </Badge>
              )}

              <VehicleDescription content={vehicle.description} />

              <VehicleSpecs specifications={vehicle.specifications} features={vehicle.features} />

              {vehicle.serviceHistory && vehicle.serviceHistory.length > 0 && (
                <ServiceHistory records={vehicle.serviceHistory} />
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              <Card className="p-6">
                <p className="text-3xl font-bold text-primary mb-4">
                  ${vehicle.price.toLocaleString()}
                </p>

                <div className="space-y-2 text-sm mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mileage:</span>
                    <span className="font-semibold">{vehicle.mileage.toLocaleString()} mi</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Year:</span>
                    <span className="font-semibold">{vehicle.year}</span>
                  </div>
                  {vehicle.vin && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">VIN:</span>
                      <span className="font-mono text-xs">{vehicle.vin}</span>
                    </div>
                  )}
                </div>

                {!isSold && (
                  <ContactInquiry
                    subject={`Inquiry: ${vehicle.title}`}
                    vehicleId={vehicle._id}
                  />
                )}

                {isSold && (
                  <p className="text-center text-muted-foreground">
                    This vehicle has been sold.
                  </p>
                )}
              </Card>

              <Button asChild variant="outline" className="w-full">
                <Link href="/vehicles">
                  ← Back to Inventory
                </Link>
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
```

**File:** `lib/sanity/queries.ts` (add to existing file)

```typescript
export const vehicleDetailQuery = `
  *[_type == "vehicle" && slug.current == $slug][0] {
    _id,
    title,
    year,
    make,
    model,
    trim,
    vin,
    price,
    mileage,
    status,
    "slug": slug.current,
    images[]{
      asset->{
        url,
        metadata {
          lqip,
          dimensions,
          palette
        }
      },
      alt,
      caption
    },
    specifications,
    features,
    description,
    serviceHistory[] | order(date desc),
    seo,
    createdAt,
    soldAt
  }
`;
```

**File:** `components/vehicles/VehicleGallery.tsx` (Client Component)

```typescript
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react';

export function VehicleGallery({ images, title }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const currentImage = images[currentIndex];

  return (
    <>
      {/* Main Image */}
      <div className="relative group">
        <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
          <Image
            src={currentImage.asset.url}
            alt={currentImage.alt || `${title} - Image ${currentIndex + 1}`}
            fill
            className="object-cover"
            priority={currentIndex === 0}
            sizes="(max-width: 1024px) 100vw, 66vw"
          />
        </div>

        {/* Navigation Arrows */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
          onClick={prevImage}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
          onClick={nextImage}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>

        {/* Fullscreen Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 bg-background/80 hover:bg-background"
          onClick={() => setIsFullscreen(true)}
        >
          <Expand className="h-5 w-5" />
        </Button>

        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 bg-background/80 px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnail Grid */}
      <div className="grid grid-cols-6 gap-2 mt-4">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`relative aspect-video rounded overflow-hidden border-2 transition-all ${
              idx === currentIndex ? 'border-primary' : 'border-transparent hover:border-muted-foreground'
            }`}
          >
            <Image
              src={img.asset.url}
              alt={img.alt || `Thumbnail ${idx + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 16vw, 10vw"
            />
          </button>
        ))}
      </div>

      {/* Fullscreen Dialog */}
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-screen-xl h-screen">
          <div className="relative w-full h-full">
            <Image
              src={currentImage.asset.url}
              alt={currentImage.alt || `${title} - Image ${currentIndex + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
            />

            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80"
              onClick={prevImage}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80"
              onClick={nextImage}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
```

### Acceptance Criteria Validation

- [ ] Vehicle detail page accessible at /vehicles/[slug]
- [ ] Full-screen photo gallery with 10-30 images, thumbnails, navigation arrows
- [ ] Comprehensive vehicle information: specs, features, description, service history
- [ ] Price, mileage, VIN, availability status prominently displayed
- [ ] Breadcrumb navigation (Home > Vehicles > [Year Model])
- [ ] "Contact Us" / "Inquire" button for interested buyers
- [ ] "Back to Inventory" link
- [ ] SEO optimization with schema.org Vehicle structured data
- [ ] Social sharing meta tags (Open Graph, Twitter Cards)

---

## Story 3.5: Vehicle Status Management & Real-Time Updates

### Implementation Overview

**Objective:** Enable content editors to update vehicle status instantly with webhook-driven revalidation for real-time updates.

**Effort:** 5 points
**Priority:** Must Have
**Dependencies:** Story 3.4 (detail pages must exist to revalidate)

### Webhook Implementation

**File:** `app/api/revalidate/vehicle/[slug]/route.ts`

```typescript
import { revalidatePath } from 'next/cache';
import { NextRequest } from 'next/server';
import crypto from 'crypto';

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // 1. Verify Sanity webhook signature
    const signature = req.headers.get('sanity-webhook-signature');
    const body = await req.text();

    const expectedSig = crypto
      .createHmac('sha256', process.env.SANITY_WEBHOOK_SECRET!)
      .update(body)
      .digest('hex');

    if (signature !== `sha256=${expectedSig}`) {
      console.error('Invalid webhook signature');
      return new Response('Invalid signature', { status: 401 });
    }

    // 2. Parse webhook payload
    const payload = JSON.parse(body);
    const vehicleSlug = params.slug || payload.slug?.current;

    if (!vehicleSlug) {
      return new Response('No slug provided', { status: 400 });
    }

    // 3. Revalidate vehicle detail page
    revalidatePath(`/vehicles/${vehicleSlug}`);

    // 4. Revalidate listing page (in case status changed visibility)
    revalidatePath('/vehicles');

    // 5. Revalidate homepage (if vehicle is featured)
    revalidatePath('/');

    console.log(`Revalidated vehicle: ${vehicleSlug}`);

    return new Response(JSON.stringify({ revalidated: true, slug: vehicleSlug }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response('Webhook processing failed', { status: 500 });
  }
}
```

### Sanity Webhook Configuration

**In Sanity Dashboard (sanity.io/manage):**

1. Navigate to API tab → Webhooks
2. Create new webhook:
   - **Name:** "Vehicle Revalidation"
   - **URL:** `https://shop.enthusiastauto.com/api/revalidate/vehicle/{slug.current}`
   - **Dataset:** Production
   - **Trigger on:** Create, Update, Delete
   - **Filter:** `_type == "vehicle"`
   - **Projection:** `{ "slug": slug }`
   - **Secret:** (Copy to `SANITY_WEBHOOK_SECRET` env var)
   - **HTTP method:** POST
   - **API version:** v2021-06-07

**Webhook Payload Example:**
```json
{
  "_type": "vehicle",
  "_id": "abc123",
  "slug": { "current": "2005-bmw-e46-m3" },
  "status": "sold"
}
```

### Sanity Studio Status Update Action

**File:** `sanity/schemas/vehicle.ts` (add custom action)

```typescript
// Add to vehicle schema exports
export const vehicleActions = (prev, context) => {
  return prev.map((action) => {
    // Customize the publish action to show confirmation for status changes
    if (action.action === 'publish') {
      return {
        ...action,
        onHandle: async (props) => {
          const { draft } = props;

          // Check if status changed to "sold"
          if (draft?.status === 'sold' && draft.status !== context.published?.status) {
            const confirmed = window.confirm(
              `Are you sure you want to mark "${draft.title}" as SOLD? This will update the website immediately.`
            );

            if (!confirmed) {
              return; // Cancel publish
            }

            // Auto-set soldAt timestamp
            if (!draft.soldAt) {
              await props.patch.execute([
                { set: { soldAt: new Date().toISOString() } },
              ]);
            }
          }

          // Proceed with publish
          action.onHandle(props);
        },
      };
    }

    return action;
  });
};
```

### Status History Tracking

**File:** `sanity/schemas/statusHistory.ts` (optional enhancement)

```typescript
// Optional: Track status change history
export default {
  name: 'statusChange',
  title: 'Status Change',
  type: 'object',
  fields: [
    {
      name: 'status',
      title: 'Status',
      type: 'string',
    },
    {
      name: 'changedAt',
      title: 'Changed At',
      type: 'datetime',
    },
    {
      name: 'changedBy',
      title: 'Changed By',
      type: 'reference',
      to: [{ type: 'sanity.user' }],
    },
  ],
};

// Add to vehicle schema:
{
  name: 'statusHistory',
  title: 'Status History',
  type: 'array',
  of: [{ type: 'statusChange' }],
  readOnly: true,
}
```

### Email Notification (Optional)

**File:** `app/api/revalidate/vehicle/[slug]/route.ts` (enhancement)

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// After successful revalidation, send notification
if (payload.status === 'sold' && payload.previousStatus !== 'sold') {
  await resend.emails.send({
    from: 'notifications@enthusiastauto.com',
    to: 'admin@enthusiastauto.com',
    subject: `Vehicle Sold: ${payload.title}`,
    html: `
      <p>The following vehicle has been marked as sold:</p>
      <p><strong>${payload.title}</strong></p>
      <p>Price: $${payload.price}</p>
      <p>View: <a href="https://shop.enthusiastauto.com/vehicles/${vehicleSlug}">Vehicle Page</a></p>
    `,
  });
}
```

### Acceptance Criteria Validation

- [ ] Editors can mark vehicles as "sold" in Sanity Studio
- [ ] Status change triggers webhook to revalidate affected pages
- [ ] Listing page updates within 60 seconds of status change
- [ ] Detail page shows "SOLD" overlay/badge when vehicle is sold
- [ ] Sold vehicles optionally hidden from main listing (filterable)
- [ ] Status history tracked in Sanity
- [ ] Email notification sent to admin when vehicle marked sold (optional)

---

## Story 3.6: Sanity Studio Workflow & Editor Training

### Implementation Overview

**Objective:** Customize Sanity Studio for intuitive vehicle management and train content editors on workflows.

**Effort:** 3 points
**Priority:** Should Have
**Dependencies:** Stories 3.1, 3.2 (Studio and schemas must exist)

### Studio Customization

**File:** `sanity/sanity.config.ts` (enhancements)

```typescript
import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { visionTool } from '@sanity/vision';
import { schemas } from './schemas';

export default defineConfig({
  // ... existing config

  plugins: [
    deskTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // Vehicles section
            S.listItem()
              .title('Vehicles')
              .child(
                S.list()
                  .title('Vehicles')
                  .items([
                    S.listItem()
                      .title('Current Inventory')
                      .child(
                        S.documentTypeList('vehicle')
                          .title('Current Inventory')
                          .filter('status == "current"')
                          .defaultOrdering([{ field: 'createdAt', direction: 'desc' }])
                      ),
                    S.listItem()
                      .title('Sold Vehicles')
                      .child(
                        S.documentTypeList('vehicle')
                          .title('Sold Vehicles')
                          .filter('status == "sold"')
                          .defaultOrdering([{ field: 'soldAt', direction: 'desc' }])
                      ),
                    S.listItem()
                      .title('Pending Sales')
                      .child(
                        S.documentTypeList('vehicle')
                          .title('Pending Sales')
                          .filter('status == "pending"')
                      ),
                    S.divider(),
                    S.listItem()
                      .title('All Vehicles')
                      .child(
                        S.documentTypeList('vehicle')
                          .title('All Vehicles')
                          .defaultOrdering([{ field: 'createdAt', direction: 'desc' }])
                      ),
                  ])
              ),
          ]),
    }),
    visionTool(), // Keep for debugging
  ],

  // Document templates
  document: {
    newDocumentOptions: (prev, { creationContext }) => {
      if (creationContext.type === 'global') {
        return prev.filter((template) => template.templateId !== 'vehicle');
      }
      return prev;
    },
    actions: (prev, context) => {
      // Custom publish confirmation for status changes
      if (context.schemaType === 'vehicle') {
        return vehicleActions(prev, context);
      }
      return prev;
    },
  },

  // Custom branding
  studio: {
    components: {
      logo: () => (
        <div style={{ padding: '0.5rem' }}>
          <h2 style={{ margin: 0 }}>Enthusiast Auto</h2>
          <p style={{ margin: 0, fontSize: '0.75rem', color: '#666' }}>
            Vehicle Content Manager
          </p>
        </div>
      ),
    },
  },
});
```

### Document Templates

**File:** `sanity/templates/vehicleTemplate.ts`

```typescript
import { Template } from 'sanity';

export const vehicleTemplate: Template = {
  id: 'vehicle-from-template',
  title: 'New Vehicle Listing',
  schemaType: 'vehicle',
  parameters: [],
  value: {
    status: 'current',
    make: 'BMW',
    // Pre-fill other common fields
  },
};
```

### Field Descriptions and Help Text

**Enhancements to `sanity/schemas/vehicle.ts`:**

```typescript
// Add helpful descriptions to fields
defineField({
  name: 'title',
  title: 'Title',
  type: 'string',
  description: '📝 Format: "Year BMW Model Trim" (e.g., "2005 BMW E46 M3 Competition Package")',
  validation: (Rule) => Rule.required().min(10).max(100),
}),

defineField({
  name: 'slug',
  title: 'URL Slug',
  type: 'slug',
  description: '🔗 Click "Generate" to create URL-friendly slug from title. Example: 2005-bmw-e46-m3',
  // ... rest of config
}),

defineField({
  name: 'images',
  title: 'Photo Gallery',
  type: 'array',
  description: '📸 Upload 10-30 high-quality images. First image = hero/thumbnail. Tip: Use batch upload for faster workflow.',
  validation: (Rule) => Rule.required().min(5).max(50),
  // ... rest of config
}),
```

### Batch Image Upload

**File:** `sanity/components/BatchImageUpload.tsx` (custom input component)

```typescript
import { useCallback } from 'react';
import { set, insert } from 'sanity';

export function BatchImageUpload(props) {
  const { value = [], onChange } = props;

  const handleBatchUpload = useCallback((files: File[]) => {
    files.forEach((file, index) => {
      // Sanity's built-in image upload handler
      onChange([
        insert([
          {
            _type: 'image',
            _key: `img-${Date.now()}-${index}`,
            asset: {
              _type: 'reference',
              _ref: '', // Will be set by Sanity after upload
            },
            alt: `Image ${index + 1}`, // Default alt text
          },
        ], 'after', value.length - 1 + index),
      ]);
    });
  }, [onChange, value]);

  return (
    <div>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => handleBatchUpload(Array.from(e.target.files || []))}
      />
      <p className="text-sm text-muted-foreground mt-2">
        Select multiple images to upload in batch
      </p>
    </div>
  );
}
```

### Editor Training Documentation

**File:** `docs/sanity-editor-guide.md`

```markdown
# Sanity Studio Editor Guide - Vehicle Management

## Accessing the Studio

1. Navigate to: https://enthusiast-auto.sanity.studio
2. Log in with your Sanity credentials
3. You will see "Vehicles" in the left sidebar

## Adding a New Vehicle

### Step 1: Create New Vehicle
1. Click "Vehicles" in sidebar
2. Click "+ New Vehicle" button
3. Fill in required fields (marked with *)

### Step 2: Required Fields

**Title** (Required)
- Format: "Year BMW Model Trim"
- Example: "2005 BMW E46 M3 Competition Package"

**Slug** (Required)
- Click "Generate" button to auto-create from title
- This becomes the URL: /vehicles/[slug]

**Year** (Required)
- Enter 4-digit year (1980-2025)

**Model** (Required)
- E.g., E46, E90, X3, X5

**Mileage** (Required)
- Current odometer reading in miles

**Price** (Required)
- Asking price in US dollars
- Example: 35000 (don't include $ or commas)

**Status** (Required)
- Select "Current - Available for Sale" for new listings
- Change to "Sold" when vehicle sells

**Images** (Required - minimum 5)
- Click "Upload" to add images
- Select multiple images for batch upload
- First image becomes the hero/thumbnail
- Add alt text for each image (describe what's shown)

### Step 3: Optional but Recommended

**Specifications**
- Engine, Transmission, Drivetrain
- Exterior/Interior Colors
- Doors, Seats

**Features**
- Type and press Enter to add each feature
- Examples: "Navigation System", "Sunroof", "Leather Seats"

**Description**
- Detailed vehicle description
- Use formatting (bold, headings) as needed
- Include condition notes, modifications, highlights

**Service History**
- Click "Add Item" for each service record
- Enter date, type, mileage, description, cost

### Step 4: SEO (Optional)

**Meta Title** - Custom title for Google search results (max 60 chars)
**Meta Description** - Custom description for search results (max 160 chars)

### Step 5: Publish

1. Review all fields
2. Click "Publish" button in bottom-right
3. If marking as "Sold", you'll see a confirmation dialog
4. Website updates within 60 seconds

## Editing an Existing Vehicle

1. Click "Vehicles" → "Current Inventory" or "Sold Vehicles"
2. Find and click the vehicle to edit
3. Make changes
4. Click "Publish" to save
5. Website updates automatically

## Marking a Vehicle as Sold

1. Open the vehicle listing
2. Change "Status" to "Sold"
3. Click "Publish"
4. Confirm the dialog: "Are you sure you want to mark ... as SOLD?"
5. Sold timestamp is automatically set
6. Website shows "SOLD" badge immediately

## Tips & Best Practices

- **Image Quality**: Upload high-resolution photos (1920x1080 or higher)
- **Image Order**: First image is most important (listing thumbnail)
- **Batch Upload**: Select 10-20 images at once for faster workflow
- **Alt Text**: Describe each image for accessibility (e.g., "Driver side exterior")
- **Slug**: Use "Generate" button - don't type slugs manually
- **Price**: Enter numbers only (35000, not "$35,000")
- **Features**: Be specific ("Harman Kardon Audio" vs "Sound System")

## Troubleshooting

**Images won't upload**
- Check file size (<10MB per image)
- Supported formats: JPG, PNG, WebP

**"Publish" button disabled**
- Check for required field errors (red highlights)
- All required fields must be filled

**Changes not showing on website**
- Wait 60 seconds for cache to update
- Webhook may take 1-2 minutes in some cases
- Check that you clicked "Publish" (not just "Save")

## Support

For technical issues or questions, contact: mike@enthusiastauto.com
```

### Training Checklist

**Pre-Training Setup:**
- [ ] Grant editor access to Sanity project
- [ ] Send Sanity Studio URL and login credentials
- [ ] Share editor guide documentation

**Training Session Agenda (60 minutes):**
1. Introduction to Sanity Studio (10 min)
   - What is a headless CMS
   - How Sanity connects to the website

2. Vehicle Schema Overview (15 min)
   - Required vs optional fields
   - Field descriptions and help text
   - Validation rules

3. Hands-On: Add a Vehicle (20 min)
   - Create new vehicle listing
   - Upload images in batch
   - Fill in specifications
   - Add service history
   - Publish and verify on website

4. Common Workflows (10 min)
   - Marking vehicles as sold
   - Editing existing listings
   - Reordering images

5. Q&A and Troubleshooting (5 min)

**Post-Training:**
- [ ] Provide editor guide PDF
- [ ] Create 2-3 test vehicles together
- [ ] Schedule follow-up check-in (1 week later)

### Acceptance Criteria Validation

- [ ] Sanity Studio interface customized for Enthusiast Auto workflow
- [ ] Document templates for new vehicle listings
- [ ] Bulk image upload working smoothly
- [ ] Field descriptions and help text for editors
- [ ] Required field validation prevents incomplete publishing
- [ ] Draft/published workflow with preview functionality
- [ ] Editor training documentation created
- [ ] Training session conducted with content team

---

## Implementation Summary

### Epic 3 Timeline

**Total Effort:** 37 points
**Estimated Duration:** 4-5 sprints (2-week sprints, team velocity 8-10 points)

**Story Sequence:**
1. Story 3.1: Sanity Setup (5 pts) - Week 1
2. Story 3.2: Vehicle Schema (8 pts) - Week 2
3. Story 3.3: Vehicle Listing (8 pts) - Week 3-4
4. Story 3.4: Vehicle Detail (8 pts) - Week 5-6
5. Story 3.5: Status Management (5 pts) - Week 7
6. Story 3.6: Editor Training (3 pts) - Week 8

### Testing Strategy

**Unit Tests:**
- Sanity client connection
- GROQ query validation
- Webhook signature verification
- Image optimization utilities

**Integration Tests:**
- Vehicle listing page with filters
- Vehicle detail page data fetching
- Webhook → revalidation flow
- CSV import script

**E2E Tests (Playwright):**
```typescript
// __tests__/e2e/vehicles.spec.ts
test('should display vehicle listing page', async ({ page }) => {
  await page.goto('/vehicles');
  await expect(page.locator('h1')).toContainText('BMW Vehicles for Sale');
  await expect(page.locator('[data-testid="vehicle-card"]')).toHaveCount(3); // Assumes 3 test vehicles
});

test('should filter vehicles by model', async ({ page }) => {
  await page.goto('/vehicles');
  await page.selectOption('[data-testid="model-filter"]', 'E46');
  await page.click('[data-testid="apply-filters"]');
  await expect(page.locator('[data-testid="vehicle-card"]')).toHaveCount(1); // Assumes 1 E46
});

test('should display vehicle detail page with gallery', async ({ page }) => {
  await page.goto('/vehicles/2005-bmw-e46-m3');
  await expect(page.locator('h1')).toContainText('2005 BMW E46 M3');
  await expect(page.locator('[data-testid="gallery-image"]')).toBeVisible();
  await page.click('[data-testid="gallery-next"]');
  // Verify image changed
});
```

### Deployment Checklist

**Before Going Live:**
- [ ] Sanity Studio deployed to production
- [ ] All environment variables configured in Vercel
- [ ] Webhook endpoints tested with Sanity test webhook
- [ ] CSV import script tested with sample data
- [ ] Image CDN performance verified (Sanity CDN)
- [ ] ISR revalidation confirmed working (60s + webhook)
- [ ] SEO schema.org markup validated
- [ ] Lighthouse scores 85+ (Performance, Accessibility, SEO)
- [ ] Editor training completed
- [ ] 5-10 vehicles published as initial inventory

### Success Metrics

**Performance:**
- Vehicle listing page load: <2s (target: 1.5s)
- Vehicle detail page load: <2s (target: 1.5s)
- ISR revalidation time: <60s (target: 30s)
- Webhook processing: <500ms

**Editorial:**
- Editor can publish new vehicle: <15 minutes (target: 10 minutes)
- Image batch upload: 20 images in <3 minutes
- Status update reflects on site: <60 seconds

**Technical:**
- ISR cache hit rate: >90%
- Sanity API response time: <200ms p95
- Image optimization: 50%+ size reduction vs original
- Zero failed webhook deliveries

---

**Epic 3 Status:** Ready for Implementation
**Next Steps:** Review with development team, begin Story 3.1 (Sanity Setup)
