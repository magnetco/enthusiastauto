#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Try to import Notion client, but make it optional
let Client;
try {
  Client = require('@notionhq/client').Client;
} catch (error) {
  console.log('Notion SDK not installed. Notion integration will be skipped.');
  console.log('To enable Notion integration, run: npm install @notionhq/client');
}

// Directory containing story files
const storiesDir = path.join(__dirname, '../docs/stories');
// Output file path
const outputFile = path.join(__dirname, '../docs/tasks-summary.md');

// Notion configuration
const notionApiKey = process.env.NOTION_API_KEY;
const notionDatabaseId = process.env.NOTION_DATABASE_ID;

// Initialize Notion client if credentials are provided and module is available
let notion;
if (Client && notionApiKey && notionDatabaseId) {
  notion = new Client({ auth: notionApiKey });
}

// Function to extract tasks from a story file
function extractTasksFromFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    // Extract story title from the first line
    const titleLine = lines.find(line => line.startsWith('# Story'));
    const title = titleLine ? titleLine.replace('# ', '') : path.basename(filePath, '.md');
    
    // Extract status
    const statusLine = lines.find(line => line.startsWith('Status:'));
    const status = statusLine ? statusLine.replace('Status: ', '') : 'Unknown';
    
    // Extract tasks (not subtasks)
    const tasks = [];
    let inTasksSection = false;
    
    for (const line of lines) {
      // Check if we're in the Tasks / Subtasks section
      if (line.includes('Tasks / Subtasks')) {
        inTasksSection = true;
        continue;
      }
      
      // If we've moved to a new section, stop processing
      if (inTasksSection && line.startsWith('##') && !line.includes('Tasks')) {
        break;
      }
      
      // Extract tasks (not subtasks) - tasks start with "- [x]" or "- [ ]" and include "Task X:"
      if (inTasksSection && line.match(/^-\s*\[[x\s]\]\s+Task\s+\d+:/)) {
        const isComplete = line.includes('[x]');
        const taskText = line.replace(/^-\s*\[[x\s]\]\s+/, '');
        tasks.push({
          text: taskText,
          complete: isComplete
        });
      }
    }
    
    return { title, status, tasks };
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error.message);
    return null;
  }
}

// Function to determine story status based on task completion
function getStoryStatus(tasks) {
  if (tasks.length === 0) return 'Not Started';
  
  const completedTasks = tasks.filter(task => task.complete).length;
  const completionRate = Math.round((completedTasks / tasks.length) * 100);
  
  if (completionRate === 100) return 'Complete';
  if (completionRate > 0) return 'In Progress';
  return 'Not Started';
}

// Function to create or update a Notion page for a story
async function createOrUpdateNotionPage(storyData) {
  if (!notion) {
    console.log('Notion credentials not provided or Notion SDK not available. Skipping Notion integration.');
    return;
  }
  
  try {
    const { title, status, tasks } = storyData;
    const storyStatus = getStoryStatus(tasks);
    const completedTasks = tasks.filter(task => task.complete).length;
    const completionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;
    
    // Create checklist items for tasks
    const checklistItems = tasks.map(task => ({
      type: 'to_do',
      to_do: {
        text: [
          {
            type: 'text',
            text: {
              content: task.text
            }
          }
        ],
        checked: task.complete
      }
    }));
    
    // Create page content
    const pageContent = [
      {
        type: 'heading_2',
        heading_2: {
          text: [
            {
              type: 'text',
              text: {
                content: 'Tasks'
              }
            }
          ]
        }
      },
      ...checklistItems,
      {
        type: 'paragraph',
        paragraph: {
          text: [
            {
              type: 'text',
              text: {
                content: `Completion: ${completedTasks}/${tasks.length} (${completionRate}%)`
              }
            }
          ]
        }
      }
    ];
    
    // Check if a page with this story title already exists
    const existingPages = await notion.search({
      filter: {
        property: 'title',
        value: title
      },
      page_size: 1
    });
    
    if (existingPages.results.length > 0) {
      // Update existing page
      const pageId = existingPages.results[0].id;
      await notion.pages.update({
        page_id: pageId,
        properties: {
          'Story Status': {
            select: {
              name: storyStatus
            }
          },
          'Completion': {
            number: completionRate
          }
        },
        children: pageContent
      });
      console.log(`Updated Notion page for story: ${title}`);
    } else {
      // Create new page
      await notion.pages.create({
        parent: {
          database_id: notionDatabaseId
        },
        properties: {
          'Story Title': {
            title: [
              {
                text: {
                  content: title
                }
              }
            ]
          },
          'Story Status': {
            select: {
              name: storyStatus
            }
          },
          'Completion': {
            number: completionRate
          }
        },
        children: pageContent
      });
      console.log(`Created Notion page for story: ${title}`);
    }
  } catch (error) {
    console.error(`Error creating/updating Notion page for story ${storyData.title}:`, error.message);
  }
}

// Main function to process all story files
async function main() {
  try {
    // Get all .md files in the stories directory
    const files = fs.readdirSync(storiesDir)
      .filter(file => file.endsWith('.md') && file.startsWith('story-'))
      .sort();
    
    let output = '# Tasks Summary\n\n';
    output += `Generated on: ${new Date().toISOString().split('T')[0]}\n\n`;
    
    let totalTasks = 0;
    let completedTasks = 0;
    
    // Process each file
    for (const file of files) {
      const filePath = path.join(storiesDir, file);
      const storyData = extractTasksFromFile(filePath);
      
      if (storyData && storyData.tasks.length > 0) {
        // Create or update Notion page for this story
        await createOrUpdateNotionPage(storyData);
        
        output += `## ${storyData.title}\n\n`;
        output += `Status: ${storyData.status}\n\n`;
        
        for (const task of storyData.tasks) {
          const statusIcon = task.complete ? '✅' : '⏳';
          output += `${statusIcon} ${task.text}\n`;
          totalTasks++;
          if (task.complete) completedTasks++;
        }
        
        output += '\n';
      }
    }
    
    // Add summary
    output += '## Summary\n\n';
    output += `- Total Stories: ${files.length}\n`;
    output += `- Total Tasks: ${totalTasks}\n`;
    output += `- Completed Tasks: ${completedTasks}\n`;
    output += `- Incomplete Tasks: ${totalTasks - completedTasks}\n`;
    output += `- Completion Rate: ${totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%\n`;
    
    // Write to output file
    fs.writeFileSync(outputFile, output);
    console.log(`Tasks summary successfully generated at: ${outputFile}`);
    console.log(`Processed ${files.length} story files with ${totalTasks} total tasks.`);
    
    if (notion) {
      console.log('Notion database updated successfully.');
    } else {
      console.log('Notion integration skipped. Set NOTION_API_KEY and NOTION_DATABASE_ID environment variables to enable.');
    }
  } catch (error) {
    console.error('Error generating tasks summary:', error);
    process.exit(1);
  }
}

// Run the script
main();
