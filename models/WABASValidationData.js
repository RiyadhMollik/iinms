import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import RegistedUser from './RegistedUser.js';
import User from './user.js';

const WABASValidationData = sequelize.define('WABASValidationData', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  farmerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: RegistedUser,
      key: 'id'
    }
  },
  saaoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  formData: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {
      0: { irrigation: [], other: {} },
      1: { other: {} },
      2: { other: {} },
      3: { herbicide: [], other: {} },
      4: { other: {} },
      5: { fertilizer: [], other: {} },
      6: { other: {} },
      7: { pesticide: [], other: {} },
      8: { fungicide: [], other: {} },
      9: { other: {} },
      10: { other: {} },
      11: { other: {} }
    }
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'wabas_validation_data',
  timestamps: true
});

export default WABASValidationData;
