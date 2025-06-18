// controllers/surveyController.js
import Survey from '../models/Survey.js';
import DiseaseEntry from '../models/DiseaseEntry.js';

export const createSurvey = async (req, res) => {
  try {
    const {
      year, lat, lan, season, dateSurvey, datePlanting, ageSeedling,
      growthDuration, surveySite, fieldArea, variety, growthStage,
      temperature, rainfall, relativeHumidity, diseaseEntries
    } = req.body;

    const survey = await Survey.create({
      year, lat, lan, season, dateSurvey, datePlanting, ageSeedling,
      growthDuration, surveySite, fieldArea, variety, growthStage,
      temperature, rainfall, relativeHumidity,
    });

    if (diseaseEntries && Array.isArray(diseaseEntries)) {
      await Promise.all(
        diseaseEntries.map((entry) =>
          DiseaseEntry.create({ ...entry, surveyId: survey.id })
        )
      );
    }

    res.status(201).json({ message: 'Survey created successfully', survey });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create survey' });
  }
};

export const getAllSurveys = async (req, res) => {
  try {
    const surveys = await Survey.findAll({
      include: [{ model: DiseaseEntry, as: 'diseaseEntries' }],
    });
    res.json(surveys);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch surveys' });
  }
};
