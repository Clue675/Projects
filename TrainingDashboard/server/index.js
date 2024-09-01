const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./src/config/db');
const cron = require('node-cron');


// Importing routes
const employeeRoutes = require('./src/routes/employeeRoutes');
const trainingRoutes = require('./src/routes/trainingRoutes');
const certificationRoutes = require('./src/routes/certificationRoutes');
const userRoutes = require('./src/routes/userRoutes');
const requiredTrainingRoutes = require('./src/routes/requiredTrainingRoutes');
const departmentRoutes = require('./src/routes/departmentRoutes');
const divisionRoutes = require('./src/routes/divisionRoutes');
const trainingChartRoutes = require('./src/routes/trainingChartRoutes');



// Importing middleware
const errorHandler = require('./src/middleware/errorHandler');
const logger = require('./src/middleware/logger');


require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

//Cronjob
const cronJobMiddleware = require('./src/utils/cronJobs');
// Connect to the database
connectDB();

// Security Middleware
app.use(helmet()); // Helps secure your apps by setting various HTTP headers
app.use(cors()); // Enable CORS for all routes

// Logger Middleware
app.use(logger);

// For parsing application/json
app.use(express.json());

// Define routes
app.use('/api/employees', employeeRoutes);
app.use('/api/trainings', trainingRoutes);
app.use('/api/certifications', certificationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/required-trainings', requiredTrainingRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/divisions', divisionRoutes);
app.use('/api/training-metrics', trainingChartRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Welcome to the Training Dashboard API');
});

// Error handling middleware
app.use(errorHandler);


//Cronjob
app.use(cronJobMiddleware);


cron.schedule('0 * * * *', async () => {
  await updateEmployeesDepartments();
    // Call the function to populate employees for departments
});
// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('New WebSocket connection');
  // Handle WebSocket events
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
  // Include other event handlers as needed
});

// Server listening
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
