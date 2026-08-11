import mongoose from "mongoose";
import Subject from "../models/subject.model.js";


// Create subject
export const createSubject = async (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({
      message: "Subject name is required",
      success: false,
    });
  }

  const cleanName = name.trim();
  const normalizedName = cleanName.toLowerCase();

  try {

    const subject = await Subject.create({
      name: cleanName, normalizedName, userId: req.user._id
    })

    return res.status(201).json({
      message: "Subject created successfully",
      success: true,
      subject,
    });
  } catch (error) {
    console.error("Subject create error:", error.message);

    if (error.code === 11000) {
      return res.status(409).json({
        message: "Subject already exists",
        success: false,
      });
    }

    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// Fetch all subjects
export const getSubjects = async (req, res) => {
  try {

    const subjects = await Subject.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Subjects fetched successfully",
      success: true,
      subjects,
    });
  } catch (error) {
    console.error("Subjects fetch error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// Fetch subject by ID
export const getSubject = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid subject ID",
      success: false,
    });
  }

  try {
    const subject = await Subject.findOne({
      _id: id,
      userId: req.user._id,
    });

    if (!subject) {
      return res.status(404).json({
        message: "Subject not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Subject fetched successfully",
      success: true,
      subject,
    });
  } catch (error) {
    console.error("Get subject error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// Update subject
export const updateSubject = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid subject ID",
      success: false,
    });
  }

  if (!name || !name.trim()) {
    return res.status(400).json({
      message: "Subject name is required",
      success: false,
    });
  }

  const cleanName = name.trim();
  const normalizedName = cleanName.toLowerCase();

  try {
    const subject = await Subject.findOne({
      _id: id,
      userId: req.user._id,
    });

    if (!subject) {
      return res.status(404).json({
        message: "Subject not found",
        success: false,
      });
    }

    subject.name = cleanName;
    subject.normalizedName = normalizedName;

    await subject.save();

    return res.status(200).json({
      message: "Subject updated successfully",
      success: true,
      subject,
    });
  } catch (error) {
    console.error("Update subject error:", error.message);

    if (error.code === 11000) {
      return res.status(409).json({
        message: "Subject already exists",
        success: false,
      });
    }

    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// Delete subject
export const deleteSubject = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid subject ID",
      success: false,
    });
  }

  try {
    const subject = await Subject.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });

    if (!subject) {
      return res.status(404).json({
        message: "Subject not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Subject deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Delete subject error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};