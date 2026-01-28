# Phase 16: My Garage Enhancements

**Epic**: Enhance My Garage with inline parts preview, personalized recommendations, and vehicle tracking

**Priority**: High  
**Estimated Effort**: Large (3-4 weeks)  
**Dependencies**: Phase 5 (My Garage), Phase 10 (Recommendations)

---

## Overview

Transform My Garage from a simple favorites list into a comprehensive vehicle management hub with inline parts recommendations, maintenance tracking, and service history integration.

---

## User Stories

### Story 1: Garage Vehicle Cards with Inline Parts Preview

**As a** logged-in user  
**I want to** see compatible parts directly on my garage vehicle cards  
**So that** I can quickly find parts for my saved vehicles without navigating away

**Acceptance Criteria:**
- [ ] Vehicle cards in garage show 3-5 popular compatible parts inline
- [ ] Parts display includes thumbnail, name, price, and "Add to Cart" button
- [ ] Parts are fetched based on vehicle fitment data
- [ ] Loading state shows skeleton UI while parts load
- [ ] "View All Parts" link navigates to filtered parts page for that vehicle
- [ ] Parts update when vehicle fitment changes
- [ ] Mobile-responsive card layout

**Technical Notes:**
- Reuse existing recommendations engine from Phase 10
- Add `getCompatiblePartsForVehicle(vehicleId, limit)` function
- Cache parts data per vehicle (60s TTL)
- Use React Suspense for deferred loading

**Files to Modify:**
- `website/components/favorites/GarageItemCard.tsx`
- `website/lib/shared/recommendations.ts`
- `website/app/account/garage/page.tsx`

---

### Story 2: Garage-Based Personalized Homepage Recommendations

**As a** logged-in user with vehicles in my garage  
**I want to** see personalized part recommendations on the homepage  
**So that** I discover relevant products without searching

**Acceptance Criteria:**
- [ ] Homepage shows "Recommended For Your Garage" section when user is logged in
- [ ] Recommendations based on all vehicles in user's garage
- [ ] Section shows 4-8 products in carousel format
- [ ] Each product card shows which garage vehicle it fits
- [ ] Section hidden for users with empty garage
- [ ] Recommendations refresh daily
- [ ] Analytics tracking for recommendation clicks

**Technical Notes:**
- Create new `getGarageBasedRecommendations(userId)` function
- Aggregate fitment data from all garage vehicles
- Use Shopify BEST_SELLING + fitment matching
- Server-side render with ISR (revalidate: 3600)

**Files to Create:**
- `website/components/home/GarageRecommendations.tsx`

**Files to Modify:**
- `website/app/page.tsx`
- `website/lib/shared/recommendations.ts`
- `website/lib/db/queries/favorites.ts`

---

### Story 3: Vehicle Maintenance Tracking

**As a** garage user  
**I want to** track maintenance records for my vehicles  
**So that** I can remember service history and plan future maintenance

**Acceptance Criteria:**
- [ ] "Add Maintenance Record" button on each garage vehicle
- [ ] Modal form to log: date, service type, mileage, cost, notes
- [ ] Service types: Oil Change, Brake Service, Tire Rotation, Inspection, Custom
- [ ] Maintenance history timeline view per vehicle
- [ ] Sort by date (newest first)
- [ ] Edit and delete existing records
- [ ] Export maintenance history as PDF
- [ ] Optional: Upload receipt photos

**Technical Notes:**
- New database table: `VehicleMaintenance`
  - Fields: id, userId, vehicleId, date, serviceType, mileage, cost, notes, receiptUrl, createdAt
- New API routes: `/api/user/garage/[vehicleId]/maintenance`
- Use Vercel Blob for receipt uploads (optional)
- Generate PDF with React-PDF or similar

**Database Schema:**
```sql
CREATE TABLE "VehicleMaintenance" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "vehicleId" TEXT NOT NULL,
  "date" TIMESTAMP NOT NULL,
  "serviceType" TEXT NOT NULL,
  "mileage" INTEGER,
  "cost" DECIMAL(10,2),
  "notes" TEXT,
  "receiptUrl" TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);
```

**Files to Create:**
- `website/components/garage/MaintenanceForm.tsx`
- `website/components/garage/MaintenanceTimeline.tsx`
- `website/app/api/user/garage/[vehicleId]/maintenance/route.ts`
- `website/lib/db/queries/maintenance.ts`

**Files to Modify:**
- `website/prisma/schema.prisma`
- `website/components/favorites/GarageItemCard.tsx`

---

### Story 4: Service History Integration

**As a** garage user  
**I want to** see my service request history linked to my garage vehicles  
**So that** I can track all interactions with Enthusiast Auto for each vehicle

**Acceptance Criteria:**
- [ ] "Service History" tab on garage vehicle cards
- [ ] Shows all service requests submitted for that vehicle
- [ ] Display: date, service type, status (pending/completed/cancelled)
- [ ] Link to view full service request details
- [ ] Filter by status
- [ ] "Request Service" button creates new request pre-filled with vehicle info
- [ ] Admin can update service request status in data app

**Technical Notes:**
- Link ServiceRequest table to garage vehicles via vehicleId
- Add `vehicleId` field to ServiceRequest table (nullable for non-garage vehicles)
- Query service requests by userId + vehicleId
- Update service request form to accept vehicleId parameter

**Database Migration:**
```sql
ALTER TABLE "ServiceRequest" 
ADD COLUMN "vehicleId" TEXT,
ADD COLUMN "status" TEXT DEFAULT 'pending';
```

**Files to Create:**
- `website/components/garage/ServiceHistory.tsx`
- `website/app/api/user/garage/[vehicleId]/services/route.ts`

**Files to Modify:**
- `website/prisma/schema.prisma`
- `website/app/api/services/request/route.ts`
- `website/components/favorites/GarageItemCard.tsx`
- `data/server/routes/service-requests.ts`

---

## Design Considerations

### UI/UX
- Use tabs for vehicle card sections: Overview, Parts, Maintenance, Service History
- Consistent card design with existing garage items
- Mobile-first responsive design
- Loading states for all async data
- Empty states with helpful CTAs

### Performance
- Lazy load parts recommendations (not critical path)
- Cache garage data with SWR or React Query
- Optimize database queries with proper indexes
- Limit maintenance records to last 50 per vehicle

### Data Privacy
- All garage data scoped to authenticated user
- Maintenance records only visible to owner
- Service history only shows user's own requests

---

## Testing Requirements

- [ ] Unit tests for recommendation aggregation logic
- [ ] Unit tests for maintenance CRUD operations
- [ ] Integration tests for garage page with all features
- [ ] E2E test: Add vehicle → log maintenance → request service
- [ ] Mobile responsive testing on iOS/Android

---

## Success Metrics

- **Engagement**: % of users who add maintenance records
- **Conversion**: Click-through rate on inline parts recommendations
- **Retention**: Return visits to garage page (weekly active users)
- **Revenue**: Sales attributed to garage recommendations

---

## Future Enhancements

- Maintenance reminders (email notifications)
- Mileage-based service suggestions
- Integration with OBD-II data (vehicle diagnostics)
- Shared garage (multiple users per vehicle)
- Garage export/import for vehicle transfers
