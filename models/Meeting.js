import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./user.js";

const Meeting = sequelize.define("Meeting", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  meetingDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  locationLat: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: false,
  },
  locationLng: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: false,
  },
  locationName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
  status: {
    type: DataTypes.ENUM('scheduled', 'ongoing', 'completed', 'cancelled'),
    defaultValue: 'scheduled',
  },
});

export default Meeting; 