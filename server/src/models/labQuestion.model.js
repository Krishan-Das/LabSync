import mongoose from "mongoose";

const labQuestionSchema = new mongoose.Schema(
  {
    experimentNo: {
      type: Number,
      default: null,
      validate: {
        validator: function (v) {
          return v === null || v >= 1;
        },
        message: "Experiment number must be at least 1."
      }
    },

    question: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    code: {
      type: String,
      trim: true,
      default: null,
    },

    ops: {
      url: {
        type: String,
        trim: true,
        default: null,
      },

      fileId: {
        type: String,
        trim: true,
        default: null,
      },
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: null,
    },

    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    labDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const LabQuestion = mongoose.model("LabQuestion", labQuestionSchema);

export default LabQuestion;