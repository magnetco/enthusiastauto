# Navigation Structure

## Current Sidebar Organization

```
📊 ENTHUSIAST AUTO DATA MANAGER

┌─ 👥 CUSTOMERS
│  ├─ Users
│  ├─ Accounts
│  ├─ Sessions
│  ├─ Favorites
│  ├─ Service Requests
│  └─ Sell Submissions
│
┌─ 🚗 INVENTORY
│  ├─ Vehicle Import
│  └─ Version History
│
┌─ 🛍️ PARTS
│  ├─ Shopify Admin ↗
│  ├─ Products ↗
│  ├─ Collections ↗
│  ├─ Orders ↗
│  └─ Discounts ↗
│
└─ ⚙️ SYSTEM
   ├─ Documentation
   └─ Settings
```

## Section Details

### Customers
**Purpose**: Unified customer data management  
**Items**: 6 internal pages  
**Access**: All items load in-app

### Inventory
**Purpose**: Vehicle catalog management  
**Items**: 2 internal pages  
**Access**: All items load in-app

### Parts
**Purpose**: E-commerce integration  
**Items**: 5 external links  
**Access**: All items open Shopify admin in new tab  
**Icon**: External link indicator (↗) shown on each item

### System
**Purpose**: Application configuration and documentation  
**Items**: 2 internal pages  
**Access**: All items load in-app

## Key Features

### External Links
- Open in new browser tab
- Security headers included
- Visual indicator (external link icon)
- No active state (since they navigate away)

### Collapsible Sections
- Click section header to expand/collapse
- State persists in localStorage
- Chevron icon indicates state

### Active State
- Current page highlighted
- Red accent border on left
- Darker background

### Theme Support
- All colors use CSS variables
- Adapts to light/dark mode
- Smooth transitions

## URL Structure

### Internal Pages
```
/users
/accounts
/sessions
/favorites
/service-requests
/sell-submissions
/versions
/vehicle-import
/documentation
/settings
```

### External Links (Shopify)
```
https://admin.shopify.com/store/enthusiast-auto
https://admin.shopify.com/store/enthusiast-auto/products
https://admin.shopify.com/store/enthusiast-auto/collections
https://admin.shopify.com/store/enthusiast-auto/orders
https://admin.shopify.com/store/enthusiast-auto/discounts
```

## Comparison: Before vs After

### Before
```
USER MANAGEMENT (3 items)
CUSTOMER DATA (3 items)
SYSTEM (3 items)
BRAND (1 item - disabled)
CONTENT & MESSAGING (8 items - disabled)
INTELLIGENCE & SYSTEMS (5 items - disabled)
SUPPORT (2 items - disabled)
DOCUMENTATION (5 items - disabled)
```
**Total**: 8 sections, 30 items (20 disabled)

### After
```
CUSTOMERS (6 items)
INVENTORY (2 items)
PARTS (5 items - external)
SYSTEM (2 items)
```
**Total**: 4 sections, 15 items (all active)

## Benefits

1. **Reduced Complexity**: 8 sections → 4 sections
2. **Better Grouping**: Customer items consolidated
3. **Active Features Only**: Removed 20 disabled items
4. **Direct Access**: Shopify deep links save clicks
5. **Clearer Purpose**: Each section has distinct role
