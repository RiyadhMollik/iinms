import express from 'express';
import sequelize from '../config/db.js';

const router = express.Router();

router.get('/measures', async (req, res) => {
  try {
    const [rows] = await sequelize.query('SELECT * FROM research_measures');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching measures:', err);
    res.status(500).send('Server error');
  }
});

router.get('/stations', async (req, res) => {
  try {
    const [rows] = await sequelize.query('SELECT * FROM research_stations');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching stations:', err);
    res.status(500).send('Server error');
  }
});

export default router;