const express = require('express');
const mongoose = require('mongoose');
const asyncHandler = require("express-async-handler");
const Department = require("../models/Department");
const Division = require("../models/Divisions"); // Ensure this is the correct file name.

// Async handler for fetching departments by division ID
exports.getDepartmentsByDivisionId = asyncHandler(async (req, res) => {
  try {
    // Fetch departments based on division ID
    const departments = await Department.find({ division: req.params.divisionId });

    // Check if departments were found
    if (departments.length === 0) {
      return res.status(404).json({ message: 'Departments not found for the given division ID' });
    }

    // Return the departments in the response
    res.json(departments);
  } catch (error) {
    // Log and handle errors
    console.error('Error fetching departments by division ID:', error);
    res.status(500).json({ message: 'Failed to fetch departments by division ID', error: error.message });
  }
});



exports.createDepartment = async (req, res) => {
  try {
    const { name, description, division: divisionId, employees, workCenter } = req.body;

    // Validate request data
    if (!name || !description || !divisionId || !workCenter) {
      return res.status(400).json({ message: 'Missing required department fields' });
    }

    // Ensure divisionId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(divisionId)) {
      return res.status(400).json({ message: 'Invalid division ID' });
    }

    // Check if the referenced Division exists
    const divisionExists = await Division.findById(divisionId);
    if (!divisionExists) {
      return res.status(404).json({ message: 'Division not found' });
    }

    // Create the department
    const createdDepartment = await Department.create({
      name,
      description,
      division: divisionId,
      employees: employees ? employees.map(id => mongoose.Types.ObjectId(id)) : [],
      workCenter
    });

    // Update the Division's departments array with the new department's ID
    await Division.findByIdAndUpdate(divisionId, { $push: { departments: createdDepartment._id } }, { new: true });

    // Respond with the created department object
    res.status(201).json({
      message: 'Department created successfully',
      data: createdDepartment,
    });
  } catch (error) {
    console.error('Error creating department:', error);
    // Handle specific error scenarios
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: error.message });
    } else if (error.code === 11000) {
      return res.status(400).json({ message: 'Department already exists' });
    }
    // Handle other types of errors
    res.status(500).json({ message: 'Server error', error: error.toString() });
  }
};

// Async handler for fetching all departments in alphabetical order
exports.getAllDepartments = asyncHandler(async (req, res) => {
  try {
    const departments = await Department.find({}).populate('division').sort({ name: 1 }); // Populate the division field and sort by name in ascending order
    res.json(departments);
  } catch (error) {
    console.error(`Error fetching all departments: ${error}`);
    res.status(500).json({ message: "Server error", error: error.toString() });
  }
});


// Async handler for fetching a single department by ID
exports.getDepartmentById = asyncHandler(async (req, res) => {
  try {
    const department = await Department.findById(req.params.id).populate("division");

    if (!department) {
      res.status(404).json({ message: "Department not found" });
      return;
    }

    res.json(department);
  } catch (error) {
    console.error(`Error fetching department by ID: ${error}`);
    res.status(500).json({ message: "Server error", error: error.toString() });
  }
});

// Async handler for updating a department
exports.updateDepartment = asyncHandler(async (req, res) => {
  try {
    const { name, divisionId, workCenters } = req.body;
    const department = await Department.findById(req.params.id);

    if (!department) {
      res.status(404).json({ message: "Department not found" });
      return;
    }

    department.name = name || department.name;
    department.division = divisionId || department.division;
    department.workCenters = workCenters || department.workCenters;

    const updatedDepartment = await department.save();
    res.json(updatedDepartment);
  } catch (error) {
    console.error(`Error updating department: ${error}`);
    res.status(500).json({ message: "Server error", error: error.toString() });
  }
});

// Async handler for deleting a department
exports.deleteDepartment = asyncHandler(async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      res.status(404).json({ message: "Department not found" });
      return;
    }

    await department.remove();
    res.json({ message: "Department removed" });
  } catch (error) {
    console.error(`Error deleting department: ${error}`);
    res.status(500).json({ message: "Server error", error: error.toString() });
  }
});
