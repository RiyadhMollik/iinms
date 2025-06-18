// models/DiseaseEntry.js
import { DataTypes } from 'sequelize';
import sequelize from "../config/db.js";
import Survey from './Survey.js';

const DiseaseEntry = sequelize.define('DiseaseEntry', {
  diseaseName: DataTypes.STRING,
  diseaseSeverity: DataTypes.STRING,
  remarks: DataTypes.STRING,
  diseasesIncident: DataTypes.STRING,
  diseasesIncidentRemarks: DataTypes.STRING,
  images: {
    type: DataTypes.JSON, // array of image URLs or filenames
    allowNull: true,
  },
}, {
  tableName: 'disease_entries',
  timestamps: true,
});

Survey.hasMany(DiseaseEntry, { foreignKey: 'surveyId', as: 'diseaseEntries' });
DiseaseEntry.belongsTo(Survey, { foreignKey: 'surveyId' });

export default DiseaseEntry;
