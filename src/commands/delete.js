const { readTasks, writeTasks } = require('../taskStore');

async function del(args) {
  const id = Number(args[0]);

  if (!Number.isInteger(id)) {
    console.error('Usage: node index.js delete <id>');
    process.exitCode = 1;
    return;
  }

  const tasks = await readTasks();
  const exists = tasks.some((t) => t.id === id);

  if (!exists) {
    console.error(`Task ${id} not found.`);
    process.exitCode = 1;
    return;
  }

  const remaining = tasks.filter((t) => t.id !== id);
  await writeTasks(remaining);

  console.log(`Deleted task ${id}.`);
}

module.exports = del;