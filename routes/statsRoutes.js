import express from "express";
import { getTemperatureStats ,getTemperatureStatsTest } from "../controllers/temperatureController.js";
import { getSoilMoistureStats ,getSoilMoistureStatsTest} from "../controllers/soilMoistureController.js";
import { getWaterLevelStats ,getWaterLevelStatstest , getYoutubeStats } from "../controllers/waterLevelController.js";

const router = express.Router();

router.get("/temperature", getTemperatureStats);
router.get("/temperature-test", getTemperatureStatsTest );
router.get("/soil-moisture", getSoilMoistureStats);
router.get("/soil-moisture-test", getSoilMoistureStatsTest);
router.get("/water-level", getWaterLevelStats);
router.get("/water-level-test", getWaterLevelStatstest);
router.get("/youtube", getYoutubeStats);

export default router;
