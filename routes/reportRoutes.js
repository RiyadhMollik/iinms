import express from 'express';
import { getLocationCounts , getBlockCounts , getSaaoUserCounts } from '../controllers/reportController.js';


const router = express.Router();

// Route to get counts of farmers by location type
router.get('/area-wise-counts', getLocationCounts);
router.get('/block-wise-counts', getBlockCounts);
router.get('/saao-user-counts', getSaaoUserCounts);

export default router;