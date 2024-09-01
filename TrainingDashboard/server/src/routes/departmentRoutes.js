const express = require('express');
const router = express.Router();
const asyncHandler = require("express-async-handler");
const departmentController = require('../controllers/departmentController');

// Define routes
router.post('/', asyncHandler(departmentController.createDepartment));
router.get('/', asyncHandler(departmentController.getAllDepartments));
router.get('/:id', asyncHandler(departmentController.getDepartmentById));
router.put('/:id', asyncHandler(departmentController.updateDepartment));
router.delete('/:id', asyncHandler(departmentController.deleteDepartment));
router.get('/by-division/:divisionId', asyncHandler(departmentController.getDepartmentsByDivisionId));

module.exports = router;
