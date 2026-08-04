const fs = require('fs').promises;
const path = require('path');

const TASKS_FILE = path.join(__dirname, '..', 'tasks.json');

/**
 * Read tasks from disk. Accepts an optional filePath so tests can point
 * this at a separate test file instead of the real tasks.json.
 * - If the file doesn't exist yet (first run), return an empty array.
 * - If the file exists but contains invalid JSON, throw a clear error.
 */
async function readTasks(filePath = TASKS_FILE) {
  let raw;
  try {
    raw = await fs.readFile(filePath, 'utf-8');
  } catch (err) {
    if (err.code === 'ENOENT') {
      return []; // first run — no file yet, that's expected
    }
    throw err;
  }

  try {
    return JSON.parse(raw);
  } catch (err) {
    throw new Error(
      `${path.basename(filePath)} is corrupted and could not be parsed as JSON. ` +
      `Back it up and delete it, or fix it by hand. (${err.message})`
    );
  }
}

/**
 * Persist the full tasks array back to disk, pretty-printed.
 */
async function writeTasks(tasks, filePath = TASKS_FILE) {
  await fs.writeFile(filePath, JSON.stringify(tasks, null, 2), 'utf-8');
}

/**
 * Compute the next id as (max existing id) + 1, or 1 if the list is empty.
 */
function nextId(tasks) {
  if (tasks.length === 0) return 1;
  return Math.max(...tasks.map((t) => t.id)) + 1;
}

/* ---------------------------------------------------------------------
 * Pure store-logic functions.
 * These never touch disk — they take the current tasks array and return
 * a result object describing success/failure. This is what Task 14's
 * cheat sheet means by "test the store logic directly": these functions
 * are trivial to unit test, and the CLI commands layer just wires them
 * up to readTasks/writeTasks and console output.
 * ------------------------------------------------------------------- */

function addTask(tasks, text) {
  const trimmed = (text || '').trim();
  if (!trimmed) {
    return { success: false, error: 'Task text cannot be empty' };
  }

  const task = {
    id: nextId(tasks),
    text: trimmed,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  return { success: true, task, tasks: [...tasks, task] };
}

function completeTask(tasks, id) {
  const task = tasks.find((t) => t.id === id);
  if (!task) {
    return { success: false, error: `Task with id ${id} not found` };
  }

  const updatedTasks = tasks.map((t) =>
    t.id === id ? { ...t, completed: true } : t
  );

  return { success: true, task: { ...task, completed: true }, tasks: updatedTasks };
}

function deleteTask(tasks, id) {
  const exists = tasks.some((t) => t.id === id);
  if (!exists) {
    return { success: false, error: `Task with id ${id} not found` };
  }

  return { success: true, tasks: tasks.filter((t) => t.id !== id) };
}

module.exports = {
  readTasks,
  writeTasks,
  nextId,
  addTask,
  completeTask,
  deleteTask,
  TASKS_FILE,
};
