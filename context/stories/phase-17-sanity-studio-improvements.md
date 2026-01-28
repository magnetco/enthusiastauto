# Phase 17: Sanity Studio Improvements

**Epic**: Enhance Sanity Studio workflow with preview mode, better image management, and bulk operations

**Priority**: Medium  
**Estimated Effort**: Medium (2-3 weeks)  
**Dependencies**: Phase 2 (Vehicle Inventory), Phase 8 (Data Admin App)

---

## Overview

Improve the content editing experience in Sanity Studio with draft preview, streamlined image workflows, enhanced bulk import capabilities, and custom validation rules.

---

## User Stories

### Story 1: Preview Mode for Draft Vehicles

**As a** content editor  
**I want to** preview draft vehicles before publishing  
**So that** I can verify content and layout without making it live

**Acceptance Criteria:**
- [ ] "Preview" button in Sanity Studio vehicle editor
- [ ] Preview opens vehicle detail page in new tab with `?preview=true` parameter
- [ ] Preview shows draft content (unpublished changes)
- [ ] Preview banner at top: "Preview Mode - Draft Content"
- [ ] "Exit Preview" button returns to normal view
- [ ] Preview requires authentication (editor login)
- [ ] Preview works for new (unpublished) vehicles
- [ ] Preview updates in real-time as editor makes changes

**Technical Notes:**
- Use Sanity's Presentation Tool or custom preview implementation
- Add preview API route: `/api/preview?slug=vehicle-slug&secret=token`
- Set preview cookie, fetch draft content via Sanity client
- Use `perspective: 'previewDrafts'` in Sanity queries
- Disable preview route: `/api/disable-preview`

**Files to Create:**
- `website/app/api/preview/vehicle/route.ts`
- `website/components/studio/PreviewBanner.tsx`

**Files to Modify:**
- `studio/sanity.config.ts` (add preview configuration)
- `website/lib/sanity/client.ts` (add draft mode support)
- `website/app/vehicles/[slug]/page.tsx` (handle preview mode)

**Sanity Config Example:**
```typescript
import { defineConfig } from 'sanity'
import { presentationTool } from 'sanity/presentation'

export default defineConfig({
  // ... other config
  plugins: [
    presentationTool({
      previewUrl: {
        origin: 'https://staging.enthusiastauto.com',
        previewMode: {
          enable: '/api/preview',
        },
      },
    }),
  ],
})
```

---

### Story 2: Better Image Management Workflow

**As a** content editor  
**I want to** efficiently manage vehicle images with bulk upload, reordering, and metadata  
**So that** I can quickly prepare vehicles for publication

**Acceptance Criteria:**
- [ ] Drag-and-drop multiple images at once (bulk upload)
- [ ] Drag to reorder images in gallery
- [ ] Set primary image (hero shot)
- [ ] Add alt text and captions per image
- [ ] Image preview grid in editor
- [ ] Delete multiple images at once
- [ ] Image optimization on upload (auto-resize, WebP conversion)
- [ ] Progress indicator for bulk uploads
- [ ] Validation: max 50 images per vehicle

**Technical Notes:**
- Use Sanity's native image field with array type
- Custom input component for drag-and-drop reordering
- Sanity asset pipeline handles optimization
- Add custom validation rules for image count and alt text

**Files to Modify:**
- `studio/schemas/vehicle.ts` (enhance image field)
- `studio/components/ImageGalleryInput.tsx` (custom input component)

**Schema Enhancement:**
```typescript
{
  name: 'gallery',
  title: 'Image Gallery',
  type: 'array',
  of: [
    {
      type: 'image',
      options: { hotspot: true },
      fields: [
        { name: 'alt', type: 'string', title: 'Alt Text', validation: Rule => Rule.required() },
        { name: 'caption', type: 'string', title: 'Caption' },
        { name: 'isPrimary', type: 'boolean', title: 'Primary Image' },
      ],
    },
  ],
  validation: Rule => Rule.max(50).required(),
}
```

---

### Story 3: Bulk Vehicle Import Improvements

**As a** admin user  
**I want to** import vehicles from CSV with better error handling and validation  
**So that** I can efficiently add inventory without manual data entry

**Acceptance Criteria:**
- [ ] CSV template download with all required fields
- [ ] Pre-import validation with detailed error messages
- [ ] Row-by-row error reporting (e.g., "Row 5: Invalid chassis code")
- [ ] Preview imported data before committing
- [ ] Bulk image upload via ZIP file (images matched by filename)
- [ ] Progress tracking during import
- [ ] Rollback option if import fails
- [ ] Import history log (who imported, when, how many records)
- [ ] Support for updating existing vehicles (match by VIN or slug)

**Technical Notes:**
- Enhance existing import script in data app
- Add Zod validation for CSV rows
- Use Sanity transaction API for atomic imports
- Store import logs in database

**Files to Modify:**
- `data/server/routes/vehicle-import.ts`
- `data/src/App.tsx` (add import UI)
- `studio/lib/templates/vehicles.ts`

**Validation Schema:**
```typescript
const vehicleImportSchema = z.object({
  vin: z.string().length(17),
  year: z.number().min(1990).max(2030),
  make: z.literal('BMW'),
  model: z.string(),
  chassis: z.enum(['E30', 'E36', 'E46', 'E90', 'F80', 'G80', /* ... */]),
  mileage: z.number().min(0),
  price: z.number().min(0),
  status: z.enum(['available', 'sold', 'pending']),
  // ... other fields
})
```

---

### Story 4: Custom Validation Rules

**As a** content editor  
**I want to** receive helpful validation errors when creating vehicles  
**So that** I don't publish incomplete or incorrect data

**Acceptance Criteria:**
- [ ] Required fields clearly marked with asterisks
- [ ] Real-time validation as user types
- [ ] Custom rules:
  - VIN must be 17 characters
  - Year must be between 1990-2030
  - Mileage must be positive number
  - Price must be positive number
  - At least 5 images required
  - Slug must be unique
  - Description minimum 100 characters
- [ ] Validation errors show inline with helpful messages
- [ ] Cannot publish until all validations pass
- [ ] Warning for missing recommended fields (e.g., service history)

**Technical Notes:**
- Use Sanity's built-in validation API
- Custom async validation for slug uniqueness
- Add validation to all vehicle schema fields

**Files to Modify:**
- `studio/schemas/vehicle.ts`

**Validation Examples:**
```typescript
{
  name: 'vin',
  type: 'string',
  validation: Rule => Rule.required()
    .length(17)
    .regex(/^[A-HJ-NPR-Z0-9]{17}$/, 'Invalid VIN format')
    .custom(async (vin, context) => {
      // Check uniqueness
      const existing = await context.getClient({ apiVersion: '2024-01-01' })
        .fetch(`count(*[_type == "vehicle" && vin == $vin && _id != $id])`, 
          { vin, id: context.document._id }
        )
      return existing > 0 ? 'VIN already exists' : true
    })
}
```

---

## Design Considerations

### Editor Experience
- Minimize clicks to complete common tasks
- Clear visual hierarchy in form fields
- Helpful placeholder text and examples
- Keyboard shortcuts for power users

### Performance
- Lazy load images in gallery editor
- Debounce validation checks
- Optimize Sanity queries with projections
- Cache validation results

### Data Integrity
- Prevent duplicate VINs
- Ensure slug uniqueness
- Validate relationships (e.g., chassis code matches model)
- Audit trail for all changes

---

## Testing Requirements

- [ ] Unit tests for validation rules
- [ ] Integration tests for bulk import
- [ ] E2E test: Create vehicle → preview → publish
- [ ] E2E test: Import CSV with errors → fix → retry
- [ ] Test image upload limits and formats

---

## Success Metrics

- **Efficiency**: Time to publish a vehicle (target: < 10 minutes)
- **Quality**: % of vehicles with complete data (target: 95%+)
- **Errors**: Validation errors caught before publish (target: 100%)
- **Adoption**: % of editors using preview mode (target: 80%+)

---

## Documentation Needs

- [ ] CSV import template and field guide
- [ ] Image guidelines (dimensions, formats, naming)
- [ ] Validation rules reference
- [ ] Preview mode user guide
- [ ] Video tutorial for bulk import

---

## Future Enhancements

- AI-powered image tagging and alt text generation
- Bulk edit multiple vehicles at once
- Vehicle templates for common configurations
- Integration with third-party data sources (Carfax, AutoCheck)
- Scheduled publishing (draft → publish at specific time)
