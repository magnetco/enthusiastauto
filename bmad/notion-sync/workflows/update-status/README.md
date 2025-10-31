# Update Status Workflow

**Main status reporting workflow for the Notion Project Reporter module**

## Overview

The Update Status workflow synchronizes individual story statuses from your local development project to your Notion database. It handles both creating new story entries and updating existing ones, with automatic changelog tracking.

**Workflow Type:** Interactive
**Complexity:** Standard
**Theme:** Mission Control Flight Director (operational, efficient)
**Invocation:** Via Status Reporter Agent (`*update-status`)

## Purpose

This is the primary day-to-day workflow for keeping your Notion project dashboard synchronized with development progress. It:

- Updates story status in Notion database
- Creates new story entries if they don't exist
- Optionally updates a "current status" block with high-level project status
- Maintains a comprehensive changelog of all updates
- Validates configuration and connectivity before transmitting

## When to Use

- You've completed work on a story and want to update its status
- A story is blocked and you need to communicate that to stakeholders
- You want to synchronize local project state with Notion
- You need to track progress updates with timestamp and notes

## Prerequisites

1. **Notion integration configured** - Run Setup Agent's `*setup` first
2. **Valid config.yaml** - Contains API token, database ID, and settings
3. **Notion database shared** - Integration must have write access
4. **Internet connectivity** - Required for Notion API calls

## User Journey

### Happy Path (Existing Story)

1. **Invoke workflow** - User runs `*update-status` from Status Reporter Agent
2. **Story identification** - User provides story ID (e.g., "Story-12")
3. **Status selection** - User chooses new status from preset list or enters custom
4. **Add notes** - User optionally describes what changed
5. **Database lookup** - System finds story in Notion database
6. **Update transmission** - Status and notes updated in Notion
7. **Status block option** - User chooses whether to update high-level status block
8. **Changelog append** - Update recorded in mission log
9. **Confirmation** - Summary displayed with Notion page link

**Duration:** 30-90 seconds

### Alternative Path (New Story)

Same as happy path, except:
- Step 5: Story not found in database
- User chooses to create new entry
- System creates new page in Notion database with story details
- Continues with changelog and confirmation

### Error Recovery

- **No configuration:** Workflow exits, directs user to Setup Agent
- **Story not found:** Offers to create new entry or re-enter ID
- **API errors:** Displays detailed error, offers retry or abort
- **Block update fails:** Warns user but completes story update successfully
- **Changelog fails:** Warns user but confirms Notion update succeeded

## Workflow Steps

1. **Verify configuration exists** - Load config.yaml or exit
2. **Collect story identifier** - Ask for story ID
3. **Collect new status** - Present status options or accept custom
4. **Collect update notes** - Optional notes about changes
5. **Check if story exists** - Query Notion database
6. **Update or create story** - PATCH existing or POST new page
7. **Ask about status block** - Offer high-level update option
8. **Update status block** - If user confirmed (optional step)
9. **Append to changelog** - Record update in mission log
10. **Success summary** - Confirm completion with details

## Configuration Variables

Loaded from `bmad/notion-sync/config.yaml`:

- `notion_api_token` - Notion integration authentication
- `notion_database_id` - Target database for story updates
- `current_status_block_id` - Optional block for high-level updates
- `project_name` - Project identifier
- `status_mapping` - Emoji mappings for status values
- `user_name` - User performing update (from BMB config)
- `communication_language` - Language for all messages

## User Inputs Collected

- `story_id` - Story identifier (e.g., Story-12, US-045)
- `new_status` - Status value (preset or custom)
- `update_notes` - Description of changes (optional)
- `update_block_choice` - Whether to update status block (yes/no)
- `status_block_content` - High-level project status (if updating block)

## Outputs Generated

### Notion Database Update

Updates or creates page with properties:
- Story ID
- Status (with emoji from mapping)
- Notes
- Last Updated timestamp

### Status Block Update (Optional)

Updates specified Notion block with:
- Current date
- User-provided status content
- Attribution footer

### Changelog Entry

Appends to `data/changelog.md`:
```markdown
## 2025-10-30 14:30 - Story-12 Status Update

**Story:** Story-12
**New Status:** ✅ Done
**Updated By:** Mike
**Notes:** Fixed authentication bug, added tests
**Notion Page:** https://notion.so/abc123...

---
```

## API Calls Made

1. **Database Query** (Step 5)
   - `POST /v1/databases/{id}/query`
   - Purpose: Find existing story

2. **Create Page** (Step 6, if new story)
   - `POST /v1/pages`
   - Purpose: Create new story entry

3. **Update Page** (Step 6, if existing)
   - `PATCH /v1/pages/{page_id}`
   - Purpose: Update story status

4. **Update Block** (Step 8, if opted in)
   - `PATCH /v1/blocks/{block_id}`
   - Purpose: Update status block

## Error Handling

### Configuration Missing
- **Detection:** Step 1 fails to load config.yaml
- **Response:** Exit gracefully, direct to Setup Agent
- **Recovery:** Run `*setup` first

### Story Not Found
- **Detection:** Step 5 database query returns no results
- **Response:** Offer to create new or re-enter ID
- **Recovery:** User chooses creation or correction

### API Failures
- **Detection:** Any API call returns error status
- **Response:** Display specific error message with troubleshooting
- **Recovery:** Offer retry, detailed view, or abort

### Permission Errors
- **Detection:** 403 Forbidden from Notion API
- **Response:** Explain integration access requirements
- **Recovery:** User shares page/database with integration

### Network Errors
- **Detection:** Connection timeout or DNS failure
- **Response:** Suggest checking internet connectivity
- **Recovery:** Retry after connection restored

## Success Criteria

Workflow is successful when:
1. ✅ Story status updated in Notion database
2. ✅ Changelog entry appended to mission log
3. ✅ User receives confirmation with Notion page link
4. ✅ Optional status block updated if requested

Partial success scenarios:
- Story updated but status block failed → Still success (with warning)
- Story updated but changelog failed → Still success (with warning)

## Integration Points

### Called By
- Status Reporter Agent (`*update-status` command)
- Quick update action (after parsing parameters)

### Calls
- Notion API (database query, page create/update, block update)
- File system (read config, append changelog)

### Data Dependencies
- `config.yaml` - Must exist and be valid
- `data/changelog.md` - Created if doesn't exist
- Notion database - Must be shared with integration

## Testing Checklist

- [ ] Configuration loaded successfully
- [ ] Story ID accepted and normalized
- [ ] Status selection works (numbered and custom)
- [ ] Notes collection allows empty input
- [ ] Existing story found in database
- [ ] Story status updated successfully
- [ ] New story creation works when not found
- [ ] Status block update optional flow
- [ ] Status block content submitted correctly
- [ ] Changelog entry appended
- [ ] Success message displays all details
- [ ] Configuration missing handled gracefully
- [ ] API errors display helpful messages
- [ ] Retry logic works after failures
- [ ] Notion page link valid and clickable

## Future Enhancements

### Phase 2
- Quick update mode: `*quick Story-12 done "Fixed bug"`
- Story mapping cache for faster lookups
- Batch update multiple stories at once
- Parse story files automatically to detect status

### Phase 3
- Notion preview before submitting
- Smart story detection from recent git commits
- Checklist synchronization (markdown → Notion)
- Offline mode with queue for later sync

## Related Workflows

- **install-notion-sync** - Required prerequisite, creates configuration
- **test-connection** - Validates setup before updates
- **sync-stories** - Batch version for multiple stories
- **view-changelog** - Query mission log history
- **reconfigure** - Update configuration if database changes

## Troubleshooting

### "Configuration not detected"
**Cause:** Haven't run setup yet
**Solution:** Run `agent setup` then `*setup`

### "Story not found in database"
**Cause:** Story doesn't exist in Notion yet
**Solution:** Choose option 1 to create new entry

### "Could not update status block"
**Cause:** Block deleted, moved, or integration lost access
**Solution:** Story still updated! Reconfigure block with `*reconfigure`

### API rate limit errors
**Cause:** Too many requests to Notion API
**Solution:** Wait 60 seconds before retrying

## Author Notes

This workflow balances efficiency with safety:
- Validates configuration before API calls
- Offers graceful degradation (block update can fail without breaking story update)
- Provides clear error messages with actionable solutions
- Uses Mission Control language to reduce setup anxiety
- Tracks every update for accountability

The two-tier update (database + optional block) separates detailed story tracking from high-level status communication, allowing teams to use whichever fits their workflow.

---

**Version:** 1.0.0
**Author:** Mike
**Created:** 2025-10-30
**Module:** notion-sync
