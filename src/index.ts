#!/usr/bin/env node

import add from './commands/add';
import list from './commands/list';
import complete from './commands/complete';
import del from './commands/delete';
import { getErrorMessage } from './errors';

const args: string[] = process.argv.slice(2);
const command: string | undefined = args[0];
const rest: string[] = args.slice(1);

function printUsage(): void {
  console.log(`Usage: node index.js <command> [args]

Commands:
  add "<text>"     Add a new task
  list             List all tasks
  complete <id>    Mark a task as completed
  delete <id>      Delete a task`);
}

async function main(): Promise<void> {
  switch (command) {
    case 'add':
      await add(rest);
      break;
    case 'list':
      await list();
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
  console.error('Unexpected error:', getErrorMessage(err));
  process.exitCode = 1;
});