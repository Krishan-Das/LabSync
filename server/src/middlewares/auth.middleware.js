import config from "../config/config.js";
import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next)=>{
  
  try {
    const token = req.cookies.LS_Token;
    if(!token){
      return res.status(401).json({
        message: "Unauthorized. Please login first.",
        success: false,
      })
    }

    const decoded = jwt.verify(token, config.LS_TOKEN);

    req.user = decoded;

    next()
  } catch (error) {
    console.error("Auth middleware error:", error);

    return res.status(401).json({
      message: "Invalid or expired token",
      success: false,
    });
  }
}

export default authMiddleware;