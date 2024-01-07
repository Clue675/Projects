// config/config.js
require('dotenv').config();

module.exports = {
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGO_URI,
    // Add other configurations as needed
    // For example, if you have email settings or third-party API keys:
    // emailApiKey: process.env.EMAIL_API_KEY,
    // thirdPartyServiceKey: process.env.THIRD_PARTY_SERVICE_KEY
};
