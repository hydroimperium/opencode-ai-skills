#!/usr/bin/env node
import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const commandsDir = path.join(root, '.opencode', 'commands');
const agentsDir = path.join(root, '.opencode', 'agents');
const skillsDir = path.join(root, 'skills');
const errors = [];
const warnings = [];
const skillNames = new Set();
const commandNames = new Set();
const agentNames = new Set();

async function collectSkills() {
  if (!existsSync(skillsDir)) return;
  for (const category of await readdir(skillsDir, { withFileTypes: true })) {
    if (!category.isDirectory() || category.name.startsWith('.')) continue;
    const categoryDir = path.join(skillsDir, category.name);
    for (const skill of await readdir(categoryDir, { withFileTypes: true })) {
      if (!skill.isDirectory() || skill.name.startsWith('.')) continue;
      if (existsSync(path.join(categoryDir, skill.name, 'SKILL.md'))) {
        skillNames.add(skill.name);
      }
    }
  }
}

function frontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return null;
  return { raw: match[1], body: text.slice(match[0].length).trim() };
}

async function checkCommands() {
  if (!existsSync(commandsDir)) {
    errors.push('No .opencode/commands directory found.');
    return;
  }
  const entries = await readdir(commandsDir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.md')) continue;
    const name = entry.name.replace(/\.md$/, '');
    commandNames.add(name);
    const relative = `.opencode/commands/${entry.name}`;
    const text = await readFile(path.join(commandsDir, entry.name), 'utf8');
    const parsed = frontmatter(text);
    if (!parsed) {
      errors.push(`${relative}: missing frontmatter`);
      continue;
    }
    const desc = parsed.raw.split(/\r?\n/).find((line) => line.startsWith('description:'));
    if (!desc) warnings.push(`${relative}: no description`);
    const agent = parsed.raw.split(/\r?\n/).find((line) => line.startsWith('agent:'));
    if (!agent) {
      errors.push(`${relative}: missing agent`);
    } else {
      const agentName = agent.slice('agent:'.length).trim().replace(/^["']|["']$/g, '');
      if (!/^cmd-[a-z0-9-]+$/.test(agentName)) {
        errors.push(`${relative}: agent must use the cmd- prefix`);
      }
      if (agentName !== `cmd-${name}`) {
        errors.push(`${relative}: agent "${agentName}" must be "cmd-${name}"`);
      }
    }
    if (parsed.body !== '$ARGUMENTS') {
      errors.push(`${relative}: body must contain only $ARGUMENTS to keep instructions hidden`);
    }
  }
}

async function checkAgents() {
  if (!existsSync(agentsDir)) {
    errors.push('No .opencode/agents directory found.');
    return;
  }
  const entries = await readdir(agentsDir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.md')) continue;
    const name = entry.name.replace(/\.md$/, '');
    agentNames.add(name);
    const relative = `.opencode/agents/${entry.name}`;
    const text = await readFile(path.join(agentsDir, entry.name), 'utf8');
    const parsed = frontmatter(text);
    if (!parsed) {
      errors.push(`${relative}: missing frontmatter`);
      continue;
    }
    const mode = parsed.raw.split(/\r?\n/).find((line) => line.startsWith('mode:'));
    const isCommandAgent = name.startsWith('cmd-');

    if (isCommandAgent) {
      if (!mode || !mode.includes('primary')) {
        errors.push(`${relative}: mode must be primary`);
      }
      const hidden = parsed.raw.split(/\r?\n/).find((line) => line.startsWith('hidden:'));
      if (!hidden || !hidden.includes('true')) {
        errors.push(`${relative}: hidden must be true`);
      }
      const skillMatch = parsed.body.match(/Load the `([a-z0-9-]+)` skill/);
      if (!skillMatch) {
        errors.push(`${relative}: does not load a skill`);
      } else if (!skillNames.has(skillMatch[1])) {
        errors.push(`${relative}: references missing skill "${skillMatch[1]}"`);
      }
    } else {
      if (!mode || !mode.includes('subagent')) {
        errors.push(`${relative}: non-command agents must use mode: subagent`);
      }
      const desc = parsed.raw.split(/\r?\n/).find((line) => line.startsWith('description:'));
      if (!desc) warnings.push(`${relative}: no description`);
    }
  }
}

await collectSkills();
await checkCommands();
await checkAgents();

for (const command of commandNames) {
  if (!agentNames.has(`cmd-${command}`)) {
    errors.push(`Command /${command} has no matching agent cmd-${command}`);
  }
}
for (const agent of agentNames) {
  if (!agent.startsWith('cmd-')) continue;
  const command = agent.slice('cmd-'.length);
  if (!commandNames.has(command)) {
    errors.push(`Agent ${agent} has no matching command /${command}`);
  }
}

if (!existsSync(path.join(root, 'opencode.json'))) {
  errors.push('opencode.json is missing');
}

console.log(`\nOpenCode setup: ${commandNames.size} commands, ${agentNames.size} agents, ${skillNames.size} skills.`);
if (warnings.length) {
  console.log(`\nWarnings (${warnings.length}):`);
  for (const warning of warnings) console.log(`  - ${warning}`);
}
if (errors.length) {
  console.log(`\nErrors (${errors.length}):`);
  for (const error of errors) console.log(`  - ${error}`);
  process.exit(1);
}
console.log('\nOpenCode setup passed validation.\n');
