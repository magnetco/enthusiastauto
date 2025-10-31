# Install Notion Sync - Validation Checklist

This checklist validates that the Notion integration setup completed successfully.

## Configuration File Validation

- [ ] Config file exists at `bmad/notion-sync/config.yaml`
- [ ] Config contains valid `notion_api_token` (starts with 'secret_')
- [ ] Config contains `notion_database_id` (32-character alphanumeric)
- [ ] Config contains `current_status_block_id` (32-character alphanumeric or empty if skipped)
- [ ] Config contains `project_name` (non-empty string)
- [ ] Config includes `status_mapping` object with at least 5 status types
- [ ] All path variables use proper {project-root} syntax

## API Authentication Validation

- [ ] Notion API token successfully authenticates (test call to /v1/users/me returns 200)
- [ ] Integration has access to at least one database
- [ ] Selected database ID matches an accessible database in Notion workspace

## Database Access Validation

- [ ] Can query the configured database (GET /v1/databases/{database_id} returns 200)
- [ ] Database has required properties: Story Name (title), Status (select)
- [ ] Integration has read and write permissions to the database

## Status Block Validation (if configured)

- [ ] Can read the status block (GET /v1/blocks/{block_id} returns 200) OR status block was skipped
- [ ] Integration has permissions to update the block OR status block was skipped
- [ ] Block is in a page that's shared with the integration OR status block was skipped

## Data Directory Validation

- [ ] Data directory exists at `bmad/notion-sync/data/`
- [ ] Data directory is writable
- [ ] Changelog file exists at `bmad/notion-sync/data/changelog.md`
- [ ] Changelog file contains initial header and timestamp
- [ ] Changelog file is writable for future updates

## Security Validation

- [ ] Config file is NOT in version control (should be in .gitignore)
- [ ] API token is stored securely (not exposed in logs or output)
- [ ] Token display in confirmation screens shows only last 4 characters

## Integration Permissions

- [ ] Notion integration is properly configured at notion.so/my-integrations
- [ ] Integration has been shared with the target database (via database settings → Connections)
- [ ] Integration has been shared with the status block's parent page (if status block configured)

## Workflow Completion

- [ ] All 12 setup steps completed without errors
- [ ] User received success confirmation message
- [ ] User was provided with next steps (load Status Reporter Agent, try first update)
- [ ] Configuration saved before workflow exit

## Error Recovery

- [ ] If setup failed, error message was clear and actionable
- [ ] If API calls failed, appropriate troubleshooting guidance was provided
- [ ] User can restart setup without conflicts (existing config can be overwritten)

## Post-Setup Validation Commands

After setup completes, test these commands work:

- [ ] `*test-connection` from Setup Agent successfully validates all settings
- [ ] `*show-config` from Setup Agent displays configuration (with masked token)
- [ ] Status Reporter Agent can be loaded without errors
- [ ] Config variables are accessible to the Status Reporter Agent

---

## Success Criteria

Setup is considered successful when:

1. ✅ Config file exists with all required fields
2. ✅ API authentication works (test call succeeds)
3. ✅ Database is accessible and has required properties
4. ✅ Status block is accessible (or intentionally skipped)
5. ✅ Data directory and changelog are initialized
6. ✅ User received confirmation and next steps

## Troubleshooting Reference

If validation fails, common issues:

**Token Authentication Fails:**
- Verify token copied correctly from notion.so/my-integrations
- Check token hasn't expired or been revoked
- Ensure token starts with 'secret_'

**Database Not Accessible:**
- Confirm database is shared with integration (Database → ... → Connections)
- Verify integration is enabled in Notion workspace settings
- Check database hasn't been archived or deleted

**Status Block Not Accessible:**
- Confirm parent page is shared with integration (Page → Share → Connections)
- Verify block ID is correct (should be 32 characters)
- Ensure block wasn't deleted

**Config File Issues:**
- Check write permissions on bmad/notion-sync/ directory
- Verify YAML syntax is valid (no unescaped quotes)
- Ensure file encoding is UTF-8

---

**Validation Complete**: All systems nominal if all checkboxes are ticked! 🚀
