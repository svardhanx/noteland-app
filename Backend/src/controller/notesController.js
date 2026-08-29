import db from "../db/db.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  getAllUserNotes as getAllUserNotesService,
  createNote as createNoteService,
  updateNote as updateNoteService,
  deleteNote as deleteNoteService,
} from "../services/notesService.js";

// Not using
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
      message: "Something went wrong at our end. Please try again.",
      success: false,
    });
  }
};

// DONE
export const getAllUserNotes = async (req, res) => {
  const notes = await getAllUserNotesService(req.user.id);

  return res
    .status(200)
    .json(new ApiResponse(200, notes, "Notes fetched successfully."));
};

// DONE
export const createNote = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const { title, content } = req.body;

  if (!title || !content) {
    throw new ApiError(400, "Title and content are required to create a note.");
  }

  const note = await createNoteService({ userId, title, content });

  return res
    .status(201)
    .json(new ApiResponse(201, note, "Note created successfully."));
});

// DONE
export const updateNote = asyncHandler(async (req, res) => {
  const { noteId } = req.params;

  const { title, content } = req.body;

  if (!noteId) {
    throw new ApiError(400, "Note ID is required.");
  }

  if (!title || !content) {
    throw new ApiError(400, "Title and content are required to update a note.");
  }

  const note = await updateNoteService({
    noteId,
    userId: req.user.id,
    title,
    content,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, note, "Note successfully updated."));
});

export const deleteNote = asyncHandler(async (req, res) => {
  const { noteId } = req.params;

  if (!noteId) {
    throw new ApiError(400, "Note ID is required.");
  }

  await deleteNoteService({
    noteId,
    userId: req.user.id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Note deleted successfully."));
});
