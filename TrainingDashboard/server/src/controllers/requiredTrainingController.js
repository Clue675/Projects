const mongoose = require("mongoose");
const RequiredTraining = require("../models/RequiredTraining");
const Department = require("../models/Department");
const Division = require("../models/Divisions");

exports.createRequiredTraining = async (req, res) => {
  try {
    const { title, departments, divisions, frequency, description } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required." });
    }

    const newRequiredTraining = new RequiredTraining({
      title,
      departments,
      divisions,
      frequency,
      description,
    });

    await newRequiredTraining.save();

    res
      .status(201)
      .json({
        message: "Required training created successfully",
        data: newRequiredTraining,
      });
  } catch (error) {
    console.error("Error creating required training:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.toString() });
  }
};

exports.updateTrainingCompletionStatus = async (req, res) => {
  const { trainingSessionId, employeeId } = req.params;
  const { completed } = req.body;

  try {
    const trainingSession = await TrainingSession.findById(trainingSessionId)
      .populate("attendees");

    if (!trainingSession) {
      return res.status(404).json({ message: "Training session not found" });
    }

    if (!trainingSession.attendees.some(attendee => attendee._id.toString() === employeeId)) {
      return res.status(404).json({ message: "Employee not found in the training session" });
    }

    await Employee.findByIdAndUpdate(employeeId, {
      $set: { "trainings.$[elem].completed": completed },
    }, {
      arrayFilters: [{ "elem.trainingSession": trainingSessionId }],
      new: true,
    });

    res.json({ message: "Training completion status updated successfully" });
  } catch (error) {
    console.error(`Error updating training completion status: ${error}`);
    res.status(500).json({ message: "Server error", error: error.toString() });
  }
};

exports.getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id).populate("division");
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }
    res.json(department);
  } catch (error) {
    console.error(`Error fetching department by ID: ${error}`);
    res.status(500).json({ message: "Server error", error: error.toString() });
  }
};

exports.getDistinctFrequencies = async (req, res) => {
  try {
    const frequencies = await RequiredTraining.distinct("frequency");
    res.json(frequencies);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.createTrainingRecord = async (req, res) => {
  try {
    const { trainingId, employeeId, completionDate } = req.body;
    const requiredTraining = await RequiredTraining.findById(trainingId);
    if (!requiredTraining) {
      return res.status(404).send("Required training not found");
    }

    const frequency = requiredTraining.frequency;
    const nextDueDate = calculateNextDueDate(completionDate, frequency);

    const newRecord = new TrainingRecord({
      training: trainingId,
      employee: employeeId,
      completionDate,
      nextDueDate,
    });

    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

function calculateNextDueDate(completionDate, frequency) {
  const date = new Date(completionDate);
  switch (frequency) {
    case "Annually":
      date.setFullYear(date.getFullYear() + 1);
      break;
  }
  return date;
}

exports.getDivisions = async (req, res) => {
  try {
    const divisions = await Division.find();
    res.json(divisions);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getAllRequiredTrainingTitles = async (req, res) => {
  try {
    const requiredTrainings = await RequiredTraining.find(
      {},
      "title departments divisions"
    )
      .populate("departments._id", "name")
      .populate("divisions._id", "name");

    const titlesWithDetails = requiredTrainings.map((training) => ({
      title: training.title,
      departments: training.departments.map((dept) => ({
        id: dept._id.toString(),
        name: dept.name,
      })),
      divisions: training.divisions.map((div) => ({
        id: div._id.toString(),
        name: div.name,
      })),
    }));

    res.json({ titlesWithDetails });
  } catch (error) {
    console.error(
      `Error fetching all required training titles and details: ${error}`
    );
    res.status(500).json({ message: "Server error", error: error.toString() });
  }
};

exports.updateRequiredTraining = async (req, res) => {
  try {
    const { title, departments, frequency } = req.body;
    const trainingId = req.params.id;

    const trainingToUpdate = await RequiredTraining.findById(trainingId);
    if (!trainingToUpdate) {
      return res.status(404).send("Required training not found");
    }

    if (title) trainingToUpdate.title = title;
    if (frequency) trainingToUpdate.frequency = frequency;

    if (departments && Array.isArray(departments)) {
      const departmentNames = departments.filter(name => typeof name === 'string');
      const departmentDocs = await Department.find({
        name: { $in: departmentNames },
      });

      if (departmentDocs.length !== departmentNames.length) {
        const invalidDepartments = departmentNames.filter(name => !departmentDocs.some(doc => doc.name === name));
        return res
          .status(400)
          .json({ error: `One or more department names are invalid: ${invalidDepartments.join(', ')}` });
      }
      trainingToUpdate.departments = departmentDocs.map((dept) => dept._id);
    }

    const updatedTraining = await trainingToUpdate.save();

    res.status(200).json(updatedTraining);
  } catch (error) {
    console.error("Error updating required training:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.deleteRequiredTraining = async (req, res) => {
  try {
    const deletedTraining = await RequiredTraining.findByIdAndDelete(
      req.params.id
    );
    if (!deletedTraining) {
      return res.status(404).send("Required training not found");
    }
    res.status(204).send(); // Successfully deleted
  } catch (err) {
    console.error("Error deleting required training:", err);
    res.status(500).send(err.message);
  }
};

exports.getAllTrainings = async (req, res) => {
  try {
    const trainings = await RequiredTraining.find()
      .populate({
        path: "departments",
        select: "name -_id",
      })
      .populate({
        path: "divisions",
        select: "name -_id",
      })
      .sort("title");

    res.json(trainings);
  } catch (error) {
    console.error("Error fetching trainings:", error);
    res.status(500).send({ message: "Server error", error: error.toString() });
  }
};
