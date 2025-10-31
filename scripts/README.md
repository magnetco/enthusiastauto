# Scripts Directory

This directory contains utility scripts for the Enthusiast Auto project.

## Available Scripts

### extract-tasks.js

Extracts all tasks (not subtasks) from every story file in the `/docs/stories` directory and compiles them into a single document. Optionally creates or updates pages in a Notion database for each story.

#### Usage

```bash
# Run directly
node scripts/extract-tasks.js

# Or use the npm script
npm run extract:tasks
```

#### Notion Integration

The script can optionally create or update pages in a Notion database for each story. To enable this feature:

1. Install the Notion SDK:
   ```bash
   npm run install:notion
   ```

2. Create a `.env.local` file in your project root
3. Add the following environment variables:
   ```bash
   NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
4. Set up your Notion database with these properties:
   - **Story Title** (Title) - The story title
   - **Story Status** (Select) - Options: Not Started, In Progress, Complete
   - **Completion** (Number) - Completion percentage

For detailed setup instructions, see `/docs/env-example.md`.

#### Output

The script generates a `tasks-summary.md` file in the `/docs` directory that includes:

- Story titles and status
- All tasks with completion status (✅ for complete, ⏳ for incomplete)
- A summary section with total counts and completion percentage

If Notion integration is enabled, it will also create or update pages in your Notion database with:
- Story title and status
- Completion percentage
- Checklist of all tasks (marked as complete or incomplete)

#### Features

- Processes all `.md` files in the `/docs/stories` directory that start with `story-`
- Extracts only top-level tasks (not subtasks)
- Identifies task completion status from markdown checkboxes
- Provides a summary with total counts and completion percentage
- Sorts stories alphabetically by filename
- Optional Notion database integration
- Creates new pages or updates existing ones based on story title

### install-notion.js

Installs the Notion SDK required for Notion integration with the extract-tasks script.

#### Usage

```bash
# Run directly
node scripts/install-notion.js

# Or use the npm script
npm run install:notion
```

This script will:
1. Install the `@notionhq/client` package
2. Provide instructions for setting up Notion integration

### import-vehicles.ts

Imports vehicle data from a CSV file into the database.

#### Usage

```bash
npm run import:vehicles
```

## Adding New Scripts

When adding new scripts to this directory:

1. Create the script file with an appropriate extension (.js for Node.js, .ts for TypeScript)
2. Make the script executable with `chmod +x scripts/script-name.js`
3. Add a corresponding npm script in `package.json` if the script will be run frequently
4. Update this README.md with documentation for the new script
