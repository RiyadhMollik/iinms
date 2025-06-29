import express from 'express';
import { getLocationCounts } from '../controllers/reportController';


const router = express.Router();

// Route to get counts of farmers by location type
router.get('/area-wise-counts', getLocationCounts);

export default router;