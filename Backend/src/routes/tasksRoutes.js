import { Router } from "express";
import { createTask, updateTask } from "../controller/tasksController.js";
import verifyJWT from "../middleware/authMiddleware.js";

const tasksRouter = Router();

tasksRouter.post("/:noteId/tasks", verifyJWT, createTask);
tasksRouter.patch("/:noteId/tasks/:taskId", verifyJWT, updateTask);

export default tasksRouter;
