import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref:"user",
    },
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    blogImage: {
      type: String,
      required: false,
      default:null,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const blogModel = mongoose.model("blog", blogSchema);
