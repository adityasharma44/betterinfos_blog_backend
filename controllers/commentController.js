import { commentModel } from "../models/comment.model.js";
import Joi from "joi";
import { likeModel } from "../models/like.model.js";

export const commentController = {
  addComment: async (req, res, next) => {
    const commentSchema = Joi.object({
      userId: Joi.string().required(),
      blogId: Joi.string().required(),
      comment: Joi.string().required(),
    });

    const { error } = commentSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { userId, blogId, comment } = req.body;

    try {
      const commentData = await commentModel.create({
        userId,
        blogId,
        comment,
      });
      if (commentData) {
        return res.status(200).json({
          status: "success",
          message: "Comment added successfully",
          data: commentData,
        });
      } else {
        return res.status(500).json({
          status: "error",
          message: "Failed to add comment",
        });
      }
    } catch (error) {
      return next(error);
    }
  },

  getBlogComment: async (req, res, next) => {
    const { blogId } = req.body;

    try {
      const commentData = await commentModel.find({ blogId: blogId });
      if (commentData.length > 0) {
        return res.status(200).json({
          status: "success",
          comments: commentData,
        });
      } else {
        return res.status(404).json({
          status: "error",
          message: "No Comment Exists",
        });
      }
    } catch (error) {
      return next(error);
    }
  },

  getUserComments: async (req, res, next) => {
    const { userId } = req.body;

    try {
      const commentData = await commentModel.find({ userId: userId });
      if (commentData.length > 0) {
        return res.status(200).json({
          status: "success",
          comments: commentData,
        });
      } else {
        return res.status(404).json({
          status: "error",
          message: "No Comment Exists",
        });
      }
    } catch (error) {
      return next(error);
    }
  },

  addLike: async (req, res, next) => {
    const likeSchema = Joi.object({
      userId: Joi.string().required(),
      commentId: Joi.string().required(),
      state: Joi.boolean().optional().default(true),
    });

    const { error, value } = likeSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { userId, commentId, state } = req.body;

    try {
      const likedComment = await likeModel.findOne({ userId, commentId });
      if (likedComment) {
        const unlike = await likeModel.findOneAndDelete({
          userId: userId,
          commentId: commentId,
        });

        if (unlike) {
          return res
            .status(200)
            .json({ message: "Unliked successfully", unliked: unlike });
        }
      } else {
        const like = await likeModel.create({
          userId,
          commentId,
          state,
        });

        if (like) {
          return res
            .status(200)
            .json({ message: "liked successfully", liked: like });
        }
      }
    } catch (error) {
      return next(error);
    }
  },

  countLike: async (req, res, next) => {
    const { commentId } = req.body;

    try {
      const likes = await likeModel.find({ commentId });
      if (likes) {
        const count = likes.length;
        return res
          .status(200)
          .json({ message: "total Counts", likeCount: count, likes: likes });
      } else {
        return res.status(404).json({ message: "no likes" });
      }
    } catch (error) {
      return next(error);
    }
  },

  deleteComment: async (req, res, next) => {
    const { commentId } = req.body;

    try {
      const deletedComment = await commentModel.findOneAndDelete({
        _id: commentId,
      });
      if (deletedComment) {
        return res.status(200).json({
          message: "Comment Deleted Successfully",
          deleted: deletedComment,
        });
      } else {
        return res.status(404).json({
          message: "Comment not found",
        });
      }
    } catch (error) {
      return next(error);
    }
  },
};
