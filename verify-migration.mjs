import https from 'https';

const API_KEY = process.env.LINEAR_API_KEY;

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
    console.log('\n📊 MIGRATION VERIFICATION\n');
    console.log('═'.repeat(70));
    
    // Check PRI-1112
    console.log('\n🔍 Checking PRI-1112 (new parent)...\n');
    const query1112 = `
      query {
        issue(id: "PRI-1112") {
          identifier
          title
          children(first: 100) {
            nodes {
              identifier
              title
              state {
                name
              }
            }
          }
        }
      }
    `;
    
    const result1112 = await graphqlRequest(query1112);
    const subIssues1112 = result1112.issue.children.nodes;
    
    console.log(`PRI-1112: "${result1112.issue.title}"`);
    console.log(`Sub-issues: ${subIssues1112.length}`);
    
    if (subIssues1112.length > 0) {
      console.log('\n✅ Sub-issues found under PRI-1112:');
      subIssues1112.forEach(issue => {
        console.log(`   • ${issue.identifier} - ${issue.title} (${issue.state.name})`);
      });
    } else {
      console.log('\n⚠️  No sub-issues found under PRI-1112');
    }
    
    // Check PRI-289
    console.log('\n' + '─'.repeat(70));
    console.log('\n🔍 Checking PRI-289 (old parent)...\n');
    const query289 = `
      query {
        issue(id: "PRI-289") {
          identifier
          title
          children(first: 100) {
            nodes {
              identifier
              title
            }
          }
        }
      }
    `;
    
    const result289 = await graphqlRequest(query289);
    const subIssues289 = result289.issue.children.nodes;
    
    console.log(`PRI-289: "${result289.issue.title}"`);
    console.log(`Sub-issues: ${subIssues289.length}`);
    
    if (subIssues289.length > 0) {
      console.log('\n⚠️  Sub-issues still under PRI-289:');
      subIssues289.slice(0, 5).forEach(issue => {
        console.log(`   • ${issue.identifier} - ${issue.title}`);
      });
      if (subIssues289.length > 5) {
        console.log(`   ... and ${subIssues289.length - 5} more`);
      }
    } else {
      console.log('\n✅ No sub-issues under PRI-289 (successfully migrated)');
    }
    
    console.log('\n' + '═'.repeat(70));
    console.log(`\n📈 SUMMARY:`);
    console.log(`   PRI-1112 sub-issues: ${subIssues1112.length}`);
    console.log(`   PRI-289 sub-issues:  ${subIssues289.length}`);
    
    if (subIssues1112.length > 0 && subIssues289.length === 0) {
      console.log('\n✅ MIGRATION SUCCESSFUL!');
    } else if (subIssues1112.length === 0 && subIssues289.length > 0) {
      console.log('\n❌ MIGRATION FAILED - issues still under PRI-289');
    } else if (subIssues1112.length > 0 && subIssues289.length > 0) {
      console.log('\n⚠️  PARTIAL MIGRATION - some issues still under PRI-289');
    } else {
      console.log('\n❓ STATUS UNCLEAR - no sub-issues found in either location');
    }
    
    console.log('\n');
    
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

main();
