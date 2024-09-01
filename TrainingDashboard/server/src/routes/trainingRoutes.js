// server/src/routes/trainingRoutes.js
const express = require("express");
const Employee = require("../models/Employee");
const Department = require("../models/Department");
const Division = require("../models/Divisions");
const mongoose = require("mongoose");
const TrainingSession = require("../models/Training");
const RequiredTraining = require("../models/RequiredTraining");
const trainingController = require("../controllers/trainingController");
const router = express.Router(); // Define your router

// Enhanced route to get all trainings
router.get("/records", async (req, res) => {
  try {
    const { populateAttendees } = req.query;
    let query = TrainingSession.find({}).lean(); // Use lean() for better performance if you're only reading documents

    // Dynamically populate attendee details if requested
    if (populateAttendees === "true") {
      query = query.populate({
        path: "attendees.employee",
        select: "firstName lastName badgeNumber department",
        populate: { // Nested population for department and division
          path: "department",
          model: "Department",
          select: "name description division",
          populate: {
            path: "division",
            model: "Division",
            select: "name description"
          }
        }
      });
    }

    const trainings = await query.exec();

    if (trainings.length === 0) {
      return res.status(404).json({ message: "No training sessions found" });
    }

    // Transform data to include detailed information
    const responseData = trainings.map(training => {
      // Map through attendees to extract and transform necessary details
      const attendeesDetails = training.attendees.map(attendee => ({
        fullName: `${attendee.employee.firstName} ${attendee.employee.lastName}`,
        badgeNumber: attendee.employee.badgeNumber,
        department: attendee.employee.department ? attendee.employee.department.name : "N/A",
        division: attendee.employee.department && attendee.employee.department.division
          ? attendee.employee.department.division.name : "N/A"
      }));

      return {
        ...training,
        attendees: attendeesDetails,
        attendeeCount: attendeesDetails.length
      };
    });

    res.json({
      message: "Training sessions fetched successfully",
      data: responseData
    });
  } catch (error) {
    console.error("Error fetching training sessions:", error);
    res.status(500).json({
      message: "Failed to fetch training sessions",
      error: error.toString()
    });
  }
});



// Route to update a specific training by ID
router.put("/:id", trainingController.updateTraining);

// Route to delete a specific training by ID
router.delete("/:id", trainingController.deleteTraining);

// Route to get training completion statistics
router.get("/completion-stats", trainingController.getTrainingCompletionStats);

// Route to create a training session
router.post('/session', async (req, res) => {
  const { title, description, date, attendees } = req.body;

  try {
    // Create a new training session without attendees initially
    const trainingSession = new TrainingSession({
      title,
      description,
      date,
      attendees: []
    });

    // Fetch matching required trainings to check if the session is required for any department
    const requiredTrainings = await RequiredTraining.find({ title });

    // Attempt to find each attendee, validate, and determine if the training is required for them
    for (const attendee of attendees) {
      const employee = await Employee.findOne({ badgeNumber: attendee.badgeNumber.trim() }).populate('department');

      if (!employee) {
        console.error(`Employee not found with badge number: ${attendee.badgeNumber}`);
        continue; // Skip to the next attendee if not found
      }

      const isRequiredTraining = requiredTrainings.some(rt => rt.departments.includes(employee.department._id.toString()));

      // Add the attendee to the training session with the required training status
      trainingSession.attendees.push({
        employee: employee._id,
        requiredTraining: isRequiredTraining,
        completed: true
      });

      // Update the employee's training records accordingly
      // This could be a separate function to handle logic complexity
      await updateEmployeeTrainingRecords(employee, trainingSession._id, title, date, isRequiredTraining);
    }

    // Save the training session after processing all attendees
    await trainingSession.save();

    // Populate attendees' employee details if needed for the response
    await trainingSession.populate('attendees.employee');

    res.status(201).json({
      message: 'Training session created successfully',
      data: trainingSession
    });
  } catch (error) {
    console.error('Error creating training session:', error);
    res.status(500).json({ message: 'Failed to create training session', error: error.toString() });
  }
});

async function updateEmployeeTrainingRecords(employee, sessionId, title, date, isRequiredTraining) {
  if (isRequiredTraining) {
    employee.requiredTrainings.push({
      requiredTrainingSession: sessionId,
      title,
      isCompleted: true,
      completionDate: date
    });
  } else {
    employee.completedTrainings.push({
      trainingSession: sessionId,
      title,
      completionDate: date
    });
  }

  await employee.save();
}

// Route to get a specific training record by title
// Fetch required training by title
router.get("/byTitle/:title", async (req, res) => {
  const { title } = req.params;
  try {
    // Assuming you have a text index on the title field or adjust the query accordingly
    const trainings = await TrainingSession.find({
      title: { $regex: new RegExp(title, "i") },
    }).populate("trainee trainer"); // Adjust population paths according to your schema

    if (!trainings.length) {
      return res
        .status(404)
        .json({ message: "No training sessions found with this title" });
    }

    res.json(trainings);
  } catch (error) {
    console.error(`Error fetching training sessions by title: ${error}`);
    res.status(500).json({ message: "Server error", error: error.toString() });
  }
});

// Validate employee route
// Assuming this is part of your route handler in Express
router.post("/validate", async (req, res) => {
  const { badgeNumber, firstName, lastName } = req.body;
  
  // Build query based on available information
  let query = {};
  if (badgeNumber) {
    query.badgeNumber = badgeNumber;
  } else if (firstName && lastName) {
    query.firstName = firstName;
    query.lastName = lastName;
  } else {
    return res.status(400).json({ message: "Please provide badge number or both first and last name." });
  }

  try {
    // Find the employee and populate the department and the division linked to that department
    const employee = await Employee.findOne(query)
      .populate({
        path: "department",
        select: "name description division",
        populate: {
          path: "division",
          model: "Division", // Ensure this matches your Division model name
          select: "name description"
        }
      });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Prepare and send the response including department and division details
    res.json({
      _id: employee._id,
      firstName: employee.firstName,
      lastName: employee.lastName,
      badgeNumber: employee.badgeNumber,
      department: employee.department ? {
        name: employee.department.name,
        description: employee.department.description,
        division: employee.department.division ? {
          name: employee.department.division.name,
          description: employee.department.division.description
        } : null
      } : null,
      isActive: employee.isActive,
      completedTrainings: employee.completedTrainings,
      requiredTrainings: employee.requiredTrainings
    });
  } catch (error) {
    console.error("Error during employee validation:", error);
    res.status(500).json({ message: "Server error", error: error.toString() });
  }
});


// Utility function to validate attendees' information
function validateAttendees(attendees) {
  const errors = [];

  attendees.forEach((attendee) => {
    const { badgeNumber, firstName, lastName } = attendee;
    if (!badgeNumber || !firstName || !lastName) {
      errors.push({
        attendeeId: attendee.id, // Assuming each attendee has a unique ID
        missingFields: [
          !badgeNumber ? "badgeNumber" : null,
          !firstName ? "firstName" : null,
          !lastName ? "lastName" : null,
        ].filter(Boolean),
      });
    }
  });
  return errors.length > 0 ? errors : null;
}
router.post("/update-chart", (req, res) => {
  try {
    const { stats } = req.body;
    // Update the chart data based on the received statistics
    // For example, set the chartData state in your component
    // Make sure to handle state management appropriately
    // Example: setChartData(stats);
    res.status(200).json({ message: "Chart data updated successfully" });
  } catch (error) {
    console.error("Error updating chart data:", error);
    res
      .status(500)
      .json({
        message: "Failed to update chart data",
        error: error.toString(),
      });
  }
});

module.exports = router;
