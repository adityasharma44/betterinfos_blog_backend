import mongoose from "mongoose";

const saveSchema = new mongoose.Schema({
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
});

export const saveModel = mongoose.model("save", saveSchema);
