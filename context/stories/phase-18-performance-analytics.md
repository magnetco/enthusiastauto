# Phase 18: Performance & Analytics

**Epic**: Optimize site performance and implement comprehensive analytics tracking

**Priority**: High  
**Estimated Effort**: Medium (2-3 weeks)  
**Dependencies**: All previous phases

---

## Overview

Conduct comprehensive performance audit, optimize Core Web Vitals, implement analytics tracking, and set up conversion monitoring to improve user experience and measure business impact.

---

## User Stories

### Story 1: Image Optimization Audit

**As a** site visitor  
**I want to** experience fast page loads with optimized images  
**So that** I can browse vehicles and products without delays

**Acceptance Criteria:**
- [ ] All images use Next.js Image component with proper sizing
- [ ] Images served in modern formats (WebP, AVIF)
- [ ] Lazy loading for below-the-fold images
- [ ] Responsive images with srcset for different screen sizes
- [ ] Blur-up placeholders for all images
- [ ] CDN caching configured correctly
- [ ] Image dimensions specified to prevent layout shift
- [ ] Audit report documenting improvements

**Technical Tasks:**
- [ ] Audit all image usage across site
- [ ] Replace `<img>` tags with `<Image>` component
- [ ] Configure Sanity image pipeline for optimal formats
- [ ] Set up proper image sizing strategy
- [ ] Add blur placeholders using Sanity LQIP
- [ ] Configure Vercel Image Optimization settings
- [ ] Test on slow 3G connection

**Files to Audit:**
- `website/components/vehicles/VehicleCard.tsx`
- `website/components/vehicles/VehicleGallery.tsx`
- `website/components/product-card.tsx`
- `website/app/page.tsx` (hero images)
- All Sanity image queries

**Performance Targets:**
- Largest Contentful Paint (LCP): < 2.5s
- Cumulative Layout Shift (CLS): < 0.1
- First Contentful Paint (FCP): < 1.8s

---

### Story 2: Core Web Vitals Improvements

**As a** site owner  
**I want to** achieve excellent Core Web Vitals scores  
**So that** the site ranks well in search and provides great UX

**Acceptance Criteria:**
- [ ] LCP < 2.5s on mobile and desktop
- [ ] FID/INP < 100ms on mobile and desktop
- [ ] CLS < 0.1 on all pages
- [ ] Green scores in PageSpeed Insights
- [ ] Green scores in Vercel Speed Insights
- [ ] Performance monitoring dashboard
- [ ] Automated performance testing in CI/CD

**Technical Tasks:**

**LCP Optimization:**
- [ ] Preload critical images and fonts
- [ ] Optimize server response time (TTFB < 600ms)
- [ ] Implement streaming SSR where applicable
- [ ] Remove render-blocking resources
- [ ] Optimize critical CSS

**INP/FID Optimization:**
- [ ] Reduce JavaScript bundle size
- [ ] Code split by route
- [ ] Defer non-critical scripts
- [ ] Optimize event handlers
- [ ] Use web workers for heavy computations

**CLS Optimization:**
- [ ] Set explicit dimensions for all images and iframes
- [ ] Reserve space for dynamic content
- [ ] Avoid inserting content above existing content
- [ ] Use CSS containment where appropriate
- [ ] Optimize font loading with font-display: swap

**Files to Modify:**
- `website/next.config.js` (optimization settings)
- `website/app/layout.tsx` (font loading)
- `website/lib/sanity/image.ts` (image optimization)
- Various component files for layout stability

**Next.js Config Enhancements:**
```javascript
module.exports = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@heroicons/react'],
  },
}
```

---

### Story 3: Analytics Dashboard Integration

**As a** business owner  
**I want to** track user behavior and site performance  
**So that** I can make data-driven decisions

**Acceptance Criteria:**
- [ ] Google Analytics 4 integration
- [ ] Custom event tracking for key actions:
  - Vehicle views
  - Product views
  - Add to cart
  - Checkout initiated
  - Favorite added
  - Service request submitted
  - Sell inquiry submitted
  - Search queries
- [ ] User flow tracking (page sequences)
- [ ] Bounce rate and engagement metrics
- [ ] Traffic source attribution
- [ ] Device and browser analytics
- [ ] Real-time dashboard access
- [ ] Privacy-compliant (GDPR, CCPA)

**Technical Tasks:**
- [ ] Set up GA4 property
- [ ] Install gtag.js or Google Tag Manager
- [ ] Create custom event schema
- [ ] Implement event tracking throughout app
- [ ] Set up enhanced ecommerce tracking
- [ ] Configure conversion goals
- [ ] Add cookie consent banner
- [ ] Create analytics documentation

**Files to Create:**
- `website/lib/analytics/gtag.ts`
- `website/lib/analytics/events.ts`
- `website/components/analytics/CookieConsent.tsx`

**Files to Modify:**
- `website/app/layout.tsx` (add analytics script)
- `website/components/cart/add-to-cart.tsx` (track add to cart)
- `website/components/favorites/FavoriteButton.tsx` (track favorites)
- All form submission handlers

**Event Tracking Example:**
```typescript
// lib/analytics/events.ts
export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params)
  }
}

// Usage
trackEvent('view_vehicle', {
  vehicle_id: vehicle.id,
  vehicle_name: vehicle.title,
  price: vehicle.price,
  chassis: vehicle.chassis,
})
```

---

### Story 4: Conversion Tracking Setup

**As a** business owner  
**I want to** measure conversion rates for key business goals  
**So that** I can optimize marketing and user experience

**Acceptance Criteria:**
- [ ] Track conversion funnels:
  - Vehicle inquiry funnel
  - Parts purchase funnel
  - Service request funnel
  - Sell submission funnel
- [ ] Revenue tracking for Shopify purchases
- [ ] Lead value assignment for inquiries
- [ ] A/B test framework for optimization
- [ ] Conversion rate dashboard
- [ ] Attribution modeling (first touch, last touch, multi-touch)
- [ ] ROI tracking for marketing channels

**Technical Tasks:**
- [ ] Set up conversion goals in GA4
- [ ] Implement enhanced ecommerce tracking
- [ ] Configure Shopify → GA4 integration
- [ ] Set up UTM parameter tracking
- [ ] Create conversion funnel reports
- [ ] Implement server-side tracking for critical events
- [ ] Set up Google Ads conversion tracking
- [ ] Configure Meta Pixel for Facebook/Instagram ads

**Conversion Goals:**
1. **Vehicle Inquiry**: Contact form submission on vehicle page
2. **Parts Purchase**: Shopify checkout completion
3. **Service Request**: Service form submission
4. **Sell Submission**: Sell form completion
5. **Account Creation**: User signup
6. **Garage Addition**: First vehicle added to garage

**Files to Create:**
- `website/lib/analytics/conversions.ts`
- `website/app/api/analytics/conversion/route.ts`

**Files to Modify:**
- `website/app/api/contact/vehicle/route.ts` (track inquiries)
- `website/app/api/services/request/route.ts` (track requests)
- `website/app/api/contact/sell/route.ts` (track submissions)
- `website/components/cart/modal.tsx` (track checkout)

**Server-Side Tracking Example:**
```typescript
// Track conversion server-side for reliability
await fetch('https://www.google-analytics.com/mp/collect', {
  method: 'POST',
  body: JSON.stringify({
    client_id: userId,
    events: [{
      name: 'service_request_submitted',
      params: {
        service_type: serviceType,
        vehicle_id: vehicleId,
        value: estimatedValue,
        currency: 'USD',
      },
    }],
  }),
})
```

---

## Design Considerations

### Performance
- Minimize analytics script impact on page load
- Use async/defer for third-party scripts
- Batch events to reduce network requests
- Implement request queuing for offline support

### Privacy
- Cookie consent before tracking
- Anonymize IP addresses
- Respect Do Not Track headers
- GDPR-compliant data retention
- Clear privacy policy

### Data Quality
- Validate event parameters
- Filter bot traffic
- Deduplicate events
- Handle edge cases (ad blockers, script failures)

---

## Testing Requirements

- [ ] Lighthouse CI in GitHub Actions
- [ ] Performance regression tests
- [ ] Analytics event validation
- [ ] Cross-browser performance testing
- [ ] Mobile performance testing (real devices)
- [ ] Conversion funnel testing

---

## Success Metrics

### Performance
- **LCP**: < 2.5s (target: 1.5s)
- **INP**: < 100ms (target: 50ms)
- **CLS**: < 0.1 (target: 0.05)
- **PageSpeed Score**: > 90 (mobile and desktop)
- **Time to Interactive**: < 3.5s

### Analytics
- **Tracking Coverage**: 100% of key events
- **Data Accuracy**: < 5% discrepancy vs. server logs
- **Conversion Attribution**: 90%+ of conversions attributed
- **Dashboard Adoption**: All stakeholders using analytics weekly

---

## Tools & Services

- **Performance Monitoring**: Vercel Speed Insights, Lighthouse CI
- **Analytics**: Google Analytics 4, Google Tag Manager
- **Error Tracking**: Consider Sentry for error monitoring
- **A/B Testing**: Consider Vercel Edge Config or Google Optimize
- **Heatmaps**: Consider Hotjar or Microsoft Clarity (optional)

---

## Documentation Needs

- [ ] Performance optimization guide
- [ ] Analytics event catalog
- [ ] Conversion tracking setup guide
- [ ] Dashboard user guide for stakeholders
- [ ] Privacy policy updates

---

## Future Enhancements

- Real User Monitoring (RUM) dashboard
- Automated performance budgets
- Predictive analytics for inventory
- Customer lifetime value tracking
- Advanced segmentation and cohort analysis
