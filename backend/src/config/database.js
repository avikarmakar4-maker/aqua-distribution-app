const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/aqua_db', {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    timestamps: true,
    underscored: true,
  },
});

sequelize.authenticate()
  .then(() => console.log('✓ Database connected successfully'))
  .catch((err) => console.error('✗ Database connection error:', err));

module.exports = sequelize;
