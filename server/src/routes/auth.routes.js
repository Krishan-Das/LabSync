import {Router} from "express";
import * as authController from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import registerLimiter from "../middlewares/registerLimiter.js";
const authRouter = Router();


authRouter.post("/register", registerLimiter, authController.register);
authRouter.post("/login", authController.login);
authRouter.post("/logout", authController.logout);
authRouter.get("/me", authMiddleware, authController.getMe);


export default authRouter;