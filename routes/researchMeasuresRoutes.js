import express from 'express';
import {
  getAllMeasures,
  getMeasuresByStation,
  getMeasuresByParameter,
  getMeasuresByStationAndParameter,
  getStations,
  getParameters,
  addMeasure,
  updateMeasure,
  deleteMeasure
} from '../controllers/researchMeasuresController.js';

const router = express.Router();

// Get all measures
router.get('/', getAllMeasures);

// Get unique stations
router.get('/stations', getStations);

// Get unique parameters
router.get('/parameters', getParameters);

// Get measures by station
router.get('/station/:station_id', getMeasuresByStation);

// Get measures by parameter
router.get('/parameter/:measure', getMeasuresByParameter);

// Get measures by station and parameter
router.get('/station/:station_id/parameter/:measure', getMeasuresByStationAndParameter);

// Add new measure
router.post('/', addMeasure);

// Update measure
router.put('/:id', updateMeasure);

// Delete measure
router.delete('/:id', deleteMeasure);

export default router; 