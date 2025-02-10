import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const CSA = sequelize.define("CSA", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  district: {
    type: DataTypes.JSON, // Store districts as an array
    allowNull: false,
  },
});

export default CSA;
