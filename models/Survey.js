// models/Survey.js
import { DataTypes } from 'sequelize';
import sequelize from "../config/db.js";

const Survey = sequelize.define('Survey', {
  year: DataTypes.STRING,
  lat: DataTypes.STRING,
  lan: DataTypes.STRING,
  season: DataTypes.STRING,
  dateSurvey: DataTypes.DATEONLY,
  datePlanting: DataTypes.DATEONLY,
  ageSeedling: DataTypes.STRING,
  growthDuration: DataTypes.STRING,
  surveySite: DataTypes.STRING,
  fieldArea: DataTypes.STRING,
  variety: DataTypes.STRING,
  growthStage: DataTypes.STRING,
  temperature: DataTypes.STRING,
  rainfall: DataTypes.STRING,
  relativeHumidity: DataTypes.STRING,
}, {
  tableName: 'surveys',
  timestamps: true,
});

export default Survey;
