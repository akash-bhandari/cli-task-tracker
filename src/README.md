# cli-task-tracker

A tiny command-line task tracker built with **Node core modules only**
(`fs.promises`, `path`, `process.argv`) — no npm dependencies.

## Commands

| Command | Example | Behavior |
|---|---|---|
| `add` | `node src/index.js add "Buy milk"` | Creates a new task with an auto-incremented id, appends it, saves to disk. |
| `list` | `node src/index.js list` | Prints all tasks with their id and completion status. |
| `complete` | `node src/index.js complete 3` | Marks the task with that id as completed. Errors clearly if the id doesn't exist. |
| `delete` | `node src/index.js delete 3` | Removes the task with that id. Errors clearly if the id doesn't exist. |

## Data shape

```json
{ "id": 1, "text": "Buy milk", "completed": false, "createdAt": "2026-01-15T10:00:00.000Z" }
```

Tasks are persisted to `tasks.json` in the project root, created
automatically on first run.

## Tests

```
npm test
```