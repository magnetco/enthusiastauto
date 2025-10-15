# Deployment Guide

**Project:** Enthusiast Auto Ecommerce Site
**Platform:** Vercel (Recommended)
**Framework:** Next.js 15
**Generated:** 2025-10-14

---

## Overview

This application is optimized for deployment on **Vercel**, the platform created by the makers of Next.js. Vercel provides:

- Zero-configuration deployment
- Automatic HTTPS/SSL
- Global CDN
- Edge Functions
- Preview deployments
- Built-in analytics

**Alternative Platforms:** Docker, AWS, Google Cloud, self-hosted (requires additional configuration)

---

## Prerequisites

### Required

- **GitHub Account** - For repository hosting
- **Vercel Account** - Sign up at https://vercel.com
- **Shopify Store** - With Storefront API enabled
- **Domain Name** (Optional) - For custom domain

### Before Deployment

✅ **Checklist:**

- [ ] Code pushed to GitHub repository
- [ ] `.env` file **NOT** committed (in `.gitignore`)
- [ ] Shopify store configured
- [ ] Shopify Storefront API access token generated
- [ ] Production build tested locally (`pnpm build && pnpm start`)
- [ ] All tests passing (`pnpm test`)

---

## Deployment Methods

### Method 1: Vercel Dashboard (Recommended)

**Best for:** First-time deployment, quickest setup

**Steps:**

1. **Connect GitHub Repository**

   - Go to https://vercel.com/new
   - Click "Import Project"
   - Select your GitHub repository
   - Authorize Vercel to access the repo

2. **Configure Project**

   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `./` (default)
   - **Build Command:** `pnpm build` (auto-detected)
   - **Output Directory:** `.next` (auto-detected)
   - **Install Command:** `pnpm install` (auto-detected)

3. **Add Environment Variables**

   Click "Environment Variables" and add:

   ```
   SHOPIFY_STORE_DOMAIN=[your-store].myshopify.com
   SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_token_here
   SITE_NAME=Your Store Name
   COMPANY_NAME=Your Company Name
   SHOPIFY_REVALIDATION_SECRET=your_secret_key
   ```

   **Important:** Add to all environments (Production, Preview, Development)

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build
   - Your site will be live at `https://your-project.vercel.app`

---

### Method 2: Vercel CLI

**Best for:** Command-line workflow, CI/CD integration

**Installation:**

```bash
npm install -g vercel
```

**Initial Setup:**

```bash
# Login to Vercel
vercel login

# Link project to Vercel
vercel link

# Set environment variables (one-time)
vercel env add SHOPIFY_STORE_DOMAIN
vercel env add SHOPIFY_STOREFRONT_ACCESS_TOKEN
vercel env add SITE_NAME
vercel env add COMPANY_NAME
vercel env add SHOPIFY_REVALIDATION_SECRET
```

**Deploy to Preview:**

```bash
# Deploy preview (non-production)
vercel
```

**Deploy to Production:**

```bash
# Deploy to production
vercel --prod
```

**Pull Environment Variables:**

```bash
# Download env vars for local development
vercel env pull
```

---

### Method 3: Git Integration (Automatic)

**Best for:** Continuous deployment, team collaboration

**Setup:**

1. **Connect GitHub** (via Method 1)

2. **Automatic Deployments:**

   - **Push to `main` branch** → Production deployment
   - **Push to other branches** → Preview deployment
   - **Pull requests** → Preview deployment with unique URL

3. **Deployment Flow:**
   ```
   git push origin main
       ↓
   Vercel detects push
       ↓
   Automatic build starts
       ↓
   Tests run (if configured)
       ↓
   Deploy to production
       ↓
   Live at https://your-domain.com
   ```

---

## Environment Variables

### Required Variables

**File:** `.env.example` (template)

```env
# Shopify Configuration
SHOPIFY_STORE_DOMAIN="your-store.myshopify.com"
SHOPIFY_STOREFRONT_ACCESS_TOKEN="your_storefront_access_token"

# Site Configuration
SITE_NAME="Your Store Name"
COMPANY_NAME="Your Company Name"

# Revalidation (for ISR webhooks)
SHOPIFY_REVALIDATION_SECRET="random_secure_string"
```

### Setting Environment Variables

**Via Vercel Dashboard:**

1. Go to Project Settings → Environment Variables
2. Add each variable
3. Select environments (Production, Preview, Development)
4. Save

**Via Vercel CLI:**

```bash
vercel env add SHOPIFY_STORE_DOMAIN production
# Enter value when prompted

vercel env add SHOPIFY_STOREFRONT_ACCESS_TOKEN production
# Paste token (hidden input)
```

### Environment-Specific Variables

**Production:**

```env
SHOPIFY_STORE_DOMAIN=prod-store.myshopify.com
SITE_NAME=Production Store
```

**Preview/Staging:**

```env
SHOPIFY_STORE_DOMAIN=staging-store.myshopify.com
SITE_NAME=Staging Store
```

---

## Build Configuration

### Next.js Configuration

**File:** `next.config.ts`

```typescript
export default {
  experimental: {
    ppr: true, // Partial Prerendering
    inlineCss: true, // Inline critical CSS
    useCache: true, // Enable caching
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        pathname: "/s/files/**",
      },
    ],
  },
};
```

**Key Settings:**

- **Partial Prerendering (PPR):** Combines static and dynamic rendering
- **Image Optimization:** Automatic AVIF/WebP conversion
- **Remote Patterns:** Allow Shopify CDN images

### Build Command

**Default:**

```bash
pnpm build
```

**Build Process:**

1. TypeScript compilation
2. Next.js page generation
3. Static asset optimization
4. Image optimization
5. Bundle creation

**Build Output:**

- `.next/` directory
- Static assets in `.next/static/`
- Server functions in `.next/server/`

---

## Deployment Architecture

### Vercel Infrastructure

```
GitHub Repository
    ↓ Git Push
Vercel Build System
    ↓ Build & Optimize
Vercel Edge Network (Global CDN)
    ├── Static Assets (cached globally)
    ├── Server Components (Edge Functions)
    └── API Routes (Serverless Functions)
    ↓
End Users (Worldwide)
```

### Caching Strategy

**Static Assets:**

- Cached indefinitely on CDN
- Cache-busting via content hashes

**Server-Rendered Pages:**

- ISR (Incremental Static Regeneration)
- On-demand revalidation via webhook
- Stale-while-revalidate pattern

**API Routes:**

- No caching (real-time)
- Edge runtime for low latency

### Edge Functions

**Next.js 15 Features:**

- Server Components run on Edge
- Near-instant response times
- Global distribution

**Regions:**

- Automatic multi-region deployment
- Users routed to nearest edge location

---

## Custom Domain Setup

### Adding Custom Domain

**Via Vercel Dashboard:**

1. Go to Project Settings → Domains
2. Enter your domain (e.g., `shop.example.com`)
3. Click "Add"
4. Follow DNS configuration instructions

**DNS Configuration:**

**Option A: CNAME Record (Subdomain)**

```
Type: CNAME
Name: shop
Value: cname.vercel-dns.com
```

**Option B: A Record (Apex Domain)**

```
Type: A
Name: @
Value: 76.76.21.21
```

**Propagation Time:** 24-48 hours (usually faster)

### SSL/HTTPS

**Automatic:**

- Free SSL certificate from Let's Encrypt
- Auto-renewal
- Enabled by default
- No configuration needed

**HTTP → HTTPS Redirect:**
Automatic (enforced by Vercel)

---

## Shopify Integration

### Storefront API Setup

**1. Enable Storefront API:**

- Shopify Admin → Apps → Develop apps
- Create custom app
- Configure Storefront API scopes:
  - `unauthenticated_read_product_listings`
  - `unauthenticated_read_checkouts`
  - `unauthenticated_write_checkouts`

**2. Generate Access Token:**

- Install the app
- Copy Storefront API access token
- Add to Vercel environment variables

### Webhook Configuration

**Purpose:** On-demand ISR revalidation

**Webhook URL:**

```
https://your-domain.com/api/revalidate?secret=YOUR_SECRET
```

**Shopify Admin Setup:**

1. Settings → Notifications → Webhooks
2. Create webhook:
   - **Event:** Products update
   - **Format:** JSON
   - **URL:** `https://your-domain.com/api/revalidate?secret=YOUR_SECRET`
3. Create webhook:
   - **Event:** Collections update
   - **Format:** JSON
   - **URL:** Same as above

**Supported Events:**

- `products/create`
- `products/update`
- `products/delete`
- `collections/create`
- `collections/update`
- `collections/delete`

---

## Performance Optimization

### Pre-Deployment Checklist

**Build Performance:**

- ✅ Remove unused dependencies
- ✅ Optimize images (use WebP/AVIF)
- ✅ Enable code splitting
- ✅ Minimize bundle size

**Runtime Performance:**

- ✅ Use Server Components by default
- ✅ Implement proper caching
- ✅ Lazy load below-the-fold images
- ✅ Minimize client-side JavaScript

### Vercel Analytics

**Enable Analytics:**

1. Go to Project → Analytics
2. Enable Web Vitals
3. Monitor:
   - First Contentful Paint (FCP)
   - Largest Contentful Paint (LCP)
   - Cumulative Layout Shift (CLS)
   - First Input Delay (FID)

**Speed Insights:**

- Real User Monitoring (RUM)
- Core Web Vitals tracking
- Performance scores per page

---

## Monitoring & Logging

### Vercel Logs

**Access Logs:**

1. Go to Project → Deployments
2. Click on deployment
3. View "Functions" tab
4. See real-time logs

**Log Levels:**

- `console.log()` → Info
- `console.error()` → Error
- `console.warn()` → Warning

### Error Tracking

**Recommended Tools:**

- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **Datadog** - APM monitoring

**Setup Sentry (Example):**

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

---

## CI/CD Pipeline

### GitHub Actions (Optional)

**File:** `.github/workflows/deploy.yml`

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 20
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install

      - name: Run tests
        run: pnpm test

      - name: Build
        run: pnpm build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: "--prod"
```

**Note:** Vercel's Git integration already provides CI/CD. GitHub Actions are optional.

---

## Rollback & Recovery

### Instant Rollback

**Via Dashboard:**

1. Go to Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"
4. Instant rollback (no rebuild)

**Via CLI:**

```bash
# List deployments
vercel ls

# Promote specific deployment
vercel promote <deployment-url>
```

### Backup Strategy

**What's Backed Up:**

- All deployments stored indefinitely (Free plan: 100, Pro+: unlimited)
- Environment variables
- Domain configuration
- Build logs

**What's NOT Backed Up:**

- Database (N/A - using Shopify)
- User sessions (cart stored in Shopify)

---

## Security Best Practices

### Environment Variables

**Do:**

- ✅ Store secrets in Vercel env vars
- ✅ Use different tokens for prod/staging
- ✅ Rotate tokens regularly
- ✅ Never log secrets

**Don't:**

- ❌ Commit `.env` to Git
- ❌ Hardcode secrets in code
- ❌ Expose secrets in client-side code
- ❌ Share tokens publicly

### HTTPS/SSL

**Automatic:**

- SSL certificates auto-provisioned
- HTTPS enforced by default
- HTTP → HTTPS redirect
- HSTS enabled

### Rate Limiting

**Vercel Edge:**

- DDoS protection included
- Rate limiting available (Enterprise)

**Shopify API:**

- Rate limits enforced by Shopify
- Handle 429 errors gracefully

---

## Troubleshooting

### Build Failures

**Issue:** Build fails with TypeScript errors

**Solution:**

```bash
# Check locally first
pnpm build

# Fix type errors
npx tsc --noEmit
```

---

**Issue:** Out of memory during build

**Solution:**

- Reduce bundle size
- Optimize dependencies
- Use Vercel Pro for more memory

---

**Issue:** Environment variables not loading

**Solution:**

- Verify variables exist in Vercel dashboard
- Check variable names match exactly
- Redeploy after adding variables

---

### Runtime Issues

**Issue:** Images not loading

**Solution:**

- Check `next.config.ts` remote patterns
- Verify Shopify CDN URL format
- Check image URLs in browser console

---

**Issue:** API requests failing

**Solution:**

- Verify Shopify access token
- Check token permissions
- Test API endpoint directly

---

**Issue:** Webhook not working

**Solution:**

- Verify secret matches environment variable
- Check webhook URL in Shopify
- Test webhook with curl:
  ```bash
  curl -X POST "https://your-domain.com/api/revalidate?secret=YOUR_SECRET" \
    -H "X-Shopify-Topic: products/update" \
    -H "Content-Type: application/json" \
    -d '{}'
  ```

---

## Cost Estimation

### Vercel Pricing

**Hobby (Free):**

- **Cost:** $0/month
- **Bandwidth:** 100 GB
- **Build Time:** 100 hours/month
- **Deployments:** Unlimited
- **Team Size:** 1 user

**Pro:**

- **Cost:** $20/month per user
- **Bandwidth:** 1 TB
- **Build Time:** 400 hours/month
- **Deployments:** Unlimited
- **Team Size:** Unlimited
- **Analytics:** Included

**Enterprise:**

- **Cost:** Custom pricing
- **Advanced features:** SLA, SSO, priority support

**Recommendation:** Start with Hobby, upgrade to Pro when needed

---

## Post-Deployment Checklist

**Deployment Complete:**

- [ ] Site accessible at production URL
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active (HTTPS working)
- [ ] All pages loading correctly
- [ ] Images displaying properly
- [ ] Cart functionality working
- [ ] Shopify checkout flow working
- [ ] Analytics/monitoring enabled
- [ ] Webhooks configured and tested
- [ ] Error tracking setup (optional)
- [ ] Performance metrics reviewed

**Team Communication:**

- [ ] Share production URL with team
- [ ] Document deployment process
- [ ] Set up monitoring alerts
- [ ] Schedule first post-launch review

---

## Related Documentation

- **[Development Guide](./development-guide.md)** - Local development setup
- **[Architecture](./architecture.md)** - Deployment architecture
- **[API Contracts](./api-contracts.md)** - Webhook configuration

---

**Document Version:** 1.0
**Last Updated:** 2025-10-14
**Platform:** Vercel
**Deployment Status:** Ready for Production
