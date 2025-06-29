import express from 'express';
import { getLocationCounts , getBlockCounts , getSaaoUserCounts , assignSaaosToFarmers} from '../controllers/reportController.js';


const router = express.Router();

// Route to get counts of farmers by location type
router.get('/area-wise-counts', getLocationCounts);
router.get('/block-wise-counts', getBlockCounts);
router.get('/saao-user-counts', getSaaoUserCounts);
router.post('/assign-saaos-to-farmers', assignSaaosToFarmers);

export default router;