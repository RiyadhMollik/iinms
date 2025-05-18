// models/User.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import RegistedUser from "./RegistedUser.js"; // Import RegistedUser at the top

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mobileNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  farmerId: {
    type: DataTypes.INTEGER,
    references: {
      model: RegistedUser, 
      key: "id",
    },
    allowNull: false,
  },
  roleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

// Associations
User.belongsTo(RegistedUser, { foreignKey: "farmerId" });
RegistedUser.hasMany(User, { foreignKey: "farmerId" });

export default User;
