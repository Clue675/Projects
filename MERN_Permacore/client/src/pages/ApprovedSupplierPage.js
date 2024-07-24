import React, { useState, useContext, createContext } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Dialog,
  DialogContent,
  Switch,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ApprovedSupplierList from "../components/SupplierQuality/SupplierQuality/ApprovedSupplierList";
import SupplierPerformanceScorecard from "../components/SupplierQuality/SupplierQuality/SupplierPerformanceScorecard";

// Theme context for dynamic theming
const ThemeContext = createContext({
  toggleTheme: () => {},
});

const useThemeContext = () => useContext(ThemeContext);

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    primary: {
      main: mode === "dark" ? "#90caf9" : "#1976d2",
    },
    secondary: {
      main: mode === "dark" ? "#f48fb1" : "#dc004e",
    },
    background: {
      default: mode === "dark" ? "#121212" : "#fff",
    },
    text: {
      primary: mode === "dark" ? "#fff" : "#000",
      secondary: mode === "dark" ? "#ccc" : "#555",
    }
  },
});

const ApprovedSupplierPage = () => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("light");
  const theme = createTheme(getDesignTokens(mode));

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const toggleTheme = () =>
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));

  return (
    <ThemeProvider theme={theme}>
      <ThemeContext.Provider value={{ toggleTheme }}>
        <Container maxWidth="xl">
          <Box
            sx={{
              my: 4,
              py: 3,
              textAlign: "center",
              background:
                theme.palette.mode === "dark"
                  ? "linear-gradient(45deg, #333 30%, #666 90%)"
                  : "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
              borderRadius: 2,
            }}
          >
            <Typography variant="h3" component="h1" color="text.primary" gutterBottom>
              Supplier Dashboard
            </Typography>
            <Button variant="contained" color="primary" onClick={handleOpen}>
              Open Scorecard Search
            </Button>
            <Switch
              checked={mode === "dark"}
              onChange={toggleTheme}
              color="default"
              sx={{ ml: 2 }}
            />
          </Box>
          <Paper elevation={3} sx={{ p: 2 }}>
            <ApprovedSupplierList />
          </Paper>
          <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
            <DialogContent>
              <SupplierPerformanceScorecard open={open} onClose={handleClose} />
            </DialogContent>
          </Dialog>
        </Container>
      </ThemeContext.Provider>
    </ThemeProvider>
  );
};

export default ApprovedSupplierPage;
