import db from "../db/db.js";
import { notes } from "../db/schema/schema.js";
import { and, eq } from "drizzle-orm";

export const existsForUser = async ({ noteId, userId }) => {
  const result = await db
    .select({ id: notes.id })
    .from(notes)
    .where(and(eq(notes.id, Number(noteId)), eq(notes.userId, Number(userId))))
    .limit(1);

  return result.length > 0;
};

export const getAllByUserId = async (userId) => {
  return db.query.notes.findMany({
    where: (notes, { eq }) => eq(notes.userId, userId),
    with: { tasks: true },
  });
};

export const createNote = async ({ title, content, userId }) => {
  const result = await db
    .insert(notes)
    .values({
      title,
      content,
      userId,
    })
    .returning();

  return result[0];
};

export const updateNote = async ({ noteId, userId, title, content }) => {
  const result = await db
    .update(notes)
    .set({ title, content })
    .where(and(eq(notes.id, Number(noteId)), eq(notes.userId, Number(userId))))
    .returning();

  return result[0];
};

export const deleteNote = async ({ noteId, userId }) => {
  const result = await db
    .delete(notes)
    .where(and(eq(notes.id, Number(noteId)), eq(notes.userId, Number(userId))))
    .returning();

  return result[0];
};
