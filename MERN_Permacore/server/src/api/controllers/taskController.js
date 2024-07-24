const Task = require('../../models/Task'); // Adjust the path as necessary
const authMiddleware = require('../../middleware/authMiddleware');

const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error: Unable to retrieve tasks'
        });
    }
};



// Get tasks by status
const getTasksByStatus = async (req, res) => {
    const { status } = req.params;
    try {
        const tasks = await Task.find({ status });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get completed tasks
const getCompletedTasks = (req, res) => {
    req.params.status = 'done'; // Set status to 'done'
    getTasksByStatus(req, res); // Delegate to getTasksByStatus
};

// Get a single task by id
const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (task) {
            res.json(task);
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createTask = async (req, res) => {
    const { title, description, priority, dueDate, assignee, labels } = req.body;

    // Example validation
    if (!title || !dueDate || !assignee) {
        return res.status(400).json({ message: "Missing required fields: title, dueDate, assignee." });
    }

    // Proceed with task creation
    try {
        const newTask = new Task({
            title,
            description,
            priority,
            dueDate,
            assignee,
            labels,
            status: 'todo', // Default status
        });

        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (error) {
        console.error('Failed to create task:', error);
        res.status(500).json({ message: "Internal server error while creating task." });
    }
};


const updateTask = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
      const updatedTask = await Task.findByIdAndUpdate(id, { status }, { new: true });
      if (!updatedTask) {
        return res.status(404).json({ message: 'Task not found' });
      }
      res.json(updatedTask);
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).json({ message: 'Failed to update task' });
    }
  };


// Delete a task
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (task) {
            res.json({ message: 'Deleted Task', id: req.params.id });
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// Assign a task to a user
const assignTask = async (req, res) => {
    const { taskId } = req.params;
    const { userId } = req.body; // Assume userId is passed in the request body
    try {
        const updatedTask = await Task.findByIdAndUpdate(taskId, { assignee: userId }, { new: true });
        res.json(updatedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


module.exports = {
    getAllTasks,
    getTasksByStatus,
    getCompletedTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    assignTask, // Make sure you have implemented and included this function as well if you're using it
};