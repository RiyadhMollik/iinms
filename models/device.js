// models/User.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import RegistedUser from "./RegistedUser.js"; // Import RegistedUser at the top

const Device = sequelize.define("Device", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  deviceId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  farmerId: {
    type: DataTypes.INTEGER,
    references: {
      model: RegistedUser, 
      key: "id",
    },
    allowNull: false,
  },
});

// Associations
Device.belongsTo(RegistedUser, { foreignKey: "farmerId" });
RegistedUser.hasMany(Device, { foreignKey: "farmerId" });

export default Device;
