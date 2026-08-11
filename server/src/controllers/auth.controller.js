import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config/config.js";


// Register new user
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "All fields are required",
      success: false,
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characters",
      success: false,
    });
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {

    let user = await User.findOne({ email: normalizedEmail });

    if (user) {
      return res.status(409).json({
        message: "User already exists",
        success: false,
      });
    }

    const hashedPass = await bcrypt.hash(password, 10);

    user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPass
    })

    const LS_Token = jwt.sign({ _id: user._id, email: user.email }, config.LS_TOKEN, { expiresIn: "3d" });
    res.cookie("LS_Token", LS_Token, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: config.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });


    return res.status(201).json({
      message: "Registration successful",
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("Register error:", error);

    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
}

// Login
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "All fields are required",
      success: false,
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characters",
      success: false,
    });
  }

  const normalizedEmail = email.toLowerCase().trim();
  try {

    const user = await User.findOne({ email: normalizedEmail }).select("+password");
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
        success: false,
      });
    }

    const isPassValid = await bcrypt.compare(password, user.password);
    if (!isPassValid) {
      return res.status(401).json({
        message: "Invalid email or password",
        success: false,
      });
    }

    const LS_Token = await jwt.sign({ _id: user._id, email: user.email }, config.LS_TOKEN, { expiresIn: "3d" });

    res.cookie("LS_Token", LS_Token, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: config.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// Logout
export const logout = async (req, res) => {
  try {

    res.clearCookie("LS_Token", {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: config.NODE_ENV === "production" ? "none" : "lax",
    })

    return res.status(200).json({
      message: "Logout successful",
      success: true,
    });
    
  } catch (error) {
    console.error("Logout error:", error);

    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
}

// ME
export const getMe = async (req, res) => {
  try {

    const user = await User.findById(req.user._id).select("-password");
     if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "User fetched successfully",
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("getMe error:", error);

    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};