import * as fs from 'fs/promises';
import * as path from 'path';
import { Task, AddResult, CompleteResult, DeleteResult } from './types';
import { isErrnoException, getErrorMessage } from './errors';

const TASKS_FILE: string = path.join(__dirname, '..', 'tasks.json');

/**
 * Read tasks from disk. Accepts an optional filePath so tests can point
 * this at a separate test file instead of the real tasks.json.
 * - If the file doesn't exist yet (first run), return an empty array.
 * - If the file exists but contains invalid JSON, throw a clear error.
 */
async function readTasks(filePath: string = TASKS_FILE): Promise<Task[]> {
  let raw: string;
  try {
    raw = await fs.readFile(filePath, 'utf-8');
  } catch (err) {
    if (isErrnoException(err) && err.code === 'ENOENT') {
      return []; // first run — no file yet, that's expected
    }
    throw err;
  }

  try {
    // Type assertion is defensible here: JSON.parse always returns `any`
    // because TypeScript cannot verify the shape of raw JSON read from
    // disk at compile time. This is the only unchecked spot in the store.
    return JSON.parse(raw) as Task[];
  } catch (err) {
    throw new Error(
      `${path.basename(filePath)} is corrupted and could not be parsed as JSON. ` +
      `Back it up and delete it, or fix it by hand. (${getErrorMessage(err)})`
    );
  }
}

/**
 * Persist the full tasks array back to disk, pretty-printed.
 */
async function writeTasks(tasks: Task[], filePath: string = TASKS_FILE): Promise<void> {
  await fs.writeFile(filePath, JSON.stringify(tasks, null, 2), 'utf-8');
}

/**
 * Compute the next id as (max existing id) + 1, or 1 if the list is empty.
 */
function nextId(tasks: Task[]): number {
  if (tasks.length === 0) return 1;
  return Math.max(...tasks.map((t) => t.id)) + 1;
}

function addTask(tasks: Task[], text: string): AddResult {
  const trimmed = (text || '').trim();
  if (!trimmed) {
    return { success: false, error: 'Task text cannot be empty' };
  }

  const task: Task = {
    id: nextId(tasks),
    text: trimmed,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  return { success: true, task, tasks: [...tasks, task] };
}

function completeTask(tasks: Task[], id: number): CompleteResult {
  const task = tasks.find((t) => t.id === id);
  if (!task) {
    return { success: false, error: `Task with id ${id} not found` };
  }

  const updatedTasks = tasks.map((t) =>
    t.id === id ? { ...t, completed: true } : t
  );

  return { success: true, task: { ...task, completed: true }, tasks: updatedTasks };
}

function deleteTask(tasks: Task[], id: number): DeleteResult {
  const exists = tasks.some((t) => t.id === id);
  if (!exists) {
    return { success: false, error: `Task with id ${id} not found` };
  }

  return { success: true, tasks: tasks.filter((t) => t.id !== id) };
}

export { readTasks, writeTasks, nextId, addTask, completeTask, deleteTask, TASKS_FILE };