// routes/emailRoutes.js
import express from "express";
import { sendAdvisoryEmail , Scraping } from "../controllers/emailController.js";

const router = express.Router();

router.post("/send-advisory-email", sendAdvisoryEmail);
router.get("/get-data", Scraping);

export default router;
