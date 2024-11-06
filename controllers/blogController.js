import CustomErrorHandler from "../service/customErrorHandler.js";
import multer from "multer";
import path from "path";
import Joi from "joi";
import fs from "fs";
import { blogModel } from "../models/blog.model.js";
import { commentModel } from "../models/comment.model.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const handleMultipartData = multer({
  storage,
  limits: { fileSize: 1000000 * 5 },
}).single("blogImage");

export const blogController = {
  addBlog: async (req, res, next) => {
    handleMultipartData(req, res, async (err) => {
      if (err) {
        return next(CustomErrorHandler.serverError(err.message));
      }

      const fileName = req.file.filename;

      const blogSchema = Joi.object({
        userId: Joi.string().required(),
        title: Joi.string().required(),
        blogImage: Joi.string().required(),
        category: Joi.string().required(),
        description: Joi.string().required(),
      });

      const { error } = blogSchema.validate({
        ...req.body,
        blogImage: fileName,
      });

      if (error) {
        fs.unlink(`${appRoot}/${req.file.destination}/${fileName}`, (error) => {
          if (error) {
            return next(CustomErrorHandler.serverError(error.message));
          }
        });
        return next(error);
      }

      const { title, category, description, userId } = req.body;

      try {
        const blog = await blogModel.create({
          userId,
          title,
          category,
          blogImage: fileName,
          description,
        });
        res.status(200).json(blog);
      } catch (error) {
        return next(error);
      }
    });
  },

  getBlogs: async (req, res, next) => {
    try {
      const blogs = await blogModel.find({});
      return res.status(200).json({ blogs: blogs });
    } catch (error) {
      return next(error);
    }
  },

  getUserBlogs: async (req, res, next) => {
    const { userId } = req.body;
    try {
      if (userId) {
        const blogs = await commentModel.find({ userId: userId });
        return res.json(blogs);
      } else {
        res.status(401).json({ message: "User not found" });
      }
    } catch (error) {
      return next(error);
    }
  },

  deleteBlog: async (req, res, next) => {
    const { blogId } = req.body;
    try {
      if (blogId) {
        const blog = await blogModel.findOneAndDelete({ _id: blogId });
        return res
          .status(200)
          .json({ message: "Blog Deleted Successfully", blog });
      } else {
        res.status(401).json({ message: "Blog not found" });
      }
    } catch (error) {
      return next(error);
    }
  },
};
