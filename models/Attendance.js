import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./user.js";
import Meeting from "./Meeting.js";

const Attendance = sequelize.define("Attendance", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  meetingId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Meeting,
      key: "id",
    },
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
  checkInTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  checkInLat: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: false,
  },
  checkInLng: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: false,
  },
  distance: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Distance in meters from meeting location',
  },
  status: {
    type: DataTypes.ENUM('present', 'absent', 'late'),
    defaultValue: 'present',
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

export default Attendance; 