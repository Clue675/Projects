const mongoose = require('mongoose');
const Department = require('../models/Department'); // Adjust the path as necessary
const Employee = require('../models/Employee'); // Adjust the path as necessary
const TrainingSession = require('../models/Training'); // Adjust the path as necessary

const calculateCompletionRate = async (departmentId) => {
  const employees = await Employee.find({ department: departmentId });
  const employeeIds = employees.map(e => e._id.toString());
  const trainingSessions = await TrainingSession.find({});
  let totalAttendees = 0;
  let totalCompleted = 0;

  trainingSessions.forEach(session => {
    session.attendees.forEach(attendee => {
      if (employeeIds.includes(attendee.employee.toString())) {
        totalAttendees++;
        if (attendee.completed) {
          totalCompleted++;
        }
      }
    });
  });

  if (totalAttendees === 0) return 0; // Avoid division by zero
  const completionRate = (totalCompleted / totalAttendees) * 100;
  return completionRate.toFixed(2); // Returns the rate as a string with two decimals
};

const getTrainingCompletionRateByDepartment = async (req, res) => {
  try {
    const departments = await Department.find();

    if (!departments || departments.length === 0) {
      return res.status(404).json({ message: 'No departments found' });
    }

    const results = await Promise.all(departments.map(async (department) => {
      if (department && department.name) {
        const rate = await calculateCompletionRate(department._id);
        return { label: department.name, rate: rate };
      } else {
        console.log('Invalid department data encountered', department);
        return null;
      }
    }));

    const filteredResults = results.filter(result => result !== null);

    if (filteredResults.length === 0) {
      return res.status(404).json({ message: 'No completion rate data available' });
    }

    res.json({ completionRates: filteredResults });
  } catch (error) {
    console.error('Error fetching training completion rates by department:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { getTrainingCompletionRateByDepartment };
