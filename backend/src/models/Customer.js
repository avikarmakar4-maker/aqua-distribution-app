const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Customer = sequelize.define('Customer', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    validate: { isEmail: true },
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.TEXT,
  },
  district: {
    type: DataTypes.STRING,
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
  },
  photo_url: {
    type: DataTypes.STRING,
  },
  is_new: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  verification_status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending',
  },
  representative_id: {
    type: DataTypes.UUID,
    references: { model: 'Users', key: 'id' },
    onDelete: 'CASCADE',
  },
  created_by: {
    type: DataTypes.UUID,
    references: { model: 'Users', key: 'id' },
  },
}, {
  timestamps: true,
});

module.exports = Customer;
