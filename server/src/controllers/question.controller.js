import mongoose from "mongoose";
import LabQuestion from "../models/labQuestion.model.js";
import Subject from "../models/subject.model.js";
import { uploadImage, deleteImage } from "../services/imagekit.service.js";


// Create question
export const createQuestion = async (req, res) => {
  const { question, code, subjectId, labDate } = req.body;

  if (!question || !question.trim()) {
    return res.status(400).json({
      message: "Question is required",
      success: false,
    });
  }

  if (!subjectId) {
    return res.status(400).json({
      message: "Subject ID is required",
      success: false,
    });
  }

  if (!mongoose.Types.ObjectId.isValid(subjectId)) {
    return res.status(400).json({
      message: "Invalid subject ID",
      success: false,
    });
  }

  if (!labDate) {
    return res.status(400).json({
      message: "Lab date is required",
      success: false,
    });
  }

  try {
    const subject = await Subject.findOne({
      _id: subjectId,
      userId: req.user._id,
    });

    if (!subject) {
      return res.status(404).json({
        message: "Subject not found",
        success: false,
      });
    }

    let ops = {
      url: null,
      fileId: null,
    };

    // Screenshot is optional
    let uploadedFile = null;

    if (req.file) {
      uploadedFile = await uploadImage(
        req.file,
        `screenshots/${req.user._id}`
      );

      ops = {
        url: uploadedFile.url,
        fileId: uploadedFile.fileId,
      };
    }

    let labQuestion;

    try {
      labQuestion = await LabQuestion.create({
        question: question.trim(),
        code: code?.trim() || null,
        ops,
        subjectId,
        userId: req.user._id,
        labDate,
      });
    } catch (dbError) {
      if (uploadedFile?.fileId) {
        try {
          await deleteImage(uploadedFile.fileId);
        } catch (deleteError) {
          console.error(
            "ImageKit cleanup error:",
            deleteError.message
          );
        }
      }

      throw dbError;
    }

    return res.status(201).json({
      message: "Question created successfully",
      success: true,
      question: labQuestion,
    });
  } catch (error) {
    console.error("Create question error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// Get all questions
export const getQuestions = async (req, res) => {
  try {
    const questions = await LabQuestion.find({
      userId: req.user._id,
    })
      .populate("subjectId", "name")
      .sort({ labDate: -1, createdAt: -1 });

    return res.status(200).json({
      message: "Questions fetched successfully",
      success: true,
      questions,
    });
  } catch (error) {
    console.error("Get questions error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// Get Question by id
export const getQuestion = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid question ID",
      success: false,
    });
  }

  try {
    const question = await LabQuestion.findOne({
      _id: id,
      userId: req.user._id,
    }).populate("subjectId", "name");

    if (!question) {
      return res.status(404).json({
        message: "Question not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Question fetched successfully",
      success: true,
      question,
    });
  } catch (error) {
    console.error("Get question error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// Update question
export const updateQuestion = async (req, res) => {
  const { id } = req.params;
  const { question, code, subjectId, labDate } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid question ID",
      success: false,
    });
  }

  try {
    const labQuestion = await LabQuestion.findOne({
      _id: id,
      userId: req.user._id,
    });

    if (!labQuestion) {
      return res.status(404).json({
        message: "Question not found",
        success: false,
      });
    }

    // Update question
    if (question !== undefined) {
      if (!question.trim()) {
        return res.status(400).json({
          message: "Question cannot be empty",
          success: false,
        });
      }

      labQuestion.question = question.trim();
    }

    // Update code
    if (code !== undefined) {
      labQuestion.code = code?.trim() || null;
    }

    // Update subject
    if (subjectId !== undefined) {
      if (!mongoose.Types.ObjectId.isValid(subjectId)) {
        return res.status(400).json({
          message: "Invalid subject ID",
          success: false,
        });
      }

      const subject = await Subject.findOne({
        _id: subjectId,
        userId: req.user._id,
      });

      if (!subject) {
        return res.status(404).json({
          message: "Subject not found",
          success: false,
        });
      }

      labQuestion.subjectId = subjectId;
    }

    // Update lab date
    if (labDate !== undefined) {
      if (!labDate) {
        return res.status(400).json({
          message: "Lab date cannot be empty",
          success: false,
        });
      }

      labQuestion.labDate = labDate;
    }

    // Replace screenshot
    if (req.file) {
      const uploadedFile = await uploadImage(
        req.file,
        `screenshots/${req.user._id}`
      );

      const oldFileId = labQuestion.ops?.fileId;

      labQuestion.ops = {
        url: uploadedFile.url,
        fileId: uploadedFile.fileId,
      };

      await labQuestion.save();

      if (oldFileId) {
        try {
          await deleteImage(oldFileId);
        } catch (deleteError) {
          console.error(
            "Old screenshot delete error:",
            deleteError.message
          );
        }
      }
    } else {
      await labQuestion.save();
    }

    return res.status(200).json({
      message: "Question updated successfully",
      success: true,
      question: labQuestion,
    });
  } catch (error) {
    console.error("Update question error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// Delete Question
export const deleteQuestion = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid question ID",
      success: false,
    });
  }

  try {
    const labQuestion = await LabQuestion.findOne({
      _id: id,
      userId: req.user._id,
    });

    if (!labQuestion) {
      return res.status(404).json({
        message: "Question not found",
        success: false,
      });
    }

    // Delete output screenshot from ImageKit
    const fileId = labQuestion.ops?.fileId;

    if (fileId) {
      try {
        await deleteImage(fileId);
      } catch (deleteError) {
        console.error(
          "ImageKit delete error:",
          deleteError.message
        );

        return res.status(500).json({
          message: "Failed to delete output screenshot",
          success: false,
        });
      }
    }

    // Delete question from MongoDB
    await LabQuestion.deleteOne({
      _id: id,
      userId: req.user._id,
    });

    return res.status(200).json({
      message: "Question deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Delete question error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};