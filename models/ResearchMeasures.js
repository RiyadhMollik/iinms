import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const ResearchMeasures = sequelize.define("ResearchMeasures", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  station_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  station_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  network: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  owner: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  power_save: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  latest_data: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  measure: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_value: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  trend: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  delta_h: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  date_value: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  alarm: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'research_measures',
  timestamps: false,
});

export default ResearchMeasures; 