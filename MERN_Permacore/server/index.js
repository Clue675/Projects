// index.js
require('dotenv').config();
const express = require('express');
const connectDB = require('./src/config/connectDB');
const cors = require('cors');

// Import routes
const correctiveActionRoutes = require('./src/api/routes/correctiveActionRoutes');
const inspectionRoutes = require('./src/api/routes/inspectionRoutes');
const internalCorrectiveActionRoutes = require('./src/api/routes/internalCorrectiveActionRoutes');
const internalNotificationRoutes = require('./src/api/routes/internalNotificationRoutes');
const nonconformingNotificationRoutes = require('./src/api/routes/nonconformingNotificationRoutes');
const rejectionCodeRoutes = require('./src/api/routes/rejectionCodeRoutes');
const shipmentRoutes = require('./src/api/routes/shipmentRoutes');
const supplierQualityRoutes = require('./src/api/routes/supplierQualityRoutes');
const vendorRoutes = require('./src/api/routes/vendorRoutes');
const userRoutes = require('./src/api/routes/userRoutes');

// Import the script with the cron job
require('./src/utils/cronJobs');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON request bodies

// Define routes
app.use('/api/correctiveActions', correctiveActionRoutes);
app.use('/api/inspections', inspectionRoutes);
app.use('/api/internalCorrectiveActions', internalCorrectiveActionRoutes);
app.use('/api/internalNotifications', internalNotificationRoutes);
app.use('/api/nonconformingNotifications', nonconformingNotificationRoutes);
app.use('/api/rejectionCodes', rejectionCodeRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/supplierQuality', supplierQualityRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/users', userRoutes);

// Catch-all for unhandled routes
app.use((req, res, next) => {
    res.status(404).send('Route not found');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Internal Server Error');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
