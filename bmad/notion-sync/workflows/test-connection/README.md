# Test Connection Workflow

**Notion Project Reporter - Connection Diagnostics**

## Purpose

Validates Notion API connectivity, permissions, and configuration. This workflow performs a comprehensive systems check of all Notion integrations to ensure the module is properly configured and operational.

## Overview

The test-connection workflow runs three critical validation tests:

1. **API Authentication** - Verifies Notion API token is valid
2. **Database Access** - Confirms integration can query the project database
3. **Status Block Access** - Checks permission to update current status block

## When to Use

- **After initial setup** - Verify configuration before first status update
- **When troubleshooting** - Diagnose connectivity or permission issues
- **After reconfiguration** - Validate changes to database or block IDs
- **Periodically** - Ensure ongoing system health

## Usage

### From Status Reporter Agent

```
agent setup
*test-connection
```

### Direct Workflow Invocation

```
workflow test-connection
```

### From Setup Agent Menu

```
agent setup
*test-connection
```

## How It Works

### Step 1: Load Configuration
- Reads `bmad/notion-sync/config.yaml`
- Validates all required fields present
- Displays masked configuration summary

### Step 2: Test API Authentication
- Makes GET request to `/v1/users/me`
- Validates API token
- Reports authenticated user and workspace

**Success Criteria:**
- ✅ Token valid and active
- ✅ Returns authenticated bot information

**Possible Errors:**
- ❌ 401 Unauthorized - Invalid/expired token
- ❌ Network error - Connection issues

### Step 3: Test Database Access
- Queries project database with page_size=1
- Verifies integration has database permissions
- Reports entry count

**Success Criteria:**
- ✅ Database found and accessible
- ✅ Integration can query entries

**Possible Errors:**
- ❌ 404 Not Found - Database doesn't exist or ID wrong
- ❌ 403 Forbidden - Integration not connected to database

### Step 4: Test Status Block Access
- Retrieves status block by ID
- Verifies block is accessible
- Reports block type and status

**Success Criteria:**
- ✅ Block found and accessible
- ✅ Integration can read block

**Possible Errors:**
- ⚠️ 404 Not Found - Block doesn't exist (optional, updates still work)
- ⚠️ 403 Forbidden - Parent page not shared (can be fixed)

### Step 5: Generate Systems Report
- Summarizes all test results
- Displays capability matrix
- Provides next steps guidance

## Output

### All Systems Green ✅

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       NOTION MISSION CONTROL - SYSTEMS CHECK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PROJECT: Your Project Name
TIMESTAMP: 2025-10-30

CONNECTIVITY STATUS:

✅ API Authentication .......... OPERATIONAL
✅ Database Access ............. OPERATIONAL
✅ Status Block Access ......... OPERATIONAL

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SYSTEM CAPABILITIES:

✅ Can update story status in database
✅ Can create new story entries
✅ Can query existing stories
✅ Can update current status block

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ALL SYSTEMS GREEN

Mission Control is fully operational. You are cleared for status updates.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Partial Systems Yellow ⚠️

If status block access fails but other tests pass:
- Database updates: ✅ Operational
- Status block updates: ⚠️ Limited
- Overall status: YELLOW - Some features unavailable

### Critical Failure Red ❌

If authentication or database access fails:
- Must fix configuration before attempting updates
- Reconfigure using Setup Agent
- Overall status: RED - Not operational

## Error Recovery

### Invalid API Token
1. Go to https://www.notion.so/my-integrations
2. Verify integration exists
3. Copy Internal Integration Token
4. Run `agent setup` → `*reconfigure`
5. Retry test

### Database Not Accessible
1. Open database in Notion
2. Click "..." → "Connections"
3. Add your integration
4. Retry test

### Status Block Not Accessible
1. Open parent page in Notion
2. Click "Share" → "Add connections"
3. Select your integration
4. Retry test

## Configuration Variables

Loaded from `bmad/notion-sync/config.yaml`:

- `notion_api_token` - Notion API integration token
- `notion_database_id` - Target project database ID
- `current_status_block_id` - Optional status block ID
- `project_name` - Project name for reporting

## Integration with Module

The test-connection workflow is accessible from:

1. **Setup Agent** - For post-configuration validation
2. **Status Reporter Agent** - For pre-update diagnostics
3. **Direct invocation** - For troubleshooting

Recommended to run:
- After first-time setup
- Before important status updates
- When errors occur during operations
- After Notion workspace changes

## Technical Details

### API Endpoints Used

```
GET  /v1/users/me                         - Authentication test
POST /v1/databases/{id}/query             - Database access test
GET  /v1/blocks/{id}                      - Block access test
```

### Required Headers

```
Authorization: Bearer {api_token}
Notion-Version: 2022-06-28
Content-Type: application/json
```

### Success Response Codes
- 200 OK - All tests passed
- Workflow continues on warnings

### Error Response Codes
- 401 - Authentication failed (critical)
- 403 - Permission denied (critical for DB, warning for block)
- 404 - Resource not found (critical for DB, warning for block)

## Workflow Metadata

- **Type:** Action workflow (no document output)
- **Complexity:** Simple
- **Interactivity:** Low (automated testing)
- **Theme:** Mission Control Ground Control diagnostics
- **Standalone:** Yes

## Future Enhancements

Planned improvements for Phase 2+:

- [ ] Save test results to log file
- [ ] Provide database schema validation
- [ ] Check Notion API rate limit status
- [ ] Test write permissions (safe test write/delete)
- [ ] Export diagnostics report
- [ ] Integration health monitoring over time

## Related Workflows

- **install-notion-sync** - Initial setup and configuration
- **update-status** - Depends on valid connection
- **reconfigure** - Fix configuration issues
- **sync-stories** - Batch operations requiring stable connection

## Mission Control Language

This workflow uses Ground Control diagnostic terminology:

- "Systems check" - Validation testing
- "All systems green/yellow/red" - Status indicators
- "Operational/Limited/Offline" - Capability states
- "Ground Control out" - Workflow completion

---

**Ready to validate your Notion Mission Control connection!** Run this workflow anytime you need to verify system health or diagnose connectivity issues.
