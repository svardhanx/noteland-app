import express from "express";
import dotenv from "dotenv";
import cors from "cors";
// import createTables from "../backup/createTables.js";
import notesRouter from "./routes/notesRoutes.js";
import authRouter from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import healthCheckRoute from "./routes/healthCheckRoute.js";
import tasksRouter from "./routes/tasksRoutes.js";

dotenv.config();

// const red = (msg) => `\x1b[31m${msg}\x1b[0m`;

const PORT = process.env.PORT;

const app = express();

app.use(
  cors({
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    origin: [process.env.FRONTEND_URL, process.env.LOCALHOST],
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", healthCheckRoute);
app.use("/api/auth", authRouter);
app.use("/api/notes", notesRouter);
app.use("/api/notes", tasksRouter);

app.use((err, _req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: message,
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
    }),
  });
});

app.listen(PORT, () =>
  console.info(`Server started. Listening on PORT: ${PORT}`),
);

export default app;
