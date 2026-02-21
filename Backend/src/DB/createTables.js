import db from "./db.js";

async function createTables() {
  try {
    await db.execute(`CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      is_logged_in BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`);

    await db.execute(`CREATE TABLE IF NOT EXISTS notes (
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            user_id INT REFERENCES users(id) ON DELETE CASCADE
            );
        `);

    await db.execute(`CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        note_id INT REFERENCES notes(id) ON DELETE CASCADE,
        task_name TEXT NOT NULL,
        completed BOOLEAN DEFAULT false
        );
      `);

    console.log("Tables - NOTES, TASKS, USERS are ready.");
  } catch (error) {
    console.error("Error creating tables: ", error.message);
    throw error;
  }
}

export default createTables;
