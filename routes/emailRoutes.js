// routes/emailRoutes.js
import express from "express";
import { sendAdvisoryEmail } from "../controllers/emailController.js";

const router = express.Router();

router.post("/send-advisory-email", sendAdvisoryEmail);

export default router;
