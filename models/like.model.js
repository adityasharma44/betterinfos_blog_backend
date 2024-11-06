import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "user",
    },
    commentId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "comment",
    },
    state: {
      type: Boolean,
      required:false,
      default:true,
    },
  },
  { timestamps: true }
);

export const likeModel = mongoose.model("like", likeSchema);
