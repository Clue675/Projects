require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const WebSocket = require('ws');
const mongoose = require('mongoose'); // Ensure mongoose is required here
const { GridFsStorage } = require('multer-gridfs-storage');
const path = require('path'); // Add path module

// Database connection function
const connectDB = require("./src/config/connectDB");

// Middleware imports
const { errorHandler } = require("./src/middleware/errorMiddleware");
const { loggerMiddleware } = require("./src/middleware/loggerMiddleware");

// Routes imports
const correctiveActionRoutes = require("./src/api/routes/correctiveActionRoutes");
const inspectionRoutes = require("./src/api/routes/inspectionRoutes");
const internalCorrectiveActionRoutes = require("./src/api/routes/internalCorrectiveActionRoutes");
const internalNotificationRoutes = require("./src/api/routes/internalNotificationRoutes");
const nonconformingNotificationRoutes = require("./src/api/routes/nonconformingNotificationRoutes");
const rejectionCodeRoutes = require("./src/api/routes/rejectionCodeRoutes");
const shipmentRoutes = require("./src/api/routes/shipmentRoutes");
const supplierQualityRoutes = require("./src/api/routes/supplierQualityRoutes");
const vendorRoutes = require("./src/api/routes/vendorRoutes");
const userRoutes = require("./src/api/routes/userRoutes");
const vendorPerformanceRoutes = require("./src/api/routes/vendorPerformanceRoutes");
const discrepancyReportRoutes = require("./src/api/routes/discrepancyReportRoutes");
const taskRoutes = require("./src/api/routes/taskRoutes");
const multer = require('multer');

const cronJobs = require("./src/utils/cronJobs");

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);

// Routes setup
app.use("/api/vendorPerformance", vendorPerformanceRoutes);
app.use("/api/correctiveActions", correctiveActionRoutes);
app.use("/api/inspections", inspectionRoutes);
app.use("/api/internalCorrectiveActions", internalCorrectiveActionRoutes);
app.use("/api/internalNotifications", internalNotificationRoutes);
app.use("/api/nonconformingNotifications", nonconformingNotificationRoutes);
app.use("/api/rejectionCodes", rejectionCodeRoutes);
app.use("/api/shipments", shipmentRoutes);
app.use("/api/supplierQuality", supplierQualityRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/discrepancyReport", discrepancyReportRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

app.post("/api/logError", (req, res) => {
  console.error("Frontend Error Reported:", req.body);
  res.status(200).json({ message: "Error logged successfully" });
});

// Multer and GridFS Storage
const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    return {
      filename: `file_${Date.now()}${path.extname(file.originalname)}`,
      bucketName: 'uploads' // MongoDB collection name
    };
  }
});
const upload = multer({ storage });

// Upload route
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  res.json({ fileReference: req.file.filename }); // Return the filename as reference
});

// Create a server from the Express app
const server = http.createServer(app);

// Set up WebSocket server
const wss = new WebSocket.Server({ noServer: true });

server.on('upgrade', function upgrade(request, socket, head) {
    wss.handleUpgrade(request, socket, head, function done(ws) {
        wss.emit('connection', ws, request);
    });
});

wss.on("connection", function connection(ws) {
  ws.on("message", function incoming(message) {
    console.log("received: %s", message);
  });

  ws.send("something");
});

// Error handling middleware
app.use(errorHandler);

// Initialize and start the cron job for updating vendor performances
cronJobs.updateVendorPerformanceScores();

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
