import React, { useState } from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';



// Import custom components
// import EnhancedDataDisplay from "../components/SupplierQuality/SupplierQualityTable/index";
import CreateVendorAccount from "../components/SupplierQuality/CreateVendorAccount/CreateVendorAccount";
import CorrectiveActionsForm from "../components/SupplierQuality/CorrectiveActions/CorrectiveActions";
import IncomingShipments from "../components/Shipping/IncomingShipments";
import ReceivingInspectionForm from '../components/RecievingInspection/ReceivingInspectionForm';
import DailySimulationToggle from "../components/DailySimulation/DailySimulation"; // Adjust the import path

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const defaultTheme = createTheme();

export default function SupplierQualityDashboard() {
  const [open, setOpen] = useState(true);
  const [currentView, setCurrentView] = useState("dashboard");
  const [simulationRunning, setSimulationRunning] = useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleListItemClick = (view) => {
    setCurrentView(view);
  };

  const runSimulation = () => {
    setSimulationRunning(true);
    // Here you'd make the call to your API to start the simulation
    // For demo purposes, I will just use a timeout
    setTimeout(() => {
      setSimulationRunning(false);
    }, 5000); // Simulate a 5-second long process
  };

  const renderContent = () => {
    switch (currentView) {
      case "receivingInspection":
        return <ReceivingInspectionForm />;
      case "addVendor":
        return <CreateVendorAccount />;
      case "correctiveActions":
        return <CorrectiveActionsForm />;
      case "incomingShipments":
        return <IncomingShipments />;
      default:
        // return <EnhancedDataDisplay />;
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: "24px", // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Supplier Quality Dashboard
            </Typography>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            {/* Daily Simulation Toggle */}
            <ListItem>
              <DailySimulationToggle
                isRunning={simulationRunning}
                onToggle={runSimulation}
              />
            </ListItem>
            <Divider />
            {/* Other list items */}
            <ListItem button onClick={() => handleListItemClick("dashboard")}>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>

            {/* List Item for Adding a Vendor */}
            <ListItem button onClick={() => handleListItemClick("addVendor")}>
              <ListItemIcon>
                <AssignmentIcon />
              </ListItemIcon>
              <ListItemText primary="Add Vendor" />
            </ListItem>

            {/* List Item for Corrective Actions */}
            <ListItem
              button
              onClick={() => handleListItemClick("correctiveActions")}
            >
              <ListItemIcon>
                <ReportProblemIcon />
              </ListItemIcon>
              <ListItemText primary="Corrective Actions" />
            </ListItem>

            {/* List Item for Receiving Inspection */}
            <ListItem
              button
              onClick={() => handleListItemClick("receivingInspection")}
            >
              <ListItemIcon>
                <Inventory2Icon />
              </ListItemIcon>
              <ListItemText primary="Receiving Inspection" />
            </ListItem>

            {/* List Item for Incoming Shipments */}
            <ListItem button onClick={() => handleListItemClick('incomingShipments')}>
                <ListItemIcon>
                    <LocalShippingIcon />
                </ListItemIcon>
                <ListItemText primary="Incoming Shipments" />
            </ListItem>
            {/* Add more list items as needed */}
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {renderContent()}
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
