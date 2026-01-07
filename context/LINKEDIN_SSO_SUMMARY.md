# LinkedIn SSO - Quick Reference

**Linear Issue:** PROD-15287  
**Status:** Planned  
**Priority:** Medium  
**Estimated Effort:** 8-10 hours  

---

## Overview

Add LinkedIn as a third OAuth provider to enable professional BMW enthusiasts to sign in with their LinkedIn accounts.

## Why LinkedIn?

- **Target audience alignment:** Our users are 35-65 year old professionals and high-net-worth individuals
- **Reduced friction:** One-click sign-in for users who prefer LinkedIn over Google
- **Trust signal:** LinkedIn verification adds credibility
- **Professional network:** Aligns with BMW enthusiast community networking

## Implementation Summary

### 1. Setup (30 min)
- Create LinkedIn app in Developer Portal
- Configure OAuth redirect URLs
- Add environment variables to Vercel

### 2. Code Changes (2-3 hours)
- Add `LinkedInProvider` to `/website/lib/auth/config.ts`
- Add LinkedIn button to `/website/app/auth/signin/page.tsx`
- Add LinkedIn button to `/website/app/auth/signup/page.tsx`

### 3. Testing (2-3 hours)
- Unit tests for LinkedIn provider configuration
- Integration tests for sign-up/sign-in flows
- Cross-browser testing
- Mobile testing

### 4. Deployment (1 hour)
- Update documentation
- Deploy to staging → production
- Monitor adoption metrics

## Key Files to Modify

```
website/
├── lib/auth/config.ts                    # Add LinkedInProvider
├── app/auth/signin/page.tsx              # Add LinkedIn button
├── app/auth/signup/page.tsx              # Add LinkedIn button
└── lib/auth/__tests__/oauth-config.test.ts  # Add LinkedIn tests
```

## Environment Variables Required

```bash
LINKEDIN_CLIENT_ID=your_client_id_here
LINKEDIN_CLIENT_SECRET=your_client_secret_here
```

## Success Metrics

- **Week 1:** 5+ successful LinkedIn sign-ins (internal testing)
- **Month 1:** 10-15% of new sign-ups use LinkedIn
- **Ongoing:** <1% OAuth error rate

## Dependencies

- NextAuth.js v5 (already installed)
- LinkedIn Developer account (to be created)
- Vercel environment variable access (already have)

## Risks

| Risk | Mitigation |
|------|------------|
| Low adoption | Prominent placement on sign-in page, marketing announcement |
| LinkedIn API changes | Monitor changelog, test regularly |
| Account linking conflicts | Clear error messages, documentation |

## Next Steps

1. ✅ **Planning complete** - Feature plan written to `/context/LINKEDIN_SSO_FEATURE_PLAN.md`
2. ⏳ **LinkedIn app setup** - Create app in LinkedIn Developer Portal
3. ⏳ **Implementation** - Add LinkedIn provider and UI buttons
4. ⏳ **Testing** - Unit, integration, and cross-browser tests
5. ⏳ **Deployment** - Staging → Production rollout
6. ⏳ **Monitoring** - Track adoption and error rates

## Reference Documents

- **Detailed Plan:** `/context/LINKEDIN_SSO_FEATURE_PLAN.md` (comprehensive implementation guide)
- **Roadmap Entry:** `/context/ROADMAP.md` (planned features section)
- **Architecture:** `/context/ARCHITECTURE.md` (authentication section)

## Quick Links

- [NextAuth LinkedIn Provider Docs](https://next-auth.js.org/providers/linkedin)
- [LinkedIn OAuth Documentation](https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/sign-in-with-linkedin-v2)
- [LinkedIn Developer Portal](https://www.linkedin.com/developers/apps)

---

**Ready to implement?** Follow the detailed plan in `LINKEDIN_SSO_FEATURE_PLAN.md`
