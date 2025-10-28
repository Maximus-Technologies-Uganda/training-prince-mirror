import https from 'https';
import fs from 'fs';

const API_KEY = process.env.LINEAR_API_KEY;
const PARENT_ID = process.env.PARENT_ID || 'PRI-1447';
const TASKS_FILE = process.env.TASKS_FILE || 'specs/015-friday-final-polish/tasks.md';

if (!API_KEY) {
  console.error('❌ LINEAR_API_KEY not set');
  process.exit(1);
}

async function graphqlRequest(query, variables = {}) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ query, variables });
    const req = https.request({
      method: 'POST',
      hostname: 'api.linear.app',
      path: '/graphql',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        'Authorization': API_KEY
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.errors) {
            reject(new Error(json.errors.map(e => e.message).join('; ')));
          } else {
            resolve(json.data);
          }
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function parseTasksFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const tasks = [];
  const taskRegex = /- \[.\] \*\*([T\d]+)\*\*\s+(.+?)(?:\n|$)/g;
  let match;
  while ((match = taskRegex.exec(content)) !== null) {
    tasks.push({
      id: match[1],
      title: `${match[1]}: ${match[2].trim()}`
    });
  }
  return tasks;
}

async function createSubIssues() {
  console.log('🚀 Creating Linear sub-issues for PRI-1447');
  const tasks = parseTasksFile(TASKS_FILE);
  console.log(`Creating ${tasks.length} sub-issues...\n`);
  
  let created = 0;
  for (const task of tasks) {
    try {
      const response = await graphqlRequest(`
        mutation {
          issueCreate(input: {title: "${task.title}", parentId: "${PARENT_ID}"}) {
            issue { identifier }
          }
        }
      `);
      
      const id = response.issueCreate?.issue?.identifier;
      console.log(`✅ ${id} - ${task.title}`);
      created++;
    } catch (error) {
      console.log(`❌ ${task.title} - ${error.message}`);
    }
  }
  
  console.log(`\n✅ Created ${created}/${tasks.length} sub-issues`);
}

createSubIssues().catch(console.error);
