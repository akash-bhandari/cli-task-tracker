#!/usr/bin/env node

const add = require('./commands/add');
const list = require('./commands/list');
const complete = require('./commands/complete');
const del = require('./commands/delete');

const args = process.argv.slice(2);
const command = args[0];
const rest = args.slice(1);

function printUsage() {
  console.log(`Usage: node index.js <command> [args]

Commands:
  add "<text>"     Add a new task
  list             List all tasks
  complete <id>    Mark a task as completed
  delete <id>      Delete a task`);
}

async function main() {
  switch (command) {
    case 'add':
      await add(rest);
      break;
    case 'list':
      await list(rest);
      break;
    case 'complete':
      await complete(rest);
      break;
    case 'delete':
      await del(rest);
      break;
    default:
      printUsage();
      process.exitCode = command ? 1 : 0;
  }
}

main().catch((err) => {
  console.error('Unexpected error:', err.message);
  process.exitCode = 1;
});