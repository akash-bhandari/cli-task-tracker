# cli-task-tracker

A tiny command-line task tracker built with **Node core modules only**
(`fs.promises`, `path`, `process.argv`) — no npm dependencies. Written in
strict TypeScript (`strict: true`, zero `any`).

## Install

```
npm install
```

## Usage

```
npx ts-node src/index.ts add "Buy milk"
npx ts-node src/index.ts list
npx ts-node src/index.ts complete 1
npx ts-node src/index.ts delete 1
```

Tasks are stored in `tasks.json` in the project root and persist between
separate runs of the script.

## Commands

Run the tool from the project root with `npx ts-node src/index.ts <command> [args]`.
Each command reads `tasks.json`, makes its change, and writes the updated
list back to disk before exiting.

| Command | Example | Behavior |
|---|---|---|
| `add` | `npx ts-node src/index.ts add "Buy milk"` | Creates a new task with an auto-incremented id, appends it, saves to disk. |
| `list` | `npx ts-node src/index.ts list` | Prints all tasks with their id and completion status. |
| `complete` | `npx ts-node src/index.ts complete 3` | Marks the task with that id as completed. Errors clearly if the id doesn't exist. |
| `delete` | `npx ts-node src/index.ts delete 3` | Removes the task with that id. Errors clearly if the id doesn't exist. |

## Data shape

```json
{ "id": 1, "text": "Buy milk", "completed": false, "createdAt": "2026-01-15T10:00:00.000Z" }
```

## Typecheck

```
npm run typecheck
```

```
> cli-task-tracker@1.0.0 typecheck
> tsc --noEmit
```

Zero errors. `strict: true` is on in `tsconfig.json`, and the codebase has
exactly one type assertion (`JSON.parse(raw) as Task[]` in `taskStore.ts`,
documented inline) — see Section 3.3 of the assignment for why that one
is unavoidable.

## Tests

```
npm test
```