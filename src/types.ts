// src/types.ts
export interface Task {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string; // ISO date string, as stored in JSON
}

export type AddResult =
  | { success: true; task: Task; tasks: Task[] }
  | { success: false; error: string };

export type CompleteResult =
  | { success: true; task: Task; tasks: Task[] }
  | { success: false; error: string };

export type DeleteResult =
  | { success: true; tasks: Task[] }
  | { success: false; error: string };