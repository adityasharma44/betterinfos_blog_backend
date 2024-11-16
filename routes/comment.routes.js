import express from "express";
import { commentController } from "../controllers/commentController.js";
import authorization from "../middlewares/auth.js";

const router = express.Router();

router.post("/addComment", authorization, commentController.addComment);
router.post("/getBlogComment", commentController.getBlogComment);
router.post("/addLike", authorization, commentController.addLike);
router.post("/countLike",commentController.countLike)
router.delete("/deleteComment", authorization, commentController.deleteComment);
router.post("/getUserComments", authorization, commentController.getUserComments);

export default router;
