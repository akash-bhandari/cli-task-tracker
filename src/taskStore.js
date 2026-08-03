const fs = require('fs').promises;
const path = require('path');

const TASKS_FILE = path.join(__dirname, '..', 'tasks.json');

/**
 * Read all tasks from disk.
 * - If the file doesn't exist yet (first run), return an empty array.
 * - If the file exists but contains invalid JSON, throw a clear error
 *   instead of silently losing/overwriting the user's data.
 */
async function readTasks() {
  let raw;
  try {
    raw = await fs.readFile(TASKS_FILE, 'utf-8');
  } catch (err) {
    if (err.code === 'ENOENT') {
      return []; // first run — no file yet, that's expected
    }
    throw err; // some other read error (permissions, etc.) — don't swallow it
  }

  try {
    return JSON.parse(raw);
  } catch (err) {
    throw new Error(
      `tasks.json is corrupted and could not be parsed as JSON. ` +
      `Back it up and delete it, or fix it by hand. (${err.message})`
    );
  }
}

/**
 * Persist the full tasks array back to disk, pretty-printed.
 */
async function writeTasks(tasks) {
  await fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2), 'utf-8');
}

/**
 * Compute the next id as (max existing id) + 1, or 1 if the list is empty.
 */
function nextId(tasks) {
  if (tasks.length === 0) return 1;
  return Math.max(...tasks.map((t) => t.id)) + 1;
}

module.exports = { readTasks, writeTasks, nextId, TASKS_FILE };