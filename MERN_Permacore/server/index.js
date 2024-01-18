// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Database connection
const connectDB = require('./src/config/connectDB');

// Middleware imports
// const authenticate = require('./src/middleware/authenticate');
// const { isSupplierQuality } = require('./src/middleware/authMiddleware');
const errorHandler = require('./src/middleware/errorMiddleware');
const loggerMiddleware = require('./src/middleware/loggerMiddleware');

// Routes imports
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
const vendorPerformanceRoutes = require('./src/api/routes/vendorPerformanceRoutes')

const cronJobs = require('./src/utils/cronJobs');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware setup
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON request bodies
app.use(loggerMiddleware); // Log every request to the console

// Routes setup
app.use('/api', vendorPerformanceRoutes);
app.use('/api/correctiveActions', correctiveActionRoutes);
app.use('/api/inspections', inspectionRoutes);
app.use('/api/internalCorrectiveActions', internalCorrectiveActionRoutes);
app.use('/api/internalNotifications', internalNotificationRoutes);
app.use('/api/nonconformingNotifications', nonconformingNotificationRoutes);
app.use('/api/rejectionCodes', rejectionCodeRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/supplierQuality', supplierQualityRoutes);
app.use('/api/vendors', vendorRoutes);

app.use('/api/users', userRoutes); // Public routes for login, registration

// Catch-all for unhandled routes
app.use((req, res, next) => {
    res.status(404).send('Route not found');
});

// Error handling middleware
app.use(errorHandler);

 // Initialize and start the cron job for updating vendor performances
 cronJobs.updateVendorPerformanceScores();

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
