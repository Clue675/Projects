import React, { useState } from "react";
import {
  Grid, Paper, Typography, Button, CircularProgress, IconButton, Snackbar
} from "@mui/material";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import DeleteIcon from '@mui/icons-material/Delete';

const KanbanBoard = ({ tasks, fetchTasks }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleMoveTask = async (taskId, newStatus) => {
    setIsLoading(true);
    try {
      const response = await axios.patch(`/api/tasks/${taskId}`, { status: newStatus });
      if (response.status === 200) {
        await fetchTasks();
      } else {
        throw new Error(`Failed to update task, server responded with status: ${response.status}`);
      }
    } catch (error) {
      console.error("Failed to move task:", error);
      setError(`Failed to move task: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    setIsLoading(true);
    try {
      const response = await axios.delete(`/api/tasks/${taskId}`);
      if (response.status === 200) {
        await fetchTasks();
      } else {
        throw new Error(`Failed to delete task, server responded with status: ${response.status}`);
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
      setError(`Failed to delete task: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <CircularProgress />}
      <Grid container spacing={2}>
        {Object.keys(tasks).map((status) => (
          <Grid item xs={12} sm={4} key={status}>
            <Paper elevation={3} sx={{ minHeight: "300px", padding: "16px" }}>
              <Typography variant="h6">{status.charAt(0).toUpperCase() + status.slice(1)}</Typography>
              {tasks[status]?.map((task) => (
                <Paper key={task._id} sx={{ margin: "8px", padding: "8px", position: "relative" }}>
                  <Typography variant="h6">{task.title}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Added {formatDistanceToNow(new Date(task.createdAt))} ago by {task.assignee}
                  </Typography>
                  <div>
                    {Object.keys(tasks).filter((key) => key !== status).map((targetStatus) => (
                      <Button
                        key={targetStatus}
                        size="small"
                        onClick={() => handleMoveTask(task._id, targetStatus)}
                        style={{ marginRight: 8 }}
                      >
                        Move to {targetStatus.charAt(0).toUpperCase() + targetStatus.slice(1)}
                      </Button>
                    ))}
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteTask(task._id)}
                      style={{ position: "absolute", right: 8, top: 8 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </Paper>
              ))}
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Snackbar
        open={Boolean(error)}
        autoHideDuration={6000}
        onClose={() => setError("")}
        message={error}
      />
    </>
  );
};

export default KanbanBoard;


