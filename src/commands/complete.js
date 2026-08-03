const { readTasks, writeTasks } = require('../taskStore');

async function complete(args) {
  const id = Number(args[0]);

  if (!Number.isInteger(id)) {
    console.error('Usage: node index.js complete <id>');
    process.exitCode = 1;
    return;
  }

  const tasks = await readTasks();
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    console.error(`Task ${id} not found.`);
    process.exitCode = 1;
    return;
  }

  task.completed = true;
  await writeTasks(tasks);

  console.log(`Completed task ${id}: "${task.text}"`);
}

module.exports = complete;