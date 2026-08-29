import { relations } from "drizzle-orm";
import { users, notes, tasks } from "./schema.js";

export const notesRelations = relations(notes, ({ one, many }) => ({
  user: one(users, {
    fields: [notes.userId],
    references: [users.id],
  }),
  tasks: many(tasks),
}));

export const usersRelations = relations(users, ({ many }) => ({
  notes: many(notes),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  note: one(notes, {
    fields: [tasks.noteId],
    references: [notes.id],
  }),
}));
