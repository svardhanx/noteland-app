import {
  getAllByUserId as getAllByUserIdRepository,
  createNote as createNoteRepository,
  updateNote as updateNoteRepository,
  deleteNote as deleteNoteRepository,
} from "../repositories/notesRepository.js";
import ApiError from "../utils/ApiError.js";

export const getAllUserNotes = async (userId) => {
  if (!userId) {
    throw new ApiError(
      401,
      "Unauthorized. You're not allowed to view your notes.",
    );
  }
  return getAllByUserIdRepository(userId);
};

export const createNote = async ({ userId, title, content }) => {
  if (!userId) {
    throw new ApiError(
      401,
      "Unauthorized. You're not allowed to create a note.",
    );
  }

  const note = await createNoteRepository({
    title,
    content,
    userId,
  });

  if (!note) {
    throw new ApiError(
      500,
      "Unable to save the note in our database. Please try again.",
    );
  }

  return note;
};

export const updateNote = async ({ noteId, userId, title, content }) => {
  if (!userId) {
    throw new ApiError(
      401,
      "Unauthorized. You're not allowed to update a note.",
    );
  }

  if (!noteId) {
    throw new ApiError(400, "Note ID is required.");
  }

  const note = await updateNoteRepository({
    noteId,
    userId,
    title,
    content,
  });

  if (!note) {
    throw new ApiError(
      404,
      "Note not found or you're not authorized to update it.",
    );
  }

  return note;
};

export const deleteNote = async ({ noteId, userId }) => {
  if (!userId) {
    throw new ApiError(
      401,
      "Unauthorized. You're not allowed to delete a note.",
    );
  }

  if (!noteId) {
    throw new ApiError(400, "Note ID is required.");
  }

  const deletedNote = await deleteNoteRepository({
    noteId,
    userId,
  });

  if (!deletedNote) {
    throw new ApiError(
      404,
      "Note not found or you're not authorized to delete it.",
    );
  }

  return deletedNote;
};
