#!/usr/bin/env node
/*
 Archives duplicate sub-issues under a parent Linear issue by comparing against
 titles parsed from a tasks.md file. Any child issue whose title is NOT in the
 keep list OR whose title contains known wrong patterns (e.g., ui-todo) is archived.

 Env vars:
  - LINEAR_API_KEY (required)
  - LINEAR_PARENT_IDENTIFIER (required) e.g., PRI-43
  - TASKS_FILE (required) absolute path to tasks.md
*/
import fs from 'node:fs';
import https from 'node:https';

function fail(msg) { console.error(msg); process.exit(1); }
function env(name) { const v = process.env[name]; if (!v || !String(v).trim()) fail(`Missing env: ${name}`); return String(v).trim(); }

const apiKey = env('LINEAR_API_KEY');
const parentIdentifier = env('LINEAR_PARENT_IDENTIFIER');
const tasksFile = env('TASKS_FILE');

function gql(query, variables) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ query, variables });
    const req = https.request({ method: 'POST', hostname: 'api.linear.app', path: '/graphql', headers: { 'Content-Type': 'application/json', 'Authorization': apiKey } }, res => {
      let data = ''; res.on('data', c => data += c); res.on('end', () => {
        try { const json = JSON.parse(data); if (json.errors) return reject(new Error(json.errors.map(e => e.message).join('; '))); resolve(json.data); } catch (e) { reject(e); }
      });
    });
    req.on('error', reject); req.write(body); req.end();
  });
}

function parseTasksTitles(file) {
  const raw = fs.readFileSync(file, 'utf8');
  const lines = raw.split(/\r?\n/);
  const titles = [];
  let currentCategory = '';
  for (const line of lines) {
    const mPhase = /^###\s+[^:]+:\s*(.+)$/.exec(line);
    if (mPhase) { currentCategory = mPhase[1].trim(); continue; }
    const mTask = /^-\s*\[[ xX]\]\s*T(\d{3})(.*)$/.exec(line);
    if (mTask) {
      const id = mTask[1];
      const rest = mTask[2].trim();
      const hasP = /\[P\]/.test(rest);
      const cleaned = rest.replace(/\[P\]\s*/g, '').trim();
      const description = cleaned.replace(/^:|^-\s*/, '').trim();
      const title = `T${id}: [${currentCategory}]${hasP ? ' [P]' : ''}: ${description}`;
      titles.push(title);
    }
  }
  return titles;
}

function parseIdentifier(identifier) {
  const m = /^([A-Z]+)-(\d+)$/.exec(identifier.trim());
  if (!m) fail(`Invalid identifier: ${identifier}`);
  return { teamKey: m[1], number: Number(m[2]) };
}

async function getParentIssue(teamKey, number) {
  const q = `query($teamKey:String!,$number:Float!){ issues(first:1, filter:{ number:{eq:$number}, team:{ key:{eq:$teamKey} }}){ nodes{ id identifier } } }`;
  const d = await gql(q, { teamKey, number });
  const node = d?.issues?.nodes?.[0];
  if (!node) fail('Parent issue not found');
  return node;
}

async function listChildren(parentId) {
  const q = `query($pid:String!){ issues(first:500, filter:{ parent: { id: { eq: $pid } } }) { nodes { id identifier title } } }`;
  const d = await gql(q, { pid: parentId });
  return d?.issues?.nodes || [];
}

async function archiveIssue(id) {
  const q = `mutation($id:String!){ issueArchive(id:$id){ success } }`;
  const d = await gql(q, { id });
  return d?.issueArchive?.success === true;
}

(async () => {
  const keepTitles = new Set(parseTasksTitles(tasksFile));
  const { teamKey, number } = parseIdentifier(parentIdentifier);
  const parent = await getParentIssue(teamKey, number);
  const children = await listChildren(parent.id);

  const wrongPattern = /ui-todo|ui-coverage-todo|src\/ui-todo/;
  let archived = 0, skipped = 0;
  for (const c of children) {
    const keep = keepTitles.has(c.title) && !wrongPattern.test(c.title);
    if (!keep) {
      try { const ok = await archiveIssue(c.id); if (ok) { archived++; console.log(`Archived: ${c.identifier} -> ${c.title}`); } }
      catch (e) { console.error(`Failed to archive ${c.identifier}: ${e.message}`); }
    } else {
      skipped++;
    }
  }
  console.log(`Done. Archived ${archived}, kept ${skipped}.`);
})().catch(e => { fail(String(e?.message || e)); });


