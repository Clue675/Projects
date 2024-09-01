import React, { useState } from "react";
import TrainingForm from "../TrainingForm"; // Import the TrainingForm component here
import TrainingSession from "./TrainingSession"; // Import the TrainingSession component here
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles"; // Import styled from @mui/material/styles

const useStyles = styled("div")({
  background: "linear-gradient(to right, #c9d6ff, #e2e2e2)",
  padding: "16px", // Use pixel values for padding
});

const PopupButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("form");
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleOpenPopup = () => {
    setIsOpen(true);
  };

  const handleClosePopup = () => {
    setIsOpen(false);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ height: "100vh" }}
    >
      <Grid item>
        <Button variant="contained" onClick={handleOpenPopup}>
          Open Popup
        </Button>
      </Grid>
      <Dialog
        open={isOpen}
        onClose={handleClosePopup}
        fullScreen={fullScreen}
        fullWidth
        maxWidth="md"
      >
        <Paper style={{ minHeight: "100vh" }}>
          <DialogTitle>Training Popup</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {/* You can add any introductory text here */}
            </DialogContentText>
            <Grid container justifyContent="center">
              <Button
                variant={activeTab === "form" ? "contained" : "outlined"}
                onClick={() => handleTabChange("form")}
              >
                Training Form
              </Button>
              <Button
                variant={activeTab === "session" ? "contained" : "outlined"}
                onClick={() => handleTabChange("session")}
              >
                Training Session
              </Button>
            </Grid>
            {activeTab === "form" && <TrainingForm />}
            {activeTab === "session" && <TrainingSession />}
          </DialogContent>
        </Paper>
        <DialogActions>
          <Button onClick={handleClosePopup} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default PopupButton;
