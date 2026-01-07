# LinkedIn SSO Feature Plan

**Issue:** PROD-15287  
**Created:** January 7, 2026  
**Status:** Planning  

---

## Executive Summary

Add LinkedIn as a third OAuth provider to the Enthusiast Auto Group website authentication system, enabling users to sign in with their LinkedIn accounts. This feature aligns with our target market of professional BMW enthusiasts and collectors (ages 35-65, high-net-worth individuals) who are likely to have LinkedIn profiles.

### Business Value

- **Reduced friction:** One-click sign-in for professional users who prefer LinkedIn over Google
- **Target audience alignment:** LinkedIn is the professional network of choice for our demographic (35-65, high-net-worth automotive enthusiasts)
- **Trust signal:** LinkedIn verification adds credibility to user profiles
- **Marketing opportunity:** Potential for B2B partnerships and professional networking within the BMW enthusiast community

### Success Metrics

- LinkedIn SSO adoption rate: Target 10-15% of new sign-ups within first 3 months
- Sign-up completion rate improvement: Target 5-10% increase
- User authentication errors: Maintain <1% error rate
- Time-to-sign-in: <5 seconds for OAuth flow

---

## Technical Architecture

### Current State

The website already has a robust OAuth implementation:

- **Framework:** NextAuth.js v5 (beta.29) with Prisma adapter
- **Existing providers:** 
  - Google OAuth (configured and tested)
  - Email/password credentials (with verification flow)
  - Facebook OAuth (commented out, ready for activation)
- **Database:** Vercel Postgres with Prisma ORM
- **Session strategy:** JWT with 30-day expiration
- **Account linking:** Multi-provider support via `Account` model

### Architecture Pattern

```
┌─────────────────────────────────────────────────────────┐
│                   Next.js App (Client)                  │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Sign In Page (/auth/signin)                       │ │
│  │  - Email/Password Form                             │ │
│  │  - Google OAuth Button                             │ │
│  │  - LinkedIn OAuth Button [NEW]                     │ │
│  └────────────────────────────────────────────────────┘ │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│              NextAuth.js v5 (Middleware)                │
│  ┌────────────────────────────────────────────────────┐ │
│  │  /api/auth/[...nextauth]/route.ts                  │ │
│  │  - Provider configuration                          │ │
│  │  - Callbacks (signIn, jwt, session)                │ │
│  │  - PrismaAdapter integration                       │ │
│  └────────────────────────────────────────────────────┘ │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│                  LinkedIn OAuth 2.0                     │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Authorization Endpoint                            │ │
│  │  https://www.linkedin.com/oauth/v2/authorization   │ │
│  │                                                     │ │
│  │  Token Endpoint                                    │ │
│  │  https://www.linkedin.com/oauth/v2/accessToken     │ │
│  │                                                     │ │
│  │  User Info Endpoint                                │ │
│  │  https://api.linkedin.com/v2/userinfo              │ │
│  └────────────────────────────────────────────────────┘ │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│              Vercel Postgres (Neon)                     │
│  ┌────────────────────────────────────────────────────┐ │
│  │  User Table                                        │ │
│  │  - id, email, name, image, emailVerified           │ │
│  │                                                     │ │
│  │  Account Table                                     │ │
│  │  - userId, provider, providerAccountId             │ │
│  │  - access_token, refresh_token, expires_at         │ │
│  │                                                     │ │
│  │  Session Table                                     │ │
│  │  - sessionToken, userId, expires                   │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### LinkedIn OAuth Flow

1. **User clicks "Sign in with LinkedIn"** on `/auth/signin`
2. **Redirect to LinkedIn:** NextAuth redirects to LinkedIn authorization URL with:
   - `client_id`: LinkedIn app client ID
   - `redirect_uri`: `https://[domain]/api/auth/callback/linkedin`
   - `scope`: `openid profile email`
   - `response_type`: `code`
   - `state`: CSRF protection token
3. **User authorizes:** LinkedIn prompts user to authorize EAG website
4. **LinkedIn redirects back:** With authorization code
5. **Token exchange:** NextAuth exchanges code for access token
6. **Fetch user info:** NextAuth calls LinkedIn userinfo endpoint
7. **Create/link account:** 
   - If email exists: Link LinkedIn account to existing user
   - If new email: Create new user with emailVerified set
8. **Create session:** JWT token issued, user redirected to `/account`

---

## Implementation Plan

### Phase 1: LinkedIn Developer Setup (30 minutes)

**Prerequisites:**
- Access to LinkedIn Developer Portal
- Domain verification (enthusiastauto.com)
- Admin access to Vercel environment variables

**Steps:**

1. **Create LinkedIn App**
   - Go to https://www.linkedin.com/developers/apps
   - Click "Create app"
   - App name: "Enthusiast Auto Group"
   - LinkedIn Page: Associate with EAG company page (if available)
   - App logo: EAG logo (400x400px minimum)
   - Privacy policy URL: `https://enthusiastauto.com/privacy`
   - Terms of service URL: `https://enthusiastauto.com/terms`

2. **Configure OAuth Settings**
   - Products → Request "Sign In with LinkedIn using OpenID Connect"
   - Auth → Redirect URLs:
     - Production: `https://enthusiastauto.com/api/auth/callback/linkedin`
     - Staging: `https://staging.enthusiastauto.com/api/auth/callback/linkedin`
     - Local dev: `http://localhost:3000/api/auth/callback/linkedin`
   - Scopes: `openid`, `profile`, `email`

3. **Obtain Credentials**
   - Copy Client ID
   - Copy Client Secret
   - Store securely (1Password, Vercel env vars)

4. **Environment Variables**
   - Add to Vercel project settings:
     ```
     LINKEDIN_CLIENT_ID=your_client_id_here
     LINKEDIN_CLIENT_SECRET=your_client_secret_here
     ```
   - Add to local `.env.local`:
     ```
     LINKEDIN_CLIENT_ID=your_client_id_here
     LINKEDIN_CLIENT_SECRET=your_client_secret_here
     ```

### Phase 2: Code Implementation (2-3 hours)

#### 2.1 Update NextAuth Configuration

**File:** `/workspace/website/lib/auth/config.ts`

**Changes:**
1. Import LinkedIn provider
2. Add LinkedIn to providers array
3. Configure scopes and authorization parameters
4. Ensure callbacks handle LinkedIn profile data

**Code:**

```typescript
import LinkedInProvider from "next-auth/providers/linkedin";

export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile",
        },
      },
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid profile email",
        },
      },
      // Use OpenID Connect endpoints
      wellKnown: "https://www.linkedin.com/oauth/.well-known/openid-configuration",
    }),
    CredentialsProvider({
      // ... existing credentials config
    }),
  ],
  // ... rest of config remains the same
};
```

**Notes:**
- LinkedIn uses OpenID Connect (OIDC) standard
- Profile data structure: `{ sub, name, email, picture, email_verified }`
- Email is always verified by LinkedIn
- No additional callback changes needed (existing OAuth logic handles LinkedIn)

#### 2.2 Update Sign-In Page UI

**File:** `/workspace/website/app/auth/signin/page.tsx`

**Changes:**
1. Import LinkedIn icon from lucide-react
2. Add LinkedIn button to social login section
3. Update `handleSocialLogin` to accept "linkedin" provider
4. Add loading state for LinkedIn button

**Code additions:**

```typescript
import { Chrome, Loader2, Linkedin } from "lucide-react";

// Update handleSocialLogin function signature
async function handleSocialLogin(provider: "google" | "linkedin") {
  // ... existing logic
}

// Add LinkedIn button after Google button
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

**Visual Design:**
- Button style: Outline variant (consistent with Google button)
- Icon: LinkedIn logo from lucide-react
- Text: "Sign in with LinkedIn"
- Order: Google → LinkedIn → Email/Password divider
- Spacing: 12px gap between buttons

#### 2.3 Update Sign-Up Page UI

**File:** `/workspace/website/app/auth/signup/page.tsx`

**Changes:**
- Add LinkedIn button to social sign-up section
- Mirror sign-in page implementation
- Ensure consistent messaging ("Sign up with LinkedIn")

### Phase 3: Testing (2-3 hours)

#### 3.1 Unit Tests

**File:** `/workspace/website/lib/auth/__tests__/oauth-config.test.ts`

**New test cases:**

```typescript
describe("LinkedIn OAuth Configuration", () => {
  it("should configure LinkedIn OAuth provider", () => {
    const providers = authConfig.providers;
    const linkedinProvider = providers.find(
      (p: any) => p.id === "linkedin" || p.name === "LinkedIn"
    );
    expect(linkedinProvider).toBeDefined();
  });

  it("should request minimal LinkedIn scopes (openid, profile, email)", () => {
    const providers = authConfig.providers;
    const linkedinProvider = providers.find(
      (p: any) => p.id === "linkedin"
    ) as any;

    if (linkedinProvider?.options?.authorization?.params) {
      const scopes = linkedinProvider.options.authorization.params.scope;
      expect(scopes).toContain("openid");
      expect(scopes).toContain("email");
      expect(scopes).toContain("profile");
    }
  });

  it("should have 3 total providers (Google, LinkedIn, Credentials)", () => {
    expect(authConfig.providers).toHaveLength(3);
  });
});
```

**Run tests:**
```bash
cd website
pnpm test
```

#### 3.2 Integration Testing

**Manual test scenarios:**

1. **New user sign-up with LinkedIn**
   - Click "Sign in with LinkedIn" on `/auth/signin`
   - Authorize on LinkedIn
   - Verify redirect to `/account`
   - Check database: User created with emailVerified set
   - Check database: Account record created with provider="linkedin"

2. **Existing user sign-in with LinkedIn**
   - Create account via email/password
   - Sign out
   - Click "Sign in with LinkedIn" (same email)
   - Verify account linking works
   - Check database: New Account record added to existing User

3. **Account conflict handling**
   - Create account via Google (email: test@example.com)
   - Sign out
   - Try to sign in with LinkedIn (same email)
   - Verify error message: "Email already registered with a different sign-in method"

4. **Profile data sync**
   - Sign in with LinkedIn
   - Verify user name matches LinkedIn profile
   - Verify profile image URL saved
   - Check session data includes provider="linkedin"

5. **Session persistence**
   - Sign in with LinkedIn
   - Close browser
   - Reopen and visit `/account`
   - Verify session persists (30-day JWT)

6. **Error handling**
   - Deny LinkedIn authorization
   - Verify error message displayed
   - Verify user remains on sign-in page

#### 3.3 Cross-Browser Testing

**Browsers to test:**
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- iOS Safari (latest)
- Android Chrome (latest)

**Test matrix:**
- Sign in with LinkedIn
- Sign up with LinkedIn
- Mobile responsive design
- Button accessibility (keyboard navigation)

### Phase 4: Documentation & Deployment (1 hour)

#### 4.1 Update Documentation

**Files to update:**

1. **`/workspace/context/ARCHITECTURE.md`**
   - Add LinkedIn to authentication section
   - Update provider list: "Email/password, Google OAuth, LinkedIn OAuth"

2. **`/workspace/context/ROADMAP.md`**
   - Move "LinkedIn SSO" from "Planned" to "Shipped"
   - Add completion date

3. **`/workspace/README.md`** (if authentication section exists)
   - Document LinkedIn OAuth setup steps
   - Add environment variable requirements

4. **Internal wiki/docs** (if applicable)
   - Add LinkedIn app credentials location
   - Document troubleshooting steps

#### 4.2 Deployment Checklist

**Pre-deployment:**
- [ ] All unit tests passing
- [ ] Integration tests completed on staging
- [ ] LinkedIn app approved and verified
- [ ] Environment variables set in Vercel (production)
- [ ] Privacy policy updated (mention LinkedIn data usage)
- [ ] Terms of service reviewed

**Deployment steps:**
1. Merge feature branch to `main`
2. Vercel auto-deploys to production
3. Verify LinkedIn button appears on production
4. Test LinkedIn OAuth flow on production
5. Monitor error logs for 24 hours

**Post-deployment:**
- [ ] Verify analytics tracking (sign-in events)
- [ ] Monitor LinkedIn OAuth error rate
- [ ] Check database for LinkedIn account records
- [ ] Announce feature to users (email, social media)

---

## Security Considerations

### OAuth Security Best Practices

1. **CSRF Protection**
   - NextAuth automatically includes `state` parameter
   - Validates state on callback to prevent CSRF attacks

2. **Token Storage**
   - Access tokens stored in database (encrypted at rest)
   - Never expose tokens to client-side JavaScript
   - Refresh tokens not used (LinkedIn access tokens are long-lived)

3. **Scope Minimization**
   - Only request necessary scopes: `openid profile email`
   - No write permissions requested
   - No access to user's connections or posts

4. **Email Verification**
   - LinkedIn emails are pre-verified
   - Set `emailVerified` automatically on account creation
   - No additional verification email needed

5. **Account Linking**
   - Prevent account hijacking via email matching
   - Error if email exists with different provider
   - User must sign in with original method first

6. **Rate Limiting**
   - Consider adding rate limiting to OAuth endpoints
   - Prevent brute-force authorization attempts
   - Use Vercel Edge Config or Redis for rate limit tracking

### Privacy & Compliance

1. **GDPR Compliance**
   - Privacy policy discloses LinkedIn data usage
   - Users can disconnect LinkedIn account
   - Data deletion includes LinkedIn account records

2. **Data Minimization**
   - Only store: name, email, profile picture URL
   - No additional LinkedIn profile data collected
   - User can update/remove profile picture

3. **Third-Party Data Sharing**
   - No LinkedIn data shared with other services
   - Profile data only used for authentication
   - Transparent about data usage in privacy policy

---

## Rollout Strategy

### Phased Rollout

**Phase 1: Internal Testing (Week 1)**
- Deploy to staging environment
- Test with EAG team members
- Gather feedback on UX
- Fix any bugs discovered

**Phase 2: Beta Launch (Week 2)**
- Deploy to production
- No announcement (organic discovery)
- Monitor adoption rate and error logs
- Collect user feedback

**Phase 3: Full Launch (Week 3)**
- Announce via email newsletter
- Social media posts highlighting feature
- Update marketing materials
- Monitor success metrics

### Success Criteria

**Week 1 (Internal Testing):**
- [ ] 5+ successful LinkedIn sign-ins by team
- [ ] Zero critical bugs
- [ ] OAuth flow completes in <5 seconds

**Week 2-4 (Beta Launch):**
- [ ] 10+ LinkedIn sign-ups
- [ ] <1% OAuth error rate
- [ ] No user complaints about LinkedIn sign-in

**Month 1-3 (Full Launch):**
- [ ] 10-15% of new sign-ups use LinkedIn
- [ ] 5-10% improvement in sign-up completion rate
- [ ] Positive user feedback

### Monitoring & Analytics

**Metrics to track:**

1. **Adoption Metrics**
   - LinkedIn sign-ups per day/week/month
   - LinkedIn sign-ins per day/week/month
   - Percentage of users with LinkedIn account linked

2. **Performance Metrics**
   - OAuth flow completion time
   - Error rate by provider (Google vs LinkedIn)
   - Callback success rate

3. **User Behavior**
   - Conversion rate: sign-in page → account creation
   - Time to first purchase (LinkedIn users vs others)
   - Retention rate by authentication method

**Tracking implementation:**
- Add custom events to Google Analytics 4
- Track sign-in method in user session
- Create Vercel Analytics dashboard for OAuth metrics

---

## Maintenance & Support

### Ongoing Maintenance

1. **LinkedIn API Updates**
   - Monitor LinkedIn developer changelog
   - Test OAuth flow after LinkedIn API updates
   - Update NextAuth provider if breaking changes

2. **Dependency Updates**
   - Keep NextAuth.js updated (currently v5 beta)
   - Monitor for security patches
   - Test OAuth flow after major updates

3. **Error Monitoring**
   - Set up alerts for OAuth error spikes
   - Review error logs weekly
   - Investigate user-reported issues

### Troubleshooting Guide

**Common issues:**

1. **"Unable to connect to authentication provider"**
   - Cause: LinkedIn app not approved or credentials invalid
   - Fix: Verify LinkedIn app status, check environment variables

2. **"Email already registered with a different sign-in method"**
   - Cause: User trying to link existing email with LinkedIn
   - Fix: User should sign in with original method, then link LinkedIn in settings

3. **"Authentication callback failed"**
   - Cause: Redirect URI mismatch or state validation failure
   - Fix: Verify redirect URI in LinkedIn app matches NextAuth callback URL

4. **Profile picture not loading**
   - Cause: LinkedIn CDN URL expired or invalid
   - Fix: Refresh user session to fetch new profile picture URL

### Support Resources

- **NextAuth.js Docs:** https://next-auth.js.org/providers/linkedin
- **LinkedIn OAuth Docs:** https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/sign-in-with-linkedin-v2
- **LinkedIn Developer Support:** https://www.linkedin.com/help/linkedin/ask/TS-RDOPC

---

## Risks & Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| LinkedIn API changes break OAuth | High | Low | Monitor changelog, test regularly, have rollback plan |
| Low adoption rate | Medium | Medium | Promote feature, ensure prominent placement on sign-in page |
| Account linking conflicts | Medium | Low | Clear error messages, document linking process |
| LinkedIn app rejection | High | Low | Follow LinkedIn guidelines, provide clear app description |
| Security vulnerability in OAuth flow | High | Low | Use NextAuth.js (battle-tested), follow security best practices |

---

## Future Enhancements

### Phase 2 Features (Future)

1. **Account Settings: Link/Unlink LinkedIn**
   - Add "Connected Accounts" section to `/account/profile`
   - Allow users to link LinkedIn to existing account
   - Allow users to disconnect LinkedIn (if other auth method exists)

2. **LinkedIn Profile Data Enrichment**
   - Optionally fetch job title and company
   - Display on user profile (if user opts in)
   - Use for personalized recommendations

3. **LinkedIn Sharing Integration**
   - "Share to LinkedIn" button on vehicle pages
   - Pre-populated post with vehicle details
   - Track referral traffic from LinkedIn

4. **B2B Features**
   - LinkedIn company verification for dealer accounts
   - Professional networking features for BMW enthusiasts
   - Integration with LinkedIn Groups

### Technical Debt

- Upgrade NextAuth.js from beta to stable v5 when released
- Consider migrating from JWT to database sessions for better revocation
- Add comprehensive E2E tests with Playwright
- Implement OAuth rate limiting

---

## Appendix

### A. LinkedIn OAuth Scopes

| Scope | Purpose | Data Accessed |
|-------|---------|---------------|
| `openid` | OpenID Connect authentication | User ID (sub) |
| `profile` | Basic profile information | Name, profile picture URL |
| `email` | Email address | Email address (verified) |

### B. LinkedIn Profile Response

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

### C. Database Schema (No Changes Required)

The existing Prisma schema already supports multiple OAuth providers via the `Account` model:

```prisma
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String  // "oauth"
  provider          String  // "linkedin"
  providerAccountId String  // LinkedIn user ID
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}
```

### D. Environment Variables Checklist

```bash
# Required for LinkedIn OAuth
LINKEDIN_CLIENT_ID=your_client_id_here
LINKEDIN_CLIENT_SECRET=your_client_secret_here

# Existing (no changes)
NEXTAUTH_URL=https://enthusiastauto.com
NEXTAUTH_SECRET=your_secret_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### E. Testing Checklist

- [ ] Unit tests pass (OAuth config)
- [ ] Integration test: New user sign-up with LinkedIn
- [ ] Integration test: Existing user sign-in with LinkedIn
- [ ] Integration test: Account conflict error handling
- [ ] Integration test: Profile data sync
- [ ] Integration test: Session persistence
- [ ] Cross-browser test: Chrome, Firefox, Safari, Edge
- [ ] Mobile test: iOS Safari, Android Chrome
- [ ] Accessibility test: Keyboard navigation, screen reader
- [ ] Performance test: OAuth flow completes in <5 seconds
- [ ] Security test: CSRF protection, token storage

---

## Conclusion

This feature plan provides a comprehensive roadmap for implementing LinkedIn SSO on the Enthusiast Auto Group website. The implementation leverages existing OAuth infrastructure, requires minimal code changes, and aligns with the target market of professional BMW enthusiasts.

**Estimated effort:** 8-10 hours total
- Setup: 0.5 hours
- Development: 2-3 hours
- Testing: 2-3 hours
- Documentation: 1 hour
- Deployment & monitoring: 2-3 hours

**Target completion:** 1-2 weeks (including testing and rollout)

**Next steps:**
1. Review and approve this plan
2. Create LinkedIn Developer account and app
3. Implement code changes
4. Test on staging environment
5. Deploy to production
6. Monitor adoption and iterate
