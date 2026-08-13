import { readTasks } from '../taskStore';

async function list(): Promise<void> {
  const tasks = await readTasks();

  if (tasks.length === 0) {
    console.log('No tasks yet. Add one with: node index.js add "<task text>"');
    return;
  }

  for (const task of tasks) {
    const box = task.completed ? '[x]' : '[ ]';
    console.log(`${box} ${task.id}. ${task.text}`);
  }
}

export default list;