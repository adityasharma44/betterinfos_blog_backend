import CustomErrorHandler from "../service/customErrorHandler.js";
import Joi from "joi";
import fs from "fs";
import { blogModel } from "../models/blog.model.js";
import { commentModel } from "../models/comment.model.js";
import { saveModel } from "../models/save.model.js";
import { title } from "process";

export const blogController = {
  addBlog: async (req, res, next) => {
    const imageFile = req.files?.blogImage?.[0];
    const fileName = imageFile?.filename || "";

    const blogSchema = Joi.object({
      userId: Joi.string().required(),
      title: Joi.string().required(),
      blogImage: Joi.string().optional(),
      category: Joi.string().required(),
      description: Joi.string().required(),
    });

    const { error } = blogSchema.validate({
      ...req.body,
      blogImage: fileName,
    });

    if (error) {
      if (imageFile) {
        fs.unlink(`${appRoot}/${imageFile?.path}`, (error) => {
          if (error) {
            return next(CustomErrorHandler.serverError(error.message));
          }
        });
        return next(error);
      }
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
      res.status(200).json({ message: "Blog Added Successfully", data: blog });
    } catch (error) {
      return next(error);
    }
  },

  // getBlogs: async (req, res, next) => {
  //   const page = req.query.page;
  //   const query = req.query.q;
  //   const category = req.query.category;
  //   const perPage = 9;
  //   const totalPosts = await blogModel.countDocuments();
  //   const totalPages = Math.ceil(totalPosts / perPage);
  //   if (page > totalPages) {
  //     return res.status(404).json({ message: "Page not found" });
  //   }
  //   try {
  //     if (query === "" && category === "") {
  //       const blogs = await blogModel
  //         .find({})
  //         .populate("userId", "name profileImage")
  //         .skip((page - 1) * perPage)
  //         .limit(perPage)
  //         .exec();
  //       return res.status(200).json({ blogs: blogs, totalPages });
  //     } else if (category !== "" && query === "") {
  //       const blogs = await blogModel
  //         .find({ category: category })
  //         .populate("userId", "name profileImage")
  //         .skip((page - 1) * perPage)
  //         .limit(perPage)
  //         .exec();
  //       return res.status(200).json({ blogs: blogs, totalPages });
  //     } else if (category === "" && query !== "") {
  //       const blogs = await blogModel
  //         .find({ title: { $regex: new RegExp(query, "i") } })
  //         .populate("userId", "name profileImage")
  //         .skip((page - 1) * perPage)
  //         .limit(perPage)
  //         .exec();
  //       return res.status(200).json({ blogs: blogs, totalPages });
  //     } else {
  //       const blogs = await blogModel
  //         .find({
  //           title: { $regex: new RegExp(query, "i") },
  //           category: category,
  //         })
  //         .populate("userId", "name profileImage")
  //         .skip((page - 1) * perPage)
  //         .limit(perPage)
  //         .exec();
  //       return res.status(200).json({ blogs: blogs, totalPages });
  //     }
  //   } catch (error) {
  //     return next(error);
  //   }
  // },

  getBlogs: async (req, res, next) => {
    const { page = 1, q = "", category = "" } = req.query; 
    const perPage = 9;
  
    try {
      const query = {};
      if (q) query.title = { $regex: new RegExp(q, "i") };
      if (category) query.category = category;
  
      const totalPosts = await blogModel.countDocuments(query);
      const totalPages = Math.ceil(totalPosts / perPage);
  
      if (page > totalPages) {
        return res.status(404).json({ message: "Page not found" });
      }
  
      const blogs = await blogModel
        .find(query)
        .populate("userId", "name profileImage")
        .skip((page - 1) * perPage)
        .limit(perPage)
        .exec();
  
      return res.status(200).json({ blogs, totalPages });
    } catch (error) {
      return next(error);
    }
  },
  

  getUserBlogs: async (req, res, next) => {
    const { userId } = req.body;
    try {
      if (userId) {
        const blogs = await blogModel.find({ userId: userId });
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
    console.log(req.body);
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

  updateBlog: async (req, res, next) => {
    const { blogId, title, category, description } = req.body;
    const imageFile = req.files?.blogImage?.[0];
    const fileName = imageFile?.filename;

    console.log(blogId);

    try {
      if (blogId) {
        const blog = await blogModel.findOneAndUpdate(
          { _id: blogId },
          {
            title,
            category,
            description,
            blogImage: fileName,
          },
          { new: true }
        );
        return res
          .status(200)
          .json({ message: "Blog Updated Successfully", blog });
      } else {
        res.status(401).json({ message: "Blog not found" });
      }
    } catch (error) {
      return next(error);
    }
  },

  saveBlog: async (req, res, next) => {
    const { userId, blogId } = req.body;
    try {
      const blog = await saveModel.findOne({ blogId, userId });
      if (blog) {
        await saveModel.findOneAndDelete({ blogId, userId });
        return res.status(200).json({ message: "unsaved" });
      } else {
        const save = await saveModel.create({
          userId,
          blogId,
        });

        return res.status(200).json({ message: "saved", save });
      }
    } catch (error) {
      return next(error);
    }
  },
};
