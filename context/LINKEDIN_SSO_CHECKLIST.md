# LinkedIn SSO Implementation Checklist

**Issue:** PROD-15287  
**Developer:** _____________  
**Start Date:** _____________  
**Target Completion:** _____________  

---

## Phase 1: LinkedIn Developer Setup ⏱️ 30 min

### LinkedIn App Creation
- [ ] Access LinkedIn Developer Portal (https://www.linkedin.com/developers/apps)
- [ ] Click "Create app"
- [ ] Enter app details:
  - [ ] App name: "Enthusiast Auto Group"
  - [ ] LinkedIn Page: Associate with EAG company page (if available)
  - [ ] App logo: Upload EAG logo (400x400px minimum)
  - [ ] Privacy policy URL: `https://enthusiastauto.com/privacy`
  - [ ] Terms of service URL: `https://enthusiastauto.com/terms`
- [ ] Submit app for review

### OAuth Configuration
- [ ] Navigate to Products → Request "Sign In with LinkedIn using OpenID Connect"
- [ ] Wait for approval (usually instant for OIDC)
- [ ] Navigate to Auth → Redirect URLs
- [ ] Add redirect URLs:
  - [ ] Production: `https://enthusiastauto.com/api/auth/callback/linkedin`
  - [ ] Staging: `https://staging.enthusiastauto.com/api/auth/callback/linkedin`
  - [ ] Local dev: `http://localhost:3000/api/auth/callback/linkedin`
- [ ] Verify scopes: `openid`, `profile`, `email`
- [ ] Save changes

### Credentials
- [ ] Copy Client ID from Auth tab
- [ ] Copy Client Secret from Auth tab
- [ ] Store credentials securely (1Password/Vercel)

### Environment Variables
- [ ] Add to Vercel project settings (Production):
  ```
  LINKEDIN_CLIENT_ID=_______________
  LINKEDIN_CLIENT_SECRET=_______________
  ```
- [ ] Add to Vercel project settings (Preview/Staging)
- [ ] Add to local `.env.local`:
  ```
  LINKEDIN_CLIENT_ID=_______________
  LINKEDIN_CLIENT_SECRET=_______________
  ```
- [ ] Restart local dev server to load new env vars

---

## Phase 2: Code Implementation ⏱️ 2-3 hours

### 2.1 Update NextAuth Configuration
**File:** `/workspace/website/lib/auth/config.ts`

- [ ] Import LinkedIn provider:
  ```typescript
  import LinkedInProvider from "next-auth/providers/linkedin";
  ```
- [ ] Add LinkedIn to providers array (after Google, before Credentials)
- [ ] Configure LinkedIn provider:
  ```typescript
  LinkedInProvider({
    clientId: process.env.LINKEDIN_CLIENT_ID!,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
    authorization: {
      params: {
        scope: "openid profile email",
      },
    },
    wellKnown: "https://www.linkedin.com/oauth/.well-known/openid-configuration",
  }),
  ```
- [ ] Verify callbacks don't need changes (existing OAuth logic should handle LinkedIn)
- [ ] Save file

### 2.2 Update Sign-In Page
**File:** `/workspace/website/app/auth/signin/page.tsx`

- [ ] Import LinkedIn icon:
  ```typescript
  import { Chrome, Loader2, Linkedin } from "lucide-react";
  ```
- [ ] Update `handleSocialLogin` function signature:
  ```typescript
  async function handleSocialLogin(provider: "google" | "linkedin")
  ```
- [ ] Update error message in catch block to handle "linkedin"
- [ ] Add LinkedIn button after Google button (before divider):
  ```typescript
  <Button
    type="button"
    variant="outline"
    className="w-full"
    onClick={() => handleSocialLogin("linkedin")}
    disabled={isLoading}
    aria-label="Sign in with LinkedIn"
  >
    {isLoading && socialProvider === "linkedin" ? (
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
    ) : (
      <Linkedin className="mr-2 h-4 w-4" />
    )}
    Sign in with LinkedIn
  </Button>
  ```
- [ ] Verify button spacing (12px gap between buttons)
- [ ] Save file

### 2.3 Update Sign-Up Page
**File:** `/workspace/website/app/auth/signup/page.tsx`

- [ ] Import LinkedIn icon
- [ ] Update `handleSocialLogin` function signature
- [ ] Add LinkedIn button (same as sign-in page)
- [ ] Update button text to "Sign up with LinkedIn"
- [ ] Save file

### 2.4 Code Review
- [ ] Run TypeScript check: `cd website && pnpm tsc --noEmit`
- [ ] Run linter: `cd website && pnpm prettier:check`
- [ ] Fix any type errors or linting issues
- [ ] Verify no console errors in dev server

---

## Phase 3: Testing ⏱️ 2-3 hours

### 3.1 Unit Tests
**File:** `/workspace/website/lib/auth/__tests__/oauth-config.test.ts`

- [ ] Add test: "should configure LinkedIn OAuth provider"
- [ ] Add test: "should request minimal LinkedIn scopes"
- [ ] Update test: "should have 3 total providers" (change from 2 to 3)
- [ ] Run tests: `cd website && pnpm test`
- [ ] Verify all tests pass
- [ ] Fix any failing tests

### 3.2 Local Integration Testing

**Test 1: New User Sign-Up**
- [ ] Start local dev server: `cd website && pnpm dev`
- [ ] Navigate to http://localhost:3000/auth/signin
- [ ] Verify LinkedIn button appears
- [ ] Click "Sign in with LinkedIn"
- [ ] Authorize on LinkedIn (use test account)
- [ ] Verify redirect to `/account`
- [ ] Check database: User created with emailVerified set
- [ ] Check database: Account record with provider="linkedin"

**Test 2: Existing User Sign-In**
- [ ] Sign out
- [ ] Click "Sign in with LinkedIn" again
- [ ] Verify immediate sign-in (no account creation)
- [ ] Verify redirect to `/account`

**Test 3: Account Conflict**
- [ ] Create new account via email/password (different email)
- [ ] Sign out
- [ ] Try to sign in with LinkedIn (same email as email/password account)
- [ ] Verify error message: "Email already registered with a different sign-in method"

**Test 4: Profile Data Sync**
- [ ] Sign in with LinkedIn
- [ ] Navigate to `/account/profile`
- [ ] Verify name matches LinkedIn profile
- [ ] Verify profile image appears (if LinkedIn has one)
- [ ] Check browser DevTools → Application → Cookies
- [ ] Verify session cookie exists

**Test 5: Session Persistence**
- [ ] Sign in with LinkedIn
- [ ] Close browser completely
- [ ] Reopen browser and navigate to http://localhost:3000/account
- [ ] Verify still signed in (session persists)

**Test 6: Error Handling**
- [ ] Click "Sign in with LinkedIn"
- [ ] On LinkedIn authorization page, click "Cancel"
- [ ] Verify error message displayed
- [ ] Verify user remains on sign-in page

**Test 7: Mobile Responsive**
- [ ] Open Chrome DevTools → Toggle device toolbar
- [ ] Test on iPhone SE (375px)
- [ ] Test on iPad (768px)
- [ ] Verify LinkedIn button is full-width and readable
- [ ] Verify button spacing is appropriate

### 3.3 Staging Environment Testing

- [ ] Deploy to staging: Merge to staging branch
- [ ] Verify LinkedIn button appears on staging
- [ ] Test sign-up flow on staging
- [ ] Test sign-in flow on staging
- [ ] Verify database records created correctly
- [ ] Test on real mobile device (iOS Safari)
- [ ] Test on real mobile device (Android Chrome)

### 3.4 Cross-Browser Testing

- [ ] Chrome (latest): Sign in with LinkedIn
- [ ] Firefox (latest): Sign in with LinkedIn
- [ ] Safari (latest): Sign in with LinkedIn
- [ ] Edge (latest): Sign in with LinkedIn
- [ ] iOS Safari: Sign in with LinkedIn
- [ ] Android Chrome: Sign in with LinkedIn

### 3.5 Accessibility Testing

- [ ] Keyboard navigation: Tab to LinkedIn button
- [ ] Keyboard navigation: Press Enter to activate
- [ ] Screen reader: Verify button label is read correctly
- [ ] Focus indicator: Verify visible focus ring on button
- [ ] Color contrast: Verify button meets WCAG AA standards

---

## Phase 4: Documentation & Deployment ⏱️ 1 hour

### 4.1 Documentation Updates

- [ ] Update `/workspace/context/ARCHITECTURE.md`:
  - [ ] Change "LinkedIn OAuth (planned)" to "LinkedIn OAuth"
- [ ] Update `/workspace/context/ROADMAP.md`:
  - [ ] Move LinkedIn SSO from "Planned" to "Shipped"
  - [ ] Add completion date
- [ ] Update `/workspace/README.md` (if auth section exists):
  - [ ] Document LinkedIn OAuth setup steps
  - [ ] Add environment variable requirements
- [ ] Update privacy policy (if needed):
  - [ ] Mention LinkedIn data usage
  - [ ] Specify data collected: name, email, profile picture

### 4.2 Pre-Deployment Checklist

- [ ] All unit tests passing
- [ ] All integration tests completed on staging
- [ ] LinkedIn app approved and verified
- [ ] Environment variables set in Vercel (production)
- [ ] Privacy policy reviewed and updated
- [ ] Terms of service reviewed
- [ ] No TypeScript errors
- [ ] No linting errors
- [ ] No console errors in browser

### 4.3 Production Deployment

- [ ] Create pull request to `main` branch
- [ ] Request code review from team member
- [ ] Address review feedback
- [ ] Merge PR to `main`
- [ ] Verify Vercel auto-deploy triggered
- [ ] Monitor deployment logs for errors
- [ ] Wait for deployment to complete

### 4.4 Post-Deployment Verification

- [ ] Visit https://enthusiastauto.com/auth/signin
- [ ] Verify LinkedIn button appears
- [ ] Test LinkedIn OAuth flow on production
- [ ] Sign up with test account
- [ ] Verify redirect to `/account`
- [ ] Check production database for LinkedIn account record
- [ ] Sign out and sign in again
- [ ] Verify session persistence

### 4.5 Monitoring Setup

- [ ] Add custom event to Google Analytics 4: "linkedin_signin"
- [ ] Add custom event to Google Analytics 4: "linkedin_signup"
- [ ] Create Vercel Analytics dashboard for OAuth metrics
- [ ] Set up error alerts for OAuth failures
- [ ] Monitor error logs for 24 hours

---

## Phase 5: Launch & Marketing ⏱️ 1-2 hours

### 5.1 Internal Announcement

- [ ] Notify team via Slack/email
- [ ] Share testing instructions
- [ ] Request team members to test LinkedIn sign-in
- [ ] Gather initial feedback

### 5.2 User Announcement (Optional)

- [ ] Draft email newsletter announcement
- [ ] Draft social media posts (Twitter, LinkedIn, Instagram)
- [ ] Schedule posts for launch day
- [ ] Update marketing materials (if applicable)

### 5.3 Monitoring & Iteration

**Week 1:**
- [ ] Check error logs daily
- [ ] Monitor LinkedIn sign-up count
- [ ] Respond to user feedback
- [ ] Fix any critical bugs

**Week 2-4:**
- [ ] Review adoption metrics
- [ ] Compare LinkedIn vs Google adoption rates
- [ ] Analyze conversion funnel
- [ ] Identify improvement opportunities

**Month 1-3:**
- [ ] Calculate LinkedIn adoption rate (target: 10-15%)
- [ ] Measure sign-up completion rate improvement (target: 5-10%)
- [ ] Review OAuth error rate (target: <1%)
- [ ] Collect user feedback via surveys

---

## Success Criteria

### Week 1 (Internal Testing)
- [ ] ✅ 5+ successful LinkedIn sign-ins by team
- [ ] ✅ Zero critical bugs
- [ ] ✅ OAuth flow completes in <5 seconds

### Week 2-4 (Beta Launch)
- [ ] ✅ 10+ LinkedIn sign-ups
- [ ] ✅ <1% OAuth error rate
- [ ] ✅ No user complaints about LinkedIn sign-in

### Month 1-3 (Full Launch)
- [ ] ✅ 10-15% of new sign-ups use LinkedIn
- [ ] ✅ 5-10% improvement in sign-up completion rate
- [ ] ✅ Positive user feedback

---

## Rollback Plan

If critical issues arise:

1. **Immediate Rollback:**
   - [ ] Revert PR in GitHub
   - [ ] Redeploy previous version via Vercel
   - [ ] Verify LinkedIn button removed
   - [ ] Notify users via status page

2. **Investigation:**
   - [ ] Review error logs
   - [ ] Identify root cause
   - [ ] Test fix locally
   - [ ] Test fix on staging

3. **Re-deployment:**
   - [ ] Apply fix
   - [ ] Re-test all scenarios
   - [ ] Deploy to production
   - [ ] Monitor closely

---

## Notes & Observations

**Issues encountered:**
- 
- 
- 

**Improvements for future:**
- 
- 
- 

**Feedback from users:**
- 
- 
- 

---

## Sign-Off

- [ ] **Developer:** Implementation complete and tested
- [ ] **QA:** All test scenarios passed
- [ ] **Product Owner:** Feature meets acceptance criteria
- [ ] **DevOps:** Monitoring and alerts configured

**Completion Date:** _____________  
**Deployed By:** _____________  
**Approved By:** _____________  

---

**Status:** ⏳ Not Started | 🚧 In Progress | ✅ Complete
