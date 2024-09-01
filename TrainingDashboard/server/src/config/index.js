require('dotenv').config();
const dbConfig = require('./db');

module.exports = {
  dbConfig: dbConfig,
  jwtSecret: process.env.SECRET
  // other configs can be exported here
};
