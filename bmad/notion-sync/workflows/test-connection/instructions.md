# Test Connection - Workflow Instructions

<critical>The workflow execution engine is governed by: {project-root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project-root}/bmad/notion-sync/workflows/test-connection/workflow.yaml</critical>
<critical>Communicate in {communication_language} throughout the process</critical>
<critical>Use Mission Control Ground Control language - diagnostic, methodical, systems-check focused</critical>

<workflow>

<step n="1" goal="Load and validate configuration">
<action>Greet {user_name} with Ground Control style:

"Ground Control initiating systems diagnostic, {user_name}.

Running comprehensive Notion connectivity and permissions check..."</action>

<action>Attempt to load configuration from {notion_config}</action>

<check if="config file not found">
<action>Report failure:

"❌ CONFIGURATION NOT FOUND

The Notion integration has not been configured yet.

To establish connection to Notion Mission Control, run the Setup Agent:

```
agent setup
*setup
```

Systems check cannot proceed without configuration."</action>

<action>Exit workflow - cannot proceed without configuration</action>
</check>

<action>Load all configuration variables:
- {{notion_api_token}}
- {{notion_database_id}}
- {{current_status_block_id}}
- {{project_name}}
</action>

<action>Report: "✅ Configuration file loaded
Project: {{project_name}}
Database ID: {{notion_database_id}} (first 8 chars)
Status Block ID: {{current_status_block_id}} (first 8 chars)
API Token: •••••••••• (secured)

Beginning connectivity tests..."</action>
</step>

<step n="2" goal="Test Notion API authentication">
<action>Explain: "🔍 TEST 1/3: API Authentication

Testing Notion API credentials..."</action>

<action>Make API request to Notion API to validate authentication:
- Endpoint: GET https://api.notion.com/v1/users/me
- Headers:
  - Authorization: Bearer {{notion_api_token}}
  - Notion-Version: 2022-06-28
</action>

<check if="API returns 200 OK">
<action>Parse response to get authenticated user information</action>

<action>Report success:

"✅ API AUTHENTICATION: SUCCESSFUL

Connected as: [user name from API response]
Bot ID: [bot id from API response]
Workspace: [workspace name if available]

API credentials are valid and active."</action>
</check>

<check if="API returns 401 Unauthorized">
<action>Report failure:

"❌ API AUTHENTICATION: FAILED

Error: Invalid or expired API token

The Notion API token in your configuration is not valid.

Troubleshooting steps:
1. Go to https://www.notion.so/my-integrations
2. Verify your integration exists
3. Copy the 'Internal Integration Token'
4. Run the Setup Agent to update configuration:
   ```
   agent setup
   *reconfigure
   ```

Make sure to copy the complete token string (starts with 'secret_')."</action>

<ask>Retry authentication test? [y/n]</ask>

<check if="yes">
<goto step="1">Reload configuration and retry</goto>
</check>

<check if="no">
<action>Exit workflow with failure status</action>
</check>
</check>

<check if="API returns other error or network failure">
<action>Report failure:

"❌ API AUTHENTICATION: ERROR

Error: [error message from API or network]

Possible causes:
- Network connectivity issues
- Notion API service disruption
- Firewall or proxy blocking requests

Check your internet connection and try again."</action>

<ask>Retry authentication test? [y/n]</ask>

<check if="yes">
<goto step="2">Retry authentication</goto>
</check>

<check if="no">
<action>Exit workflow with failure status</action>
</check>
</check>
</step>

<step n="3" goal="Test database access permissions">
<action>Explain: "🔍 TEST 2/3: Database Access

Verifying connection to project database..."</action>

<action>Make API request to query the database:
- Endpoint: POST https://api.notion.com/v1/databases/{{notion_database_id}}/query
- Headers:
  - Authorization: Bearer {{notion_api_token}}
  - Notion-Version: 2022-06-28
  - Content-Type: application/json
- Body: {"page_size": 1}
</action>

<check if="API returns 200 OK">
<action>Parse response to get database information and entry count</action>

<action>Report success:

"✅ DATABASE ACCESS: SUCCESSFUL

Database ID: {{notion_database_id}}
Database accessible: Yes
Current entries: [count from API response]

The integration has proper access to query and read the project database."</action>
</check>

<check if="API returns 404 Not Found">
<action>Report failure:

"❌ DATABASE ACCESS: NOT FOUND

Error: Database ID not found or not accessible

The database ID in your configuration does not exist or the integration doesn't have access.

Troubleshooting steps:
1. Open your project database in Notion
2. Click '...' → 'Connections'
3. Ensure your integration is connected
4. If database was deleted or ID changed, run:
   ```
   agent setup
   *reconfigure
   ```"</action>

<ask>Retry database test? [y/n]</ask>

<check if="yes">
<goto step="1">Reload configuration and retry</goto>
</check>

<check if="no">
<action>Exit workflow with failure status</action>
</check>
</check>

<check if="API returns 403 Forbidden">
<action>Report failure:

"❌ DATABASE ACCESS: PERMISSION DENIED

Error: Integration lacks permission to access database

The integration can authenticate but doesn't have permission to access this database.

Required action:
1. Open the database in Notion
2. Click '...' → 'Connections'
3. Add your integration to the database connections
4. Return here and retry the test"</action>

<ask>Ready to retry database test? [y/n]</ask>

<check if="yes">
<goto step="3">Retry database access</goto>
</check>

<check if="no">
<action>Exit workflow with failure status</action>
</check>
</check>

<check if="API returns other error">
<action>Report failure:

"❌ DATABASE ACCESS: ERROR

Error: [error message from API]

An unexpected error occurred while accessing the database.

Error details: [full error response]"</action>

<ask>Retry database test? [y/n]</ask>

<check if="yes">
<goto step="3">Retry database access</goto>
</check>

<check if="no">
<action>Exit workflow with failure status</action>
</check>
</check>
</step>

<step n="4" goal="Test status block access permissions">
<action>Explain: "🔍 TEST 3/3: Status Block Access

Verifying access to current status block..."</action>

<check if="current_status_block_id is empty or not set">
<action>Report skip:

"⚠️ STATUS BLOCK ACCESS: SKIPPED

No status block ID configured.

This is optional - you can still update story database without status block updates.

To enable status block updates, run:
```
agent setup
*reconfigure
```"</action>

<goto step="5">Skip to final report</goto>
</check>

<action>Make API request to retrieve the block:
- Endpoint: GET https://api.notion.com/v1/blocks/{{current_status_block_id}}
- Headers:
  - Authorization: Bearer {{notion_api_token}}
  - Notion-Version: 2022-06-28
</action>

<check if="API returns 200 OK">
<action>Parse response to get block information</action>

<action>Report success:

"✅ STATUS BLOCK ACCESS: SUCCESSFUL

Block ID: {{current_status_block_id}}
Block type: [type from API response]
Block accessible: Yes

The integration can read and update the current status block."</action>
</check>

<check if="API returns 404 Not Found">
<action>Report warning:

"⚠️ STATUS BLOCK ACCESS: NOT FOUND

Error: Block ID not found or not accessible

The status block ID in configuration is invalid or the integration doesn't have access.

Impact: Story database updates will work, but status block updates will fail.

To fix:
1. Open the page containing the status block in Notion
2. Share the page with your integration
3. Or update the block ID:
   ```
   agent setup
   *reconfigure
   ```"</action>
</check>

<check if="API returns 403 Forbidden">
<action>Report warning:

"⚠️ STATUS BLOCK ACCESS: PERMISSION DENIED

Error: Integration lacks permission to access the block

The parent page containing this block hasn't been shared with the integration.

To fix:
1. Open the page in Notion
2. Click 'Share' → 'Add connections'
3. Select your integration
4. Return and retry test"</action>

<ask>Retry status block test? [y/n]</ask>

<check if="yes">
<goto step="4">Retry block access</goto>
</check>
</check>

<check if="API returns other error">
<action>Report warning:

"⚠️ STATUS BLOCK ACCESS: ERROR

Error: [error message from API]

Status block updates may not work, but story database updates will still function."</action>
</check>
</step>

<step n="5" goal="Generate final systems report">
<action>Display comprehensive systems check summary:

"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       NOTION MISSION CONTROL - SYSTEMS CHECK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PROJECT: {{project_name}}
TIMESTAMP: {{date}}

CONNECTIVITY STATUS:

✅ API Authentication .......... OPERATIONAL
✅ Database Access ............. OPERATIONAL
[✅/⚠️/❌] Status Block Access ...... [OPERATIONAL/LIMITED/OFFLINE]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SYSTEM CAPABILITIES:

✅ Can update story status in database
✅ Can create new story entries
✅ Can query existing stories
[✅/❌] Can update current status block

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ALL SYSTEMS [GREEN/YELLOW/RED]

[If all green]: Mission Control is fully operational. You are cleared for status updates.

[If yellow/red]: Review warnings above. Some features may be limited.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"</action>

<action>Provide next steps guidance based on results:

[If all systems green]:
"Ready to begin status reporting operations.

To update a story status:
```
agent reporter
*update-status
```

To synchronize all stories:
```
agent reporter
*sync-stories
```"

[If there are warnings]:
"Some systems are limited. Review the warnings above and fix permissions before attempting status updates.

To reconfigure:
```
agent setup
*reconfigure
```"

[If there are errors]:
"Critical systems offline. Fix the errors above before attempting status updates.

To reconfigure from scratch:
```
agent setup
*setup
```"
</action>

<action>Confirm workflow completion:

"Systems diagnostic complete. Ground Control out."</action>
</step>

</workflow>
