import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import config from "./config/config.js";
import authRouter from "./routes/auth.routes.js";
import subjectRouter from "./routes/subject.routes.js";
import questionRouter from "./routes/question.routes.js";
const app = express();

// --- CORS ---
const allowedOrigin = config.NODE_ENV === "production"
    ? config.CLIENT_URL
    : true;

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);


// --- Middlewares ---
app.use(express.json());
app.use(cookieParser())

// --- Routes ---
app.use("/api/auth", authRouter);
app.use("/api/subject", subjectRouter);
app.use("/api/question", questionRouter);

export default app;