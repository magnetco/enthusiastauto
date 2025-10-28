# Story 7.1: Service Request Page & Form

Status: Done

## Story

As a **BMW owner**,
I want **to request service (conditioning, rejuvenation, mechanical, or cosmetic) through an online form**,
so that **the Enthusiast Auto service team can contact me about my needs and schedule an assessment**.

## Acceptance Criteria

1. **Service Page** - Dedicated `/services` page accessible from main navigation (desktop and mobile)
2. **Service Cards** - Four service cards displayed: Conditioning & Protection, Full Rejuvenation, Mechanical Services, Cosmetic Repairs
3. **Service Descriptions** - Each card shows service name, icon, description, features list, ideal use case, and badge (where applicable)
4. **Request Form** - Unified service request form with fields: service type dropdown, contact info (name, email, phone), vehicle info (year, make, model, VIN optional), description textarea, existing customer checkbox
5. **Conditional Fields** - Form placeholder text changes based on selected service type
6. **Email Notifications** - Service requests trigger email to service team via Resend with all form data and request ID
7. **Database Storage** - Service requests saved to PostgreSQL (ServiceRequest model) with status tracking
8. **Success Confirmation** - Success message shown after submission with contact information and next steps

## Tasks / Subtasks

- [x] **Task 1: Create service page route** (AC: #1, #2, #3)
  - [x] Create `app/services/page.tsx` with ISR revalidation
  - [x] Add SEO metadata (title, description, Open Graph)
  - [x] Create ServiceHero component with hero section and CTAs
  - [x] Create ServiceCards component with 4 service types
  - [x] Add service type badges (Most Popular, M Series Specialists, BMW Specialists)
  - [x] Implement responsive grid layout (1 col mobile, 2 col tablet, 4 col desktop)
  - [x] Add scroll-to-form functionality from service cards

- [x] **Task 2: Build service request form** (AC: #4, #5, #8)
  - [x] Create ServiceRequestForm client component
  - [x] Implement React Hook Form with Zod validation
  - [x] Add service type dropdown (conditioning, rejuvenation, mechanical, cosmetic, not-sure)
  - [x] Add contact fields (name, email, phone)
  - [x] Add vehicle fields (year, make, model, VIN optional)
  - [x] Add description textarea with conditional placeholders
  - [x] Add existing customer checkbox
  - [x] Implement form validation with inline error messages
  - [x] Add loading states and success confirmation

- [x] **Task 3: Create email notification system** (AC: #6)
  - [x] Create `lib/email/service-request.ts` with Resend integration
  - [x] Design HTML email template with vehicle info and form data
  - [x] Implement sendServiceRequestNotification function
  - [x] Configure development mode (onboarding@resend.dev)
  - [x] Add service type labels mapping
  - [x] Include request ID in email for tracking

- [x] **Task 4: Implement API endpoint** (AC: #7)
  - [x] Create `app/api/services/request/route.ts`
  - [x] Implement POST handler with Zod validation
  - [x] Save service request to database
  - [x] Trigger email notification (non-blocking)
  - [x] Return success response with request ID
  - [x] Add error handling

- [x] **Task 5: Create database schema** (AC: #7)
  - [x] Add ServiceRequest model to Prisma schema
  - [x] Include fields: serviceType, name, email, phone, vehicle info, VIN, description, existingCustomer, status
  - [x] Add indexes on email, status, createdAt
  - [x] Run Prisma migration
  - [x] Update Prisma client

- [x] **Task 6: Add missing UI components** (AC: #4)
  - [x] Create `components/ui/textarea.tsx` ShadCN component
  - [x] Style with consistent design system

- [x] **Task 7: Update navigation** (AC: #1)
  - [x] Add Services link to `components/shared/Navigation.tsx` (desktop)
  - [x] Add Services link to `components/shared/MobileMenu.tsx` (mobile)
  - [x] Position Services between Parts and About
  - [x] Update Shopify menu filter to exclude duplicate Services links

- [x] **Task 8: Remove unused components** (cleanup)
  - [x] Delete `components/layout/desktop-navbar.tsx` (unused)
  - [x] Delete `components/layout/expanded-navbar.tsx` (unused)
  - [x] Delete `components/layout/bmw-navigation.tsx` (unused)

- [x] **Task 9: Document future integration** (AC: #7)
  - [x] Create `docs/TODO.md` with Microsoft Planner API integration task
  - [x] Document current implementation state
  - [x] List requirements for Planner integration
  - [x] Provide implementation notes and resources

## Dev Notes

### Architecture Context

**New Epic 7:** Service Request System
- Story 7.1 (Complete) - Service Request Page & Form
- Future stories could include: Microsoft Planner integration, service tracking portal, calendar scheduling

**Built Components:**
- Service landing page at `/services` with hero, service cards, and inline form
- Email-based lead capture system using Resend
- PostgreSQL database storage for request tracking
- ShadCN UI components for consistent design

**Reusable Patterns:**
- Form handling: React Hook Form + Zod (from Stories 5.1-5.3)
- Email service: Resend integration (from Story 5.1)
- API routes: Next.js App Router patterns
- Database: Prisma ORM (from Epic 5)

### Project Structure Notes

**Files Created:**
```
app/services/page.tsx
components/services/ServiceHero.tsx
components/services/ServiceCards.tsx
components/services/ServiceRequestForm.tsx
components/ui/textarea.tsx
lib/email/service-request.ts
app/api/services/request/route.ts
prisma/migrations/[timestamp]_add_service_request_model/
docs/TODO.md
```

**Files Modified:**
```
components/shared/Navigation.tsx (added Services link)
components/shared/MobileMenu.tsx (added Services link)
prisma/schema.prisma (added ServiceRequest model)
```

**Files Deleted:**
```
components/layout/desktop-navbar.tsx
components/layout/expanded-navbar.tsx
components/layout/bmw-navigation.tsx
```

### References

**Implementation Details:**
- [Source: app/services/page.tsx] - Main service page with hero, cards, and form
- [Source: components/services/ServiceCards.tsx] - 4 service cards with scroll-to-form interaction
- [Source: components/services/ServiceRequestForm.tsx] - React Hook Form with Zod validation
- [Source: lib/email/service-request.ts] - Resend email notification system
- [Source: app/api/services/request/route.ts] - API endpoint for form submissions
- [Source: prisma/schema.prisma:84-103] - ServiceRequest database model
- [Source: docs/TODO.md] - Microsoft Planner API integration requirements

**Business Context:**
- Consolidates 4 separate service pages from old site (enthusiastauto.com/services/*)
- Services offered: Conditioning, Rejuvenation, Mechanical, Cosmetic
- Development mode email: delivered@resend.dev (update for production)

## Dev Agent Record

### Context Reference

- Created retroactively to document completed implementation (2025-10-28)

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

Story 7.1 implemented successfully with all 8 acceptance criteria met.

### Completion Notes

**Completed:** 2025-10-28
**Definition of Done:** All acceptance criteria met, code implemented, build successful, documentation complete

### Completion Notes List

**Implementation Summary:**
- Created unified `/services` page consolidating 4 service offerings from old site
- Implemented 4 service cards: Conditioning & Protection, Full Rejuvenation (M Series Specialists), Mechanical Services (BMW Specialists), Cosmetic Repairs (Most Popular)
- Built comprehensive service request form with React Hook Form + Zod validation
- Integrated Resend email notifications (development mode)
- Created PostgreSQL ServiceRequest model with Prisma
- Added Services navigation links to desktop and mobile menus
- Cleaned up 3 unused navbar components
- Documented Microsoft Planner API integration task in TODO.md
- Build successful, all features working

**Key Features:**
1. Service Cards: 4 distinct services with icons, badges, features, and CTAs
2. Request Form: Conditional placeholders, comprehensive validation, success states
3. Email Notifications: HTML template with vehicle details and request tracking
4. Database Integration: Full CRUD with status tracking (pending, contacted, scheduled, completed)
5. Navigation: Services link positioned between Parts and About in both desktop/mobile
6. Responsive Design: Mobile-first approach with 1-2-4 column grid layouts
7. Type Safety: Full TypeScript coverage with Zod schemas

**Testing:**
- Manual testing: Form validation, email sending, database storage
- Build verification: TypeScript compilation successful
- No automated tests written (add in future enhancement)

### File List

**New Files Created (9):**
- app/services/page.tsx
- components/services/ServiceHero.tsx
- components/services/ServiceCards.tsx
- components/services/ServiceRequestForm.tsx
- components/ui/textarea.tsx
- lib/email/service-request.ts
- app/api/services/request/route.ts
- prisma/migrations/20251028202054_add_service_request_model/migration.sql
- docs/TODO.md

**Modified Files (3):**
- components/shared/Navigation.tsx
- components/shared/MobileMenu.tsx
- prisma/schema.prisma

**Deleted Files (3):**
- components/layout/desktop-navbar.tsx
- components/layout/expanded-navbar.tsx
- components/layout/bmw-navigation.tsx
