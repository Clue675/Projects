// server/src/controllers/certificationController.js

const Certification = require('../models/Certificate');
const Training = require('../models/Training');
const Employee = require('../models/Employee'); // Assuming you have an Employee model

exports.createCertification = async (req, res) => {
  try {
    const { employeeBadgeNumber, trainingTitle } = req.body;

    // Check if the training is required
    const training = await Training.findOne({ title: trainingTitle, isRequired: true });
    if (!training) {
      return res.status(400).send('Certification can only be created for required training.');
    }

    // Check if employee exists
    const employee = await Employee.findOne({ badgeNumber: employeeBadgeNumber });
    if (!employee) {
      return res.status(404).send('Employee not found.');
    }

    // Create new certification
    const newCertification = new Certification({ ...req.body });
    await newCertification.save();
    res.status(201).json(newCertification);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Add other methods as needed
