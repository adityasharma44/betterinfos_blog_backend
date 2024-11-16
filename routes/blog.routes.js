import express from "express";
import { blogController } from "../controllers/blogController.js";
import authorization from "../middlewares/auth.js";
import uploadFile from "../middlewares/fileUploader.js"

const router = express.Router();

router.post("/addBlog/:fileCategory",uploadFile, authorization, blogController.addBlog);
router.get("/getBlogs", blogController.getBlogs);
router.post("/getUserBlogs", authorization, blogController.getUserBlogs);
router.delete("/deleteBlog", authorization, blogController.deleteBlog)
router.post("/saveBlog", authorization, blogController.saveBlog)
router.put("/updateBlog/:fileCategory",uploadFile ,authorization, blogController.updateBlog)

export default router;
