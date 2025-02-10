import { DataTypes } from "sequelize";
import sequelize from '../config/db.js';

// Define the WeatherParameter model
const WeatherParameter = sequelize.define("WeatherParameter", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  latitude: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  longitude: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

export default WeatherParameter;
