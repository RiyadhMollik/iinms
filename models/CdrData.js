import { DataTypes } from 'sequelize';
import sequelize from "../config/db.js";

const CdrData = sequelize.define('cdr_data', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  date: DataTypes.DATE,
  source: DataTypes.STRING,
  ring_group: DataTypes.STRING,
  destination: DataTypes.STRING,
  src_channel: DataTypes.STRING,
  account_code: DataTypes.STRING,
  dst_channel: DataTypes.STRING,
  status: DataTypes.STRING,
  duration: DataTypes.STRING,
  uniqueid: DataTypes.STRING,
  user_field: DataTypes.STRING,
  name: DataTypes.STRING,
  address: DataTypes.STRING,
}, {
  tableName: 'cdr_data',
  timestamps: false,
});

export default CdrData;
