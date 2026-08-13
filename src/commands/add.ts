import { readTasks, writeTasks, addTask } from '../taskStore';

/**
 * args: everything the user typed after "add", e.g. ['Buy', 'milk']
 */
async function add(args: string[]): Promise<void> {
  const text = args.join(' ');
  const tasks = await readTasks();
  const result = addTask(tasks, text);

  if (!result.success) {
    console.error(result.error);
    console.error('Usage: node index.js add "<task text>"');
    process.exitCode = 1;
    return;
  }

  await writeTasks(result.tasks);
  console.log(`Added task ${result.task.id}: "${result.task.text}"`);
}

export default add;