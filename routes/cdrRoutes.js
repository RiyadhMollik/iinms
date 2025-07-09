import express from 'express';
import { getFilteredCdr, updateCdrField } from '../controllers/cdrController.js';

const router = express.Router();

// GET /api/cdr?destination=104&status=ANSWERED&page=1&limit=10
router.get('/', getFilteredCdr);
router.patch('/:id', updateCdrField);
export default router;
