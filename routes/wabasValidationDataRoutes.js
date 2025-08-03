import express from 'express';
import {
  createWABASValidationData,
  getWABASValidationData,
  updateWABASValidationData,
  getAllWABASValidationDataBySaao,
  deleteWABASValidationData
} from '../controllers/wabasValidationDataController.js';

const router = express.Router();

router.post('/', createWABASValidationData);
router.get('/:farmerId', getWABASValidationData);
router.put('/:farmerId', updateWABASValidationData);
router.get('/saao/:saaoId', getAllWABASValidationDataBySaao);
router.delete('/:farmerId', deleteWABASValidationData);

export default router;
