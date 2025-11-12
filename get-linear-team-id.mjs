#!/usr/bin/env node

/**
 * Get your Linear Team ID
 * 
 * Usage:
 *   export LINEAR_API_KEY="your-api-key"
 *   node get-linear-team-id.mjs
 */

import https from 'https';

const LINEAR_API_KEY = process.env.LINEAR_API_KEY;

if (!LINEAR_API_KEY) {
  console.error('❌ Error: LINEAR_API_KEY not set');
  console.error('Run: export LINEAR_API_KEY="your-api-key"');
  process.exit(1);
}

const query = `
  query {
    teams(first: 10) {
      nodes {
        id
        name
      }
    }
  }
`;

const postData = JSON.stringify({ query });

const options = {
  hostname: 'api.linear.app',
  port: 443,
  path: '/graphql',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
    'Authorization': LINEAR_API_KEY
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      if (response.errors) {
        console.error('❌ GraphQL Error:', response.errors[0].message);
        process.exit(1);
      }
      
      console.log('\n✅ Your Linear Teams:\n');
      response.data.teams.nodes.forEach(team => {
        console.log(`  Team ID: ${team.id}`);
        console.log(`  Team Name: ${team.name}\n`);
      });
      
      if (response.data.teams.nodes.length > 0) {
        const firstTeamId = response.data.teams.nodes[0].id;
        console.log(`📝 To use the first team, set:\n`);
        console.log(`  export LINEAR_TEAM_ID="${firstTeamId}"\n`);
      }
    } catch (e) {
      console.error('❌ Error parsing response:', e.message);
      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request error:', error.message);
  process.exit(1);
});

req.write(postData);
req.end();

