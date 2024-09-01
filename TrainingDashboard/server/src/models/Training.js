const mongoose = require("mongoose");
// Correct the model imports based on your file structure
const Employee = require("./Employee");
const Department = require("./Department"); // Ensure this is the correct path to your Department model
const Division = require("./Divisions"); // Ensure this is the correct path to your Division model
const RequiredTraining = require("./RequiredTraining"); // Ensure this is the correct path to your RequiredTraining model

const attendeeSchema = new mongoose.Schema({
  employee: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Employee', 
    required: true 
  },
  requiredTraining: { type: Boolean, default: false },
  completed: { type: Boolean, default: false }
});

const TrainingSessionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  // Use the defined attendee schema for the attendees array
  attendees: [attendeeSchema],
}, { timestamps: true });

// Method to mark training as completed and update employee records accordingly
TrainingSessionSchema.methods.markTrainingAsCompleted = async function() {
  const session = this; // The context of the current training session document

  // Fetch all the required training definitions
  const requiredTrainingsList = await RequiredTraining.find();

  // Iterate over each attendee of the session
  await Promise.all(session.attendees.map(async (attendee) => {
    const employee = await Employee.findById(attendee.employee).populate('department');

    if (!employee) {
      console.log(`Employee not found with ID: ${attendee.employee}`);
      return; // Skip this attendee if the employee is not found
    }

    // Determine if this training session is required for the employee's department
    const isRequired = requiredTrainingsList.some((rt) => {
      return rt._id.equals(session._id) && rt.departments.includes(employee.department._id);
    });

    if (isRequired) {
      // If required, update or add to the employee's requiredTrainings
      let found = false;
      for (let rt of employee.requiredTrainings) {
        if (rt.requiredTrainingSession.equals(session._id)) {
          rt.isCompleted = true;
          rt.completionDate = new Date();
          found = true;
          break;
        }
      }
      if (!found) {
        employee.requiredTrainings.push({
          requiredTrainingSession: session._id,
          title: session.title,
          isCompleted: true,
          completionDate: new Date(),
        });
      }
    } else {
      // If not required, add to the employee's completedTrainings
      employee.completedTrainings.push({
        trainingSession: session._id,
        title: session.title,
        completionDate: new Date(),
      });
    }

    await employee.save(); // Save the updates to the employee document
  }));

  console.log("Training session marked as completed for all attendees.");
};

const TrainingSession = mongoose.model('TrainingSession', TrainingSessionSchema);

module.exports = TrainingSession;