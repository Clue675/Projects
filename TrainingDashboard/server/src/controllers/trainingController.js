const { checkTrainingCompletionAndTitlesForAllEmployees } = require('../utils/helper');
const RequiredTraining = require('../models/RequiredTraining');
const Employee = require('../models/Employee');
const Department = require('../models/Department');
const TrainingSession = require("../models/Training");
const Division = require('../models/Divisions');
const { checkIfTrainingIsRequired } = require('../utils/helper'); // Importing the checkIfTrainingIsRequired function

exports.createOrUpdateTrainingSession = async (req, res) => {
  const { title, trainerName, date, attendees } = req.body;

  try {
    // Check if this training session's title matches any required training titles
    const isRequired = await checkIfTrainingIsRequired(title, await RequiredTraining.find());

    // Map attendees, populating employee data and adding requiredTraining status based on the check above
    const populatedAttendees = [];
    for (const attendeeId of attendees) {
      const attendee = await Employee.findById(attendeeId);
      if (attendee) {
        populatedAttendees.push({
          employee: attendee,
          requiredTraining: !!isRequired,
        });
      }
    }

    const sessionData = {
      title,
      trainerName,
      date,
      attendees: populatedAttendees,
      // If requiredTraining should apply to the entire session instead
      requiredTraining: !!isRequired,
    };

    // Create or update the session
    const session = new TrainingSession(sessionData);
    await session.save();

    // Update each attendee's completedTrainings if necessary
    if (!isRequired) {
      for (const attendee of populatedAttendees) {
        if (!attendee.requiredTraining) {
          attendee.employee.completedTrainings.push({
            trainingSession: session._id,
            completionDate: session.date, // Assuming completion date is the session date
          });
          await attendee.employee.save();
        }
      }
    }

    res.status(201).json(session);
  } catch (error) {
    console.error("Error creating/updating training session:", error);
    res.status(500).json({ message: "Internal server error", error: error.toString() });
  }
};


exports.getTrainingSessionByTitle = async (req, res) => {
  const trainingTitle = req.params.title; // Get the training title from request parameters

  try {
    const trainingSessions = await TrainingRecord.find({ 'training.title': trainingTitle })
      .populate('trainee')
      .populate('trainer')
      .populate('training');

    // Filter out records where training doesn't match the title (due to how populate match works)
    const filteredSessions = trainingSessions.filter(session => session.training && session.training.title === trainingTitle);

    if (filteredSessions.length === 0) {
      return res.status(404).send('Training sessions not found for the given title');
    }

    res.status(200).json(filteredSessions);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Update a training
exports.updateTraining = async (req, res) => {
  try {
    const updatedTraining = await Training.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTraining) {
      return res.status(404).send('Training not found.');
    }
    res.json(updatedTraining);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Delete a training
exports.deleteTraining = async (req, res) => {
  try {
    const deletedTraining = await Training.findByIdAndDelete(req.params.id);
    if (!deletedTraining) {
      return res.status(404).send('Training not found.');
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Get training completion statistics
// Adjust the aggregation pipeline in getTrainingCompletionStats function
exports.getTrainingCompletionStats = async (req, res) => {
  try {
    // Fetch required trainings with populated departments and employees
    const requiredTrainings = await RequiredTraining.find().populate({
      path: 'departments',
      populate: {
        path: 'employees',
        model: 'Employee'
      }
    });

    if (!requiredTrainings || requiredTrainings.length === 0) {
      // Handle case where no required trainings are found
      console.error('No required trainings found.');
      return res.status(404).send('No required trainings found.');
    }

    // Calculate department completion stats
    const departmentCompletionStats = {};

    // Iterate over each required training
    requiredTrainings.forEach(requiredTraining => {
      const trainingTitle = requiredTraining.title;

      // Iterate over departments in the required training
      requiredTraining.departments.forEach(department => {
        const departmentId = department._id;
        const departmentName = department.name;

        // Ensure department has employees before attempting to iterate
        if (department.employees && department.employees.length > 0) {
          // Count employees who have completed the required training in this department
          department.employees.forEach(employee => {
            const completedTrainings = employee.completedTrainings || []; // Handle potential undefined
            const completedEmployeesCount = completedTrainings.reduce((count, training) => {
              return count + (training.title === trainingTitle ? 1 : 0);
            }, 0);

            if (!departmentCompletionStats[departmentId]) {
              departmentCompletionStats[departmentId] = {
                departmentName,
                totalCompleted: completedEmployeesCount
              };
            } else {
              departmentCompletionStats[departmentId].totalCompleted += completedEmployeesCount;
            }
          });
        }
      });
    });

    // Prepare chart data
    const stats = Object.values(departmentCompletionStats);
    const labels = stats.map(stat => stat.departmentName);
    const data = stats.map(stat => stat.totalCompleted);

    const chartData = { labels, data };

    res.json(chartData);
  } catch (error) {
    console.error("Error fetching training completion stats:", error);
    res.status(500).json({ error: 'Failed to load training completion stats' });
  }
};
