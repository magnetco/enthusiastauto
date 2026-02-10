# Data Manager Views - Quick Reference

## View Modes

The Enthusiast Auto Data Manager now supports **two view modes** for customer data:

### 📊 Table View (Default)
- Traditional spreadsheet-style layout
- Sortable columns
- Inline editing
- Row click to open details
- Best for: Data entry, bulk editing, detailed analysis

### 📋 Kanban View (New)
- Visual workflow boards
- Drag-and-drop status updates
- Color-coded columns
- Card-based layout
- Best for: Workflow management, status tracking, visual overview

## Supported Tabs

| Tab | Table View | Kanban View | Detail View |
|-----|------------|-------------|-------------|
| Users | ✅ | ❌ | ❌ |
| Accounts | ✅ (read-only) | ❌ | ❌ |
| Sessions | ✅ (read-only) | ❌ | ❌ |
| Favorites | ✅ | ❌ | ❌ |
| **Service Requests** | ✅ | ✅ | ✅ |
| **Sell Submissions** | ✅ | ✅ | ✅ |
| Version History | ✅ (read-only) | ❌ | ❌ |
| Vehicle Import | Custom UI | ❌ | ❌ |

## Quick Actions

### Table View
- **Click column header** → Sort by that column
- **Click editable cell** → Edit inline (press Enter to save, Escape to cancel)
- **Click row** → Open detail view (Service Requests & Sell Submissions)
- **Click delete icon** → Delete record (with confirmation)

### Kanban View
- **Drag card** → Move between columns (updates status)
- **Click card** → Open detail view
- **Scroll horizontally** → See all columns

### Detail View
- **Click status button** → Update status
- **Click email/phone** → Open default app
- **Click "Copy Details"** → Copy to clipboard
- **Click "View CARFAX"** → Open vehicle history (Sell Submissions only)
- **Type in notes** → Add internal notes
- **Click "Save Notes"** → Persist to database

## Keyboard Shortcuts

### Table View
- `Tab` → Navigate between cells
- `Enter` → Edit cell / Save edit
- `Escape` → Cancel edit
- `↑` `↓` → Navigate rows (when not editing)

### Detail View
- `Escape` → Close modal
- `Tab` → Navigate interactive elements

## Status Workflows

### Service Requests
```
Pending → Contacted → Scheduled → In Progress → Completed
                                              ↘ Cancelled
```

### Sell Submissions
```
Pending → Contacted → Evaluating → Offer Made → Completed
                                              ↘ Cancelled
```

## Color Coding

| Status | Color | Meaning |
|--------|-------|---------|
| Pending | 🟡 Yellow | Awaiting initial review |
| Contacted | 🔵 Blue | Customer has been reached |
| Scheduled/Evaluating | 🟣 Purple | Next step planned |
| In Progress/Offer Made | 🟠 Orange | Active work happening |
| Completed | 🟢 Green | Successfully finished |
| Cancelled | 🔴 Red | Request/submission cancelled |

## Data Refresh

- **Manual**: Click "Refresh" button in header
- **Automatic**: After closing detail view
- **Real-time**: Status updates reflect immediately

## Tips & Best Practices

### When to Use Table View
- ✅ Bulk data entry or editing
- ✅ Searching for specific records
- ✅ Exporting data (copy/paste)
- ✅ Detailed analysis of multiple fields
- ✅ Sorting by multiple criteria

### When to Use Kanban View
- ✅ Managing workflow stages
- ✅ Visualizing pipeline
- ✅ Quick status updates (drag-and-drop)
- ✅ Team standup meetings
- ✅ Identifying bottlenecks

### Detail View Best Practices
- 📧 Use "Send Email" for quick responses
- 📞 Use "Call Customer" on mobile devices
- 📋 Use "Copy Details" to share with team
- 📝 Always add internal notes for context
- 🚗 Check CARFAX before making offers (Sell Submissions)

## Mobile Support

### Fully Supported
- ✅ Table view (responsive columns)
- ✅ Detail views (full functionality)
- ✅ Status updates
- ✅ Quick actions (email, phone, copy)

### Limited Support
- ⚠️ Kanban drag-and-drop (requires desktop browser)
- ⚠️ Inline editing (use detail view instead)

**Recommendation**: Use Table view on mobile, Kanban view on desktop.

## Performance

### Optimized For
- Up to 1,000 records in Table view
- Up to 500 cards in Kanban view
- Smooth 60fps animations
- Sub-second API responses

### Large Datasets
If you have >1,000 records:
- Use filters to reduce visible data
- Consider pagination (future enhancement)
- Archive old completed/cancelled items

## Troubleshooting

### Kanban cards not dragging
- **Solution**: Use desktop browser (Chrome, Firefox, Safari)
- Mobile drag-and-drop requires touch event support (coming soon)

### Detail view not opening
- **Solution**: Ensure you're clicking the row, not an editable cell
- Try clicking on the customer name or status badge

### Status not updating
- **Solution**: Check network connection
- Refresh the page and try again
- Check browser console for errors

### Data not refreshing
- **Solution**: Click "Refresh" button manually
- Close and reopen detail view to trigger refresh

## Data Security

### What's Tracked
- ✅ All field changes (version history)
- ✅ Status updates with timestamps
- ✅ Internal notes

### What's NOT Tracked
- ❌ Who made the change (coming soon)
- ❌ View/read access
- ❌ Export/copy actions

### Privacy
- 🔒 Internal notes are never visible to customers
- 🔒 Version history is admin-only
- 🔒 All data transmitted over HTTPS

## Getting Help

### Common Questions

**Q: Can I customize the Kanban columns?**
A: Yes! Edit the column configuration in `App.tsx`. See `FEATURE-KANBAN-VIEWS.md` for details.

**Q: Can I add custom fields to the detail view?**
A: Yes! Edit the detail components. See feature documentation for guidance.

**Q: Can I export data from Kanban view?**
A: Switch to Table view and copy/paste. CSV export coming soon.

**Q: Can I filter Kanban cards?**
A: Not yet. Use Table view for filtering. Kanban filters coming soon.

### Feature Requests

Want a new feature? Check the "Future Enhancements" section in:
- `FEATURE-SERVICE-REQUEST-DETAIL.md`
- `FEATURE-KANBAN-VIEWS.md`

## Version History

- **v1.2** (Feb 2026) - Added Kanban view, Sell Submission detail
- **v1.1** (Feb 2026) - Added Service Request detail view
- **v1.0** (Feb 2026) - Initial data manager with table views

---

**Need more details?** See the full feature documentation:
- `FEATURE-SERVICE-REQUEST-DETAIL.md` - Service request detail view
- `FEATURE-KANBAN-VIEWS.md` - Kanban boards & sell submissions
