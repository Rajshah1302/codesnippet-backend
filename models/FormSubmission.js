// models/FormSubmission.js

require('dotenv').config(); // Load environment variables from .env file
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql'
});

const FormSubmission = sequelize.define('FormSubmission', {
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  language: {
    type: DataTypes.STRING,
    allowNull: false
  },
  stdin: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  sourceCode: {
    type: DataTypes.TEXT,
    allowNull: false
  }
});

// Synchronize the model with the database (create the table if it doesn't exist)
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
    await FormSubmission.sync({ force: false }); // If you set force to true, it will drop the table if it already exists and re-create it
    console.log('FormSubmission model synced with database.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

module.exports = FormSubmission;
