import { sqliteTable, integer, text, numeric } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  email: text().notNull(),
  password: text().notNull(),
  isLoggedIn: integer("is_logged_in").default(0),
  createdAt: numeric("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: numeric("updated_at").default(sql`(CURRENT_TIMESTAMP)`),
});

export const notes = sqliteTable("notes", {
  id: integer().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
  content: text().notNull(),
  userId: integer("user_id").references(() => users.id, {
    onDelete: "cascade",
  }),
});

export const tasks = sqliteTable("tasks", {
  id: integer().primaryKey({ autoIncrement: true }),
  noteId: integer("note_id").references(() => notes.id, {
    onDelete: "cascade",
  }),
  taskName: text("task_name").notNull(),
  completed: integer({ mode: "boolean" }).default(false),
});
