import User from './user.js';
import RegistedUser from './RegistedUser.js';
import WABASValidationData from './WABASValidationData.js';

// 1. User (SAAO) has many farmers
User.hasMany(RegistedUser, { foreignKey: 'saaoId', as: 'Farmers' });

// 2. RegistedUser belongs to a SAAO
RegistedUser.belongsTo(User, { foreignKey: 'saaoId', as: 'Saao' });

// 3. User belongs to a farmer (RegistedUser)
User.belongsTo(RegistedUser, { foreignKey: 'farmerId' });

// 4. RegistedUser has many Users (optional if you need reverse)
RegistedUser.hasMany(User, { foreignKey: 'farmerId' });

export { User, RegistedUser };

RegistedUser.hasMany(WABASValidationData, { foreignKey: 'farmerId' });
User.hasMany(WABASValidationData, { foreignKey: 'saaoId' });

WABASValidationData.belongsTo(RegistedUser, { foreignKey: 'farmerId' });
WABASValidationData.belongsTo(User, { foreignKey: 'saaoId' });

User.belongsTo(RegistedUser, { foreignKey: 'farmerId' });
