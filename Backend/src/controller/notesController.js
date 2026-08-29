import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  getAllUserNotes as getAllUserNotesService,
  createNote as createNoteService,
  updateNote as updateNoteService,
  deleteNote as deleteNoteService,
} from "../services/notesService.js";

export const getAllUserNotes = async (req, res) => {
  const notes = await getAllUserNotesService(req.user.id);

  return res
    .status(200)
    .json(new ApiResponse(200, notes, "Notes fetched successfully."));
};

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
