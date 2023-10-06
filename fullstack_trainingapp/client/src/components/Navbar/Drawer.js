import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import AddBoxIcon from "@material-ui/icons/AddBox";
import LoginIcon from "@material-ui/icons/ExitToApp";
import LogoutIcon from "@material-ui/icons/PowerSettingsNew";
import MenuIcon from "@material-ui/icons/Menu";
import { AuthContext } from "../Auth/AuthContext";
import axios from "axios";
import './Navbar.css'; // Assuming the styles are in Navbar.css
import { FaSearch } from "react-icons/fa";

function DrawerComponent() {
  const [openDrawer, setOpenDrawer] = useState(false);
  const { isLoggedIn, token } = useContext(AuthContext);
  

  useEffect(() => {
    if (isLoggedIn && token) {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      axios
        .get("http://localhost:5000/getUsername", config)
        .then((response) => {
          // Debugging: Log the user data received from the server
          console.log("User Data:", response.data);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, [isLoggedIn, token]);

  return (
    <>
      <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)}>
        <List className="drawerList">
          <ListItem onClick={() => setOpenDrawer(false)}>
            <ListItemIcon><HomeIcon className="iconStyle" /></ListItemIcon>
            <ListItemText>
              <Link to="/" className="drawerLink">Dashboard</Link>
            </ListItemText>
          </ListItem>
          <ListItem onClick={() => setOpenDrawer(false)}>
            <ListItemIcon><FaSearch className="iconStyle" /></ListItemIcon>
            <ListItemText>
              <Link to="/home-page" className="drawerLink">Search Training Records</Link>
            </ListItemText>
          </ListItem>
          <ListItem onClick={() => setOpenDrawer(false)}>
            <ListItemIcon><AddBoxIcon className="iconStyle" /></ListItemIcon>
            <ListItemText>
              <Link to="/smart-form" className="drawerLink">Add Training Data</Link>
            </ListItemText>
          </ListItem>
          <ListItem onClick={() => setOpenDrawer(false)}>
            <ListItemIcon><AddBoxIcon className="iconStyle" /></ListItemIcon>
            <ListItemText>
              <Link to="/training-verification" className="drawerLink">Training Verification</Link>
            </ListItemText>
          </ListItem>
          {!isLoggedIn && (
            <ListItem onClick={() => setOpenDrawer(false)}>
              <ListItemIcon><LoginIcon className="iconStyle" /></ListItemIcon>
              <ListItemText>
                <Link to="/login" className="drawerLink">Login</Link>
              </ListItemText>
            </ListItem>
          )}
          {isLoggedIn && (
            <ListItem onClick={() => setOpenDrawer(false)}>
              <ListItemIcon><LogoutIcon className="iconStyle" /></ListItemIcon>
              <ListItemText>
                <Link to="/logout" className="drawerLink">Logout</Link>
              </ListItemText>
            </ListItem>
          )}
        </List>
      </Drawer>
      <MenuIcon className="drawerIcon" onClick={() => setOpenDrawer(!openDrawer)} />
    </>
  );
}

export default DrawerComponent;
