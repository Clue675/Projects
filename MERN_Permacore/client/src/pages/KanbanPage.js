import React, { useState, useEffect } from "react";
import {
  Box, Typography, Button, CircularProgress, Dialog,
  DialogTitle, DialogContent, TextField, DialogActions,
  useTheme, Snackbar, MenuItem
} from "@mui/material";
import axios from "axios";
import KanbanChart from "../components/Kanban/KanbanChart";
import KanbanBoard from "../components/Kanban/Kanban";

const KanbanPage = () => {
  const [tasks, setTasks] = useState({ todo: [], inProgress: [], done: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const theme = useTheme();
  const [isAddTaskDialogOpen, setAddTaskDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "Medium",
    dueDate: "",
    assignee: "",
    labels: []
  });

  const fetchTasks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get("/api/tasks");
      if (Array.isArray(response.data)) {
        const categorizedTasks = response.data.reduce((acc, task) => {
          acc[task.status] = acc[task.status] ? [...acc[task.status], task] : [task];
          return acc;
        }, { todo: [], inProgress: [], done: [] });
        setTasks(categorizedTasks);
      } else {
        throw new Error('Received non-array response');
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      setError("Failed to fetch tasks. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleOpenAddTaskDialog = () => setAddTaskDialogOpen(true);

  const handleCloseAddTaskDialog = () => {
    setAddTaskDialogOpen(false);
    setNewTask({
      title: "",
      description: "",
      priority: "Medium",
      dueDate: "",
      assignee: "",
      labels: []
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "labels") {
      setNewTask({ ...newTask, [name]: value.split(",").map(label => label.trim()) });
    } else {
      setNewTask({ ...newTask, [name]: value });
    }
  };

  const handleSubmitNewTask = async () => {
    setIsLoading(true);
    try {
      await axios.post("/api/tasks", newTask);
      handleCloseAddTaskDialog();
      fetchTasks();
    } catch (error) {
      console.error("Failed to add new task:", error);
      setError("Failed to add new task. Please check your input.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3, backgroundColor: theme.palette.grey[100], minHeight: "100vh" }}>
      <Typography variant="h4" gutterBottom>Kanban Overview</Typography>
      {isLoading && <CircularProgress />}
      <KanbanBoard tasks={tasks} fetchTasks={fetchTasks} />
      <KanbanChart tasks={tasks} />
      <Button variant="contained" color="primary" onClick={handleOpenAddTaskDialog} sx={{ mt: 2 }}>
        Add New Task
      </Button>
      <Dialog open={isAddTaskDialogOpen} onClose={handleCloseAddTaskDialog} fullWidth>
        <DialogTitle>Add New Task</DialogTitle>
        <DialogContent>
          <TextField name="title" label="Title" fullWidth variant="outlined" value={newTask.title} onChange={handleChange} margin="dense" />
          <TextField name="description" label="Description" fullWidth variant="outlined" multiline rows={4} value={newTask.description} onChange={handleChange} margin="dense" />
          <TextField name="priority" label="Priority" select fullWidth variant="outlined" value={newTask.priority} onChange={handleChange} margin="dense">
            {["Low", "Medium", "High"].map((option) => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </TextField>
          <TextField name="dueDate" label="Due Date" type="date" fullWidth variant="outlined" InputLabelProps={{ shrink: true }} value={newTask.dueDate} onChange={handleChange} margin="dense" />
          <TextField name="assignee" label="Assignee" fullWidth variant="outlined" value={newTask.assignee} onChange={handleChange} margin="dense" />
          <TextField name="labels" label="Labels" fullWidth variant="outlined" value={newTask.labels.join(",")} onChange={handleChange} margin="dense" helperText="Separate labels with commas (e.g., bug, urgent)" />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddTaskDialog}>Cancel</Button>
          <Button onClick={handleSubmitNewTask}>Submit</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={Boolean(error)}
        autoHideDuration={6000}
        onClose={() => setError("")}
        message={error}
      />
    </Box>
  );
};

export default KanbanPage;

