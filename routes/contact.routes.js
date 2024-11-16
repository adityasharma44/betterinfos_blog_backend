import express from "express";
import { contactController } from "../controllers/contactController.js";

const router = express.Router();

router.post("/addQuery", contactController.addContact);

export default router;
