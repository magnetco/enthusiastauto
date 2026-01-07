# LinkedIn SSO - Documentation Index

**Linear Issue:** PROD-15287  
**Status:** Planning Complete ✅  
**Next Step:** LinkedIn Developer Setup  

---

## Quick Links

| Document | Purpose | Audience | Read Time |
|----------|---------|----------|-----------|
| **[Summary](./LINKEDIN_SSO_SUMMARY.md)** | High-level overview and quick reference | Everyone | 3 min |
| **[Feature Plan](./LINKEDIN_SSO_FEATURE_PLAN.md)** | Comprehensive implementation guide | Product, Engineering | 20 min |
| **[Technical Spec](./LINKEDIN_SSO_TECH_SPEC.md)** | Detailed technical specification | Engineering, QA | 15 min |
| **[Checklist](./LINKEDIN_SSO_CHECKLIST.md)** | Step-by-step implementation checklist | Developer | 5 min |

---

## Document Overview

### 1. [LINKEDIN_SSO_SUMMARY.md](./LINKEDIN_SSO_SUMMARY.md)
**Quick Reference Guide**

Start here for a high-level understanding of the feature.

**Contents:**
- Overview and business rationale
- Implementation summary (4 phases)
- Key files to modify
- Environment variables required
- Success metrics
- Next steps

**Best for:**
- Product managers reviewing the feature
- Stakeholders wanting a quick overview
- Developers getting started

---

### 2. [LINKEDIN_SSO_FEATURE_PLAN.md](./LINKEDIN_SSO_FEATURE_PLAN.md)
**Comprehensive Implementation Guide**

The most detailed document covering all aspects of the feature.

**Contents:**
- Executive summary with business value
- Technical architecture diagrams
- Implementation plan (4 phases)
- Security considerations
- Rollout strategy
- Monitoring & analytics
- Maintenance & support
- Risks & mitigation
- Future enhancements

**Best for:**
- Developers implementing the feature
- Technical leads reviewing the architecture
- Product managers planning the rollout
- QA engineers designing test plans

---

### 3. [LINKEDIN_SSO_TECH_SPEC.md](./LINKEDIN_SSO_TECH_SPEC.md)
**Technical Specification**

Detailed technical specification for code review and implementation.

**Contents:**
- System architecture diagrams
- Data flow diagrams
- Implementation details (code snippets)
- API specifications
- Security considerations
- Testing strategy
- Performance considerations
- Monitoring & observability
- Acceptance criteria

**Best for:**
- Developers writing code
- Code reviewers
- QA engineers writing tests
- DevOps engineers setting up monitoring

---

### 4. [LINKEDIN_SSO_CHECKLIST.md](./LINKEDIN_SSO_CHECKLIST.md)
**Implementation Checklist**

Step-by-step checklist for implementation and deployment.

**Contents:**
- Phase 1: LinkedIn Developer Setup (30 min)
- Phase 2: Code Implementation (2-3 hours)
- Phase 3: Testing (2-3 hours)
- Phase 4: Documentation & Deployment (1 hour)
- Phase 5: Launch & Marketing (1-2 hours)
- Success criteria
- Rollback plan

**Best for:**
- Developers actively implementing the feature
- QA engineers running test scenarios
- DevOps engineers deploying to production
- Project managers tracking progress

---

## Implementation Workflow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Read Summary                                             │
│    └─> Understand business value and high-level approach   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Review Feature Plan                                      │
│    └─> Understand detailed architecture and rollout plan   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Study Technical Spec                                     │
│    └─> Review code snippets and API specifications         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Follow Checklist                                         │
│    └─> Execute step-by-step implementation                 │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. Deploy & Monitor                                         │
│    └─> Launch feature and track success metrics            │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Information

### Business Value
- **Target audience alignment:** Professional BMW enthusiasts (35-65, high-net-worth)
- **Reduced friction:** One-click sign-in for LinkedIn users
- **Trust signal:** LinkedIn verification adds credibility
- **Target adoption:** 10-15% of new sign-ups within 3 months

### Technical Approach
- **Framework:** NextAuth.js v5 with LinkedIn provider
- **OAuth 2.0:** OpenID Connect (OIDC) standard
- **Scopes:** `openid profile email` (minimal permissions)
- **Database:** Existing Prisma schema (no changes required)
- **Session:** JWT with 30-day expiration

### Estimated Effort
- **Total:** 8-10 hours
- **Setup:** 30 minutes
- **Development:** 2-3 hours
- **Testing:** 2-3 hours
- **Documentation:** 1 hour
- **Deployment:** 2-3 hours

### Files to Modify
1. `/workspace/website/lib/auth/config.ts` - Add LinkedIn provider
2. `/workspace/website/app/auth/signin/page.tsx` - Add LinkedIn button
3. `/workspace/website/app/auth/signup/page.tsx` - Add LinkedIn button
4. `/workspace/website/lib/auth/__tests__/oauth-config.test.ts` - Add tests

### Environment Variables
```bash
LINKEDIN_CLIENT_ID=your_client_id_here
LINKEDIN_CLIENT_SECRET=your_client_secret_here
```

### Success Metrics
- **Week 1:** 5+ successful LinkedIn sign-ins (internal testing)
- **Month 1:** 10-15% of new sign-ups use LinkedIn
- **Ongoing:** <1% OAuth error rate

---

## Related Documentation

### Project Context
- [ROADMAP.md](./ROADMAP.md) - LinkedIn SSO added to "Planned" section
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Authentication section updated
- [STANDARDS.md](./STANDARDS.md) - Component and OAuth standards
- [BUSINESS.md](./BUSINESS.md) - Target market and user segments
- [BRAND.md](./BRAND.md) - Voice, tone, and visual identity

### Existing Authentication
- `/workspace/website/lib/auth/config.ts` - Current NextAuth configuration
- `/workspace/website/lib/auth/__tests__/oauth-config.test.ts` - Existing OAuth tests
- `/workspace/website/app/auth/signin/page.tsx` - Current sign-in page
- `/workspace/website/prisma/schema.prisma` - Database schema

---

## External Resources

### LinkedIn Developer
- [LinkedIn Developer Portal](https://www.linkedin.com/developers/apps)
- [Sign In with LinkedIn (OpenID Connect)](https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/sign-in-with-linkedin-openid-connect)
- [LinkedIn OAuth 2.0 Documentation](https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/sign-in-with-linkedin-v2)

### NextAuth.js
- [NextAuth.js LinkedIn Provider](https://next-auth.js.org/providers/linkedin)
- [NextAuth.js Configuration](https://next-auth.js.org/configuration/options)
- [NextAuth.js Callbacks](https://next-auth.js.org/configuration/callbacks)

### Standards
- [OAuth 2.0 RFC 6749](https://datatracker.ietf.org/doc/html/rfc6749)
- [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html)
- [WCAG 2.1 AA Accessibility](https://www.w3.org/WAI/WCAG21/quickref/)

---

## FAQ

### Q: Why LinkedIn instead of Facebook or other providers?
**A:** LinkedIn aligns perfectly with our target audience (35-65 year old professionals and high-net-worth automotive enthusiasts). Our users are more likely to have LinkedIn accounts than Facebook accounts.

### Q: Do we need to modify the database schema?
**A:** No. The existing Prisma schema already supports multiple OAuth providers via the `Account` model. LinkedIn will be stored as `provider="linkedin"`.

### Q: How long will implementation take?
**A:** Estimated 8-10 hours total, including setup, development, testing, and deployment. Can be completed in 1-2 weeks with proper testing and rollout.

### Q: What if a user already has an account with the same email?
**A:** NextAuth will automatically link the LinkedIn account to the existing user. If the email is already registered with a different provider, the user will see an error and must sign in with the original method first.

### Q: Do we need to request special permissions from LinkedIn?
**A:** No. We only request standard OpenID Connect scopes (`openid profile email`) which are automatically approved. No special permissions or app review required.

### Q: How do we rollback if there's a critical bug?
**A:** Revert the PR in GitHub, redeploy the previous version via Vercel, and notify users. The rollback process takes ~5 minutes.

### Q: Will this affect existing users?
**A:** No. Existing users can continue using their current authentication method (email/password or Google). LinkedIn is an additional option, not a replacement.

### Q: How do we measure success?
**A:** Track LinkedIn adoption rate (target: 10-15% of new sign-ups), OAuth error rate (target: <1%), and sign-up completion rate improvement (target: 5-10%).

---

## Next Steps

### For Product Managers
1. ✅ Review [Summary](./LINKEDIN_SSO_SUMMARY.md) for business value
2. ✅ Review [Feature Plan](./LINKEDIN_SSO_FEATURE_PLAN.md) for rollout strategy
3. ⏳ Approve feature for implementation
4. ⏳ Schedule announcement for launch

### For Developers
1. ✅ Review [Technical Spec](./LINKEDIN_SSO_TECH_SPEC.md) for implementation details
2. ⏳ Create LinkedIn Developer account
3. ⏳ Follow [Checklist](./LINKEDIN_SSO_CHECKLIST.md) for step-by-step implementation
4. ⏳ Submit PR for code review

### For QA Engineers
1. ✅ Review [Technical Spec](./LINKEDIN_SSO_TECH_SPEC.md) for test scenarios
2. ✅ Review [Checklist](./LINKEDIN_SSO_CHECKLIST.md) for test cases
3. ⏳ Set up test LinkedIn accounts
4. ⏳ Execute integration tests on staging

### For DevOps Engineers
1. ✅ Review [Feature Plan](./LINKEDIN_SSO_FEATURE_PLAN.md) for deployment steps
2. ⏳ Add environment variables to Vercel
3. ⏳ Set up monitoring and alerts
4. ⏳ Prepare rollback plan

---

## Status Tracking

| Phase | Status | Assigned To | Due Date | Notes |
|-------|--------|-------------|----------|-------|
| Planning | ✅ Complete | Cursor Agent | 2026-01-07 | All docs written |
| LinkedIn Setup | ⏳ Not Started | ___________ | ___________ | Create app, get credentials |
| Development | ⏳ Not Started | ___________ | ___________ | Add provider, update UI |
| Testing | ⏳ Not Started | ___________ | ___________ | Unit, integration, cross-browser |
| Deployment | ⏳ Not Started | ___________ | ___________ | Staging → Production |
| Monitoring | ⏳ Not Started | ___________ | ___________ | Track adoption, errors |

---

## Contact

**Linear Issue:** [PROD-15287](https://linear.app/enthusiast-auto/issue/PROD-15287)  
**Project:** EAG Website Replatform  
**Repository:** https://github.com/magnetco/enthusiastauto  

---

**Last Updated:** January 7, 2026  
**Documentation Version:** 1.0  
**Status:** Planning Complete ✅
