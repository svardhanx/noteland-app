import db from "../DB/db.js";

export const getAllNotes = async (_, res) => {
  try {
    const allNotes = await db.execute(`
      SELECT
        notes.id,
        notes.title,
        notes.content,
        COALESCE(
          (SELECT json_group_array(
            json_object(
              'id', tasks.id,
              'task_name', tasks.task_name,
              'completed', tasks.completed
            )
          )
          FROM tasks
          WHERE tasks.note_id = notes.id),
          '[]'
        ) AS tasks
      FROM notes
      GROUP BY notes.id
    `);

    if (allNotes?.rows?.length === 0) {
      return res
        .status(204)
        .json({ message: "No Notes available.", success: false });
    }

    const formattedNotes = allNotes.rows.map((row) => ({
      ...row,
      tasks: typeof row.tasks === "string" ? JSON.parse(row.tasks) : row.tasks,
    }));

    return res.status(200).json({
      message: "All notes fetched successfully.",
      payload: formattedNotes,
      success: true,
    });
  } catch (error) {
    console.error("Error in createNote controller: ", error.message);
    return res.status(500).json({
      message: "Something wen't wrong at our end. Please try again.",
      success: false,
    });
  }
};

export const getAllUserNotes = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(403).json({
        message: "Unauthorized. Unable to pull your notes.",
        success: false,
      });
    }

    const result = await db.execute({
      sql: `
       SELECT n.*,
       (SELECT json_group_array(json_object('id', id, 'name', task_name))
       FROM tasks WHERE note_id = n.id) as tasks
       FROM notes n WHERE n.user_id = ?`,
      args: [userId],
    });

    if (result.rows.length === 0) {
      return res.status(200).json({ message: "No notes found." });
    }

    const notes = result.rows.map((row) => ({
      ...row,
      tasks: typeof row.tasks === "string" ? JSON.parse(row.tasks) : row.tasks,
    }));

    return res.status(200).json({
      message: "All notes fetched successfully",
      notes,
      success: true,
    });
  } catch (error) {
    console.error("Error in getAllUserNotes controller: ", error.message);
    return res.status(500).json({
      message: "Something wen't wrong at our end. Please try again.",
      success: false,
    });
  }
};

export const createNote = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(403).json({
        message: "Unauthorized. You're not allowed to create a note.",
        success: false,
      });
    }

    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(404).json({
        message: "Title and content are required to create a note.",
        success: false,
      });
    }

    const result = await db.execute({
      sql: "INSERT INTO notes (title, content, user_id) VALUES (?, ?, ?) RETURNING *",
      args: [title, content, userId],
    });

    if (result?.rows?.length === 0) {
      return res.status(404).json({
        message: "Unable to save the note in our database. Please try again.",
      });
    }

    return res.status(200).json({
      message: "A new note created successfully.",
      data: result.rows[0],
      success: true,
    });
  } catch (error) {
    console.error("Error in createNote controller: ", error.message);
    return res.status(500).json({
      message: "Something wen't wrong at our end. Please try again.",
      success: false,
      data: null,
    });
  }
};

export const createTask = async (req, res) => {
  try {
    const { task_name } = req.body;
    const { note_id } = req.params;

    const userId = req.user.id;

    if (!userId) {
      return res.status(403).json({
        message: "Unauthorized. You're not allowed to create a task.",
        success: false,
      });
    }

    if (!note_id) {
      return res.status(404).json({
        message: "Corresponding Note ID not found in the request.",
        success: false,
      });
    }

    if (!task_name) {
      return res.status(404).json({
        message: "Unable to create a task. No task found in your request.",
        success: false,
      });
    }

    const result = await db.execute({
      sql: "INSERT INTO tasks (note_id, task_name) VALUES (?, ?) RETURNING *",
      args: [note_id, task_name],
    });

    if (result?.rows?.length === 0) {
      return res.status(404).json({
        message: "Unable to save the task in our database. Please try again.",
      });
    }

    return res.status(201).json({ message: "Task successfully created.." });
  } catch (error) {
    console.error("Error in createTask controller: ", error.message);
    return res.status(500).json({
      message: "Something wen't wrong at our end. Please try again.",
      success: true,
    });
  }
};

export const updateNote = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(403).json({
        message: "Unauthorized request received. Please try again.",
        success: false,
      });
    }

    if (String(userId) !== String(req.body.user_id)) {
      return res.status(403).json({
        message: "Unauthorized. You're not allowed to update the note.",
        success: false,
      });
    }

    const noteId = req.body.id;

    if (!noteId) {
      return res.status(403).json({
        message: "Invalid request to update the note",
        success: false,
      });
    }

    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(403).json({
        message: "Invalid request to update the note",
        success: false,
      });
    }

    const result = await db.execute({
      sql: "UPDATE notes SET title = ?, content = ? WHERE id = ? RETURNING *",
      args: [title, content, noteId],
    });

    if (result.rowsAffected === 0) {
      return res.status(404).json({
        message: "Unable to update the note.",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Note successfully updated.",
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error in updateNote controller: ", error.message);
    return res.status(500).json({
      message: "Something wen't wrong at our end. Please try again.",
      data: null,
      success: false,
    });
  }
};

export const updateTask = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(403).json({
        message: "Unauthorized. You're not allowed to update the note.",
        success: false,
      });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(404).json({
        message: "Corresponding task id not found in your request.",
        success: false,
      });
    }

    const result = await db.execute({
      sql: ` UPDATE tasks SET completed = true WHERE id = ? RETURNING *`,
      args: [id],
    });

    if (result.rowsAffected === 0) {
      return res.status(404).json({
        message: "Unable to update the task at this time.",
        success: false,
      });
    }

    return res
      .status(200)
      .json({ message: "Task successfully updated.", success: true });
  } catch (error) {
    console.error("Error in updateTask controller: ", error.message);
    return res.status(500).json({
      message: "Something wen't wrong at our end. Please try again.",
      success: false,
    });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(403).json({
        message: "Unauthorized. You're not allowed to delete the note.",
        success: false,
      });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(404).json({
        message: "Note id not found in your request.",
        success: false,
      });
    }

    const result = await db.execute({
      sql: "DELETE FROM notes WHERE id = ? AND user_id = ?",
      args: [id, userId],
    });

    if (result.rowsAffected === 0) {
      return res.status(404).json({
        message: "Note not found or it not authorised to delete the note.",
        success: false,
      });
    }

    return res
      .status(200)
      .json({ message: "Note Deleted successfully.", success: true });
  } catch (error) {
    console.error("Error in deleteNote controller: ", error.message);
    return res.status(500).json({
      message: "Something wen't wrong at our end. Please try again.",
      success: false,
    });
  }
};
