import { Router } from "express";
import * as subjectController from "../controllers/subject.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const subjectRouter = Router();

// Routes
subjectRouter.post("/", authMiddleware, subjectController.createSubject);
subjectRouter.get("/", authMiddleware, subjectController.getSubjects);
subjectRouter.get("/:id", authMiddleware, subjectController.getSubject);
subjectRouter.patch("/:id", authMiddleware, subjectController.updateSubject);
subjectRouter.delete("/:id", authMiddleware, subjectController.deleteSubject);

export default subjectRouter;