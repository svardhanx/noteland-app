import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import {
  createTask as createTaskService,
  updateTask as updateTaskService,
} from "../services/tasksService.js";

export const createTask = asyncHandler(async (req, res) => {
  const { noteId } = req.params;
  const { taskName } = req.body;

  if (!noteId) {
    throw new ApiError(400, "Note ID is required.");
  }

  if (!taskName) {
    throw new ApiError(400, "Task name is required.");
  }

  const task = await createTaskService({
    noteId,
    userId: req.user.id,
    taskName: taskName,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, task, "Task successfully created."));
});

export const updateTask = asyncHandler(async (req, res) => {
  const { noteId, taskId } = req.params;
  const { completed } = req.body;

  if (!noteId) {
    throw new ApiError(400, "Note ID is required.");
  }

  if (!taskId) {
    throw new ApiError(400, "Task ID is required.");
  }

  if (typeof completed !== "boolean") {
    throw new ApiError(400, "Completed must be a boolean.");
  }

  const task = await updateTaskService({
    noteId,
    taskId,
    userId: req.user.id,
    completed,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task successfully updated."));
});
