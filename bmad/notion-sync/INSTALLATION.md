# Notion Project Reporter - Installation Guide

**Phase 1 MVP - Ready for Testing**
**Created:** 2025-10-30
**Status:** Complete, awaiting compilation

---

## Pre-Installation Checklist

Before installing this module, ensure you have:

- [ ] A Notion workspace with a project database
- [ ] Ability to create Notion integrations (workspace admin access)
- [ ] BMAD Method framework installed in your project

---

## Installation Steps

### Step 1: Compile the Module

Since this module contains agent YAML files, they need to be compiled before use.

**Run the BMAD installer:**

```bash
cd /path/to/BMAD-METHOD
npm run install:bmad
```

**During installation:**
1. Select target project directory
2. When asked about modules, ensure `notion-sync` is selected
3. Confirm agent compilation when prompted

The installer will:
- Copy module files to `{project}/bmad/notion-sync/`
- Compile `agents/*.agent.yaml` → `agents/*.md`
- Generate `config.yaml` from install-config
- Set up data directories

### Step 2: Create Notion Integration

**Before configuring the module**, create your Notion integration:

1. Go to https://www.notion.so/my-integrations
2. Click **"Create new integration"**
3. Name it: **"Project Reporter"** (or your preference)
4. Select your workspace
5. Copy the **"Internal Integration Token"** (starts with `secret_`)
   - ⚠️ Keep this secure - treat it like a password
   - You'll need this during setup

### Step 3: Prepare Your Notion Database

**Share database with integration:**

1. Open your project database in Notion
2. Click **"..."** menu → **"Connections"**
3. Search for and select **"Project Reporter"** (your integration)
4. Confirm the connection

**Required database properties:**

Your database should have these properties (case-sensitive):

- **Story Name** (Title) - The story title
- **Story Number** (Text or Number) - Unique identifier
- **Status** (Select) - Options: Not Started, In Progress, Code Review, Testing, Done, Blocked
- **Description** (Text) - Story details
- **Last Updated** (Date) - Auto-updated timestamp

**Don't have this structure?** The module will work with any database, but you may need to adapt field names in workflows.

### Step 4: Share Status Block (Optional)

If you want to update a "current status" block:

1. Open the page containing your status block in Notion
2. Click **"Share"** button
3. Click **"Add connections"**
4. Select **"Project Reporter"** integration
5. Note the block's URL - you'll need the block ID from it

**Block ID extraction:**
From URL: `https://notion.so/PageName-abc123?blockId=def456`
Block ID is: `def456`

---

## Module Configuration

### Step 5: Run Setup Workflow

After installation, configure the Notion connection:

```bash
# In your project with BMAD installed
agent setup
```

Then run the setup command:
```
*setup
```

**The setup workflow will:**

1. Welcome you to Mission Control
2. Ask for your Notion API token (paste the `secret_` token)
3. Test authentication
4. Fetch and display your accessible databases
5. Ask you to select your project database
6. Optionally ask for status block ID
7. Ask for project name
8. Save configuration to `bmad/notion-sync/config.yaml`
9. Initialize changelog at `bmad/notion-sync/data/changelog.md`
10. Create data directory structure
11. Validate the complete configuration
12. Confirm Mission Control is operational

**Expected duration:** 3-5 minutes

---

## Verification

### Step 6: Test the Connection

After setup, validate everything is working:

```bash
agent setup
*test-connection
```

**This will test:**
- ✅ API Authentication
- ✅ Database Access
- ✅ Status Block Access (if configured)

**Expected output:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       NOTION MISSION CONTROL - SYSTEMS CHECK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CONNECTIVITY STATUS:

✅ API Authentication .......... OPERATIONAL
✅ Database Access ............. OPERATIONAL
✅ Status Block Access ......... OPERATIONAL

ALL SYSTEMS GREEN
```

If you see **all green**, you're ready to start reporting status!

---

## First Status Update

### Step 7: Update Your First Story

Load the Status Reporter agent:

```bash
agent reporter
*update-status
```

**The workflow will ask:**
1. Which story are you updating? (e.g., `Story-12`)
2. What's the new status? (select from list or enter custom)
3. Any notes or updates?
4. Update current status block? (yes/no)
5. If yes: What's the high-level summary?

**The workflow will then:**
- Query your Notion database for the story
- Update the story status (or create new entry if not found)
- Update the status block (if requested)
- Append entry to changelog
- Show success confirmation with Notion page link

---

## File Structure After Installation

```
your-project/
└── bmad/
    └── notion-sync/
        ├── agents/
        │   ├── setup.md                 # Compiled from YAML
        │   └── reporter.md              # Compiled from YAML
        ├── workflows/
        │   ├── install-notion-sync/
        │   ├── update-status/
        │   └── test-connection/
        ├── data/
        │   ├── changelog.md            # Generated during setup
        │   └── story-map.json          # Generated on first sync
        ├── config.yaml                 # Generated during setup
        └── README.md
```

---

## Configuration File

After setup, your `config.yaml` will look like:

```yaml
# Notion Project Reporter Configuration
# Generated during installation

# Core inherited values
user_name: Mike
communication_language: English
document_output_language: English
output_folder: "{project-root}/docs"

# Notion API credentials
notion_api_token: "secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
notion_database_id: "abc123def456789..."
current_status_block_id: "xyz789abc123..."  # Optional
project_name: "Your Project Name"

# Status emoji mapping
status_mapping:
  "In Progress": "🚧 In Progress"
  "Done": "✅ Done"
  "Blocked": "🔴 Blocked"
  "Code Review": "👀 Code Review"
  "Testing": "🧪 Testing"
  "Not Started": "⚪ Not Started"
```

**⚠️ Security Note:** This file contains your API token. Do NOT commit it to version control!

---

## Troubleshooting Installation

### Issue: "No databases found during setup"

**Cause:** Database not shared with integration

**Solution:**
1. Open database in Notion
2. Click "..." → "Connections"
3. Add your integration

### Issue: "API authentication failed"

**Cause:** Invalid or incorrectly copied token

**Solution:**
1. Go to notion.so/my-integrations
2. Verify integration exists
3. Copy the COMPLETE token (including `secret_` prefix)
4. Re-run `*setup`

### Issue: "Agent not found after installation"

**Cause:** Agents not compiled or installation incomplete

**Solution:**
1. Verify BMAD installer ran successfully
2. Check `bmad/notion-sync/agents/` contains `.md` files
3. Re-run installer if needed

### Issue: "Config file not found when running workflows"

**Cause:** Setup workflow not completed

**Solution:**
1. Run `agent setup` → `*setup`
2. Complete all steps
3. Verify `bmad/notion-sync/config.yaml` exists

---

## Next Steps After Installation

1. **Test with one story** - Verify status update works end-to-end
2. **Review changelog** - Check `data/changelog.md` for update entries
3. **Explore workflows** - Try test-connection for diagnostics
4. **Phase 2 Features** - Coming soon: sync-stories, view-changelog, reconfigure

---

## Support

**Common Commands:**

```bash
# View setup agent menu
agent setup

# View reporter agent menu
agent reporter

# Test connection anytime
agent setup
*test-connection

# Update configuration
agent setup
*reconfigure
```

**Documentation:**
- Module README: `bmad/notion-sync/README.md`
- Development roadmap: `bmad/notion-sync/TODO.md`
- Workflow docs: `bmad/notion-sync/workflows/*/README.md`

---

**Ready to establish uplink to Notion Mission Control!** 🚀

Follow these steps carefully, and you'll have automated Notion status reporting in minutes.

*Ground Control standing by for installation sequence.*
