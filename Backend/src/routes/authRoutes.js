import { Router } from "express";
import {
  loginController,
  logoutController,
  meController,
  registerController,
} from "../controller/authController.js";
import verifyJWT from "../middleware/authMiddleware.js";

const authRouter = Router();

authRouter.post("/register", registerController);
authRouter.post("/login", loginController);
authRouter.post("/logout", verifyJWT, logoutController);
authRouter.get("/me", verifyJWT, meController);

export default authRouter;
