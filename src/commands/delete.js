const { readTasks, writeTasks, deleteTask } = require('../taskStore');

async function del(args) {
  const id = Number(args[0]);

  if (!Number.isInteger(id)) {
    console.error('Usage: node index.js delete <id>');
    process.exitCode = 1;
    return;
  }

  const tasks = await readTasks();
  const result = deleteTask(tasks, id);

  if (!result.success) {
    console.error(result.error);
    process.exitCode = 1;
    return; // no-op on disk — don't rewrite the file
  }

  await writeTasks(result.tasks);
  console.log(`Deleted task ${id}.`);
}

module.exports = del;
