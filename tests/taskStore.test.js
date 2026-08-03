const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs').promises;

const { readTasks, writeTasks, nextId, TASKS_FILE } = require('../src/taskStore');

test.beforeEach(async () => {
  await fs.rm(TASKS_FILE, { force: true });
});
test.after(async () => {
  await fs.rm(TASKS_FILE, { force: true });
});

test('nextId returns 1 for an empty list', () => {
  assert.strictEqual(nextId([]), 1);
});

test('nextId returns max id + 1', () => {
  assert.strictEqual(nextId([{ id: 1 }, { id: 5 }, { id: 3 }]), 6);
});

test('readTasks returns [] when the file does not exist (first run)', async () => {
  const tasks = await readTasks();
  assert.deepStrictEqual(tasks, []);
});

test('writeTasks then readTasks round-trips data', async () => {
  const sample = [
    { id: 1, text: 'Buy milk', completed: false, createdAt: new Date().toISOString() },
  ];
  await writeTasks(sample);
  const readBack = await readTasks();
  assert.deepStrictEqual(readBack, sample);
});

test('readTasks throws a clear error on corrupted JSON', async () => {
  await fs.writeFile(TASKS_FILE, '{ this is not valid json', 'utf-8');
  await assert.rejects(readTasks(), /corrupted/);
});