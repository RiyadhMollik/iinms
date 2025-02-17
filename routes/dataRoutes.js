import express from "express";
import { getAllData ,getFilterOptions  } from "../controllers/combindController.js";

const router = express.Router();

router.get("/", getAllData);
router.get("/filters", getFilterOptions);

export default router;
