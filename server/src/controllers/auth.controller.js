import User from "../models/user.model.js";
import Subject from "../models/subject.model.js";
import LabQuestion from "../models/labQuestion.model.js"

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { uploadImage, deleteImage } from "../services/imagekit.service.js";

// ----- util functions -----
const getUserWithStats = async (userId) => {
  const user = await User.findById(userId).select("-password");

  if (!user) return null;

  const [totalSubjects, totalLabPrograms, totalScreenshots] =
    await Promise.all([
      Subject.countDocuments({
        userId: user._id,
      }),

      LabQuestion.countDocuments({
        userId: user._id,
      }),

      LabQuestion.countDocuments({
        userId: user._id,
        "ops.url": {
          $exists: true,
          $nin: [null, ""],
        },
      }),
    ]);

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,

    stats: {
      totalSubjects,
      totalLabPrograms,
      totalScreenshots,
    },
  };
};


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

    user = await getUserWithStats(user._id);
    return res.status(201).json({
      message: "Registration successful",
      success: true,
      user
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

    let user = await User.findOne({ email: normalizedEmail }).select("+password");
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

    user = await getUserWithStats(user._id);
    return res.status(200).json({
      message: "Login successful",
      success: true,
      user
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


// Me
export const getMe = async (req, res) => {
  try {
    const user = await getUserWithStats(req.user._id);

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get me error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// Update profile (name update)
export const updateProfile = async (req, res) => {
  const { name } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({
      message: "Name is required",
      success: false,
    });
  }

  try {
    let user = await User.findByIdAndUpdate(
      req.user._id,
      {
        name: name.trim(),
      },
      {
        returnDocument: "after",
        runValidators: true,
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    user = await getUserWithStats(user._id)
    return res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      user
    });
  } catch (error) {
    console.error("Update profile error:", error);

    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// Update avatar( profile picture )
export const updateAvatar = async (req, res) => {

  if (!req.file) {
    return res.status(400).json({
      message: "Avatar is required",
      success: false,
    });
  }

  try {
    let user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    const oldFileId = user.avatar?.fileId;

    const uploadedFile = await uploadImage(
      req.file,
      `avatars/${req.user._id}`
    );

    try {
      user.avatar = {
        url: uploadedFile.url,
        fileId: uploadedFile.fileId,
      };

      await user.save();
    } catch (dbError) {
      // MongoDB save failed → delete newly uploaded avatar
      try {
        await deleteImage(uploadedFile.fileId);
      } catch (deleteError) {
        console.error(
          "New avatar cleanup error:",
          deleteError.message
        );
      }

      throw dbError;
    }

    // Delete old avatar after DB update succeeds
    if (oldFileId) {
      try {
        await deleteImage(oldFileId);
      } catch (error) {
        console.error(
          "Old avatar delete error:",
          error.message
        );
      }
    }
    
    user = await getUserWithStats(user._id);
    return res.status(200).json({
      message: "Avatar updated successfully",
      success: true,
      user
    });
  } catch (error) {
    console.error("Update avatar error:", error);

    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// Change Password
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      message: "Current password and new password are required",
      success: false,
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      message: "New password must be at least 6 characters",
      success: false,
    });
  }

  if (currentPassword === newPassword) {
    return res.status(400).json({
      message: "New password must be different from current password",
      success: false,
    });
  }

  try {
    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        message: "Current password is incorrect",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    return res.status(200).json({
      message: "Password changed successfully",
      success: true,
    });
  } catch (error) {
    console.error("Change password error:", error);

    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};