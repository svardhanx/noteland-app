import ApiError from "../utils/ApiError.js";
import {
  createTask as createTaskRepository,
  updateTask as updateTaskRepository,
} from "../repositories/tasksRepository.js";
import { existsForUser } from "../repositories/notesRepository.js";

export const createTask = async ({ noteId, userId, taskName }) => {
  if (!userId) {
    throw new ApiError(
      401,
      "Unauthorized. You're not allowed to create a task.",
    );
  }

  if (!noteId) {
    throw new ApiError(400, "Note ID is required.");
  }

  if (!taskName) {
    throw new ApiError(400, "Task name is required.");
  }

  const noteExists = await existsForUser({
    noteId,
    userId,
  });

  if (!noteExists) {
    throw new ApiError(
      404,
      "Note not found or you're not authorized to add a task to it.",
    );
  }

  const task = await createTaskRepository({
    noteId,
    taskName,
  });

  if (!task) {
    throw new ApiError(500, "Unable to save the task. Please try again.");
  }

  return task;
};

export const updateTask = async ({ noteId, taskId, userId, completed }) => {
  if (!userId) {
    throw new ApiError(
      401,
      "Unauthorized. You're not allowed to update a task.",
    );
  }

  if (!noteId) {
    throw new ApiError(400, "Note ID is required.");
  }

  if (!taskId) {
    throw new ApiError(400, "Task ID is required.");
  }

  if (typeof completed !== "boolean") {
    throw new ApiError(400, "Completed must be a boolean.");
  }

  // First verify that the note belongs to this user.
  const noteExists = await existsForUser({
    noteId,
    userId,
  });

  if (!noteExists) {
    throw new ApiError(
      404,
      "Note not found or you're not authorized to update its tasks.",
    );
  }

  const task = await updateTaskRepository({
    noteId,
    taskId,
    completed,
  });

  if (!task) {
    throw new ApiError(404, "Task not found.");
  }

  return task;
};
