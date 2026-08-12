import { Router } from "express";
import multer from "multer";

import * as questionController from "../controllers/question.controller.js"
import authMiddleware from "../middlewares/auth.middleware.js";

const questionRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
  }
})


// Routes
questionRouter.post("/", authMiddleware, upload.single("ops"), questionController.createQuestion);
questionRouter.get("/", authMiddleware, questionController.getQuestions);
questionRouter.get("/:id", authMiddleware, questionController.getQuestion);
questionRouter.patch("/:id", authMiddleware, upload.single("ops"), questionController.updateQuestion);
questionRouter.delete("/:id", authMiddleware, questionController.deleteQuestion);

export default questionRouter;