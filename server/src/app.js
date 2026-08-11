import express from "express";
import cookieParser from "cookie-parser";

import authRouter from "./routes/auth.routes.js";
import subjectRouter from "./routes/subject.routes.js";
const app = express();


// --- Middlewares ---
app.use(express.json());
app.use(cookieParser())

// --- Routes ---
app.use("/api/auth", authRouter);
app.use("/api/subject", subjectRouter);

export default app;