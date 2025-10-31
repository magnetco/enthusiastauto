# Install Notion Sync - Setup Instructions

<critical>The workflow execution engine is governed by: {project-root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project-root}/bmad/notion-sync/workflows/install-notion-sync/workflow.yaml</critical>
<critical>Communicate in {communication_language} throughout the setup process</critical>
<critical>Use Mission Control themed language naturally - "establishing uplink," "coordinates locked in," "all systems green"</critical>

<workflow>

<step n="1" goal="Welcome and explain setup process">
<action>Welcome {user_name} to the Notion Project Reporter installation sequence!</action>

<action>Use Mission Control themed language to explain what we'll configure:

"Welcome to Mission Control, {user_name}! We're initiating the Notion integration sequence. This setup will establish a secure uplink between your project and Notion for automated status reporting.

**Mission Objectives:**
- Establish API authentication credentials
- Lock in database coordinates
- Configure status update channels
- Initialize mission log (changelog)
- Validate all systems before launch

This setup takes approximately 5 minutes. Let's begin the pre-flight checklist!"
</action>

<action>Ask if they're ready to proceed, addressing any concerns or questions they might have about the setup process</action>
</step>

<step n="2" goal="Collect Notion API token">
<action>Explain how to obtain a Notion API token with Mission Control flair:

"First, we need to establish secure communication credentials with Notion Mission Control.

**To obtain your API token:**
1. Navigate to: https://www.notion.so/my-integrations
2. Click 'Create new integration'
3. Name it 'Project Reporter' (or your preference)
4. Select your workspace
5. Copy the 'Internal Integration Token' (starts with 'secret_')

**Important:** This token grants access to your Notion workspace. Keep it secure!"
</action>

<ask>Please paste your Notion API token (it should start with 'secret_'):</ask>

<action>Store the token as {{notion_api_token}}</action>

<action>Validate token format:
- Must start with 'secret_'
- Should be approximately 50 characters
- If invalid format, explain the issue and ask again
</action>

<check if="token format invalid">
<action>Explain: "Token format doesn't match expected pattern. Notion API tokens start with 'secret_' followed by alphanumeric characters. Please double-check and try again."</action>
<goto step="2">Retry token collection</goto>
</check>
</step>

<step n="3" goal="Test token validity with API call">
<action>Announce: "Establishing uplink to Notion... Testing authentication credentials..."</action>

<action>Make a test API call to Notion:
- Endpoint: GET https://api.notion.com/v1/users/me
- Headers:
  - Authorization: Bearer {{notion_api_token}}
  - Notion-Version: 2022-06-28
- Parse response to validate token works
</action>

<check if="API call successful">
<action>Celebrate: "✅ Authentication successful! Uplink established. Credentials validated."</action>
</check>

<check if="API call fails">
<action>Diagnose the error:
- 401 Unauthorized: Invalid token
- Network error: Connectivity issue
- Other: Provide specific error message

Explain the issue clearly and offer to retry token entry or troubleshoot connectivity.
</action>

<ask>The authentication test failed. Would you like to:
1. Re-enter your API token
2. Check the error details
3. Abort setup for now

Choose an option (1-3):</ask>

<check if="option 1">
<goto step="2">Return to token collection</goto>
</check>

<check if="option 2">
<action>Display full error details and suggest troubleshooting steps</action>
<goto step="3">Retry test after troubleshooting</goto>
</check>

<check if="option 3">
<action>Explain: "Setup aborted. You can restart this workflow anytime by running the Setup Agent's *setup command."</action>
<action>Exit workflow gracefully</action>
</check>
</check>
</step>

<step n="4" goal="Fetch accessible databases from Notion">
<action>Announce: "Scanning Notion workspace for accessible databases..."</action>

<action>Query Notion API for databases the integration can access:
- Endpoint: POST https://api.notion.com/v1/search
- Headers: Authorization, Notion-Version
- Body: {"filter": {"property": "object", "value": "database"}}
- Parse response to extract database list with titles and IDs
</action>

<check if="no databases found">
<action>Explain: "No databases found. This means either:
1. You haven't shared any databases with the integration yet
2. The integration doesn't have access permissions

**To share a database with the integration:**
1. Open a database in Notion
2. Click '...' (more options) → 'Connections'
3. Select your 'Project Reporter' integration
4. The database will then be accessible"
</action>

<ask>After sharing a database with the integration, would you like to scan again? [yes/no]</ask>

<check if="yes">
<goto step="4">Retry database scan</goto>
</check>

<check if="no">
<action>Explain: "Setup cannot continue without database access. Exiting setup. Run *setup again after sharing databases."</action>
<action>Exit workflow</action>
</check>
</check>

<action>Store database list as {{available_databases}} with format: [{id, title, url}]</action>
</step>

<step n="5" goal="User selects project database">
<action>Present the database options with Mission Control language:

"Database coordinates received! I've detected {{database_count}} accessible databases in your Notion workspace.

**Available Databases:**"
</action>

<action>Display numbered list of databases with titles</action>

<ask>Which database should we use for project reporting? Enter the number (1-{{database_count}}):</ask>

<action>Validate selection is within range</action>

<check if="invalid selection">
<action>Explain: "Invalid selection. Please enter a number between 1 and {{database_count}}."</action>
<goto step="5">Retry selection</goto>
</check>

<action>Store selected database as {{selected_database}} with id, title, and url</action>

<action>Confirm: "✅ Database locked in: {{selected_database.title}}"</action>
</step>

<step n="6" goal="Capture current status block ID">
<action>Explain how to get a block ID for status updates:

"Now we need the coordinates for your 'Current Status' block in Notion. This is where we'll post high-level project updates.

**To get a block URL/ID:**
1. In Notion, navigate to the page where you want status updates
2. Hover over any block (paragraph, heading, etc.)
3. Click the '⋮⋮' (six dots) → 'Copy link to block'
4. Paste that link here

**Alternatively:**
- You can paste the entire page URL and we'll update a block at the top
- Or paste a block ID directly (32-character alphanumeric)"
</action>

<ask>Paste the Notion block link or page URL:</ask>

<action>Parse the URL/ID to extract block ID:
- Extract 32-character alphanumeric ID from URL
- Format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx (with or without hyphens)
- Clean and normalize the ID
</action>

<check if="cannot parse valid ID">
<action>Explain: "Couldn't extract a valid block ID from that input. Please ensure you copied the link correctly. Block IDs are 32-character strings (with or without hyphens)."</action>
<goto step="6">Retry block ID capture</goto>
</check>

<action>Store as {{current_status_block_id}}</action>
</step>

<step n="7" goal="Validate block access">
<action>Announce: "Testing access to status update block..."</action>

<action>Attempt to read the specified block via API:
- Endpoint: GET https://api.notion.com/v1/blocks/{{current_status_block_id}}
- Headers: Authorization, Notion-Version
- Verify the integration has read/write permissions
</action>

<check if="access successful">
<action>Confirm: "✅ Status block access confirmed. Ready for status transmissions."</action>
</check>

<check if="access fails">
<action>Diagnose error:
- 404 Not Found: Block doesn't exist or wrong ID
- 403 Forbidden: Integration doesn't have access to this page
- Other: Display specific error

Explain: "Cannot access the specified block. Common issues:
1. The page isn't shared with your integration
2. Block ID is incorrect
3. Block was deleted

Please share the page with your integration and try again."
</action>

<ask>Would you like to:
1. Enter a different block ID
2. Skip status block setup (can configure later)
3. Abort setup

Choose an option (1-3):</ask>

<check if="option 1">
<goto step="6">Return to block ID capture</goto>
</check>

<check if="option 2">
<action>Set {{current_status_block_id}} to empty/null</action>
<action>Note: "Status block updates will be disabled. You can configure this later with *reconfigure."</action>
</check>

<check if="option 3">
<action>Exit workflow</action>
</check>
</check>
</step>

<step n="8" goal="Capture project name">
<ask>What is your project name? (This will be used in configuration and status updates)</ask>

<action>Store as {{project_name}}</action>

<action>If empty or whitespace only, use a default based on directory name or "My Project"</action>

<action>Confirm: "Project designation: {{project_name}}"</action>
</step>

<step n="9" goal="Save configuration to config.yaml">
<action>Announce: "Preparing to save mission parameters..."</action>

<action>Show configuration summary:

"**Configuration Summary:**
- Project: {{project_name}}
- Notion Database: {{selected_database.title}}
- Database ID: {{selected_database.id}}
- Status Block ID: {{current_status_block_id}}
- API Token: secret_****{{last_4_chars}}

This will be saved to: {config_file}"
</action>

<ask>Confirm configuration and save? [yes/no]</ask>

<check if="no">
<ask>Would you like to:
1. Restart setup from beginning
2. Go back and change specific values
3. Cancel setup

Choose option (1-3):</ask>

<check if="option 1">
<goto step="1">Restart setup</goto>
</check>

<check if="option 2">
<action>Ask which value to change (database, block, project name, token)</action>
<action>Jump to appropriate step based on selection</action>
</check>

<check if="option 3">
<action>Exit workflow</action>
</check>
</check>

<action>Write configuration file to {config_file}:

```yaml
# Notion Project Reporter Configuration
# Generated by install-notion-sync workflow on {{date}}
# User: {{user_name}}

notion_api_token: "{{notion_api_token}}"
notion_database_id: "{{selected_database.id}}"
current_status_block_id: "{{current_status_block_id}}"
project_name: "{{project_name}}"

# Status emoji mapping
status_mapping:
  "In Progress": "🚧 In Progress"
  "Done": "✅ Done"
  "Blocked": "🔴 Blocked"
  "Code Review": "👀 Code Review"
  "Testing": "🧪 Testing"
  "Not Started": "⚪ Not Started"

# Module version
module_version: "1.0.0"

# Data paths
data_path: "{project-root}/bmad/notion-sync/data"
changelog_file: "{project-root}/bmad/notion-sync/data/changelog.md"
story_map_file: "{project-root}/bmad/notion-sync/data/story-map.json"
```
</action>

<action>Confirm: "✅ Configuration saved successfully!"</action>
</step>

<step n="10" goal="Create data directory">
<action>Announce: "Initializing data storage systems..."</action>

<action>Create directory: {data_directory}</action>

<check if="directory already exists">
<action>Note: "Data directory already exists. Skipping creation."</action>
</check>

<check if="directory created successfully">
<action>Confirm: "✅ Data directory initialized at: {data_directory}"</action>
</check>
</step>

<step n="11" goal="Initialize changelog file">
<action>Announce: "Creating mission log..."</action>

<action>Create empty changelog file at: {changelog_file}</action>

<action>Write initial content:

```markdown
# Notion Sync - Mission Log

This file tracks all status updates synchronized to Notion.

---

## {{date}} - Mission Log Initialized

Project: {{project_name}}
Status: Mission Control systems online, ready for status transmissions.

---

```
</action>

<action>Confirm: "✅ Mission log (changelog) initialized."</action>
</step>

<step n="12" goal="Success summary and next steps">
<action>Present Mission Control celebration:

"🎯 **MISSION ACCOMPLISHED!**

All systems are nominal, {user_name}. Notion integration is fully operational!

**Configuration Status:**
✅ API authentication established
✅ Database coordinates locked: {{selected_database.title}}
✅ Status transmission channel configured
✅ Mission log initialized
✅ All systems green

**Next Steps:**

1. **Load the Status Reporter Agent**
   Run: `agent reporter` or from your agent menu

2. **Try your first status update**
   Use the *update-status command to sync a story to Notion

3. **Test the connection**
   You can verify everything with *test-connection anytime

**Mission Control Tips:**
- Your configuration is saved in: {config_file}
- Changelog tracking at: {changelog_file}
- Need to change settings? Run *reconfigure from Setup Agent

Ready to report status updates to Notion! 🚀"
</action>

<action>Address {user_name} by name in closing</action>

<action>Communicate celebration in {communication_language}</action>
</step>

</workflow>
