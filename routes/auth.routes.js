import express from "express";
import { authController } from "../controllers/authController.js";
import uploadFile from "../middlewares/fileUploader.js";

const router = express.Router();

router.post("/signup", authController.register);
router.post("/signin", authController.login);
router.get("/activate/:token", authController.activateAccount);
router.put(
  "/update-profile/:fileCategory",
  uploadFile,
  authController.updateProfile
);
router.post("/get-user-profile",authController.getUserProfile);

export default router;
