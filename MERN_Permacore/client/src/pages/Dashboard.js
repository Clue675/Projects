// src/components/Dashboard.js
import React, { useState } from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import {
  CssBaseline,
  Drawer as MuiDrawer,
  Box,
  AppBar as MuiAppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  Badge,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import BuildIcon from "@mui/icons-material/Build";

import ShipmentPage from "../pages/Shipping";
import InspectionPage from "../components/Inspection/Inspection";
import SupplierQualityPage from "../pages/SupplierQuality";
import CorrectiveActionPage from "../components/SupplierQuality/CorrectiveActions/CorrectiveActons";
import InspectionBacklog from "../components/Inspection/InspectionBacklog";
import KanbanPage from "../pages/KanbanPage";
import ApprovedSupplierPage from "../pages/ApprovedSupplierPage";
import SupplierDashboard from "../pages/SupplierDashboard"; // Import the new page

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

export default function Dashboard() {
  const [open, setOpen] = useState(true);
  const [notificationCount, setNotificationCount] = useState(4);
  const [currentPage, setCurrentPage] = useState("shipping");

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const clearNotifications = () => {
    setNotificationCount(0);
  };

  const selectPage = (page) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "shipping":
        return <ShipmentPage />;
      case "inspection":
        return <InspectionPage />;
      case "supplier-quality":
        return <SupplierQualityPage />;
      case "corrective-actions":
        return <CorrectiveActionPage />;
      case "approved-supplier":
        return <ApprovedSupplierPage />;
      case "inspection-backlog":
        return <InspectionBacklog />;
      case "kanban":
        return <KanbanPage />;
      case "supplier-dashboard":
        return <SupplierDashboard />;
      default:
        return <SupplierQualityPage />;
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar sx={{ pr: "24px" }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{ marginRight: "36px", ...(open && { display: "none" }) }}
            >
              <MenuIcon />
            </IconButton>
            <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
              Supplier Quality Dashboard
            </Typography>
            <IconButton color="inherit" onClick={clearNotifications}>
              <Badge badgeContent={notificationCount} color="secondary">
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
            <ListItem button onClick={() => selectPage("shipping")}>
              <ListItemIcon>
                <LocalShippingIcon />
              </ListItemIcon>
              <ListItemText primary="Shipping" />
            </ListItem>
            <ListItem button onClick={() => selectPage("inspection")}>
              <ListItemIcon>
                <VisibilityIcon />
              </ListItemIcon>
              <ListItemText primary="Inspection" />
            </ListItem>
            <ListItem button onClick={() => selectPage("inspection-backlog")}>
              <ListItemIcon>
                <VisibilityIcon />
              </ListItemIcon>
              <ListItemText primary="Inspection Backlog" />
            </ListItem>
            <ListItem button onClick={() => selectPage("supplier-quality")}>
              <ListItemIcon>
                <VerifiedUserIcon />
              </ListItemIcon>
              <ListItemText primary="Add Supplier" />
            </ListItem>
            <ListItem button onClick={() => selectPage("approved-supplier")}>
              <ListItemIcon>
                <VerifiedUserIcon />
              </ListItemIcon>
              <ListItemText primary="Approved Supplier List" />
            </ListItem>
            <ListItem button onClick={() => selectPage("corrective-actions")}>
              <ListItemIcon>
                <BuildIcon />
              </ListItemIcon>
              <ListItemText primary="Corrective Actions" />
            </ListItem>
            <ListItem button onClick={() => selectPage("kanban")}>
              <ListItemIcon>
                <BuildIcon />
              </ListItemIcon>
              <ListItemText primary="Kanban" />
            </ListItem>
            <ListItem button onClick={() => selectPage("supplier-dashboard")}>
              <ListItemIcon>
                <VerifiedUserIcon />
              </ListItemIcon>
              <ListItemText primary="Supplier Quality Metrics" />
            </ListItem>
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          {renderPage()}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
