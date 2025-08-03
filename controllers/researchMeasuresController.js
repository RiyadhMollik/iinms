import ResearchMeasures from '../models/ResearchMeasures.js';
import sequelize from '../config/db.js';

// Get all research measures
export const getAllMeasures = async (req, res) => {
  try {
    const measures = await ResearchMeasures.findAll({
      order: [['date_value', 'DESC']]
    });
    res.json(measures);
  } catch (error) {
    console.error('Error fetching measures:', error);
    res.status(500).json({ error: 'Failed to fetch measures' });
  }
};

// Get measures by station
export const getMeasuresByStation = async (req, res) => {
  try {
    const { station_id } = req.params;
    const measures = await ResearchMeasures.findAll({
      where: { station_id },
      order: [['date_value', 'DESC']]
    });
    res.json(measures);
  } catch (error) {
    console.error('Error fetching measures by station:', error);
    res.status(500).json({ error: 'Failed to fetch measures' });
  }
};

// Get measures by parameter/measure type
export const getMeasuresByParameter = async (req, res) => {
  try {
    const { measure } = req.params;
    const measures = await ResearchMeasures.findAll({
      where: { measure },
      order: [['date_value', 'DESC']]
    });
    res.json(measures);
  } catch (error) {
    console.error('Error fetching measures by parameter:', error);
    res.status(500).json({ error: 'Failed to fetch measures' });
  }
};

// Get measures by station and parameter
export const getMeasuresByStationAndParameter = async (req, res) => {
  try {
    const { station_id, measure } = req.params;
    const measures = await ResearchMeasures.findAll({
      where: { 
        station_id,
        measure 
      },
      order: [['date_value', 'ASC']]
    });
    res.json(measures);
  } catch (error) {
    console.error('Error fetching measures by station and parameter:', error);
    res.status(500).json({ error: 'Failed to fetch measures' });
  }
};

// Get unique stations
export const getStations = async (req, res) => {
  try {
    const stations = await ResearchMeasures.findAll({
      attributes: [
        [sequelize.fn('DISTINCT', sequelize.col('station_id')), 'station_id'],
        'station_name'
      ],
      group: ['station_id', 'station_name']
    });
    res.json(stations);
  } catch (error) {
    console.error('Error fetching stations:', error);
    res.status(500).json({ error: 'Failed to fetch stations' });
  }
};

// Get unique parameters/measures
export const getParameters = async (req, res) => {
  try {
    const parameters = await ResearchMeasures.findAll({
      attributes: [
        [sequelize.fn('DISTINCT', sequelize.col('measure')), 'measure']
      ],
      group: ['measure']
    });
    res.json(parameters);
  } catch (error) {
    console.error('Error fetching parameters:', error);
    res.status(500).json({ error: 'Failed to fetch parameters' });
  }
};

// Add new measure
export const addMeasure = async (req, res) => {
  try {
    const {
      station_id,
      station_name,
      state,
      type,
      network,
      owner,
      power_save,
      latest_data,
      measure,
      last_value,
      trend,
      delta_h,
      unit,
      date_value,
      alarm
    } = req.body;

    const newMeasure = await ResearchMeasures.create({
      station_id,
      station_name,
      state,
      type,
      network,
      owner,
      power_save,
      latest_data,
      measure,
      last_value,
      trend,
      delta_h,
      unit,
      date_value: date_value || new Date(),
      alarm
    });

    res.status(201).json(newMeasure);
  } catch (error) {
    console.error('Error adding measure:', error);
    res.status(500).json({ error: 'Failed to add measure' });
  }
};

// Update measure
export const updateMeasure = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const measure = await ResearchMeasures.findByPk(id);
    if (!measure) {
      return res.status(404).json({ error: 'Measure not found' });
    }

    await measure.update(updateData);
    res.json(measure);
  } catch (error) {
    console.error('Error updating measure:', error);
    res.status(500).json({ error: 'Failed to update measure' });
  }
};

// Delete measure
export const deleteMeasure = async (req, res) => {
  try {
    const { id } = req.params;
    const measure = await ResearchMeasures.findByPk(id);
    
    if (!measure) {
      return res.status(404).json({ error: 'Measure not found' });
    }

    await measure.destroy();
    res.json({ message: 'Measure deleted successfully' });
  } catch (error) {
    console.error('Error deleting measure:', error);
    res.status(500).json({ error: 'Failed to delete measure' });
  }
}; 