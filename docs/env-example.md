# Environment Variables Example

## Notion API Configuration

To enable Notion integration with the extract-tasks script, you'll need to set these environment variables:

```bash
# Get these values from your Notion integration setup
# See: https://www.notion.so/my-integrations

NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### How to get these values:

1. **NOTION_API_KEY**:
   - Go to https://www.notion.so/my-integrations
   - Create a new integration or select an existing one
   - Copy the "Internal Integration Token" (starts with `secret_`)

2. **NOTION_DATABASE_ID**:
   - Open your Notion database
   - Copy the ID from the URL (the long string of characters after your workspace name and before the question mark)
   - Example: `https://www.notion.so/your-workspace/a1b2c3d4e5f678901234567890123456?v=...`
   - The database ID is: `a1b2c3d4e5f678901234567890123456`

### Setting up your Notion database:

Your database should have these properties (case-sensitive):

- **Story Title** (Title) - The story title
- **Story Status** (Select) - Options: Not Started, In Progress, Complete
- **Completion** (Number) - Completion percentage

### Using the script with Notion:

1. Create a `.env.local` file in your project root
2. Add the environment variables above
3. Run the script: `npm run extract:tasks`

The script will create or update pages in your Notion database for each story, with:
- Story title and status
- Completion percentage
- Checklist of all tasks (marked as complete or incomplete)
