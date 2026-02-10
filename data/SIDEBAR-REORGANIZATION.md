# Sidebar Navigation Reorganization

This document describes the reorganization of the sidebar navigation structure for the data app.

## Overview

The sidebar has been restructured to better organize customer-related items, add inventory and parts management sections, include Shopify admin deep links, and consolidate documentation.

## New Navigation Structure

### 1. Customers (Top Section)
All customer-related data grouped together:
- Users
- Accounts
- Sessions
- Favorites
- Service Requests
- Sell Submissions

**Rationale**: These items were previously split across "User Management" and "Customer Data" sections, causing confusion. Now all customer-related functionality is in one place at the top of the navigation.

### 2. Inventory
Vehicle-related management:
- Vehicle Import
- Version History

**Rationale**: Dedicated section for managing the vehicle inventory, including bulk imports and tracking changes.

### 3. Parts
Shopify integration with deep links:
- Shopify Admin (main dashboard)
- Products
- Collections
- Orders
- Discounts

**Rationale**: Direct access to Shopify admin pages without leaving the data manager context. All links open in new tabs with external link indicators.

### 4. System
Core system pages:
- Documentation (consolidated single page)
- Settings

**Rationale**: Simplified system section with essential operational pages.

## Files Created

### 1. `src/components/DocumentationPage.tsx`
- Consolidated documentation page with four sections:
  - **Overview**: Application purpose and capabilities
  - **Architecture**: Tech stack and port information
  - **Business Context**: Company info and revenue streams
  - **Operations**: Key workflows and external links
- Replaces multiple separate documentation pages
- Theme-aware styling using CSS variables

## Files Modified

### 1. `src/components/Icons.tsx`
Added new icons for Shopify and parts management:
- `ShoppingBag` - Shopify admin icon
- `Tag` - Discounts icon
- `Grid` - Collections icon
- `Truck` - Orders icon
- `ExternalLink` - Indicator for external links

### 2. `src/components/Sidebar.tsx`
Major restructuring:
- Updated `menuSections` array with new organization
- Added `external` and `url` properties to `MenuItem` interface
- Implemented external link handling with new tab opening
- Added external link icon indicator
- Removed unused imports (FileText, Mail, MessageSquare, etc.)
- Updated TabId type to include `'documentation'`

### 3. `src/App.tsx`
- Imported `DocumentationPage` component
- Updated `TabId` type to include `'documentation'`
- Added documentation tab to tabs array
- Updated `isReadOnly` to include documentation
- Added conditional rendering for Documentation page
- Updated header subtitle logic to support documentation

## External Link Behavior

External links in the sidebar:
- Open in new tabs (`target="_blank"`)
- Include security attributes (`rel="noopener noreferrer"`)
- Display external link icon on the right
- Styled as links (`<a>` tags) instead of buttons
- No active state (since they navigate away)

## Shopify Deep Links

The following Shopify admin pages are directly accessible:
1. **Admin Dashboard**: Main Shopify admin interface
2. **Products**: Manage parts catalog
3. **Collections**: Organize products into categories
4. **Orders**: View and manage customer orders
5. **Discounts**: Create and manage discount codes

**Note**: Update the store URL in `Sidebar.tsx` if using a different Shopify store name.

## Benefits

### Improved Organization
- Customer data consolidated in one section
- Clear separation between customers, inventory, and parts
- Reduced cognitive load with fewer top-level sections

### Better Workflow
- Direct access to Shopify without context switching
- Quick navigation to specific Shopify admin pages
- Consolidated documentation in one place

### Enhanced UX
- External links clearly indicated with icon
- Logical grouping reduces scrolling
- Most frequently used items (customers) at the top

## Migration Notes

### Removed Sections
The following beta/disabled sections were removed:
- Brand
- Content & Messaging
- Intelligence & Systems
- Support (Customer Leads, Chat Intelligence)

These can be re-added in the future as they become active features.

### Section Mapping

Old structure → New structure:
- User Management → Customers (merged)
- Customer Data → Customers (merged)
- System → Split between Inventory and System
- Documentation (5 pages) → Documentation (1 page)

## Future Enhancements

Potential improvements:
- Add inventory analytics dashboard
- Integrate Sanity CMS links similar to Shopify
- Add quick actions for common tasks
- Implement search within documentation
- Add keyboard shortcuts for navigation
