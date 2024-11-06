import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "user",
    },
    blogId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "blog",
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const commentModel = mongoose.model("comment", commentSchema);
