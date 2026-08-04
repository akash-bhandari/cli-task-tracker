const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs').promises;
const path = require('path');

const {
  readTasks,
  writeTasks,
  nextId,
  addTask,
  completeTask,
  deleteTask,
} = require('../src/taskStore');

// Use a SEPARATE test file so tests never touch a real tasks.json a
// human might be using (Task 14, Step 2 cheat sheet).
const TEST_FILE = path.join(__dirname, 'tasks.test.json');

test.beforeEach(async () => {
  await fs.rm(TEST_FILE, { force: true });
});
test.after(async () => {
  await fs.rm(TEST_FILE, { force: true });
});

/* ---------------- nextId ---------------- */

test('nextId returns 1 for an empty list', () => {
  assert.strictEqual(nextId([]), 1);
});

test('nextId returns max id + 1', () => {
  assert.strictEqual(nextId([{ id: 1 }, { id: 5 }, { id: 3 }]), 6);
});

/* ---------------- add (store logic) ---------------- */

test('addTask creates a task with an incrementing id and adds it to the list', () => {
  const result = addTask([], 'Buy milk');
  assert.strictEqual(result.success, true);
  assert.strictEqual(result.task.text, 'Buy milk');
  assert.strictEqual(result.task.completed, false);
  assert.strictEqual(result.task.id, 1);
  assert.strictEqual(result.tasks.length, 1);
});

test('addTask fails clearly on empty text (error case)', () => {
  const result = addTask([], '   ');
  assert.strictEqual(result.success, false);
  assert.match(result.error, /empty/i);
});

/* ---------------- list (via read/write round-trip) ---------------- */

test('list: writeTasks then readTasks round-trips data correctly', async () => {
  const sample = [
    { id: 1, text: 'Buy milk', completed: false, createdAt: new Date().toISOString() },
    { id: 2, text: 'Walk the dog', completed: true, createdAt: new Date().toISOString() },
  ];
  await writeTasks(sample, TEST_FILE);
  const readBack = await readTasks(TEST_FILE);
  assert.deepStrictEqual(readBack, sample);
});

test('list: readTasks returns [] when the file does not exist (first run)', async () => {
  const tasks = await readTasks(TEST_FILE);
  assert.deepStrictEqual(tasks, []);
});

/* ---------------- complete ---------------- */

test('completeTask marks the matching task as completed', () => {
  const tasks = [{ id: 1, text: 'Buy milk', completed: false, createdAt: '2026-01-01' }];
  const result = completeTask(tasks, 1);
  assert.strictEqual(result.success, true);
  assert.strictEqual(result.task.completed, true);
  assert.strictEqual(result.tasks[0].completed, true);
});

test('completing a non-existent id does not throw and returns a clear failure result (error case)', () => {
  const tasks = [{ id: 1, text: 'Buy milk', completed: false }];
  const result = completeTask(tasks, 999);
  assert.strictEqual(result.success, false);
  assert.strictEqual(result.error, 'Task with id 999 not found');
});

/* ---------------- delete ---------------- */

test('deleteTask removes the matching task', () => {
  const tasks = [
    { id: 1, text: 'Buy milk', completed: false },
    { id: 2, text: 'Walk the dog', completed: false },
  ];
  const result = deleteTask(tasks, 2);
  assert.strictEqual(result.success, true);
  assert.strictEqual(result.tasks.length, 1);
  assert.strictEqual(result.tasks[0].id, 1);
});

test('deleting a non-existent id does not throw and returns a clear failure result (error case)', () => {
  const tasks = [{ id: 1, text: 'Buy milk', completed: false }];
  const result = deleteTask(tasks, 999);
  assert.strictEqual(result.success, false);
  assert.strictEqual(result.error, 'Task with id 999 not found');
});

/* ---------------- corrupted file ---------------- */

test('readTasks throws a clear error on corrupted JSON, not a raw parse error', async () => {
  await fs.writeFile(TEST_FILE, '{ this is not valid json', 'utf-8');
  await assert.rejects(readTasks(TEST_FILE), /corrupted/);
});
