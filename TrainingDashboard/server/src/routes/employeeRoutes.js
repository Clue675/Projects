// server/src/routes/employeeRoutes.js
const express = require('express');
const employeeController = require('../controllers/employeeController');
const Employee = require('../models/Employee');

const router = express.Router();

// Route to get all employees or filter based on query params
router.get('/', employeeController.getEmployees);

router.get('/employees', employeeController.getAllEmployees);


// Route to create a new employee
router.post('/', employeeController.createEmployee);

// Route to update an existing employee by ID
router.put('/:id', employeeController.updateEmployee);

// Route to delete an existing employee by ID
router.delete('/:id', employeeController.deleteEmployee);

// Route to validate an employee by badge number
router.post('/validate', async (req, res) => {
  const { badgeNumber } = req.body;
  try {
    const employee = await Employee.findOne({ badgeNumber }).populate('department').populate('division');
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    console.error(`Error validating employee: ${error}`);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to get the number of active employees in each department
router.get('/active', employeeController.getActiveEmployeesByDepartment);

module.exports = router;
