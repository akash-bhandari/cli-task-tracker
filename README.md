# cli-task-tracker

A tiny command-line task tracker built with **Node core modules only**
(`fs.promises`, `path`, `process.argv`) — no npm dependencies.

## Usage

```
node src/index.js add "Buy milk"
node src/index.js list
node src/index.js complete 1
node src/index.js delete 1
```

Tasks are stored in `tasks.json` in the project root and persist between
separate runs of the script.

## Commands

Run the tool from the project root with `node src/index.js <command> [args]`.
Each command reads `tasks.json`, makes its change, and writes the updated
list back to disk before exiting.

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

## Tests

```
npm test
```