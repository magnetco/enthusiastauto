# Enthusiast Auto Community Feature - Epic Breakdown

**Author:** Mike
**Date:** 2025-10-28
**Project Level:** 2 (Focused feature system)
**Target Scale:** 2 epics, 15 stories, 60-70 story points

---

## Epic Overview

This document breaks down the Community Feature into two sequential epics designed for phased delivery. Epic 7 delivers the core community experience for MVP launch, while Epic 8 adds administrative tools and content curation capabilities.

**Epic Summary:**
- **Epic 7: Core Community Platform** - 8 stories, 35-40 points (Phase 1)
- **Epic 8: Admin Tools & Content Management** - 7 stories, 25-30 points (Phase 2)

---

## Epic Details

### Epic 7: Core Community Platform (MVP Foundation)

**Epic Goal:** Deliver the essential community experience that enables users to create, discover, and engage with posts in a topic-organized feed.

**Value Proposition:** Transforms Enthusiast Auto from passive marketplace to active community, enabling enthusiasts to share knowledge, ask questions, and connect with peers around their passion for BMW vehicles.

**User Stories:**

#### Story 7.1: Community Data Models & Database Schema
**As a** system architect
**I want** well-designed database schema for community features
**So that** we can store posts, comments, communities, and upvotes efficiently with proper relationships

**Acceptance Criteria:**
- Prisma schema includes Post model (id, title, body, imageUrl, authorId, communityId, isPinned, isStaffPost, createdAt, updatedAt)
- Comment model with threading support (id, body, postId, authorId, parentCommentId, createdAt)
- Community model (id, name, slug, description, iconUrl)
- Upvote model with polymorphic support (id, userId, postId?, commentId?, createdAt)
- Proper foreign keys and indexes for performance
- Migration files generated and tested

**Estimated Points:** 3

---

#### Story 7.2: Community Feed Page with Sorting & Pagination
**As a** user
**I want** to view a chronological feed of community posts with sorting options
**So that** I can discover relevant content and see what's trending

**Acceptance Criteria:**
- `/community` route displays paginated feed (20 posts per page)
- Sort options: Popular (upvotes), New (chronological), Top (all-time upvotes)
- Post cards show: title, author, community badge, upvote count, comment count, thumbnail, excerpt, timestamp
- Pinned posts appear at top with visual distinction
- Staff posts display badge
- Loading states and empty states
- Mobile-responsive design

**Estimated Points:** 5

---

#### Story 7.3: Community Organization & Filtering
**As a** user
**I want** to filter posts by community/category
**So that** I can focus on topics relevant to my interests (e.g., E30, M3, Parts & Builds)

**Acceptance Criteria:**
- Left sidebar shows community list with post counts
- Click community filters feed to that community only
- `/community/[slug]` route for community-specific pages
- Seed initial communities: General Discussion, E30, E36, E46, M3, Parts & Builds
- Community pages show description and member count
- "All Communities" option to reset filter

**Estimated Points:** 5

---

#### Story 7.4: Create Post Interface
**As a** logged-in user
**I want** to create posts with rich text and images
**So that** I can share my experiences and ask questions

**Acceptance Criteria:**
- "+ New Post" button prominent on feed page
- Create post form: title (required), rich text body (required), image upload (optional), community selection (required)
- Rich text editor supports: bold, italic, lists, links, headings
- Image upload with preview (max 5MB, common formats)
- Client-side validation and error handling
- Success confirmation and redirect to new post
- Rate limiting: 5 posts per hour per user

**Estimated Points:** 8

---

#### Story 7.5: Post Detail Page
**As a** user
**I want** to view full post content with engagement metrics
**So that** I can read the complete post and see its popularity

**Acceptance Criteria:**
- `/community/posts/[id]` route displays full post
- Shows: title, author name/avatar, community badge, timestamp, full body content, images at full size
- Displays upvote count and comment count
- Staff badge if admin post
- Pinned indicator if pinned
- Edit/Delete buttons if user owns post
- SEO metadata: title, description, Open Graph tags
- Mobile-responsive layout

**Estimated Points:** 5

---

#### Story 7.6: Comment System
**As a** user
**I want** to add comments to posts and reply to other comments
**So that** I can participate in discussions

**Acceptance Criteria:**
- Comment form below post content
- Comments display: author, avatar, body text, timestamp, upvote count
- Reply button creates nested comment thread
- Comment threads indented visually (max 3 levels)
- Edit/Delete own comments
- Real-time optimistic UI updates
- Validation: required body text, max 2000 characters

**Estimated Points:** 8

---

#### Story 7.7: Upvoting System
**As a** user
**I want** to upvote posts and comments
**So that** I can signal quality content and help surface valuable contributions

**Acceptance Criteria:**
- Upvote button on posts and comments
- Toggle upvote on/off (no downvotes for MVP)
- Optimistic UI updates
- Vote count displays next to button
- Visual indicator when user has upvoted
- Prevents multiple upvotes per user per item
- Updates sort order when sorting by Popular/Top

**Estimated Points:** 5

---

#### Story 7.8: User Community Profile
**As a** user
**I want** a profile page showing my community activity
**So that** I can track my contributions and others can see my engagement

**Acceptance Criteria:**
- `/community/users/[userId]` route displays user profile
- Shows: username, avatar, join date, bio (optional)
- Tabs: Posts, Comments, Activity
- Posts tab: list of user's posts with engagement metrics
- Comments tab: recent comments with context links
- Activity summary: total posts, total comments, total upvotes received
- Edit profile button if viewing own profile

**Estimated Points:** 5

---

**Epic 7 Total:** 8 stories, 44 estimated points

---

### Epic 8: Admin Tools & Content Management

**Epic Goal:** Provide site administrators with tools to curate content, migrate blog posts, and maintain community quality.

**Value Proposition:** Enables admins to feature quality content, maintain community standards, and seamlessly integrate official blog content into the community feed.

**User Stories:**

#### Story 8.1: Admin Role Integration with NextAuth
**As a** system administrator
**I want** admin roles properly integrated with existing auth
**So that** I can access admin-only features securely

**Acceptance Criteria:**
- Extend User model with `role` field (user, admin)
- Middleware checks for admin role
- Admin UI components only render for admin users
- Seed script to promote initial admin user
- Role displayed in user profile
- Cannot self-promote to admin (requires database update)

**Estimated Points:** 3

---

#### Story 8.2: Staff/Official Badge System
**As a** site administrator
**I want** my posts to display a Staff badge
**So that** users can distinguish official content from user posts

**Acceptance Criteria:**
- Posts created by admin users automatically marked `isStaffPost: true`
- "Staff" or "Official" badge displays prominently on post cards
- Badge appears in feed, detail page, and profile views
- Visual styling distinguishes from regular posts (color, icon)
- Can toggle staff badge on/off when creating post (checkbox)

**Estimated Points:** 3

---

#### Story 8.3: Pin and Feature Posts
**As a** site administrator
**I want** to pin important posts to the top of the feed
**So that** I can ensure announcements and featured content are visible

**Acceptance Criteria:**
- Admin UI shows "Pin Post" button on posts
- Pinned posts appear at top of feed with "Pinned" indicator
- Can pin up to 3 posts simultaneously
- Pin/unpin toggle functionality
- Pinned posts maintain chronological order among themselves
- Admin-only feature (regular users cannot pin)

**Estimated Points:** 5

---

#### Story 8.4: Blog Post Migration Interface
**As a** site administrator
**I want** a form to manually migrate blog posts
**So that** I can reformat existing blog content as community posts

**Acceptance Criteria:**
- Admin-only `/admin/migrate-blog` page
- Form fields: title, body (rich text), image, community, publish date (custom backdating)
- Preview before publishing
- Automatically marks as staff post and pins option
- List of migrated posts with edit/delete
- Import confirmation and success message

**Estimated Points:** 5

---

#### Story 8.5: Basic Content Moderation
**As a** site administrator
**I want** moderation tools to maintain community quality
**So that** I can remove spam and enforce community guidelines

**Acceptance Criteria:**
- Admin can edit any post or comment
- Admin can delete any post or comment with confirmation
- Rate limiting: 5 posts/hour per user (system-wide)
- Basic profanity filter flagging (warning, not blocking)
- Admin moderation log of actions
- Report post/comment button for users (flags for admin review)

**Estimated Points:** 5

---

#### Story 8.6: Basic Notification System
**As a** user
**I want** notifications for engagement on my content
**So that** I know when people interact with my posts

**Acceptance Criteria:**
- Notification bell icon in header with unread count
- Notifications for: replies to my posts, replies to my comments, upvotes on my posts
- Notification list shows: type, actor, content preview, timestamp
- Mark as read functionality
- Link to relevant post/comment
- Email notifications (optional, default off for MVP)

**Estimated Points:** 8

---

#### Story 8.7: Community Search & Discovery
**As a** user
**I want** to search posts by keywords
**So that** I can find specific topics and past discussions

**Acceptance Criteria:**
- Search bar in community header
- Search queries post titles and body content
- Results show matching posts with highlighted keywords
- Filter results by community
- Sort results by relevance or date
- Empty state for no results with suggestions
- Leverage existing search infrastructure from Story 6.1 if possible

**Estimated Points:** 5

---

**Epic 8 Total:** 7 stories, 34 estimated points

---

## Summary

**Total Scope:**
- 2 Epics
- 15 Stories
- 78 Estimated Story Points

**Phased Delivery Plan:**
1. **Phase 1: Epic 7 (Core Community Platform)** - 8 stories, 44 points
   - Delivers MVP community experience for early user testing
   - Enables basic user engagement and content creation

2. **Phase 2: Epic 8 (Admin Tools & Content Management)** - 7 stories, 34 points
   - Adds content curation and blog migration
   - Completes moderation and notification features

---

## Dependencies & Integration

### External Epic Dependencies

**Epic 7 (Core Community Platform) depends on:**
- ✅ **Epic 5: User Management System** (COMPLETE)
  - Story 5.1: NextAuth.js authentication → Required for user identity
  - Story 5.2: Social login → Enables OAuth users to participate
  - Story 5.3: User profiles → Foundation for community profiles (Story 7.8)
  - User/Account tables → Author relationships for posts/comments

- ⚠️ **Epic 6: Advanced Search & Discovery** (PARTIAL - 2/4 stories complete)
  - Story 6.1: Search infrastructure → Can be leveraged for Story 8.7
  - Fuse.js integration → Reusable pattern for community search

**Epic 8 (Admin Tools) depends on:**
- 🔴 **Epic 7: Core Community Platform** (NEW - must complete Phase 1 first)
  - All of Epic 7 → Admin tools operate on community content
  - Post/Comment models → Required for moderation features
  - Community feed → Pin/feature functionality needs existing feed

- ✅ **Epic 5: User Management System** (COMPLETE)
  - User.role field → Story 8.1 extends this for admin permissions

### Story-Level Dependencies

**Epic 7 Internal Sequence:**
```
Story 7.1: Data Models (FOUNDATIONAL - Week 1)
    ↓
Story 7.2: Feed Page (Week 1-2)
    ├─→ Story 7.3: Filtering (Week 2)
    ├─→ Story 7.5: Post Detail (Week 2)
    └─→ Story 7.8: User Profile (Week 3-4)
    ↓
Story 7.4: Create Post (Week 2-3)
    ↓
Story 7.6: Comments (Week 3)
    ↓
Story 7.7: Upvoting (Week 3)
```

**Epic 8 Internal Sequence:**
```
Story 8.1: Admin Role (FOUNDATIONAL - Week 5)
    ↓
Story 8.2: Staff Badge (Week 5)
Story 8.3: Pin Posts (Week 5)
    ↓
Story 8.4: Blog Migration (Week 6)
Story 8.5: Moderation (Week 6)
    ↓
Story 8.7: Search (Week 7)
Story 8.6: Notifications (Week 7)
```

### Integration Points & Risk Areas

**🔴 HIGH IMPACT INTEGRATION POINTS:**

1. **Auth Integration (Story 7.1, 8.1)**
   - Community must use existing NextAuth sessions from Epic 5
   - **Risk:** Role confusion between admin/user permissions
   - **Mitigation:** Story 8.1 explicitly extends existing User model with role field
   - **Code Impact:** Leverage `lib/auth/`, `middleware.ts` from Stories 5.1-5.3

2. **Navigation Integration**
   - "Community" link must integrate with main nav header from Story 4.1
   - **Risk:** Breaking existing navigation patterns from Stories 4.1, 6.2
   - **Mitigation:** Add Community link using same DesktopNavbar/ExpandedNavbar patterns
   - **Code Impact:** Modify `components/layout/desktop-navbar.tsx`, `components/layout/expanded-navbar.tsx`

3. **Database Migration (Story 7.1)**
   - New tables: Post, Comment, Community, Upvote, Notification
   - **Risk:** Schema conflicts or performance degradation
   - **Mitigation:** Proper indexing from start, foreign keys to existing User table
   - **Code Impact:** Prisma schema extensions, new migration files

**🟡 MEDIUM IMPACT INTEGRATION POINTS:**

4. **Search Integration (Story 8.7)**
   - Should reuse Fuse.js infrastructure from Story 6.1
   - **Opportunity:** Unified search across vehicles, parts, AND community posts
   - **Enhancement:** Story 8.7 AC should explicitly state "Leverage lib/search/fuse.ts and lib/search/unified.ts patterns"
   - **Code Impact:** Extend `lib/search/unified.ts`, add community indexing

5. **User Profile Extension (Story 7.8)**
   - Community profile extends existing profile from Story 5.3
   - **Risk:** Profile page fragmentation (account settings vs community activity)
   - **Mitigation:** Use separate routes: `/account/profile` (settings) vs `/community/users/[id]` (community activity)
   - **Code Impact:** New route, reuse user avatar/name components

6. **Image Upload (Story 7.4)**
   - Post creation needs image upload capability
   - **Assumption:** Vercel Blob already configured from Story 5.3 (avatar uploads)
   - **Code Impact:** Reuse `app/api/user/avatar/upload/route.ts` pattern for post images

**🟢 LOW IMPACT:**

7. **Notification System (Story 8.6)**
   - Isolated feature, simple database polling for MVP
   - **Future:** Could integrate with broader notification system later
   - **Code Impact:** New Notification table, simple API route

### Identified Gaps & Recommendations

**⚠️ GAPS TO ADDRESS:**

1. **Story 8.7 Enhancement:**
   - **Current:** "Search posts by keywords"
   - **Recommended:** Add to AC: "Leverage existing Fuse.js infrastructure from Story 6.1 (lib/search/fuse.ts) for consistent search experience"

2. **Navigation Integration Story:**
   - **Gap:** No explicit story for adding Community to main navigation
   - **Recommendation:** Add as Story 7.0 or fold into Story 7.2
   - **Tasks:** Modify DesktopNavbar, add mobile link, active state highlighting
   - **Estimated Points:** 2 points if separate, or expand Story 7.2 from 5 to 6 points

3. **Image Upload Infrastructure Verification:**
   - **Assumption:** Vercel Blob configured in Story 5.3
   - **Action:** Verify before starting Story 7.4, or add image upload setup tasks

### Recommended Implementation Order

**Phase 1: Epic 7 (4 weeks)**
```
Week 1:
- Story 7.1: Data Models & Schema (3 pts)
- Story 7.2: Feed Page (5 pts) ← Include nav integration

Week 2:
- Story 7.3: Community Filtering (5 pts)
- Story 7.5: Post Detail Page (5 pts)

Week 3:
- Story 7.4: Create Post Interface (8 pts)
- Story 7.6: Comment System (8 pts)

Week 4:
- Story 7.7: Upvoting System (5 pts)
- Story 7.8: User Community Profile (5 pts)
```

**Phase 2: Epic 8 (3 weeks)**
```
Week 5:
- Story 8.1: Admin Role Integration (3 pts)
- Story 8.2: Staff Badge System (3 pts)
- Story 8.3: Pin and Feature Posts (5 pts)

Week 6:
- Story 8.4: Blog Migration Interface (5 pts)
- Story 8.5: Content Moderation (5 pts)

Week 7:
- Story 8.7: Community Search (5 pts) ← Leverage Story 6.1
- Story 8.6: Notification System (8 pts)
```

**Risk Mitigation:**
- MVP scope kept lean to enable early validation
- Phased delivery allows iteration based on user feedback
- Notification system kept basic to avoid complexity
- Manual blog migration avoids complex automation
- Reuse existing patterns from Epics 5 & 6 for faster development
