# LinkedIn SSO - OAuth Flow Diagram

**Visual guide to the LinkedIn OAuth 2.0 / OpenID Connect authentication flow**

---

## High-Level Flow

```
┌─────────────┐
│    User     │
│  (Browser)  │
└──────┬──────┘
       │ 1. Clicks "Sign in with LinkedIn"
       ▼
┌─────────────────────────────────────────────────────────┐
│              Next.js App (Server)                       │
│  /auth/signin page                                      │
│  - Renders LinkedIn button                             │
│  - Calls signIn("linkedin") from NextAuth               │
└──────┬──────────────────────────────────────────────────┘
       │ 2. Redirects to LinkedIn with OAuth params
       ▼
┌─────────────────────────────────────────────────────────┐
│              LinkedIn OAuth Server                      │
│  https://www.linkedin.com/oauth/v2/authorization        │
│  - User signs in to LinkedIn (if not already)          │
│  - User authorizes EAG app                             │
└──────┬──────────────────────────────────────────────────┘
       │ 3. Redirects back with authorization code
       ▼
┌─────────────────────────────────────────────────────────┐
│              Next.js App (Server)                       │
│  /api/auth/callback/linkedin                           │
│  - Validates state (CSRF protection)                   │
│  - Exchanges code for access token                     │
│  - Fetches user profile from LinkedIn                  │
│  - Creates/updates User and Account records            │
│  - Issues JWT session                                  │
└──────┬──────────────────────────────────────────────────┘
       │ 4. Redirects to /account with session cookie
       ▼
┌─────────────┐
│    User     │
│ (Logged In) │
└─────────────┘
```

---

## Detailed OAuth 2.0 Flow

### Step 1: Authorization Request

```
User clicks "Sign in with LinkedIn"
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│ NextAuth.js generates authorization URL:                    │
│                                                             │
│ https://www.linkedin.com/oauth/v2/authorization?            │
│   response_type=code                                        │
│   client_id=YOUR_CLIENT_ID                                  │
│   redirect_uri=https://domain/api/auth/callback/linkedin    │
│   scope=openid+profile+email                                │
│   state=RANDOM_CSRF_TOKEN                                   │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
Browser redirects to LinkedIn
```

**Parameters:**
- `response_type=code` → OAuth 2.0 authorization code flow
- `client_id` → LinkedIn app client ID (from env var)
- `redirect_uri` → Where LinkedIn sends user after authorization
- `scope` → Permissions requested (OpenID Connect standard scopes)
- `state` → Random token for CSRF protection

---

### Step 2: User Authorization

```
┌─────────────────────────────────────────────────────────────┐
│                  LinkedIn Authorization Page                │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  [LinkedIn Logo]                                      │ │
│  │                                                       │ │
│  │  Enthusiast Auto Group wants to:                     │ │
│  │  ✓ Verify your identity (openid)                     │ │
│  │  ✓ Access your profile (name, picture)               │ │
│  │  ✓ Access your email address                         │ │
│  │                                                       │ │
│  │  [Allow]  [Cancel]                                    │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
         │
         ▼ User clicks "Allow"
         │
LinkedIn generates authorization code
```

**User Actions:**
1. Signs in to LinkedIn (if not already signed in)
2. Reviews permissions requested by EAG app
3. Clicks "Allow" to authorize

---

### Step 3: Authorization Callback

```
LinkedIn redirects browser to:
https://domain/api/auth/callback/linkedin?code=AUTH_CODE&state=CSRF_TOKEN
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│ NextAuth.js callback handler:                               │
│                                                             │
│ 1. Validate state parameter (CSRF protection)               │
│    ✓ Compare state with session cookie                     │
│    ✓ Reject if mismatch (potential CSRF attack)            │
│                                                             │
│ 2. Exchange authorization code for access token             │
│    POST https://www.linkedin.com/oauth/v2/accessToken       │
│    Body: {                                                  │
│      grant_type: "authorization_code",                      │
│      code: "AUTH_CODE",                                     │
│      redirect_uri: "https://domain/api/auth/callback/...",  │
│      client_id: "YOUR_CLIENT_ID",                           │
│      client_secret: "YOUR_CLIENT_SECRET"                    │
│    }                                                        │
│                                                             │
│ 3. LinkedIn responds with access token                      │
│    {                                                        │
│      access_token: "ACCESS_TOKEN",                          │
│      expires_in: 5184000,  // 60 days                      │
│      token_type: "Bearer"                                   │
│    }                                                        │
└─────────────────────────────────────────────────────────────┘
```

---

### Step 4: Fetch User Profile

```
┌─────────────────────────────────────────────────────────────┐
│ NextAuth.js fetches user info:                              │
│                                                             │
│ GET https://api.linkedin.com/v2/userinfo                    │
│ Headers: {                                                  │
│   Authorization: "Bearer ACCESS_TOKEN"                      │
│ }                                                           │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│ LinkedIn responds with user profile:                        │
│                                                             │
│ {                                                           │
│   "sub": "linkedin_user_id_12345",                          │
│   "name": "John Doe",                                       │
│   "given_name": "John",                                     │
│   "family_name": "Doe",                                     │
│   "picture": "https://media.licdn.com/dms/image/...",       │
│   "email": "john.doe@example.com",                          │
│   "email_verified": true,                                   │
│   "locale": "en-US"                                         │
│ }                                                           │
└─────────────────────────────────────────────────────────────┘
```

**Profile Fields:**
- `sub` → LinkedIn user ID (unique identifier)
- `name` → Full name
- `email` → Email address (always verified by LinkedIn)
- `picture` → Profile picture URL
- `email_verified` → Always true for LinkedIn

---

### Step 5: Database Operations

```
┌─────────────────────────────────────────────────────────────┐
│ PrismaAdapter creates/updates database records:             │
│                                                             │
│ 1. Check if User exists with email "john.doe@example.com"  │
│                                                             │
│    Case A: User does NOT exist                             │
│    ┌─────────────────────────────────────────────────────┐ │
│    │ Create new User:                                    │ │
│    │   id: "cuid_abc123"                                 │ │
│    │   email: "john.doe@example.com"                     │ │
│    │   name: "John Doe"                                  │ │
│    │   image: "https://media.licdn.com/..."              │ │
│    │   emailVerified: NOW()                              │ │
│    │   createdAt: NOW()                                  │ │
│    └─────────────────────────────────────────────────────┘ │
│                                                             │
│    Case B: User exists (same email, different provider)    │
│    ┌─────────────────────────────────────────────────────┐ │
│    │ Link LinkedIn account to existing User              │ │
│    │ (Create Account record below)                       │ │
│    └─────────────────────────────────────────────────────┘ │
│                                                             │
│ 2. Create Account record:                                  │
│    ┌─────────────────────────────────────────────────────┐ │
│    │ id: "cuid_xyz789"                                   │ │
│    │ userId: "cuid_abc123"                               │ │
│    │ type: "oauth"                                       │ │
│    │ provider: "linkedin"                                │ │
│    │ providerAccountId: "linkedin_user_id_12345"         │ │
│    │ access_token: "ACCESS_TOKEN"                        │ │
│    │ expires_at: UNIX_TIMESTAMP (60 days from now)       │ │
│    │ token_type: "Bearer"                                │ │
│    │ scope: "openid profile email"                       │ │
│    └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**Database Tables:**
- **User:** Stores user profile (email, name, image)
- **Account:** Stores OAuth provider info (provider, access token)
- **Unique constraint:** `[provider, providerAccountId]` prevents duplicate accounts

---

### Step 6: Session Creation

```
┌─────────────────────────────────────────────────────────────┐
│ NextAuth.js creates JWT session:                            │
│                                                             │
│ JWT Payload:                                                │
│ {                                                           │
│   "id": "cuid_abc123",                                      │
│   "email": "john.doe@example.com",                          │
│   "name": "John Doe",                                       │
│   "provider": "linkedin",                                   │
│   "picture": "https://media.licdn.com/...",                 │
│   "iat": 1704672000,  // Issued at                         │
│   "exp": 1707264000   // Expires in 30 days                │
│ }                                                           │
│                                                             │
│ Signed with NEXTAUTH_SECRET (HS256)                         │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│ Set session cookie:                                         │
│                                                             │
│ Cookie Name: next-auth.session-token                        │
│ Cookie Value: JWT_TOKEN_STRING                              │
│ Cookie Attributes:                                          │
│   - HttpOnly: true  (not accessible via JavaScript)        │
│   - Secure: true    (only sent over HTTPS)                 │
│   - SameSite: Lax   (CSRF protection)                      │
│   - Max-Age: 2592000 (30 days)                             │
│   - Path: /                                                 │
└─────────────────────────────────────────────────────────────┘
```

---

### Step 7: Redirect to Account Page

```
┌─────────────────────────────────────────────────────────────┐
│ NextAuth.js redirects browser:                              │
│                                                             │
│ HTTP 302 Found                                              │
│ Location: https://domain/account                            │
│ Set-Cookie: next-auth.session-token=JWT_TOKEN; ...          │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│ Browser navigates to /account                               │
│ - Sends session cookie with request                         │
│ - Next.js middleware validates JWT                          │
│ - User is authenticated                                     │
│ - Account page renders with user data                       │
└─────────────────────────────────────────────────────────────┘
```

---

## Security Features

### CSRF Protection

```
┌─────────────────────────────────────────────────────────────┐
│ Authorization Request (Step 1):                             │
│   state=RANDOM_TOKEN_abc123                                 │
│   ↓                                                         │
│   Stored in session cookie                                  │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│ Authorization Callback (Step 3):                            │
│   state=RANDOM_TOKEN_abc123                                 │
│   ↓                                                         │
│   Compare with session cookie                               │
│   ✓ Match → Continue                                        │
│   ✗ Mismatch → Reject (potential CSRF attack)              │
└─────────────────────────────────────────────────────────────┘
```

### Token Storage

```
┌─────────────────────────────────────────────────────────────┐
│ Access Token Storage:                                       │
│                                                             │
│ ✓ Stored in database (Account table)                       │
│ ✓ Encrypted at rest (Vercel Postgres)                      │
│ ✓ Never exposed to client-side JavaScript                  │
│ ✓ Only accessible via server-side API routes               │
│                                                             │
│ ✗ NOT stored in localStorage                               │
│ ✗ NOT stored in sessionStorage                             │
│ ✗ NOT included in JWT session token                        │
└─────────────────────────────────────────────────────────────┘
```

### Session Security

```
┌─────────────────────────────────────────────────────────────┐
│ JWT Session Cookie:                                         │
│                                                             │
│ ✓ HttpOnly → Not accessible via JavaScript (XSS protection)│
│ ✓ Secure → Only sent over HTTPS (MITM protection)          │
│ ✓ SameSite=Lax → CSRF protection                           │
│ ✓ Signed with secret → Tampering detection                 │
│ ✓ 30-day expiration → Automatic logout                     │
└─────────────────────────────────────────────────────────────┘
```

---

## Error Handling

### User Denies Authorization

```
User clicks "Cancel" on LinkedIn authorization page
         │
         ▼
LinkedIn redirects to:
https://domain/api/auth/callback/linkedin?error=access_denied
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│ NextAuth.js callback handler:                               │
│ - Detects error parameter                                   │
│ - Redirects to /auth/signin?error=OAuthCallback             │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
User sees error message:
"Authentication failed. Please try again."
```

### Account Conflict (Email Already Registered)

```
User signs in with LinkedIn (email: john@example.com)
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│ PrismaAdapter checks database:                              │
│ - User exists with email "john@example.com"                 │
│ - User has Account with provider="google"                   │
│ - No Account with provider="linkedin"                       │
│                                                             │
│ Decision: Link LinkedIn account to existing User            │
│ - Create new Account record                                 │
│ - User now has 2 providers: Google + LinkedIn              │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
User is signed in successfully
(Can now use either Google or LinkedIn to sign in)
```

### Invalid State (CSRF Attack Attempt)

```
Attacker tries to forge callback:
https://domain/api/auth/callback/linkedin?code=FAKE_CODE&state=FAKE_STATE
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│ NextAuth.js callback handler:                               │
│ - Validates state parameter                                 │
│ - Compares with session cookie                              │
│ - Mismatch detected                                         │
│ - Rejects request                                           │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
User sees error message:
"Authentication callback failed. Please try again."
```

---

## Performance Metrics

### OAuth Flow Timeline

```
┌────────────────────────────────────────────────────────────┐
│ Event                          │ Time      │ Cumulative   │
├────────────────────────────────┼───────────┼──────────────┤
│ User clicks button             │ 0ms       │ 0ms          │
│ Redirect to LinkedIn           │ 100-200ms │ 200ms        │
│ User authorizes (manual)       │ 1-2s      │ 2.2s         │
│ Redirect to callback           │ 100-200ms │ 2.4s         │
│ Exchange code for token        │ 200-500ms │ 2.9s         │
│ Fetch user profile             │ 200-500ms │ 3.4s         │
│ Database operations            │ 100-200ms │ 3.6s         │
│ Create JWT session             │ 10-50ms   │ 3.65s        │
│ Redirect to /account           │ 100-200ms │ 3.85s        │
├────────────────────────────────┼───────────┼──────────────┤
│ Total (excluding user action)  │           │ ~2s          │
│ Total (including user action)  │           │ ~4s          │
└────────────────────────────────────────────────────────────┘

Target: <5 seconds total
```

---

## Data Flow Summary

```
┌─────────────┐
│ User clicks │
│   button    │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│ 1. Authorization Request                                    │
│    → LinkedIn authorization URL with OAuth params           │
└──────┬──────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. User Authorization                                       │
│    → User signs in and authorizes EAG app                   │
└──────┬──────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Authorization Callback                                   │
│    → LinkedIn redirects with authorization code             │
└──────┬──────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Token Exchange                                           │
│    → Exchange code for access token                         │
└──────┬──────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. Fetch User Profile                                       │
│    → Get user info from LinkedIn API                        │
└──────┬──────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. Database Operations                                      │
│    → Create/update User and Account records                 │
└──────┬──────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│ 7. Session Creation                                         │
│    → Create JWT session and set cookie                      │
└──────┬──────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────┐
│ User logged │
│     in      │
└─────────────┘
```

---

**Reference:** See [TECH_SPEC.md](./LINKEDIN_SSO_TECH_SPEC.md) for detailed API specifications and implementation details.
