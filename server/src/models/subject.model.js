import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    normalizedName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

subjectSchema.index(
  { userId: 1, normalizedName: 1 },
  { unique: true }
);

const Subject = mongoose.model("Subject", subjectSchema);

export default Subject;