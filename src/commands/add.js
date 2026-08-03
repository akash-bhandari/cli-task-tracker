const { readTasks, writeTasks, nextId } = require('../taskStore');

/**
 * args: everything the user typed after "add", e.g. ['Buy', 'milk']
 * (index.js is responsible for slicing process.argv down to this)
 */
async function add(args) {
  const text = args.join(' ').trim();

  if (!text) {
    console.error('Usage: node index.js add "<task text>"');
    process.exitCode = 1;
    return;
  }

  const tasks = await readTasks();

  const task = {
    id: nextId(tasks),
    text,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  tasks.push(task);
  await writeTasks(tasks);

  console.log(`Added task ${task.id}: "${task.text}"`);
}

module.exports = add;