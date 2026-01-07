# LinkedIn SSO - Technical Specification

**Issue:** PROD-15287  
**Version:** 1.0  
**Last Updated:** January 7, 2026  

---

## 1. Overview

### 1.1 Objective
Add LinkedIn as a third OAuth 2.0 / OpenID Connect provider to the Enthusiast Auto Group website authentication system.

### 1.2 Scope
- **In Scope:**
  - LinkedIn OAuth provider configuration
  - Sign-in page UI updates
  - Sign-up page UI updates
  - Unit and integration tests
  - Documentation updates

- **Out of Scope:**
  - Account settings page (link/unlink LinkedIn)
  - LinkedIn profile data enrichment (job title, company)
  - LinkedIn sharing integration
  - Facebook OAuth activation (separate story)

### 1.3 Dependencies
- NextAuth.js v5 (beta.29) - already installed
- Lucide React icons - already installed
- LinkedIn Developer account - to be created
- Vercel environment variable access - already have

---

## 2. Architecture

### 2.1 System Context

```
┌─────────────────────────────────────────────────────────┐
│                    User's Browser                       │
│  ┌────────────────────────────────────────────────────┐ │
│  │  /auth/signin page                                 │ │
│  │  - Email/Password form                             │ │
│  │  - Google OAuth button                             │ │
│  │  - LinkedIn OAuth button [NEW]                     │ │
│  └────────────────────────────────────────────────────┘ │
└───────────────────────┬─────────────────────────────────┘
                        │ 1. Click "Sign in with LinkedIn"
                        ▼
┌─────────────────────────────────────────────────────────┐
│              Next.js App (Server-Side)                  │
│  ┌────────────────────────────────────────────────────┐ │
│  │  /api/auth/[...nextauth]/route.ts                  │ │
│  │  - NextAuth.js handler                             │ │
│  │  - Redirects to LinkedIn OAuth                     │ │
│  └────────────────────────────────────────────────────┘ │
└───────────────────────┬─────────────────────────────────┘
                        │ 2. Redirect with client_id, scope, state
                        ▼
┌─────────────────────────────────────────────────────────┐
│                  LinkedIn OAuth 2.0                     │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Authorization Endpoint                            │ │
│  │  https://www.linkedin.com/oauth/v2/authorization   │ │
│  │  - User signs in to LinkedIn                       │ │
│  │  - User authorizes EAG app                         │ │
│  └────────────────────────────────────────────────────┘ │
└───────────────────────┬─────────────────────────────────┘
                        │ 3. Redirect with authorization code
                        ▼
┌─────────────────────────────────────────────────────────┐
│              Next.js App (Server-Side)                  │
│  ┌────────────────────────────────────────────────────┐ │
│  │  /api/auth/callback/linkedin                       │ │
│  │  - Exchange code for access token                  │ │
│  │  - Fetch user profile from LinkedIn                │ │
│  │  - Create/update User record                       │ │
│  │  - Create Account record (provider="linkedin")     │ │
│  │  - Create Session (JWT)                            │ │
│  └────────────────────────────────────────────────────┘ │
└───────────────────────┬─────────────────────────────────┘
                        │ 4. Redirect to /account with session cookie
                        ▼
┌─────────────────────────────────────────────────────────┐
│                    User's Browser                       │
│  ┌────────────────────────────────────────────────────┐ │
│  │  /account page (authenticated)                     │ │
│  │  - User profile displayed                          │ │
│  │  - Session persists for 30 days                    │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Data Flow

```
┌──────────────┐
│ User clicks  │
│ LinkedIn btn │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│ NextAuth.js generates authorization URL:                 │
│ https://www.linkedin.com/oauth/v2/authorization?         │
│   client_id=YOUR_CLIENT_ID&                              │
│   redirect_uri=https://domain/api/auth/callback/linkedin&│
│   scope=openid+profile+email&                            │
│   response_type=code&                                    │
│   state=RANDOM_STATE_TOKEN                               │
└──────┬───────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│ User authorizes on LinkedIn                              │
└──────┬───────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│ LinkedIn redirects to callback:                          │
│ https://domain/api/auth/callback/linkedin?               │
│   code=AUTHORIZATION_CODE&                               │
│   state=RANDOM_STATE_TOKEN                               │
└──────┬───────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│ NextAuth.js validates state (CSRF protection)            │
└──────┬───────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│ NextAuth.js exchanges code for access token:             │
│ POST https://www.linkedin.com/oauth/v2/accessToken       │
│ Body: {                                                  │
│   grant_type: "authorization_code",                      │
│   code: "AUTHORIZATION_CODE",                            │
│   redirect_uri: "https://domain/api/auth/callback/...",  │
│   client_id: "YOUR_CLIENT_ID",                           │
│   client_secret: "YOUR_CLIENT_SECRET"                    │
│ }                                                        │
│ Response: { access_token, expires_in, token_type }       │
└──────┬───────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│ NextAuth.js fetches user profile:                        │
│ GET https://api.linkedin.com/v2/userinfo                 │
│ Headers: { Authorization: "Bearer ACCESS_TOKEN" }        │
│ Response: {                                              │
│   sub: "linkedin_user_id",                               │
│   name: "John Doe",                                      │
│   email: "john@example.com",                             │
│   picture: "https://media.licdn.com/...",                │
│   email_verified: true                                   │
│ }                                                        │
└──────┬───────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│ PrismaAdapter creates/updates database records:          │
│                                                          │
│ User table:                                              │
│   id: "cuid",                                            │
│   email: "john@example.com",                             │
│   name: "John Doe",                                      │
│   image: "https://media.licdn.com/...",                  │
│   emailVerified: NOW()                                   │
│                                                          │
│ Account table:                                           │
│   userId: "cuid",                                        │
│   type: "oauth",                                         │
│   provider: "linkedin",                                  │
│   providerAccountId: "linkedin_user_id",                 │
│   access_token: "ACCESS_TOKEN",                          │
│   expires_at: UNIX_TIMESTAMP                             │
└──────┬───────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│ NextAuth.js creates JWT session:                         │
│ {                                                        │
│   id: "cuid",                                            │
│   email: "john@example.com",                             │
│   name: "John Doe",                                      │
│   provider: "linkedin",                                  │
│   picture: "https://media.licdn.com/..."                 │
│ }                                                        │
│ Signed with NEXTAUTH_SECRET, expires in 30 days          │
└──────┬───────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│ Set session cookie and redirect to /account              │
└──────────────────────────────────────────────────────────┘
```

---

## 3. Implementation Details

### 3.1 LinkedIn Provider Configuration

**File:** `/workspace/website/lib/auth/config.ts`

**Import:**
```typescript
import LinkedInProvider from "next-auth/providers/linkedin";
```

**Provider Configuration:**
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
})
```

**Why these settings?**
- `clientId` / `clientSecret`: LinkedIn app credentials
- `scope`: Minimal permissions (OpenID Connect standard scopes)
- `wellKnown`: OpenID Connect discovery endpoint (auto-configures authorization/token/userinfo URLs)

**No callback changes needed:**
- Existing `signIn` callback already handles OAuth providers
- Existing `jwt` callback already includes provider info
- Existing `session` callback already passes provider to client
- PrismaAdapter automatically creates Account records

### 3.2 Sign-In Page UI

**File:** `/workspace/website/app/auth/signin/page.tsx`

**Import:**
```typescript
import { Chrome, Loader2, Linkedin } from "lucide-react";
```

**Function Signature Update:**
```typescript
async function handleSocialLogin(provider: "google" | "linkedin") {
  setError(null);
  setSuccess(null);
  setIsLoading(true);
  setSocialProvider(provider);

  try {
    await signIn(provider, {
      callbackUrl: callbackUrl || "/",
      redirect: true,
    });
  } catch (err) {
    setError(`Unable to sign in with ${provider === "google" ? "Google" : "LinkedIn"}. Please try again.`);
    setIsLoading(false);
    setSocialProvider(null);
  }
}
```

**LinkedIn Button:**
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

**Button Placement:**
```typescript
{/* Social Login Buttons */}
<div className="space-y-3">
  {/* Google button */}
  <Button ... >Sign in with Google</Button>
  
  {/* LinkedIn button [NEW] */}
  <Button ... >Sign in with LinkedIn</Button>
</div>

{/* Divider */}
<div className="relative">...</div>

{/* Email/Password Form */}
<form>...</form>
```

### 3.3 Sign-Up Page UI

**File:** `/workspace/website/app/auth/signup/page.tsx`

**Changes:**
- Same as sign-in page
- Button text: "Sign up with LinkedIn" (instead of "Sign in")
- All other logic identical

### 3.4 Database Schema

**No changes required.** Existing Prisma schema already supports multiple OAuth providers:

```prisma
model User {
  id            String          @id @default(cuid())
  name          String?
  email         String          @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]       // Multiple OAuth accounts
  // ...
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String  // "oauth"
  provider          String  // "linkedin"
  providerAccountId String  // LinkedIn user ID
  access_token      String? @db.Text
  expires_at        Int?
  // ...
  
  @@unique([provider, providerAccountId])
}
```

**How account linking works:**
1. User signs in with LinkedIn (email: john@example.com)
2. NextAuth checks if User exists with that email
3. If yes: Create new Account record linked to existing User
4. If no: Create new User record, then create Account record

**Edge case: Email conflict**
- If User exists with same email but different provider
- NextAuth returns error: "OAuthAccountNotLinked"
- User sees: "Email already registered with a different sign-in method"
- Solution: User must sign in with original method first

---

## 4. API Specifications

### 4.1 LinkedIn OAuth Endpoints

**Authorization Endpoint:**
```
GET https://www.linkedin.com/oauth/v2/authorization
```

**Query Parameters:**
| Parameter | Value | Description |
|-----------|-------|-------------|
| `response_type` | `code` | OAuth 2.0 authorization code flow |
| `client_id` | `YOUR_CLIENT_ID` | LinkedIn app client ID |
| `redirect_uri` | `https://domain/api/auth/callback/linkedin` | Callback URL |
| `scope` | `openid profile email` | Requested permissions |
| `state` | `RANDOM_STRING` | CSRF protection token |

**Token Endpoint:**
```
POST https://www.linkedin.com/oauth/v2/accessToken
Content-Type: application/x-www-form-urlencoded
```

**Body Parameters:**
| Parameter | Value | Description |
|-----------|-------|-------------|
| `grant_type` | `authorization_code` | OAuth 2.0 grant type |
| `code` | `AUTHORIZATION_CODE` | Code from authorization callback |
| `redirect_uri` | `https://domain/api/auth/callback/linkedin` | Must match authorization request |
| `client_id` | `YOUR_CLIENT_ID` | LinkedIn app client ID |
| `client_secret` | `YOUR_CLIENT_SECRET` | LinkedIn app client secret |

**Response:**
```json
{
  "access_token": "ACCESS_TOKEN",
  "expires_in": 5184000,
  "token_type": "Bearer"
}
```

**UserInfo Endpoint:**
```
GET https://api.linkedin.com/v2/userinfo
Authorization: Bearer ACCESS_TOKEN
```

**Response:**
```json
{
  "sub": "linkedin_user_id",
  "name": "John Doe",
  "given_name": "John",
  "family_name": "Doe",
  "picture": "https://media.licdn.com/dms/image/...",
  "email": "john.doe@example.com",
  "email_verified": true,
  "locale": "en-US"
}
```

### 4.2 NextAuth.js Callback URLs

**Authorization Callback:**
```
GET /api/auth/callback/linkedin?code=...&state=...
```

**Sign-In Endpoint:**
```
POST /api/auth/signin/linkedin
```

**Sign-Out Endpoint:**
```
POST /api/auth/signout
```

**Session Endpoint:**
```
GET /api/auth/session
```

---

## 5. Security Considerations

### 5.1 CSRF Protection
- NextAuth automatically generates random `state` parameter
- State is stored in session cookie
- On callback, NextAuth validates state matches
- Prevents cross-site request forgery attacks

### 5.2 Token Storage
- Access tokens stored in database (not client-side)
- Database encrypted at rest (Vercel Postgres)
- Tokens never exposed to browser JavaScript
- JWT sessions use httpOnly, secure, sameSite cookies

### 5.3 Scope Minimization
- Only request necessary scopes: `openid profile email`
- No write permissions
- No access to user's connections, posts, or activity
- Complies with data minimization principle (GDPR)

### 5.4 Email Verification
- LinkedIn emails are pre-verified
- Set `emailVerified` to current timestamp on account creation
- No additional verification email needed
- Reduces friction for users

### 5.5 Account Linking
- Prevent account hijacking via email matching
- If email exists with different provider, return error
- User must sign in with original method first
- Then can link LinkedIn in account settings (future feature)

### 5.6 Environment Variables
- Client ID and secret stored in Vercel environment variables
- Not committed to git
- Not exposed to client-side code
- Accessed only in server-side code

---

## 6. Testing Strategy

### 6.1 Unit Tests

**File:** `/workspace/website/lib/auth/__tests__/oauth-config.test.ts`

**Test Cases:**
1. ✅ LinkedIn provider is configured
2. ✅ LinkedIn scopes are correct (openid, profile, email)
3. ✅ Total providers count is 3 (Google, LinkedIn, Credentials)
4. ✅ signIn callback sets emailVerified for OAuth users
5. ✅ jwt callback includes provider info
6. ✅ session callback passes provider to client

**Run Command:**
```bash
cd website
pnpm test
```

### 6.2 Integration Tests

**Test Scenarios:**
1. ✅ New user sign-up with LinkedIn
2. ✅ Existing user sign-in with LinkedIn
3. ✅ Account conflict error handling
4. ✅ Profile data sync (name, email, image)
5. ✅ Session persistence (30 days)
6. ✅ Error handling (user denies authorization)

**Test Environment:**
- Local development: http://localhost:3000
- Staging: https://staging.enthusiastauto.com
- Production: https://enthusiastauto.com

### 6.3 Cross-Browser Tests

**Browsers:**
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- iOS Safari (latest)
- Android Chrome (latest)

**Test Steps:**
1. Navigate to /auth/signin
2. Click "Sign in with LinkedIn"
3. Authorize on LinkedIn
4. Verify redirect to /account
5. Verify session persists after browser restart

### 6.4 Accessibility Tests

**Criteria:**
- ✅ Keyboard navigation (Tab to button, Enter to activate)
- ✅ Screen reader support (aria-label on button)
- ✅ Focus indicator (visible focus ring)
- ✅ Color contrast (WCAG AA compliance)

**Tools:**
- Chrome DevTools Lighthouse
- axe DevTools browser extension
- Manual keyboard navigation testing

---

## 7. Performance Considerations

### 7.1 OAuth Flow Performance

**Target:** OAuth flow completes in <5 seconds

**Breakdown:**
1. User clicks button: 0ms
2. Redirect to LinkedIn: 100-200ms
3. User authorizes: 1-2s (user action)
4. Redirect to callback: 100-200ms
5. Token exchange: 200-500ms
6. Fetch user info: 200-500ms
7. Database operations: 100-200ms
8. Redirect to /account: 100-200ms

**Total:** 2-4 seconds (excluding user authorization time)

### 7.2 Button Rendering

**Optimization:**
- Lucide icons are tree-shakeable (only LinkedIn icon imported)
- Button component is server-rendered (no client-side hydration delay)
- Loading state prevents double-clicks

### 7.3 Database Performance

**Optimization:**
- Indexes on User.email and Account.provider
- Upsert operations for idempotency
- Connection pooling via Prisma

---

## 8. Monitoring & Observability

### 8.1 Metrics to Track

**Adoption Metrics:**
- LinkedIn sign-ups per day/week/month
- LinkedIn sign-ins per day/week/month
- Percentage of users with LinkedIn account linked

**Performance Metrics:**
- OAuth flow completion time (p50, p95, p99)
- Error rate by provider (Google vs LinkedIn)
- Callback success rate

**User Behavior:**
- Conversion rate: sign-in page → account creation
- Time to first purchase (LinkedIn users vs others)
- Retention rate by authentication method

### 8.2 Error Tracking

**Error Types:**
- `OAuthSignin`: Unable to connect to LinkedIn
- `OAuthCallback`: Authorization failed
- `OAuthCreateAccount`: Unable to create account
- `OAuthAccountNotLinked`: Email already registered

**Monitoring Tools:**
- Vercel Analytics (built-in)
- Google Analytics 4 (custom events)
- Sentry (error monitoring, future)

### 8.3 Logging

**Log Events:**
- LinkedIn sign-in initiated
- LinkedIn authorization callback received
- User account created via LinkedIn
- LinkedIn account linked to existing user
- OAuth error occurred

**Log Format:**
```json
{
  "timestamp": "2026-01-07T18:00:00Z",
  "event": "linkedin_signin_initiated",
  "userId": "cuid",
  "provider": "linkedin",
  "success": true
}
```

---

## 9. Rollout Plan

### 9.1 Phased Rollout

**Phase 1: Internal Testing (Week 1)**
- Deploy to staging
- Test with EAG team (5+ sign-ins)
- Gather feedback
- Fix bugs

**Phase 2: Beta Launch (Week 2)**
- Deploy to production
- No announcement (organic discovery)
- Monitor error logs
- Collect user feedback

**Phase 3: Full Launch (Week 3)**
- Announce via email newsletter
- Social media posts
- Update marketing materials
- Monitor success metrics

### 9.2 Success Criteria

**Week 1:**
- ✅ 5+ successful LinkedIn sign-ins by team
- ✅ Zero critical bugs
- ✅ OAuth flow completes in <5 seconds

**Month 1:**
- ✅ 10-15% of new sign-ups use LinkedIn
- ✅ <1% OAuth error rate
- ✅ Positive user feedback

### 9.3 Rollback Plan

**Trigger:** Critical bug or >5% error rate

**Steps:**
1. Revert PR in GitHub
2. Redeploy previous version via Vercel
3. Notify users via status page
4. Investigate root cause
5. Test fix on staging
6. Re-deploy to production

---

## 10. Future Enhancements

### 10.1 Account Settings (Phase 2)

**Feature:** Link/unlink LinkedIn in account settings

**Implementation:**
- Add "Connected Accounts" section to `/account/profile`
- Show linked providers (Google, LinkedIn)
- "Connect LinkedIn" button if not linked
- "Disconnect LinkedIn" button if linked (requires other auth method)

### 10.2 Profile Data Enrichment (Phase 3)

**Feature:** Optionally fetch job title and company from LinkedIn

**Implementation:**
- Request additional scope: `r_liteprofile`
- Fetch extended profile data
- Store in User table (new fields: `jobTitle`, `company`)
- Display on user profile (if user opts in)

### 10.3 LinkedIn Sharing (Phase 4)

**Feature:** "Share to LinkedIn" button on vehicle pages

**Implementation:**
- Add share button to vehicle detail pages
- Pre-populate LinkedIn post with vehicle details
- Track referral traffic from LinkedIn
- Measure conversion from LinkedIn shares

---

## 11. Acceptance Criteria

### 11.1 Functional Requirements

- [ ] ✅ LinkedIn button appears on sign-in page
- [ ] ✅ LinkedIn button appears on sign-up page
- [ ] ✅ Clicking LinkedIn button redirects to LinkedIn authorization
- [ ] ✅ User can authorize EAG app on LinkedIn
- [ ] ✅ User is redirected to /account after authorization
- [ ] ✅ User account is created in database
- [ ] ✅ Account record is created with provider="linkedin"
- [ ] ✅ User name matches LinkedIn profile
- [ ] ✅ User email matches LinkedIn profile
- [ ] ✅ User profile image matches LinkedIn profile
- [ ] ✅ emailVerified is set to current timestamp
- [ ] ✅ Session persists for 30 days
- [ ] ✅ User can sign out and sign in again with LinkedIn

### 11.2 Non-Functional Requirements

- [ ] ✅ OAuth flow completes in <5 seconds
- [ ] ✅ Error rate <1%
- [ ] ✅ Button is keyboard accessible
- [ ] ✅ Button has visible focus indicator
- [ ] ✅ Button label is read by screen readers
- [ ] ✅ Color contrast meets WCAG AA standards
- [ ] ✅ Works on Chrome, Firefox, Safari, Edge
- [ ] ✅ Works on iOS Safari and Android Chrome
- [ ] ✅ No TypeScript errors
- [ ] ✅ No linting errors
- [ ] ✅ All unit tests pass
- [ ] ✅ All integration tests pass

### 11.3 Security Requirements

- [ ] ✅ CSRF protection via state parameter
- [ ] ✅ Access tokens stored in database (not client-side)
- [ ] ✅ Minimal scopes requested (openid, profile, email)
- [ ] ✅ Email verification automatic for LinkedIn users
- [ ] ✅ Account linking prevents email hijacking
- [ ] ✅ Environment variables not exposed to client
- [ ] ✅ Session cookies are httpOnly, secure, sameSite

---

## 12. References

### 12.1 Documentation

- [NextAuth.js LinkedIn Provider](https://next-auth.js.org/providers/linkedin)
- [LinkedIn OAuth 2.0 Documentation](https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/sign-in-with-linkedin-v2)
- [LinkedIn OpenID Connect](https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/sign-in-with-linkedin-openid-connect)
- [OAuth 2.0 RFC 6749](https://datatracker.ietf.org/doc/html/rfc6749)
- [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html)

### 12.2 Related Issues

- PROD-15287: LinkedIn SSO feature plan (this issue)
- Story 5.2: OAuth providers configuration (completed)
- Story 5.3: Facebook OAuth (future)

### 12.3 Code Locations

- NextAuth config: `/workspace/website/lib/auth/config.ts`
- Sign-in page: `/workspace/website/app/auth/signin/page.tsx`
- Sign-up page: `/workspace/website/app/auth/signup/page.tsx`
- Unit tests: `/workspace/website/lib/auth/__tests__/oauth-config.test.ts`
- Prisma schema: `/workspace/website/prisma/schema.prisma`

---

**Document Version History:**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-07 | Cursor Agent | Initial technical specification |

---

**Approval:**

- [ ] **Technical Lead:** Architecture approved
- [ ] **Security Team:** Security review passed
- [ ] **Product Owner:** Requirements validated
- [ ] **QA Lead:** Test plan approved

---

**Status:** 📋 Ready for Implementation
