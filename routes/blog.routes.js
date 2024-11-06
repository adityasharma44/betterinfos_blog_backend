import express from "express";
import { blogController } from "../controllers/blogController.js";
import authorization from "../middlewares/auth.js";

const router = express.Router();

router.post("/addBlog", authorization, blogController.addBlog);
router.get("/getBlogs", blogController.getBlogs);
router.post("/getUserBlogs", authorization, blogController.getUserBlogs);
router.delete("/deleteBlog", authorization, blogController.deleteBlog)

export default router;
