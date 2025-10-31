# Install Notion Sync Workflow

**Part of:** Notion Project Reporter Module
**Type:** Interactive Setup Workflow
**Theme:** Mission Control / NASA

## Purpose

Guides users through the complete Notion integration setup process, including API authentication, database discovery, block ID capture, and persistent configuration storage.

## How to Invoke

### From Setup Agent (Recommended)
```
agent setup
*setup
```

### Directly
```
/install-notion-sync
```

Or via IDE command palette: "install-notion-sync"

## What This Workflow Does

This workflow configures your Notion Project Reporter integration in 12 steps:

1. **Welcome** - Explains setup process
2. **API Token** - Collects Notion API token with validation
3. **Test Token** - Validates authentication with Notion API
4. **Fetch Databases** - Discovers accessible databases in workspace
5. **Select Database** - User chooses project database from list
6. **Status Block ID** - Captures block URL/ID for status updates
7. **Validate Block** - Tests block access permissions
8. **Project Name** - Captures project designation
9. **Save Config** - Writes configuration to `config.yaml`
10. **Create Data Dir** - Initializes `bmad/notion-sync/data/`
11. **Initialize Changelog** - Creates empty mission log
12. **Success Summary** - Confirms setup and provides next steps

## Expected Inputs

- **Notion API Token** (from https://www.notion.so/my-integrations)
- **Notion Database** (user selects from discovered list)
- **Status Block URL/ID** (optional - can be skipped)
- **Project Name** (defaults to directory name if not provided)

## Generated Outputs

### Configuration File
**Location:** `bmad/notion-sync/config.yaml`

Contains:
- `notion_api_token` - Secure API credentials
- `notion_database_id` - Target database for story sync
- `current_status_block_id` - Block for status updates
- `project_name` - Project designation
- `status_mapping` - Status emoji mappings
- Data paths and module version

### Data Directory
**Location:** `bmad/notion-sync/data/`

Initialized with:
- `changelog.md` - Mission log for tracking updates
- Directory structure for future cache files

## Prerequisites

1. **Notion Account** with workspace access
2. **Notion Integration** created at notion.so/my-integrations
3. **Database Shared** with the integration (via Connections)
4. **Internet Connectivity** for API validation

## Special Features

### Mission Control Theme
The workflow uses NASA/space mission terminology throughout:
- "Establishing uplink" (connecting to API)
- "Database coordinates" (database ID)
- "Mission log" (changelog)
- "All systems green" (success confirmation)

### Error Recovery
Robust error handling with retry mechanisms:
- Invalid token → Re-enter credentials
- No databases found → Guide to share databases
- Block access fails → Offer to skip or retry
- API failures → Clear troubleshooting guidance

### Validation
Complete validation at each critical step:
- Token format checking
- API authentication testing
- Database accessibility verification
- Block permission validation

## Common Issues

### "No databases found"
**Solution:** Share at least one database with your integration
1. Open database in Notion
2. Click "..." → Connections
3. Select your integration

### "Cannot access status block"
**Solution:** Share the parent page with your integration
1. Open the page containing the block
2. Click Share → Add connections
3. Select your integration

### "Token authentication failed"
**Solution:** Verify token from notion.so/my-integrations
- Token must start with 'secret_'
- Token must not be expired or revoked
- Copy the entire token string

## Next Steps After Setup

1. **Test Connection**
   ```
   agent setup
   *test-connection
   ```

2. **Load Status Reporter**
   ```
   agent reporter
   *update-status
   ```

3. **View Configuration**
   ```
   agent setup
   *show-config
   ```

## Workflow Metadata

- **Instruction Style:** Mixed (Intent-based with prescriptive moments)
- **Interactivity Level:** High (Collaborative setup)
- **Complexity:** Standard (12 steps, API integration)
- **Average Duration:** 5 minutes
- **Standalone:** Yes (can be invoked directly)

## Files

```
install-notion-sync/
├── workflow.yaml       # Configuration
├── instructions.md     # 12-step setup sequence
├── checklist.md        # Validation criteria
└── README.md          # This file
```

## Related Workflows

- **test-connection** - Validates existing configuration
- **reconfigure** - Updates database/block IDs
- **update-status** - Main reporting workflow (requires setup first)

---

**Mission Control is standing by!** 🚀 Run this workflow to establish your Notion integration uplink.
