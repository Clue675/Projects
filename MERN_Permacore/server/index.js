require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const WebSocket = require('ws');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const Grid = require('gridfs-stream');
const { Readable } = require('stream');

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

const cronJobs = require("./src/utils/cronJobs");

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);

// Set up GridFS
let gfs;
const conn = mongoose.connection;
conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

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

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload route
app.post('/api/vendors/:id/certifications', upload.single('certificationFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const readableFileStream = new Readable();
  readableFileStream.push(req.file.buffer);
  readableFileStream.push(null);

  const writestream = gfs.createWriteStream({
    filename: req.file.originalname,
    contentType: req.file.mimetype,
  });

  readableFileStream.pipe(writestream);

  writestream.on('close', async (file) => {
    try {
      const { id } = req.params;
      const { certificateName, issuedBy, issuedDate, expirationDate, notes } = req.body;

      const newCertification = new Certification({
        vendorId: id,
        certificateName,
        issuedBy,
        issuedDate: new Date(issuedDate),
        expirationDate: new Date(expirationDate),
        notes,
        fileReference: file._id,
      });

      await newCertification.save();
      await Vendor.findByIdAndUpdate(id, { $push: { certifications: newCertification._id } }, { new: true }).populate('certifications');

      res.status(201).json({ message: 'Certification added successfully', certifications: newCertification });
    } catch (error) {
      console.error('Error adding certification:', error);
      res.status(400).json({ message: 'Error adding certification.', error: error.message });
    }
  });

  writestream.on('error', (err) => {
    console.error(err);
    res.status(500).send('Error uploading file.');
  });
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
