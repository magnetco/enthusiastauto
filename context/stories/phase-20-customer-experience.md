# Phase 20: Customer Experience

**Epic**: Enhance customer engagement with live chat, vehicle comparison, email marketing, and reviews

**Priority**: Medium  
**Estimated Effort**: Large (4-5 weeks)  
**Dependencies**: Phase 4 (User Accounts), Phase 2 (Vehicle Inventory)

---

## Overview

Improve customer experience and engagement through real-time support, vehicle comparison tools, automated email marketing, and social proof via customer reviews and testimonials.

---

## User Stories

### Story 1: Live Chat Support

**As a** site visitor  
**I want to** chat with a representative in real-time  
**So that** I can get immediate answers to my questions

**Acceptance Criteria:**
- [ ] Chat widget in bottom-right corner of all pages
- [ ] Minimized by default, expandable on click
- [ ] Shows online/offline status
- [ ] Pre-chat form collects: name, email, inquiry type
- [ ] Chat history persists across page navigation
- [ ] File sharing (images, documents)
- [ ] Typing indicators
- [ ] Read receipts
- [ ] Mobile-responsive chat interface
- [ ] Offline mode: Leave a message (email notification)
- [ ] Chat transcript emailed to user after session
- [ ] Admin dashboard to manage conversations

**Technical Decision: Chat Platform**

**Option 1: Intercom (Recommended)**
- ✅ Full-featured, professional
- ✅ CRM integration
- ✅ Mobile apps for staff
- ✅ Chatbots and automation
- ❌ Expensive ($74+/month)

**Option 2: Crisp**
- ✅ Affordable ($25/month)
- ✅ Good feature set
- ✅ Unlimited conversations
- ❌ Less mature than Intercom

**Option 3: Custom (Socket.io)**
- ✅ Full control, no monthly cost
- ✅ Customizable
- ❌ High development effort
- ❌ Maintenance burden

**Recommendation**: Start with Crisp for cost efficiency, upgrade to Intercom if needed.

**Technical Tasks:**
- [ ] Sign up for Crisp account
- [ ] Install Crisp widget script
- [ ] Configure widget appearance (brand colors)
- [ ] Set up automated messages (welcome, offline)
- [ ] Integrate with user data (name, email if logged in)
- [ ] Configure routing rules (sales vs. support)
- [ ] Train staff on chat platform
- [ ] Set up mobile apps for staff

**Files to Modify:**
- `website/app/layout.tsx` (add chat script)
- `website/components/layout/ChatWidget.tsx` (optional wrapper)

**Implementation:**
```typescript
// app/layout.tsx
<Script id="crisp-chat">
  {`
    window.$crisp=[];
    window.CRISP_WEBSITE_ID="YOUR_WEBSITE_ID";
    (function(){
      d=document;
      s=d.createElement("script");
      s.src="https://client.crisp.chat/l.js";
      s.async=1;
      d.getElementsByTagName("head")[0].appendChild(s);
    })();
  `}
</Script>
```

---

### Story 2: Vehicle Comparison Tool

**As a** user browsing vehicles  
**I want to** compare multiple vehicles side-by-side  
**So that** I can make an informed purchase decision

**Acceptance Criteria:**
- [ ] "Add to Compare" button on vehicle cards
- [ ] Compare up to 3 vehicles at once
- [ ] Comparison bar at bottom of screen shows selected vehicles
- [ ] "Compare" button opens comparison page
- [ ] Side-by-side table with key specs:
  - Images (primary photo)
  - Year, Make, Model, Chassis
  - Price
  - Mileage
  - Engine, Transmission
  - Exterior/Interior Color
  - Key Features
  - Service History Summary
- [ ] Highlight differences between vehicles
- [ ] "View Details" link to full vehicle page
- [ ] "Contact About This Vehicle" button per vehicle
- [ ] Print comparison page
- [ ] Share comparison via link
- [ ] Mobile: Swipe between vehicles

**Technical Tasks:**
- [ ] Create comparison state management (Context or Zustand)
- [ ] Build ComparisonBar component (sticky bottom bar)
- [ ] Build ComparisonPage with side-by-side layout
- [ ] Store comparison in localStorage (persist across sessions)
- [ ] Generate shareable comparison URLs
- [ ] Responsive design for mobile (vertical stack)

**Files to Create:**
- `website/contexts/ComparisonContext.tsx`
- `website/components/vehicles/CompareButton.tsx`
- `website/components/vehicles/ComparisonBar.tsx`
- `website/app/compare/page.tsx`
- `website/lib/comparison/utils.ts`

**Files to Modify:**
- `website/components/vehicles/VehicleCard.tsx`
- `website/app/vehicles/[slug]/page.tsx`

**Comparison URL Format:**
```
/compare?vehicles=2024-bmw-m3-competition,2023-bmw-m4-gts,2022-bmw-m2-cs
```

---

### Story 3: Email Marketing Integration

**As a** marketing manager  
**I want to** send targeted email campaigns to users  
**So that** I can drive engagement and sales

**Acceptance Criteria:**

**Email Capture:**
- [ ] Newsletter signup in footer
- [ ] Popup modal for first-time visitors (delay 30s)
- [ ] Incentive: "Get 10% off your first parts order"
- [ ] Double opt-in confirmation email
- [ ] Preference center (choose email types)

**Automated Emails:**
- [ ] Welcome series (3 emails over 1 week)
- [ ] Abandoned cart reminder (if user added to cart but didn't checkout)
- [ ] New vehicle alerts (weekly digest of new inventory)
- [ ] Price drop alerts (for vehicles in garage)
- [ ] Service reminders (based on maintenance tracking)
- [ ] Re-engagement campaign (inactive users after 60 days)

**Campaign Types:**
- [ ] Monthly newsletter (new vehicles, blog posts, events)
- [ ] Promotional campaigns (sales, special offers)
- [ ] Event invitations (car shows, open house)
- [ ] Educational content (BMW maintenance tips)

**Technical Decision: Email Platform**

**Option 1: Resend (Current)**
- ✅ Already integrated
- ✅ Developer-friendly API
- ✅ Good deliverability
- ❌ Limited marketing features
- ❌ No visual email builder

**Option 2: Mailchimp**
- ✅ Industry standard
- ✅ Visual email builder
- ✅ Advanced segmentation
- ✅ A/B testing
- ❌ More expensive

**Option 3: SendGrid**
- ✅ Powerful API
- ✅ Marketing Campaigns feature
- ✅ Good pricing
- ❌ Complex setup

**Recommendation**: Add Mailchimp for marketing emails, keep Resend for transactional emails.

**Technical Tasks:**
- [ ] Set up Mailchimp account
- [ ] Create signup forms
- [ ] Build API integration for user sync
- [ ] Design email templates (match brand)
- [ ] Set up audience segments
- [ ] Create automated workflows
- [ ] Implement tracking pixels
- [ ] Build preference center
- [ ] GDPR compliance (unsubscribe, data export)

**Files to Create:**
- `website/components/marketing/NewsletterSignup.tsx`
- `website/components/marketing/EmailPopup.tsx`
- `website/app/api/newsletter/subscribe/route.ts`
- `website/app/preferences/page.tsx`
- `website/lib/email/mailchimp.ts`

**Files to Modify:**
- `website/components/layout/footer.tsx`
- `website/app/layout.tsx` (add popup)

**Audience Segments:**
- New subscribers (< 7 days)
- Active users (visited in last 30 days)
- Vehicle browsers (viewed 3+ vehicles)
- Parts buyers (purchased from Shopify)
- Garage users (saved vehicles)
- Service customers (submitted service request)
- Sell inquiries (submitted sell form)

---

### Story 4: Customer Reviews and Testimonials

**As a** potential customer  
**I want to** read reviews from other customers  
**So that** I can trust the business and make informed decisions

**Acceptance Criteria:**

**Vehicle Reviews:**
- [ ] "Write a Review" button on vehicle detail page (after purchase)
- [ ] Review form: Rating (1-5 stars), Title, Comment, Photos
- [ ] Reviews display on vehicle page
- [ ] Sort reviews: Most Recent, Highest Rated, Lowest Rated
- [ ] Helpful/Not Helpful voting
- [ ] Admin moderation (approve/reject)
- [ ] Verified purchase badge

**Service Reviews:**
- [ ] Review prompt after service completion (email)
- [ ] Service reviews on services page
- [ ] Display aggregate rating (e.g., 4.8/5 from 127 reviews)

**Testimonials:**
- [ ] Featured testimonials on homepage
- [ ] Testimonials page with all reviews
- [ ] Video testimonials (YouTube embeds)
- [ ] Customer stories (blog-style)

**Third-Party Reviews:**
- [ ] Google Reviews widget
- [ ] Yelp reviews integration
- [ ] Facebook reviews
- [ ] Aggregate rating schema markup (SEO)

**Technical Tasks:**
- [ ] Create Review database table
- [ ] Build review submission form
- [ ] Build review display component
- [ ] Admin review moderation interface
- [ ] Email review request automation
- [ ] Integrate Google Reviews API
- [ ] Add schema.org markup for reviews
- [ ] Photo upload for reviews (Vercel Blob)

**Database Schema:**
```sql
CREATE TABLE "Review" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "itemType" TEXT NOT NULL, -- 'vehicle' | 'service' | 'general'
  "itemId" TEXT,
  "rating" INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  "title" TEXT NOT NULL,
  "comment" TEXT NOT NULL,
  "photos" TEXT[], -- array of URLs
  "isVerified" BOOLEAN DEFAULT false,
  "status" TEXT DEFAULT 'pending', -- 'pending' | 'approved' | 'rejected'
  "helpfulCount" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE TABLE "ReviewVote" (
  "id" TEXT PRIMARY KEY,
  "reviewId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "isHelpful" BOOLEAN NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE,
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
  UNIQUE ("reviewId", "userId")
);
```

**Files to Create:**
- `website/components/reviews/ReviewForm.tsx`
- `website/components/reviews/ReviewList.tsx`
- `website/components/reviews/ReviewCard.tsx`
- `website/components/reviews/StarRating.tsx`
- `website/app/api/reviews/route.ts`
- `website/app/api/reviews/[id]/vote/route.ts`
- `website/app/reviews/page.tsx`
- `website/lib/db/queries/reviews.ts`
- `data/src/components/ReviewModeration.tsx`

**Files to Modify:**
- `website/app/vehicles/[slug]/page.tsx`
- `website/app/services/[slug]/page.tsx`
- `website/app/page.tsx` (add testimonials)
- `website/prisma/schema.prisma`

**Schema Markup Example:**
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "2024 BMW M3 Competition",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "12"
  },
  "review": [
    {
      "@type": "Review",
      "author": "John Doe",
      "datePublished": "2024-01-15",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5"
      },
      "reviewBody": "Amazing car, excellent service!"
    }
  ]
}
```

---

## Design Considerations

### User Experience
- Make chat widget unobtrusive but discoverable
- Comparison tool should be intuitive (max 3 vehicles)
- Email signup should offer clear value
- Reviews should be easy to write and read

### Trust & Safety
- Moderate reviews before publishing
- Verify purchases for vehicle reviews
- Prevent spam and fake reviews
- Display both positive and negative reviews

### Performance
- Lazy load chat widget (don't block page load)
- Optimize comparison page for large datasets
- Cache review aggregations
- Async email sending (queue-based)

---

## Testing Requirements

- [ ] E2E test: Chat widget interaction
- [ ] E2E test: Compare 3 vehicles
- [ ] E2E test: Submit review
- [ ] Integration test: Email subscription flow
- [ ] Load test: Email sending at scale
- [ ] Accessibility audit for all new components

---

## Success Metrics

### Live Chat
- **Response Time**: < 2 minutes average
- **Resolution Rate**: > 80% resolved in first conversation
- **Satisfaction**: > 4.5/5 CSAT score
- **Conversion**: 20%+ of chat users convert

### Comparison Tool
- **Usage**: 15%+ of vehicle viewers use comparison
- **Engagement**: Average 2.5 vehicles compared
- **Conversion**: 2x higher conversion for comparison users

### Email Marketing
- **List Growth**: 500+ new subscribers/month
- **Open Rate**: > 25%
- **Click Rate**: > 3%
- **Unsubscribe Rate**: < 0.5%
- **Revenue**: $10k+ attributed to email campaigns

### Reviews
- **Volume**: 50+ reviews in first 3 months
- **Average Rating**: > 4.5/5
- **Conversion Lift**: 15%+ higher conversion on pages with reviews

---

## Compliance & Legal

- [ ] GDPR compliance (email consent, data export/delete)
- [ ] CAN-SPAM compliance (unsubscribe, physical address)
- [ ] CCPA compliance (California privacy rights)
- [ ] Review guidelines and terms
- [ ] Chat privacy policy
- [ ] Cookie consent for tracking

---

## Documentation Needs

- [ ] Chat widget user guide
- [ ] Comparison tool user guide
- [ ] Email marketing playbook
- [ ] Review moderation guidelines
- [ ] Staff training for chat support

---

## Future Enhancements

- AI chatbot for common questions
- Video reviews
- Review rewards program (incentivize reviews)
- SMS marketing
- Push notifications (web push)
- Customer loyalty program
- Referral program
