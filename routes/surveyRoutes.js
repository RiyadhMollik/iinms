// routes/surveyRoutes.js
import express from 'express';
import { createSurvey, getAllSurveys } from '../controllers/surveyController.js';

const router = express.Router();

router.post('/', createSurvey);
router.get('/', getAllSurveys);

export default router;
