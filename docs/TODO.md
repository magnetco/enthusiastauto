# TODO & Future Tasks

This document tracks planned features, integrations, and improvements for the Enthusiast Auto platform.

## 🔧 Service Request Management

### Microsoft Planner API Integration
**Status**: 🔴 TODO
**Priority**: High
**Epic**: Services & Operations

**Description**:
Integrate service requests with the business's Microsoft Planner account to automatically create and manage tasks for the service team.

**Current State**:
- ✅ Service request form implemented (`/services`)
- ✅ Requests saved to PostgreSQL database (`ServiceRequest` model)
- ✅ Email notifications sent via Resend (development mode)
- ✅ Mobile and desktop navigation updated

**Requirements**:
1. Set up Microsoft Graph API authentication
2. Create Planner tasks from service request submissions
3. Map service types to appropriate Planner buckets/categories:
   - Conditioning & Protection
   - Full Rejuvenation
   - Mechanical Services
   - Cosmetic Repairs
4. Sync request status updates back to database
5. Handle task assignments based on service type

**Implementation Notes**:
- API endpoint: `app/api/services/request/route.ts`
- Service request data model: `prisma/schema.prisma` (ServiceRequest)
- Consider using Microsoft Graph SDK for Node.js
- May need to store Planner task IDs in database for bi-directional sync

**Resources**:
- [Microsoft Graph API - Planner](https://learn.microsoft.com/en-us/graph/api/resources/planner-overview)
- [Microsoft Graph SDK for JavaScript](https://github.com/microsoftgraph/msgraph-sdk-javascript)

**Dependencies**:
- Microsoft 365 Business subscription with Planner
- Azure AD app registration for API access
- Service account credentials

---

## 📋 Other Planned Features

### Admin Dashboard
**Status**: 🟡 Optional
Create an admin interface to view and manage service requests if Planner integration is not sufficient.

### Email Template Enhancement
**Status**: 🟢 Nice to Have
Switch from development to production email addresses in `lib/email/service-request.ts`

### Service Request Status Updates
**Status**: 🟡 Optional
Allow customers to check status of their requests via email link or account portal

---

*Last Updated: 2025-10-28*
