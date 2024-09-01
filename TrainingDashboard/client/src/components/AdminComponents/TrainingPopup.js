import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

function TrainingPopup({
  open,
  onClose,
  requiredTrainings,
  completedTrainings,
}) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Employee Training Records</DialogTitle>
      <DialogContent>
        <List>
          <ListItem>
            <ListItemText primary="Required Trainings" />
          </ListItem>
          {requiredTrainings.map((training) => (
            <ListItem key={training._id}>
              <ListItemText
                primary={training.title}
                secondary={`Completion Date: ${
                  training.completionDate || "Not completed"
                }`}
              />
            </ListItem>
          ))}
          <ListItem>
            <ListItemText primary="Completed Trainings" />
          </ListItem>
          {completedTrainings.map((training) => (
            <ListItem key={training._id}>
              <ListItemText
                primary={training.title}
                secondary={`Completion Date: ${
                  training.completionDate || "Not completed"
                }`}
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default TrainingPopup;
