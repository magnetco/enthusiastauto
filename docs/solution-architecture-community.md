# Solution Architecture - Community Feature Addendum

**Project:** Enthusiast Auto - Community Feature
**Date:** 2025-10-28
**Author:** Architecture Team
**Status:** Ready for Implementation

---

## Executive Summary

This document provides focused architecture guidance for adding Community features (Epics 9-10) to the existing Enthusiast Auto platform. This is a **brownfield addendum** - it references and extends the existing solution architecture rather than redefining the entire system.

**Scope:** 15 stories, 78 points, 7-week timeline
**Approach:** Extend existing Next.js monolith with new community routes and data models
**Integration Strategy:** Leverage existing auth (Epic 5), search (Epic 6), and UI systems

**Key Architectural Decisions:**
- Extend existing Prisma schema with 5 new tables (Post, Comment, Community, Upvote, Notification)
- Add `/community/*` routes using Next.js App Router patterns
- Reuse NextAuth.js sessions and extend User model with `role` field
- Integrate with existing Fuse.js search infrastructure for community search
- Use existing ShadCN components and Tailwind design system
- Leverage Vercel Blob for post image uploads (pattern from Story 5.3)

---

## Technology Stack (Community-Specific Additions)

All existing technologies from main project carry forward. Community adds:

| Category | Technology | Version | Rationale |
|----------|-----------|---------|-----------|
| **Rich Text Editor** | Tiptap | ^2.1.0 | Modern headless editor, excellent Next.js integration, extensible for future features (mentions, embeds). Preferred over Slate (complex API) and Lexical (newer, less stable). |
| **HTML Sanitization** | isomorphic-dompurify | ^2.11.0 | XSS prevention for rich text content. Sanitizes HTML from Tiptap before saving to database. Works in both Node.js and browser environments. |
| **Rate Limiting** | In-Memory Map | N/A (native) | Simple rate limiting for MVP (5 posts/hour). Stores timestamps in Map with periodic cleanup. Redis deferred until scale demands it. |
| **Profanity Filter** | bad-words | ^3.0.4 | Lightweight client-side filtering for basic moderation. Admin review for flagged content. ML-based filtering deferred. |
| **Notification Polling** | React Query | ^5.0.0 (already installed) | Simple polling (30s interval) for notifications. WebSockets deferred for MVP to reduce complexity. |

**Reused Technologies:**
- Next.js 14, React 18, TypeScript 5 (existing)
- Prisma 5.7.0, PostgreSQL (existing)
- NextAuth.js v5 (existing - extend with role field)
- Fuse.js 7.0.0 (existing - extend for community search)
- ShadCN UI, Tailwind CSS 3 (existing)
- Vercel Blob (existing - reuse upload pattern)
- React Hook Form 7, Zod 3 (existing)

---

## Database Schema Design

### New Tables (Extend Existing schema.prisma)

```prisma
// ==============================================
// COMMUNITY FEATURE MODELS
// ==============================================

model Post {
  id          String    @id @default(cuid())
  title       String
  slug        String    @unique // Generated from title for SEO-friendly URLs
  body        String    @db.Text // Rich text content (HTML from Tiptap)
  imageUrl    String?   // Optional post image (Vercel Blob)

  authorId    String
  author      User      @relation("PostAuthor", fields: [authorId], references: [id], onDelete: Cascade)

  communityId String
  community   Community @relation(fields: [communityId], references: [id], onDelete: Restrict)

  isPinned    Boolean   @default(false) // Admin feature
  isStaffPost Boolean   @default(false) // Auto-set if author.role == 'admin'

  upvotes     Upvote[]
  comments    Comment[]
  notifications Notification[]

  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  publishedAt DateTime? // For backdating migrated blog posts

  @@index([communityId])
  @@index([authorId])
  @@index([slug])
  @@index([isPinned, createdAt]) // Feed queries
  @@index([createdAt])
}

model Comment {
  id              String    @id @default(cuid())
  body            String    @db.Text

  postId          String
  post            Post      @relation(fields: [postId], references: [id], onDelete: Cascade)

  authorId        String
  author          User      @relation("CommentAuthor", fields: [authorId], references: [id], onDelete: Cascade)

  parentCommentId String?   // For threading (null = top-level comment)
  parentComment   Comment?  @relation("CommentThread", fields: [parentCommentId], references: [id], onDelete: Cascade)
  replies         Comment[] @relation("CommentThread")

  upvotes         Upvote[]
  notifications   Notification[]

  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@index([postId])
  @@index([authorId])
  @@index([parentCommentId])
  @@index([createdAt])
}

model Community {
  id          String   @id @default(cuid())
  name        String   @unique // e.g., "E30", "M3"
  slug        String   @unique // URL-friendly: "e30", "m3"
  description String?  @db.Text
  iconUrl     String?  // Optional community icon

  posts       Post[]

  createdAt   DateTime @default(now())

  @@index([slug])
}

model Upvote {
  id        String   @id @default(cuid())

  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  postId    String?  // Upvote on post (XOR with commentId)
  post      Post?    @relation(fields: [postId], references: [id], onDelete: Cascade)

  commentId String?  // Upvote on comment (XOR with postId)
  comment   Comment? @relation(fields: [commentId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())

  @@unique([userId, postId])    // Prevent duplicate upvotes on same post
  @@unique([userId, commentId]) // Prevent duplicate upvotes on same comment
  @@index([postId])
  @@index([commentId])
  @@index([userId])
}

model Notification {
  id        String   @id @default(cuid())

  userId    String   // Recipient
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  type      String   // 'post_reply', 'comment_reply', 'post_upvote', 'post_pinned'

  actorId   String?  // User who triggered notification (nullable for system actions)
  actor     User?    @relation("NotificationActor", fields: [actorId], references: [id], onDelete: SetNull)

  postId    String?  // Related post
  post      Post?    @relation(fields: [postId], references: [id], onDelete: Cascade)

  commentId String?  // Related comment
  comment   Comment? @relation(fields: [commentId], references: [id], onDelete: Cascade)

  read      Boolean  @default(false)

  createdAt DateTime @default(now())

  @@index([userId, read]) // Unread notifications query
  @@index([createdAt])
}

// ==============================================
// EXTEND EXISTING USER MODEL
// ==============================================

// Add to existing User model:
model User {
  // ... existing fields ...

  role              String         @default("user") // 'user' | 'admin'

  // Community relations
  posts             Post[]         @relation("PostAuthor")
  comments          Comment[]      @relation("CommentAuthor")
  upvotes           Upvote[]
  notifications     Notification[]
  notificationsSent Notification[] @relation("NotificationActor")

  // ... existing relations ...
}
```

**Migration Strategy:**
1. Generate migration: `npx prisma migrate dev --name add_community_tables`
2. Seed initial communities: Run seed script for 6 default communities
3. Update User.role: Add migration to set existing users to 'user', manually promote admin(s)

**Performance Indexes:**
- Feed queries: `isPinned + createdAt` composite for fast pinned posts
- Upvote aggregation: Individual indexes on `postId`, `commentId`
- Notification queries: `userId + read` composite for unread count
- Search integration: Community posts will be indexed by Fuse.js (see Search section)

---

## API Route Architecture

### New API Routes (app/api/community/*)

**Public Routes (no auth required):**
```
GET  /api/community/feed
     Query: ?page=1&limit=20&sort=popular|new|top&communityId=optional
     Response: { posts: Post[], pagination: { total, page, pages } }

GET  /api/community/posts/[id]
     Response: Post with author, community, upvoteCount, commentCount

GET  /api/community/communities
     Response: Community[] with postCount
```

**Authenticated Routes:**
```
POST /api/community/posts
     Body: { title, body, imageUrl?, communityId }
     Auth: Required
     Rate Limit: 5 posts/hour per user
     Response: Created Post

PATCH /api/community/posts/[id]
     Body: { title?, body?, imageUrl?, communityId? }
     Auth: Must own post OR be admin
     Response: Updated Post

DELETE /api/community/posts/[id]
     Auth: Must own post OR be admin
     Response: 204 No Content

POST /api/community/posts/[id]/comments
     Body: { body, parentCommentId? }
     Auth: Required
     Response: Created Comment

POST /api/community/posts/[id]/upvote
     Auth: Required
     Idempotent: Toggle upvote on/off
     Response: { upvoted: boolean, upvoteCount: number }

POST /api/community/comments/[id]/upvote
     Auth: Required
     Response: { upvoted: boolean, upvoteCount: number }
```

**Admin-Only Routes:**
```
PATCH /api/community/posts/[id]/pin
     Body: { isPinned: boolean }
     Auth: Admin only
     Max: 3 pinned posts at a time
     Response: Updated Post

GET  /api/community/admin/moderation
     Query: ?flagged=true
     Auth: Admin only
     Response: Flagged posts/comments for review
```

**Notifications:**
```
GET  /api/notifications
     Auth: Required
     Response: Notification[] (last 50, sorted by createdAt DESC)

PATCH /api/notifications/[id]/read
     Auth: Must own notification
     Response: Updated Notification

PATCH /api/notifications/read-all
     Auth: Required
     Response: { updated: number }
```

**Rate Limiting Strategy:**
- Post creation: 5 posts/hour per user (in-memory Map with cleanup)
- Comment creation: 30 comments/hour per user
- Upvotes: 100 upvotes/hour (prevent spam)
- Admin routes: No rate limiting

---

## Component Hierarchy

### Page Components (app/community/*)

```
app/
├── community/
│   ├── page.tsx                    # Feed page with sorting/filtering
│   ├── layout.tsx                  # Community layout with sidebar
│   ├── [slug]/page.tsx             # Community-specific feed
│   ├── posts/
│   │   ├── [id]/page.tsx           # Post detail page
│   │   └── new/page.tsx            # Create post form (protected)
│   └── users/
│       └── [userId]/page.tsx       # User community profile
│
├── admin/
│   └── community/
│       ├── page.tsx                # Admin dashboard
│       ├── migrate-blog/page.tsx   # Blog migration form
│       └── moderation/page.tsx     # Moderation queue
```

### Shared Components (components/community/*)

```
components/
└── community/
    ├── PostCard.tsx                 # Post preview in feed
    ├── PostDetail.tsx               # Full post with metadata
    ├── PostForm.tsx                 # Create/edit post form (Tiptap)
    ├── CommentThread.tsx            # Nested comment display
    ├── CommentForm.tsx              # Add comment/reply
    ├── UpvoteButton.tsx             # Upvote with optimistic UI
    ├── CommunityFilter.tsx          # Sidebar community list
    ├── StaffBadge.tsx               # "Staff" badge component
    ├── PinnedIndicator.tsx          # "Pinned" visual indicator
    ├── UserProfileCard.tsx          # Community profile summary
    ├── NotificationBell.tsx         # Header notification icon
    └── NotificationList.tsx         # Notification dropdown
```

### Component Patterns

**PostCard (Feed Item):**
- Polymorphic: Regular, Pinned, Staff variants
- Shows: Title, author, community, upvotes, comments, timestamp, thumbnail
- Optimistic UI: Upvote updates immediately
- Responsive: Stacked mobile, side-by-side desktop

**CommentThread (Recursive):**
- Max 3 levels of nesting (flatten deeper replies)
- Lazy load replies (show "View N replies" button)
- Inline edit/delete for own comments
- Optimistic upvoting

**PostForm (Tiptap Rich Text):**
- Toolbar: Bold, Italic, Heading, List, Link
- Image upload: Drag-drop or click (Vercel Blob)
- Auto-save drafts to localStorage (cleared on publish)
- Community selector dropdown
- Character count: Title (max 200), Body (max 10,000)

---

## Integration Patterns

### 1. Authentication Integration (Epic 5)

**Extend User Model:**
```typescript
// lib/auth/permissions.ts
export function isAdmin(user: User): boolean {
  return user.role === 'admin';
}

export function canEditPost(user: User, post: Post): boolean {
  return user.id === post.authorId || isAdmin(user);
}

export function canPinPost(user: User): boolean {
  return isAdmin(user);
}
```

**Middleware Protection:**
```typescript
// middleware.ts (extend existing)
export default async function middleware(req: NextRequest) {
  // Existing auth checks...

  // Community route protection
  if (req.nextUrl.pathname.startsWith('/community/posts/new')) {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.redirect(new URL('/signin', req.url));
    }
  }

  // Admin route protection
  if (req.nextUrl.pathname.startsWith('/admin/community')) {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }
}
```

### 2. Navigation Integration (Story 4.1)

**Add Community Link to Existing Navigation:**
```typescript
// components/shared/Navigation.tsx (modify)
<ul className="hidden gap-8 text-sm md:flex md:items-center">
  <li><NavLink href="/vehicles">Vehicles</NavLink></li>
  <li><NavLink href="/products">Parts</NavLink></li>
  <li><NavLink href="/community">Community</NavLink></li> {/* NEW */}
  <li><NavLink href="/services">Services</NavLink></li>
  <li><NavLink href="/about">About</NavLink></li>
  <li><NavLink href="/contact">Contact</NavLink></li>
</ul>
```

**Mobile Menu Update:**
```typescript
// components/shared/MobileMenu.tsx (modify)
// Add "Community" after "Parts" in mobile navigation
```

### 3. Search Integration (Epic 6, Story 6.1)

**Extend Fuse.js Indexer:**
```typescript
// lib/search/indexer.ts (extend existing)
export async function indexCommunityPosts(): Promise<SearchablePost[]> {
  const posts = await prisma.post.findMany({
    include: { author: true, community: true },
    orderBy: { createdAt: 'desc' },
  });

  return posts.map(post => ({
    type: 'post',
    id: post.id,
    title: post.title,
    description: post.body.substring(0, 200), // Excerpt
    slug: post.slug,
    handle: post.slug,
    community: post.community.name,
    author: post.author.name,
    createdAt: post.createdAt.toISOString(),
  }));
}

// Modify buildSearchIndex() to include posts
export async function buildSearchIndex() {
  const [vehicles, products, posts] = await Promise.all([
    indexVehicles(),
    indexProducts(),
    indexCommunityPosts(), // NEW
  ]);

  return [...vehicles, ...products, ...posts];
}
```

**Update Search Config:**
```typescript
// lib/search/fuse.ts (extend existing)
export const FUSE_CONFIG = {
  keys: [
    { name: 'title', weight: 2 },
    { name: 'description', weight: 1.5 },
    { name: 'community', weight: 1 }, // NEW for posts
    { name: 'author', weight: 0.5 },  // NEW for posts
    // ... existing keys ...
  ],
  // ... existing config ...
};
```

### 4. Image Upload Integration (Story 5.3)

**Reuse Vercel Blob Pattern:**
```typescript
// app/api/community/upload/route.ts (new)
import { put } from '@vercel/blob';
import { getServerSession } from 'next-auth';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const form = await request.formData();
  const file = form.get('file') as File;

  // Validate: max 5MB, common formats
  if (file.size > 5 * 1024 * 1024) {
    return new Response('File too large', { status: 400 });
  }

  const blob = await put(`community/posts/${Date.now()}-${file.name}`, file, {
    access: 'public',
  });

  return Response.json({ url: blob.url });
}
```

**PostForm Upload:**
```typescript
// components/community/PostForm.tsx
async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch('/api/community/upload', {
    method: 'POST',
    body: formData,
  });

  const { url } = await res.json();
  return url;
}
```

### 5. UI Component Integration (ShadCN)

**Reuse Existing Components:**
- `Button`, `Input`, `Textarea`, `Card`, `Badge`, `Tabs` (already installed)
- `Dialog` for confirmation modals (delete, report)
- `DropdownMenu` for post actions (edit, delete, report)
- `Separator` for comment threads
- `Avatar` for user profiles (from Story 5.3)

**New Community-Specific Components:**
- `UpvoteButton` - Custom with animation
- `RichTextEditor` - Tiptap wrapper
- `NotificationBell` - Custom badge counter

---

## Caching Strategy

### Feed Caching
```typescript
// app/community/page.tsx
export const revalidate = 60; // ISR: revalidate every 60 seconds

// For popular/top sorting (expensive aggregation)
const feedCache = new Map<string, { posts: Post[], timestamp: number }>();
const CACHE_TTL = 60 * 1000; // 1 minute
```

### Post Detail Caching
```typescript
// app/community/posts/[id]/page.tsx
export const revalidate = 300; // ISR: 5 minutes
export const dynamicParams = true; // Generate on-demand

export async function generateStaticParams() {
  // Pre-render top 100 most viewed posts at build time
  const posts = await prisma.post.findMany({
    take: 100,
    orderBy: { createdAt: 'desc' },
  });

  return posts.map(post => ({ id: post.id }));
}
```

### Cache Invalidation
```typescript
// On-demand revalidation after mutations
import { revalidatePath, revalidateTag } from 'next/cache';

// After creating post
revalidatePath('/community');
revalidatePath(`/community/${communitySlug}`);

// After deleting post
revalidatePath('/community');
revalidateTag(`post-${postId}`);
```

### React Query for Client-Side
```typescript
// For notifications and upvote counts
const { data: notifications } = useQuery({
  queryKey: ['notifications'],
  queryFn: fetchNotifications,
  refetchInterval: 30000, // Poll every 30s
});

// Optimistic upvoting
const upvoteMutation = useMutation({
  mutationFn: upvotePost,
  onMutate: async (postId) => {
    // Optimistically update UI
    await queryClient.cancelQueries(['post', postId]);
    const previous = queryClient.getQueryData(['post', postId]);

    queryClient.setQueryData(['post', postId], (old) => ({
      ...old,
      upvoteCount: old.upvoteCount + 1,
      userUpvoted: true,
    }));

    return { previous };
  },
  onError: (err, postId, context) => {
    // Rollback on error
    queryClient.setQueryData(['post', postId], context.previous);
  },
});
```

---

## Security Considerations

### 1. Rate Limiting

**In-Memory Rate Limiter:**
```typescript
// lib/community/rateLimiter.ts
const postLimits = new Map<string, number[]>(); // userId -> timestamps

export function checkPostRateLimit(userId: string): boolean {
  const now = Date.now();
  const userPosts = postLimits.get(userId) || [];

  // Keep only posts from last hour
  const recentPosts = userPosts.filter(t => now - t < 60 * 60 * 1000);

  if (recentPosts.length >= 5) {
    return false; // Limit exceeded
  }

  recentPosts.push(now);
  postLimits.set(userId, recentPosts);
  return true;
}

// Cleanup old entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [userId, timestamps] of postLimits) {
    const recent = timestamps.filter(t => now - t < 60 * 60 * 1000);
    if (recent.length === 0) {
      postLimits.delete(userId);
    } else {
      postLimits.set(userId, recent);
    }
  }
}, 10 * 60 * 1000);
```

### 2. XSS Prevention (Rich Text)

**Sanitize HTML from Tiptap:**
```typescript
import DOMPurify from 'isomorphic-dompurify';

// When saving post
const sanitizedBody = DOMPurify.sanitize(body, {
  ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'h2', 'h3', 'a'],
  ALLOWED_ATTR: ['href', 'target', 'rel'],
});

await prisma.post.create({
  data: { body: sanitizedBody, /* ... */ }
});
```

**Tiptap Configuration:**
```typescript
// Disable risky extensions
const editor = useEditor({
  extensions: [
    StarterKit.configure({
      // Disable code blocks, horizontal rule
      codeBlock: false,
      horizontalRule: false,
    }),
    Link.configure({
      // Force external links to open in new tab
      HTMLAttributes: { target: '_blank', rel: 'noopener noreferrer' },
    }),
    // Image extension (controlled upload only)
  ],
});
```

### 3. CSRF Protection

**All mutation routes use POST/PATCH/DELETE:**
- Next.js automatically adds CSRF tokens to forms
- API routes check request origin

### 4. Admin Permission Checks

**Server-Side Enforcement:**
```typescript
// app/api/community/posts/[id]/pin/route.ts
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== 'admin') {
    return new Response('Forbidden', { status: 403 });
  }

  // ... pin logic
}
```

**Never trust client-side role checks** - always verify on server

### 5. Content Moderation

**Basic Profanity Filter:**
```typescript
import Filter from 'bad-words';
const filter = new Filter();

// Flag but don't block (admin review)
const hasProfanity = filter.isProfane(body);

await prisma.post.create({
  data: {
    body,
    flagged: hasProfanity, // Admin review if true
    // ...
  }
});
```

**Spam Prevention:**
- Rate limiting (5 posts/hour)
- Honeypot field in forms (hidden field that bots fill)
- Admin moderation queue for flagged content

---

## Architecture Decision Records (ADRs)

### ADR-001: Rich Text Editor Choice (Tiptap)

**Decision:** Use Tiptap for post creation rich text editor

**Context:**
- Need WYSIWYG editing for post bodies
- Options: Tiptap, Slate, Lexical, Draft.js

**Rationale:**
- **Tiptap:** Headless, ProseMirror-based, excellent Next.js integration, active maintenance
- **Slate:** More complex API, steeper learning curve
- **Lexical:** Meta's new editor, less mature ecosystem
- **Draft.js:** Deprecated by Meta

**Consequences:**
- ✅ Modern, extensible architecture
- ✅ Easy to add mentions, embeds later
- ✅ Great TypeScript support
- ⚠️ Bundle size (~50kb) - acceptable for community feature

### ADR-002: Rate Limiting Strategy (In-Memory for MVP)

**Decision:** Use in-memory Map for rate limiting, defer Redis until scale requires it

**Context:**
- Need to prevent spam (5 posts/hour limit)
- Options: In-memory, Redis, Upstash Rate Limit

**Rationale:**
- **In-Memory:** Simple, zero infrastructure, sufficient for MVP (<1000 DAU)
- **Redis:** Adds infrastructure cost/complexity
- **Upstash:** Best for serverless, but MVP doesn't need it yet

**Consequences:**
- ✅ Zero additional infrastructure
- ✅ Fast (no network calls)
- ⚠️ Resets on server restart (acceptable for MVP)
- ⚠️ Doesn't work across multiple instances (acceptable for Vercel single-region)
- 🔄 Migrate to Redis when DAU > 1000 or multi-region

### ADR-003: Notification System Approach (Polling for MVP)

**Decision:** Use client-side polling (30s interval) for notifications, defer WebSockets/SSE

**Context:**
- Users need to see replies/upvotes in near-real-time
- Options: Polling, WebSockets, Server-Sent Events (SSE), Push API

**Rationale:**
- **Polling:** Simple, works everywhere, sufficient for MVP latency
- **WebSockets:** Complex infrastructure, overkill for low-traffic MVP
- **SSE:** Better than polling, but adds complexity
- **Push API:** Requires service worker, browser permissions

**Consequences:**
- ✅ Simple implementation (React Query)
- ✅ No infrastructure changes
- ✅ Works with existing serverless deployment
- ⚠️ 30s latency (acceptable for MVP)
- ⚠️ Slight overhead (30 req/user/hour)
- 🔄 Upgrade to SSE when real-time becomes critical

### ADR-004: Image Storage Strategy (Vercel Blob with folder structure)

**Decision:** Store post images in Vercel Blob under `community/posts/` folder

**Context:**
- Posts can include one image
- Already using Vercel Blob for avatar uploads (Story 5.3)

**Rationale:**
- Consistent with existing pattern
- No new infrastructure
- CDN-backed, global performance
- Simple pricing ($0.15/GB storage, $2/GB transfer)

**Folder Structure:**
```
vercel-blob/
├── avatars/          # From Story 5.3
│   └── {userId}-{timestamp}.jpg
└── community/
    └── posts/
        └── {postId}-{timestamp}-{filename}
```

**Consequences:**
- ✅ Consistent with existing uploads
- ✅ Global CDN performance
- ⚠️ Cost scales with usage (acceptable for MVP)
- 🔄 Consider compression/WebP conversion if costs grow

### ADR-005: Feed Pagination Strategy (Offset-based for MVP)

**Decision:** Use offset-based pagination (`?page=1&limit=20`) for community feed

**Context:**
- Need to paginate 100s-1000s of posts
- Options: Offset-based, Cursor-based

**Rationale:**
- **Offset:** Simple, familiar UX (page numbers), easy caching
- **Cursor:** Better for infinite scroll, more resilient to updates

**Consequences:**
- ✅ Simple implementation
- ✅ User-friendly page numbers
- ✅ Easy to cache by page
- ⚠️ Can miss posts if new posts created between pages (acceptable for MVP)
- 🔄 Migrate to cursor-based if infinite scroll becomes priority

### ADR-006: Community Search Integration

**Decision:** Extend existing Fuse.js infrastructure from Story 6.1 for community search

**Context:**
- Story 8.7 requires searching posts by keywords
- Story 6.1 already implemented Fuse.js for vehicles/parts search

**Rationale:**
- Consistent search experience across site
- Reuse existing indexer, caching, API patterns
- No additional dependencies

**Implementation:**
```typescript
// lib/search/types.ts (extend)
type SearchResult = VehicleResult | ProductResult | PostResult;

// lib/search/indexer.ts (extend)
async function indexCommunityPosts() { /* ... */ }
```

**Consequences:**
- ✅ Unified search experience
- ✅ No new dependencies
- ✅ Leverages existing caching (15min index TTL)
- ⚠️ Index rebuild time increases (posts added)
- 🔄 Consider Algolia/Meilisearch for advanced search if scale demands

---

## Proposed Source Tree

```
app/
├── community/                       # Community feature routes
│   ├── page.tsx                     # Feed page (SSR with ISR)
│   ├── layout.tsx                   # Community layout with sidebar
│   ├── [slug]/
│   │   └── page.tsx                 # Community-specific feed
│   ├── posts/
│   │   ├── [id]/
│   │   │   └── page.tsx             # Post detail (SSG with ISR)
│   │   └── new/
│   │       └── page.tsx             # Create post form (protected)
│   └── users/
│       └── [userId]/
│           ├── page.tsx             # User community profile
│           └── loading.tsx          # Loading state
│
├── admin/
│   └── community/
│       ├── page.tsx                 # Admin dashboard
│       ├── migrate-blog/
│       │   └── page.tsx             # Blog migration form
│       └── moderation/
│           └── page.tsx             # Moderation queue
│
├── api/
│   ├── community/
│   │   ├── feed/
│   │   │   └── route.ts             # GET feed with sorting/filtering
│   │   ├── posts/
│   │   │   ├── route.ts             # POST create post
│   │   │   └── [id]/
│   │   │       ├── route.ts         # GET/PATCH/DELETE post
│   │   │       ├── comments/
│   │   │       │   └── route.ts     # POST comment
│   │   │       ├── upvote/
│   │   │       │   └── route.ts     # POST toggle upvote
│   │   │       └── pin/
│   │   │           └── route.ts     # PATCH pin (admin)
│   │   ├── comments/
│   │   │   └── [id]/
│   │   │       ├── route.ts         # PATCH/DELETE comment
│   │   │       └── upvote/
│   │   │           └── route.ts     # POST toggle upvote
│   │   ├── communities/
│   │   │   └── route.ts             # GET list communities
│   │   ├── upload/
│   │   │   └── route.ts             # POST image upload
│   │   └── admin/
│   │       └── moderation/
│   │           └── route.ts         # GET flagged content
│   └── notifications/
│       ├── route.ts                 # GET notifications
│       ├── [id]/
│       │   └── read/
│       │       └── route.ts         # PATCH mark read
│       └── read-all/
│           └── route.ts             # PATCH mark all read
│
components/
├── community/                       # Community components
│   ├── PostCard.tsx                 # Post preview card
│   ├── PostDetail.tsx               # Full post display
│   ├── PostForm.tsx                 # Create/edit form (Tiptap)
│   ├── CommentThread.tsx            # Recursive comment tree
│   ├── CommentForm.tsx              # Add comment/reply
│   ├── CommentItem.tsx              # Single comment display
│   ├── UpvoteButton.tsx             # Upvote with animation
│   ├── CommunityFilter.tsx          # Sidebar filter
│   ├── CommunitySidebar.tsx         # Left sidebar layout
│   ├── StaffBadge.tsx               # "Staff" badge
│   ├── PinnedIndicator.tsx          # "Pinned" indicator
│   ├── UserProfileCard.tsx          # Profile summary
│   ├── FeedSortTabs.tsx             # Popular/New/Top tabs
│   └── NotificationBell.tsx         # Header bell icon
│
lib/
├── community/
│   ├── rateLimiter.ts               # In-memory rate limiter
│   ├── permissions.ts               # Permission checks
│   ├── notifications.ts             # Notification helpers
│   └── slugify.ts                   # Slug generation from titles
│
├── search/                          # Extend existing
│   └── indexer.ts                   # Add indexCommunityPosts()
│
prisma/
├── schema.prisma                    # Add 5 new models
└── migrations/
    └── 20251028_add_community_tables/
        └── migration.sql
│
types/
└── community.ts                     # Community-specific types
    └── (Post, Comment, Community, Upvote, Notification types)
```

---

## Implementation Guidance

### Phase 1: Epic 9 - Core Community Platform (4 weeks)

**Week 1: Foundation**
- Story 9.1: Database schema and migrations
- Story 9.2: Feed page with basic display

**Week 2: Discovery**
- Story 9.3: Community filtering and sidebar
- Story 9.5: Post detail page

**Week 3: Interaction**
- Story 9.4: Create post interface (Tiptap integration)
- Story 9.6: Comment system

**Week 4: Polish**
- Story 9.7: Upvoting system with optimistic UI
- Story 9.8: User community profile

### Phase 2: Epic 10 - Admin Tools (3 weeks)

**Week 5: Admin Foundation**
- Story 10.1: Admin role integration
- Story 10.2: Staff badge system
- Story 10.3: Pin and feature posts

**Week 6: Content Management**
- Story 10.4: Blog migration interface
- Story 10.5: Content moderation tools

**Week 7: Engagement Features**
- Story 10.7: Community search (Fuse.js integration)
- Story 10.6: Notification system

### Recommended Development Order

1. **Start with data models** (Story 9.1) - Foundation for everything
2. **Build feed infrastructure** (Story 9.2) - Core UX
3. **Add filtering** (Story 9.3) - Enhances discovery
4. **Create post detail** (Story 9.5) - Required before creation
5. **Implement post creation** (Story 9.4) - Content generation
6. **Add comments** (Story 9.6) - Engagement layer
7. **Add upvoting** (Story 9.7) - Gamification
8. **Build profiles** (Story 9.8) - User identity
9. **Admin features** (Epic 10) - Curation tools

### Testing Strategy

**Unit Tests:**
- Rate limiter logic (5 posts/hour enforcement)
- Permission checks (canEditPost, canPinPost)
- Slug generation (title → URL-safe slug)
- Notification creation logic

**Integration Tests:**
- API routes (POST /api/community/posts, GET /api/community/feed)
- Feed sorting (Popular, New, Top)
- Upvote toggling (idempotency)
- Comment threading (parent/child relationships)

**E2E Tests (Playwright):**
- Create post flow (fill form, upload image, submit)
- Comment and reply flow
- Upvote interaction with optimistic UI
- Admin pin post functionality
- Notification badge update

### Performance Targets

- **Feed load:** <2s (NFR001) - Achieved via ISR caching
- **Post creation:** <1s (NFR001) - Optimistic UI + background save
- **Comment submission:** <1s - Optimistic updates
- **Notification poll:** <500ms - Simple query on indexed fields
- **Search query:** <300ms - Fuse.js in-memory search

---

## Epic-to-Component Mapping

| Epic | Stories | Key Components | Data Models | API Routes | Integration Points |
|------|---------|----------------|-------------|------------|-------------------|
| **Epic 9: Core Platform** | 8 stories (44 pts) | PostCard, PostForm, CommentThread, UpvoteButton, CommunityFilter | Post, Comment, Community, Upvote | /api/community/feed, /posts, /comments, /upvote | NextAuth (User), Navigation, Search, Vercel Blob |
| **Epic 10: Admin Tools** | 7 stories (34 pts) | StaffBadge, PinnedIndicator, NotificationBell, MigrationForm, ModerationQueue | User.role, Notification | /api/notifications, /admin/moderation, /posts/[id]/pin | NextAuth roles, Fuse.js search |

---

## Next Steps

### Before Starting Implementation

1. **Review existing architecture:**
   - [ ] `prisma/schema.prisma` - Understand User model for role extension
   - [ ] `lib/auth/` - NextAuth configuration and session handling
   - [ ] `lib/search/` - Fuse.js patterns for community search
   - [ ] `components/shared/Navigation.tsx` - Add Community link
   - [ ] `app/api/user/avatar/upload/route.ts` - Image upload pattern

2. **Install new dependencies:**
```bash
npm install @tiptap/react@^2.1.0 @tiptap/starter-kit@^2.1.0 @tiptap/extension-link@^2.1.0
npm install bad-words@^3.0.4 isomorphic-dompurify@^2.11.0
npm install --save-dev @types/bad-words
```

3. **Set up Prisma:**
```bash
# Add models to schema.prisma
# Generate migration
npx prisma migrate dev --name add_community_tables

# Create seed script for initial communities
# Update seed.ts with 6 default communities
```

4. **Update workflow status:**
   - Renumber Community epics: 7→9, 8→10
   - Add 15 stories to main backlog
   - Update dependencies in bmm-workflow-status.md

### Epic 9: Story Implementation Order

```
Story 9.1 (Foundation) → Story 9.2 (Feed) → Story 9.3 (Filtering)
→ Story 9.5 (Detail) → Story 9.4 (Creation) → Story 9.6 (Comments)
→ Story 9.7 (Upvotes) → Story 9.8 (Profiles)
```

### Integration Checklist

Before each story:
- [ ] Review related existing code (auth, search, UI patterns)
- [ ] Identify reusable components
- [ ] Check for breaking changes to existing features
- [ ] Plan cache invalidation strategy
- [ ] Define API contract before implementation

---

## Document Status

- [x] Architecture pattern defined (Next.js monolith extension)
- [x] Database schema designed (5 new tables)
- [x] API routes architected (20+ endpoints)
- [x] Component hierarchy defined
- [x] Integration patterns documented
- [x] Security considerations addressed
- [x] ADRs recorded (6 key decisions)
- [x] Source tree proposed
- [x] Implementation guidance provided
- [ ] Tech specs generated per epic
- [ ] Ready for Story 9.1 implementation

**Status:** Architecture Complete - Ready for Implementation

---

**Next Action:** Generate tech specs for Epic 9 and Epic 10, then begin Story 9.1 (Database Schema)

**Reference Documents:**
- PRD: `docs/PRD-Community.md`
- Epic Breakdown: `docs/epic-stories-community.md`
- Main Project Status: `docs/bmm-workflow-status.md`
- This Architecture: `docs/solution-architecture-community.md`
