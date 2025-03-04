import express from "express";
import { getTemperatureStats } from "../controllers/temperatureController.js";
import { getSoilMoistureStats } from "../controllers/soilMoistureController.js";
import { getWaterLevelStats } from "../controllers/waterLevelController.js";

const router = express.Router();

router.get("/temperature", getTemperatureStats);
router.get("/soil-moisture", getSoilMoistureStats);
router.get("/water-level", getWaterLevelStats);

export default router;
