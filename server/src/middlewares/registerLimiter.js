import rateLimit from "express-rate-limit";

const registerLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // max 5 registration attempts
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many registration attempts. Please try again later.",
  },
});

export default registerLimiter;