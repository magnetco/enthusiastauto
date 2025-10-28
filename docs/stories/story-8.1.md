# Story 8.1: Sanity CMS Schema for Events

Status: Ready

## Story

As a **content editor**,
I want **a comprehensive Sanity CMS schema for managing event listings**,
so that **I can create, manage, and publish events with status tracking, photo galleries, and all necessary metadata**.

## Acceptance Criteria

1. **Event Document Schema Created** - Sanity schema includes all required fields: title, slug, eventDate, location, status (upcoming/recap/past), hero image, photo gallery, description, external website link, and SEO metadata
2. **Status Management** - Status field supports three states: "upcoming" (future events), "recap" (past events with photos/summary), and "past" (archived events)
3. **Date and Location Fields** - EventDate field with proper date validation, location field with venue name and address support
4. **Photo Gallery Support** - Images array field supporting 1-20 high-quality event photos with captions and hotspot support for cropping
5. **Rich Text Description** - Description field using Sanity's portable text editor for rich content formatting
6. **SEO Metadata Fields** - Meta title, meta description, and Open Graph image fields for social sharing optimization
7. **External Links** - Optional external website URL field for linking to third-party event pages (Cars & Bids, Bring a Trailer, etc.)
8. **Studio Preview Configuration** - Custom preview showing event title, date, status badge, and hero image in Sanity Studio list view
9. **Field Validation** - Validation rules ensure required fields (title, slug, eventDate, status, hero image) are completed before publishing
10. **Schema Registration** - Event schema properly registered in Sanity config and appears in Studio navigation

## Tasks / Subtasks

- [ ] **Task 1: Create Event Schema File** (AC: #1, #2, #3, #4, #5, #6, #7)
  - [ ] Create `sanity/schemas/event.ts` file following vehicle schema pattern
  - [ ] Define document type with name 'event' and title 'Event'
  - [ ] Add title field (string, required)
  - [ ] Add slug field (slug type, auto-generate from title, required)
  - [ ] Add eventDate field (datetime type, required with future/past validation)
  - [ ] Add location object field with venue name (string) and address (text)
  - [ ] Add status field (string, options: upcoming/recap/past, required, default: upcoming)
  - [ ] Add heroImage field (image type with hotspot, required)
  - [ ] Add images array field (image array, 1-20 images, optional captions)
  - [ ] Add description field (portable text/block content for rich formatting)
  - [ ] Add externalUrl field (url type, optional, for external event websites)
  - [ ] Add SEO metadata fields: metaTitle (string), metaDescription (text), ogImage (image)

- [ ] **Task 2: Implement Field Validation Rules** (AC: #9)
  - [ ] Add required validation to title field
  - [ ] Add required validation to slug field with uniqueness check
  - [ ] Add required validation to eventDate with date format validation
  - [ ] Add required validation to status field
  - [ ] Add required validation to heroImage field
  - [ ] Add min(1) max(20) validation to images array
  - [ ] Add URL format validation to externalUrl field
  - [ ] Add character limits to metaTitle (60 chars) and metaDescription (160 chars)

- [ ] **Task 3: Configure Studio Preview** (AC: #8)
  - [ ] Define preview select fields: title, eventDate, status, heroImage
  - [ ] Implement prepare function for custom preview display
  - [ ] Add status badge emoji indicators (🔵 Upcoming, 🟢 Recap, ⚪ Past)
  - [ ] Format date display in subtitle (e.g., "🔵 Upcoming - March 15, 2025")
  - [ ] Set heroImage as preview media thumbnail

- [ ] **Task 4: Register Schema in Sanity Config** (AC: #10)
  - [ ] Import event schema in `sanity/schemas/index.ts`
  - [ ] Add event to schema types array
  - [ ] Verify schema appears in Sanity Studio navigation
  - [ ] Test schema with `sanity schema extract` command

- [ ] **Task 5: Configure Studio Desk Structure** (AC: #10)
  - [ ] Add Events section to Sanity Studio desk structure
  - [ ] Create filtered views: "Upcoming Events", "Past Events (Recaps)", "Archived Events"
  - [ ] Configure default ordering by eventDate (descending)
  - [ ] Add event count badges to filtered views

- [ ] **Task 6: Add Helper Fields for Calendar Export** (AC: #1, preparation for Story 8.4)
  - [ ] Add startTime field (time string, optional, format: HH:MM)
  - [ ] Add endTime field (time string, optional, format: HH:MM)
  - [ ] Add timezone field (string, optional, default: "America/New_York")
  - [ ] Add notes about future .ics generation requirements

- [ ] **Task 7: Create Sample Event for Testing** (AC: All)
  - [ ] Start Sanity Studio in development mode
  - [ ] Create sample event with all fields populated
  - [ ] Verify field validation rules work correctly
  - [ ] Test status transitions (upcoming → recap → past)
  - [ ] Upload test images to verify gallery functionality
  - [ ] Verify preview renders correctly in Studio list view

- [ ] **Task 8: Update TypeScript Types** (AC: #10)
  - [ ] Run `sanity schema extract` to generate types
  - [ ] Verify Event type appears in generated TypeScript definitions
  - [ ] Add Event type exports to types barrel file if needed
  - [ ] Document Event type structure for future stories

- [ ] **Task 9: Documentation** (AC: All)
  - [ ] Document event schema fields in README or inline comments
  - [ ] Add editor guidelines for status management workflow
  - [ ] Document image requirements (dimensions, file size, format)
  - [ ] Create quick reference guide for content editors

- [ ] **Task 10: Testing and Validation** (AC: All)
  - [ ] Unit test schema validation rules
  - [ ] Test required field enforcement
  - [ ] Test image upload and gallery functionality
  - [ ] Test slug generation and uniqueness
  - [ ] Test portable text formatting options
  - [ ] Verify Studio preview display
  - [ ] Test filtered views in desk structure

## Dev Notes

### Architecture Patterns

**Sanity CMS Schema Pattern:** Follow the established vehicle schema pattern from Epic 3 (Story 3.2):
- Document-type schema with TypeScript definition
- Field validation using Sanity's Rule API
- Custom preview configuration for Studio list views
- Image fields with hotspot support for flexible cropping
- Portable text for rich content editing

**Schema Location:** `sanity/schemas/event.ts`

**Registration:** Schema must be imported and registered in `sanity/schemas/index.ts` to appear in Studio

**Status Field Design:**
- **upcoming**: Events with future dates, displayed on /events page
- **recap**: Past events with photos/content, featured on /events page
- **past**: Archived events, optionally hidden from main listings

**Image Requirements:**
- Hero image: Required, minimum 1200x630px for social sharing
- Gallery images: Optional 1-20 images, recommended 1920x1080px
- All images support hotspot for focal point selection

### Project Structure Notes

**Sanity Schema Files:**
```
sanity/
├── schemas/
│   ├── index.ts          # Schema registration
│   ├── vehicle.ts        # Existing vehicle schema (reference)
│   └── event.ts          # New event schema (this story)
├── lib/
│   └── client.ts         # Sanity client configuration
└── sanity.config.ts      # Studio configuration
```

**Studio Desk Structure:**
```
Sanity Studio Navigation
├── Vehicles (existing)
├── Events (new)
│   ├── Upcoming Events
│   ├── Past Events (Recaps)
│   └── Archived Events
└── Settings
```

### References

**Source Documents:**
- [PRD Epic 8: Events Management](docs/PRD.md#epic-8-events-management-phase-2) - Lines 410-433
- [PRD FR025-FR029](docs/PRD.md#functional-requirements) - Lines 118-126 (event functional requirements)
- [Solution Architecture: Sanity CMS Schema Pattern](docs/solution-architecture.md#sanity-cms-schema-vehicles) - Lines 483-602 (vehicle schema reference)
- [Epic Stories: Epic 3 Story 3.2](docs/epic-stories.md#story-32-vehicle-schema--data-models) - Lines 416-443 (vehicle schema story for pattern reference)

**Technical Decisions:**
- **Status Field**: Three-state status (upcoming/recap/past) supports both future event promotion and past event archival with photo recaps
- **Calendar Fields**: Start time, end time, and timezone fields included in schema to support .ics generation in Story 8.4
- **External URL**: Optional field allows linking to third-party event pages (Cars & Bids, Bring a Trailer) while maintaining Enthusiast Auto event presence
- **SEO First**: Dedicated meta fields ensure optimal social sharing and search engine visibility

**Dependencies:**
- Sanity CMS infrastructure from Epic 3 (Stories 3.1-3.2) must be complete
- No new packages required - uses existing @sanity/vision, @sanity/client, sanity packages
- TypeScript types will auto-generate from schema via `sanity schema extract`

**Testing Standards:**
- All required fields must be validated with Sanity Rule API
- Sample event creation must succeed with all field types
- Studio preview must render correctly with status badges
- Schema must extract valid TypeScript types

## Dev Agent Record

### Context Reference

**Context File:** `/Users/heggiedesign/Development/enthusiastauto-1/docs/stories/story-context-8.8.1.xml`
**Generated:** 2025-10-28
**Workflow:** story-context (BMAD BMM)

### Agent Model Used

<!-- Model info will be added during implementation -->

### Debug Log References

<!-- Debug logs will be added during implementation -->

### Completion Notes List

<!-- Completion notes will be added during implementation -->

### File List

<!-- Created/modified files will be listed during implementation -->
