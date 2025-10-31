# NOTION-SYNC Workflows

## Available Workflows in notion-sync

**install-notion-sync**
- Path: `bmad/notion-sync/workflows/install-notion-sync/workflow.yaml`
- Configure Notion integration and project settings

**test-connection**
- Path: `bmad/notion-sync/workflows/test-connection/workflow.yaml`
- Verify Notion API authentication, database access, and configuration

**update-status**
- Path: `bmad/notion-sync/workflows/update-status/workflow.yaml`
- Sync story status to Notion database with changelog tracking


## Execution

When running any workflow:
1. LOAD {project-root}/bmad/core/tasks/workflow.xml
2. Pass the workflow path as 'workflow-config' parameter
3. Follow workflow.xml instructions EXACTLY
4. Save outputs after EACH section

## Modes
- Normal: Full interaction
- #yolo: Skip optional steps
