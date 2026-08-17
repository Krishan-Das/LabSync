import {Router} from "express";
import * as authController from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import registerLimiter from "../middlewares/registerLimiter.js";
import multer from "multer";
const authRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, PNG and WEBP images are allowed"));
    }
  },
});


authRouter.post("/register", registerLimiter, authController.register);
authRouter.post("/login", authController.login);
authRouter.post("/logout", authController.logout);
authRouter.get("/me", authMiddleware, authController.getMe);

// Update API's
authRouter.patch("/profile", authMiddleware, authController.updateProfile);
authRouter.patch("/avatar", authMiddleware, upload.single("avatar"), authController.updateAvatar);
authRouter.patch("/password", authMiddleware, authController.changePassword);


export default authRouter;