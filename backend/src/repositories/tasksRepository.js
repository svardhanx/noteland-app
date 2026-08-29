import db from "../db/db.js";
import { tasks } from "../db/schema/schema.js";
import { and, eq } from "drizzle-orm";

export const createTask = async ({ noteId, taskName }) => {
  const result = await db
    .insert(tasks)
    .values({
      noteId: Number(noteId),
      taskName,
    })
    .returning();

  return result[0];
};

export const updateTask = async ({ noteId, taskId, completed }) => {
  const result = await db
    .update(tasks)
    .set({
      completed,
    })
    .where(and(eq(tasks.id, Number(taskId)), eq(tasks.noteId, Number(noteId))))
    .returning();

  return result[0];
};
