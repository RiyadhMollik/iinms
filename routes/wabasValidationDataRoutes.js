import express from 'express';
import {
  createWABASValidationData,
  getWABASValidationData,
  updateWABASValidationData,
  getAllWABASValidationDataBySaao,
  deleteWABASValidationData,
  getUserReportData,
  getSaaosForReport
} from '../controllers/wabasValidationDataController.js';

const router = express.Router();

router.post('/', createWABASValidationData);
router.get('/:farmerId', getWABASValidationData);
router.put('/:farmerId', updateWABASValidationData);
router.get('/saao/:saaoId', getAllWABASValidationDataBySaao);
router.get('/report/user-data', getUserReportData);
router.get('/report/saaos', getSaaosForReport);
router.delete('/:farmerId', deleteWABASValidationData);

export default router;
