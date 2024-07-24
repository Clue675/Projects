const express = require('express');
const router = express.Router();

// Import the task controller
const taskController = require('../controllers/taskController');

// GET all tasks
router.get('/', taskController.getAllTasks);

// Route to get tasks by status, e.g., pending tasks
router.get('/status/:status', taskController.getTasksByStatus);

// Route to get completed tasks
router.get('/completed', taskController.getCompletedTasks);

// GET a single task by id
router.get('/:id', taskController.getTaskById);

// POST a new task
router.post('/', taskController.createTask);

// PATCH to update a task status
router.patch('/:id', taskController.updateTask);

// DELETE a task
router.delete('/:id', taskController.deleteTask);

// Route to assign a task to a user
router.post('/assign/:taskId', taskController.assignTask);

module.exports = router;
