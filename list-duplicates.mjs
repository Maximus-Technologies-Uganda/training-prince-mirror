import https from 'https';

const API_KEY = process.env.LINEAR_API_KEY;
const PARENT_ISSUE_ID = 'PRI-289';

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

async function main() {
  try {
    console.log('🔍 Fetching all sub-issues of PRI-289...\n');
    
    const query = `
      query {
        issue(id: "PRI-289") {
          identifier
          title
          children(first: 100) {
            nodes {
              id
              identifier
              title
            }
          }
        }
      }
    `;
    
    const result = await graphqlRequest(query);
    const issues = result.issue.children.nodes;
    
    console.log(`Found ${issues.length} total sub-issues\n`);
    console.log('📋 All sub-issues:');
    console.log('─'.repeat(80));
    
    issues.forEach(issue => {
      console.log(`${issue.identifier.padEnd(12)} ${issue.title}`);
    });
    
    console.log('\n' + '─'.repeat(80));
    console.log('\n🔍 Finding duplicates by title...\n');
    
    const titleMap = {};
    for (const issue of issues) {
      if (!titleMap[issue.title]) {
        titleMap[issue.title] = [];
      }
      titleMap[issue.title].push(issue);
    }
    
    let duplicateCount = 0;
    const duplicatesToDelete = [];
    
    for (const title in titleMap) {
      if (titleMap[title].length > 1) {
        duplicateCount++;
        console.log(`\n⚠️  DUPLICATE #${duplicateCount}: "${title}"`);
        console.log('   Keep:', titleMap[title][0].identifier);
        
        for (let i = 1; i < titleMap[title].length; i++) {
          const dup = titleMap[title][i];
          console.log(`   ❌ DELETE: ${dup.identifier} (id: ${dup.id})`);
          duplicatesToDelete.push({
            identifier: dup.identifier,
            id: dup.id,
            title: dup.title
          });
        }
      }
    }
    
    console.log('\n' + '─'.repeat(80));
    console.log(`\n📊 SUMMARY:`);
    console.log(`   Total sub-issues: ${issues.length}`);
    console.log(`   Unique titles: ${Object.keys(titleMap).length}`);
    console.log(`   Duplicate groups: ${duplicateCount}`);
    console.log(`   Issues to delete: ${duplicatesToDelete.length}`);
    
    if (duplicatesToDelete.length > 0) {
      console.log(`\n🗑️  ISSUES TO DELETE:\n`);
      duplicatesToDelete.forEach((dup, idx) => {
        console.log(`${idx + 1}. ${dup.identifier} - "${dup.title}"`);
        console.log(`   ID: ${dup.id}\n`);
      });
    } else {
      console.log('\n✅ No duplicates found!');
    }
    
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

main();
