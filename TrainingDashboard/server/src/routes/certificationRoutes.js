// server/src/routes/certificationRoutes.js

const express = require('express');
const { createCertification } = require('../controllers/certificationController');
const router = express.Router();

router.post('/', createCertification);

// Add other routes as needed

module.exports = router;
