import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Profile = sequelize.define('Profile', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  studentNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  degreeProgram: {
    type: DataTypes.STRING,
    allowNull: false
  },
  pictureUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  package: {
    type: DataTypes.STRING,
    allowNull: false
  },
  hasPaid: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  paymentStatus: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'not_paid'
  },
  partialAmount: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  paymentDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  isClaimed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  claimDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  claimedBy: {
    type: DataTypes.STRING,
    allowNull: true
  },
  facebookAccount: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true
    }
  }
}, {
  timestamps: true,
  underscored: true
});

export default Profile;
