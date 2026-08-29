import { Router } from "express";
import {
  getAllUserNotes,
  createNote,
  deleteNote,
  updateNote,
} from "../controller/notesController.js";
import verifyJWT from "../middleware/authMiddleware.js";

const notesRouter = Router();

notesRouter.get("/", verifyJWT, getAllUserNotes);
notesRouter.post("/", verifyJWT, createNote);
notesRouter.put("/:noteId", verifyJWT, updateNote);
notesRouter.delete("/:noteId", verifyJWT, deleteNote);

export default notesRouter;
