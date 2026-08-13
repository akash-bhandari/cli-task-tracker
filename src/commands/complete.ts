import { readTasks, writeTasks, completeTask } from '../taskStore';

async function complete(args: string[]): Promise<void> {
  const id = Number(args[0]);

  if (!Number.isInteger(id)) {
    console.error('Usage: node index.js complete <id>');
    process.exitCode = 1;
    return;
  }

  const tasks = await readTasks();
  const result = completeTask(tasks, id);

  if (!result.success) {
    console.error(result.error);
    process.exitCode = 1;
    return; // no-op on disk — don't rewrite the file
  }

  await writeTasks(result.tasks);
  console.log(`Completed task ${id}: "${result.task.text}"`);
}

export default complete;