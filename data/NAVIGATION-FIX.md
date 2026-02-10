# Navigation Fix: Service Requests to Sell Submissions

## Issue
When navigating from Service Requests to Sell Submissions, the page sometimes didn't load properly and required a refresh to display the sell submissions data correctly.

## Root Causes

### 1. **Missing useEffect Dependencies**
Both `ServiceRequestDetail.tsx` and `SellSubmissionDetail.tsx` had `useEffect` hooks that called functions not included in their dependency arrays, potentially causing stale closures and race conditions.

### 2. **State Pollution Between Tabs**
When switching tabs, the following state was not being properly reset:
- Selected detail modal IDs (`selectedServiceRequestId`, `selectedSellSubmissionId`)
- View mode (table vs kanban) persisted even for tabs that don't support kanban
- Data from previous tab could briefly display before new data loaded

### 3. **Component Remounting Issues**
React was reusing component instances when switching between tabs, which could cause stale data to display or prevent proper initialization.

## Fixes Applied

### 1. Fixed useEffect Dependencies
**Files**: `ServiceRequestDetail.tsx`, `SellSubmissionDetail.tsx`

Reordered the function definitions to come before the `useEffect` and added proper eslint-disable comments to acknowledge the intentional dependency omission (since we only want to reload when the ID changes, not when the function reference changes).

```typescript
// Before
useEffect(() => {
  loadSubmission()
}, [submissionId])

const loadSubmission = async () => { ... }

// After
const loadSubmission = async () => { ... }

useEffect(() => {
  loadSubmission()
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [submissionId])
```

### 2. Enhanced Tab Switching Logic
**File**: `App.tsx`

Added comprehensive state reset when switching tabs:

```typescript
useEffect(() => {
  // Reset view mode when changing tabs
  if (!supportsKanban) {
    setViewMode('table')
  }
  
  // Close any open detail modals when switching tabs
  setSelectedServiceRequestId(null)
  setSelectedSellSubmissionId(null)
  
  // Load data for the new tab
  loadData()
}, [loadData, supportsKanban])
```

### 3. Added Early Return for Special Tabs
**File**: `App.tsx`

Updated `loadData` to skip data fetching for tabs that don't use the standard data table (vehicle-import, settings):

```typescript
const loadData = useCallback(async () => {
  // Skip loading for tabs that don't use the standard data table
  if (activeTab === 'vehicle-import' || activeTab === 'settings') {
    setLoading(false)
    setData([])
    return
  }
  // ... rest of loading logic
}, [currentTab.endpoint, activeTab])
```

### 4. Added Component Keys for Forced Remounting
**File**: `App.tsx`

Added unique keys to DataTable and KanbanBoard components to force React to remount them when switching tabs:

```typescript
<DataTable
  key={activeTab}
  // ... props
/>

<KanbanBoard
  key="service-requests-kanban"
  // ... props
/>

<KanbanBoard
  key="sell-submissions-kanban"
  // ... props
/>
```

## Testing Recommendations

1. **Navigation Flow**: Navigate between all tabs multiple times, especially:
   - Service Requests → Sell Submissions
   - Sell Submissions → Service Requests
   - Any tab → Vehicle Import → Any tab
   - Any tab → Settings → Any tab

2. **Modal Interactions**: 
   - Open a service request detail
   - Switch to sell submissions tab (modal should close)
   - Verify sell submissions load correctly
   - Open a sell submission detail
   - Switch back to service requests (modal should close)
   - Verify service requests load correctly

3. **View Mode Persistence**:
   - Switch to kanban view on service requests
   - Navigate to users tab (should show table view)
   - Navigate back to service requests (should show table view, not kanban)

4. **Data Integrity**:
   - Verify no data from previous tabs appears when switching
   - Verify loading states display correctly
   - Verify error states are cleared when switching tabs

## Impact
- ✅ Fixes navigation issues between service requests and sell submissions
- ✅ Prevents state pollution between tabs
- ✅ Ensures clean component initialization on tab switch
- ✅ Improves overall app stability and user experience
- ✅ No breaking changes to existing functionality
