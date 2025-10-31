# Update Status - Workflow Instructions

<critical>The workflow execution engine is governed by: {project-root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project-root}/bmad/notion-sync/workflows/update-status/workflow.yaml</critical>
<critical>Communicate in {communication_language} throughout the process</critical>
<critical>Use Mission Control Flight Director language - efficient, operational, status-focused</critical>

<workflow>

<step n="1" goal="Verify configuration exists">
<action>Attempt to load configuration from {notion_config}</action>

<check if="config file not found">
<action>Explain: "Configuration not detected. Notion integration must be configured before status updates.

Run the Setup Agent first:
```
agent setup
*setup
```

This will establish the connection to Notion Mission Control."</action>

<action>Exit workflow - cannot proceed without configuration</action>
</check>

<action>Load all configuration variables:
- {{notion_api_token}}
- {{notion_database_id}}
- {{current_status_block_id}}
- {{project_name}}
- {{status_mapping}}
</action>

<action>Confirm: "Configuration loaded. All systems ready for status transmission."</action>
</step>

<step n="2" goal="Collect story identifier">
<action>Greet {user_name} with Flight Director style:

"Flight Director standing by, {user_name}. Ready to transmit status update to Notion Mission Control.

Let's begin the status transmission sequence."</action>

<ask>Which story are you updating? (Enter story ID, e.g., Story-12, US-045, or any identifier)</ask>

<action>Store response as {{story_id}}</action>

<action>Trim whitespace and normalize the story ID</action>

<check if="story_id is empty">
<action>Explain: "Story identifier required for status transmission. Please provide a story ID."</action>
<goto step="2">Retry story ID collection</goto>
</check>

<action>Confirm: "Target story: {{story_id}}"</action>
</step>

<step n="3" goal="Collect new status">
<action>Display available status options from {{status_mapping}}:

"Select new status for {{story_id}}:

1. In Progress 🚧
2. Done ✅
3. Blocked 🔴
4. Code Review 👀
5. Testing 🧪
6. Not Started ⚪

Or enter a custom status."</action>

<ask>Enter status number (1-6) or type custom status:</ask>

<action>Parse user input:
- If number 1-6: Map to corresponding status from {{status_mapping}}
- If text: Use as custom status
- Store as {{new_status}}
</action>

<check if="invalid selection">
<action>Explain: "Invalid selection. Please enter a number (1-6) or type your custom status."</action>
<goto step="3">Retry status selection</goto>
</check>

<action>Confirm: "Status update: {{new_status}}"</action>
</step>

<step n="4" goal="Collect update notes">
<ask>Any notes about this update? (Describe what changed, what was accomplished, blockers, etc.)

Press Enter to skip notes:</ask>

<action>Store response as {{update_notes}}</action>

<check if="update_notes is empty">
<action>Set {{update_notes}} to empty string - notes are optional</action>
</check>
</step>

<step n="5" goal="Check if story exists in Notion database">
<action>Announce: "Scanning Notion database for story {{story_id}}..."</action>

<action>Query Notion database to find matching story:
- Endpoint: POST https://api.notion.com/v1/databases/{{notion_database_id}}/query
- Headers:
  - Authorization: Bearer {{notion_api_token}}
  - Notion-Version: 2022-06-28
  - Content-Type: application/json
- Body: Search for story_id in database properties (likely "Story ID" or "Title" property)
- Parse response to find matching page
</action>

<check if="story found in database">
<action>Store the Notion page ID as {{notion_page_id}}</action>
<action>Confirm: "✅ Story located in Notion database. Preparing to update existing entry."</action>
<action>Set {{update_mode}} to "update"</action>
</check>

<check if="story not found">
<action>Explain: "Story {{story_id}} not found in Notion database."</action>

<ask>Would you like to:
1. Create a new entry for this story
2. Re-enter the story ID
3. Cancel this update

Choose option (1-3):</ask>

<check if="option 1">
<action>Set {{update_mode}} to "create"</action>
<action>Confirm: "Will create new story entry in Notion."</action>
</check>

<check if="option 2">
<goto step="2">Return to story ID collection</goto>
</check>

<check if="option 3">
<action>Announce: "Status transmission aborted. No changes made."</action>
<action>Exit workflow</action>
</check>
</check>
</step>

<step n="6" goal="Update or create story in Notion database">
<action>Announce: "Transmitting status update to Notion..."</action>

<check if="update_mode is create">
<action>Create new page in Notion database:
- Endpoint: POST https://api.notion.com/v1/pages
- Headers: Authorization, Notion-Version, Content-Type
- Body structure:
  ```json
  {
    "parent": {"database_id": "{{notion_database_id}}"},
    "properties": {
      "Story ID": {"title": [{"text": {"content": "{{story_id}}"}}]},
      "Status": {"select": {"name": "{{new_status}}"}},
      "Notes": {"rich_text": [{"text": {"content": "{{update_notes}}"}}]}
    }
  }
  ```
- Adjust property names based on actual database schema
- Handle API response and errors
</action>

<check if="create successful">
<action>Store new page ID as {{notion_page_id}}</action>
<action>Confirm: "✅ New story entry created in Notion database."</action>
</check>

<check if="create fails">
<action>Display error details and possible causes:
- Schema mismatch: Property names don't match database
- Permission error: Integration lacks write access
- Rate limit: Too many requests

Provide actionable troubleshooting guidance.</action>

<ask>Status transmission failed. Would you like to:
1. Retry the update
2. View full error details
3. Abort this update

Choose option (1-3):</ask>

<check if="option 1">
<goto step="6">Retry update</goto>
</check>

<check if="option 2">
<action>Display complete error response from Notion API</action>
<goto step="6">Return to retry options</goto>
</check>

<check if="option 3">
<action>Exit workflow</action>
</check>
</check>
</check>

<check if="update_mode is update">
<action>Update existing page in Notion:
- Endpoint: PATCH https://api.notion.com/v1/pages/{{notion_page_id}}
- Headers: Authorization, Notion-Version, Content-Type
- Body structure:
  ```json
  {
    "properties": {
      "Status": {"select": {"name": "{{new_status}}"}},
      "Notes": {"rich_text": [{"text": {"content": "{{update_notes}}"}}]},
      "Last Updated": {"date": {"start": "{{current_timestamp}}"}}
    }
  }
  ```
- Handle API response and errors
</action>

<check if="update successful">
<action>Confirm: "✅ Story status updated in Notion database."</action>
</check>

<check if="update fails">
<action>Display error and troubleshooting options (same as create error handling)</action>
<ask>Retry, view details, or abort? (1-3)</ask>
<action>Handle user choice similar to create error flow</action>
</check>
</check>
</step>

<step n="7" goal="Ask about status block update">
<check if="current_status_block_id is empty or null">
<action>Note: "Status block not configured. Skipping block update."</action>
<action>Skip to step 9 (changelog)</action>
</check>

<ask>Would you like to update the current status block in Notion with a high-level project update? [yes/no]</ask>

<action>Store response as {{update_block_choice}}</action>

<check if="no">
<action>Skip to step 9 (changelog)</action>
</check>
</step>

<step n="8" goal="Update status block">
<ask>What's the high-level status update for your project?

Example: "Sprint 3 Day 5: 8/12 stories completed. Working on authentication features."

Enter your status update:</ask>

<action>Store response as {{status_block_content}}</action>

<action>Announce: "Transmitting status block update..."</action>

<action>Update the Notion block:
- Endpoint: PATCH https://api.notion.com/v1/blocks/{{current_status_block_id}}
- Headers: Authorization, Notion-Version, Content-Type
- Body structure (for paragraph block):
  ```json
  {
    "paragraph": {
      "rich_text": [
        {
          "text": {
            "content": "🚀 Project Status ({{current_date}})\n\n{{status_block_content}}\n\n— Updated by {{user_name}} via Notion Project Reporter"
          }
        }
      ]
    }
  }
  ```
- Handle response
</action>

<check if="block update successful">
<action>Confirm: "✅ Status block updated successfully."</action>
</check>

<check if="block update fails">
<action>Explain error but don't abort:
"⚠️ Could not update status block. This might be because:
- Block was deleted or moved
- Integration lost access to the page
- Block type doesn't support text updates

The story was updated successfully in the database. You can reconfigure the status block later with *reconfigure from Setup Agent."</action>
</check>
</step>

<step n="9" goal="Append to changelog">
<action>Announce: "Logging to mission changelog..."</action>

<action>Prepare changelog entry:

```markdown
## {{current_date}} {{current_time}} - {{story_id}} Status Update

**Story:** {{story_id}}
**New Status:** {{new_status}}
**Updated By:** {{user_name}}
**Notes:** {{update_notes}}
**Notion Page:** https://notion.so/{{notion_page_id}}

---

```
</action>

<action>Append this entry to {changelog_file}</action>

<check if="changelog append successful">
<action>Confirm: "✅ Mission log updated."</action>
</check>

<check if="changelog append fails">
<action>Warn: "⚠️ Could not update changelog file. Story was updated in Notion successfully."</action>
</check>
</step>

<step n="10" goal="Success summary">
<action>Present Flight Director confirmation:

"🎯 **STATUS TRANSMISSION COMPLETE**

All systems nominal, {user_name}. Status update successfully transmitted to Notion Mission Control.

**Transmission Summary:**
✅ Story: {{story_id}}
✅ New Status: {{new_status}}
✅ Database updated: {{project_name}}
✅ Notion page: https://notion.so/{{notion_page_id}}
{{#if status_block_updated}}✅ Status block updated{{/if}}
✅ Mission log entry recorded

**Next Actions:**
- View full changelog: Use *view-changelog command
- Update another story: Run *update-status again
- Sync multiple stories: Use *sync-stories for batch operations
- Check connection health: Use *status-report

Mission Control standing by for next transmission. 🚀"</action>

<action>Address {user_name} by name in closing</action>

<action>Communicate in {communication_language}</action>
</step>

</workflow>
