// Helper.js

const mongoose = require('mongoose');
const Employee = mongoose.model('Employee');
const TrainingSession = mongoose.model('TrainingSession');
const RequiredTraining = mongoose.model('RequiredTraining');

// Function to mark a training session as completed for an employee
async function markTrainingAsCompleted(employeeId, trainingSessionId, completionDate) {
  const employee = await Employee.findById(employeeId);
  if (!employee) throw new Error("Employee not found");

  const trainingSession = await TrainingSession.findById(trainingSessionId);
  if (!trainingSession) throw new Error("Training session not found");

  employee.completedTrainings.push({
    trainingSession: trainingSessionId,
    completionDate: new Date(completionDate),
  });

  await employee.save();
  return { success: true, message: "Training marked as completed." };
}

// Function to check training completion for an employee, considering division
async function checkTrainingCompletion(employeeId) {
  const employee = await Employee.findById(employeeId).populate('department');

  const requiredTrainings = await RequiredTraining.find({
    $or: [
      { departments: employee.department._id },
      // Assuming RequiredTraining has a division field
      { division: employee.department.division },
    ]
  });

  const completedTrainings = await TrainingSession.find({
    '_id': { $in: employee.completedTrainings.map(ct => ct.trainingSession) }
  });

  let trainingCompletionStatus = requiredTrainings.map(rt => ({
    title: rt.title,
    isCompleted: completedTrainings.some(ct => ct._id.equals(rt._id) && isTrainingWithinFrequency(ct.completionDate, rt.frequency)),
  }));

  return trainingCompletionStatus;
}

// Helper function to check if a training completion date is within the required frequency
function isTrainingWithinFrequency(completionDate, frequency) {
    const now = new Date();
    const completion = new Date(completionDate);
    switch (frequency) {
      case 'Annually':
        return now.getFullYear() - completion.getFullYear() < 1;
      case 'Semi-Annually':
        return monthDiff(completion, now) < 6;
      case 'Quarterly':
        return monthDiff(completion, now) < 3;
      case 'Monthly':
        return monthDiff(completion, now) < 1;
      case 'Weekly':
        return weekDiff(completion, now) < 1;
      case 'Daily':
        return dayDiff(completion, now) < 1;
      default:
        return false;
    }
  }
  
  // Helper function for calculating the day difference between two dates
  function dayDiff(startDate, endDate) {
    const MS_PER_DAY = 1000 * 60 * 60 * 24;
    return Math.floor((endDate - startDate) / MS_PER_DAY);
  }
  
  // Helper function for calculating the week difference between two dates
  function weekDiff(startDate, endDate) {
    return dayDiff(startDate, endDate) / 7;
  }
  
  // Helper function for calculating the month difference between two dates
  function monthDiff(startDate, endDate) {
    let months;
    months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
    months -= startDate.getMonth();
    months += endDate.getMonth();
    return months <= 0 ? 0 : months;
  }
  
  // Middleware to check if training is required
async function checkIfTrainingIsRequired(title, requiredTrainings) {
  try {
      const requiredTraining = requiredTrainings.find(training => training.title.toLowerCase() === title.toLowerCase());
      return !!requiredTraining;
  } catch (error) {
      console.error("Error checking if training is required:", error);
      throw new Error("Server error during required training check");
  }
}

module.exports = {
  checkTrainingCompletion,
  markTrainingAsCompleted,
  checkIfTrainingIsRequired,
  isTrainingWithinFrequency,
  dayDiff,
  weekDiff,
  monthDiff,
};
