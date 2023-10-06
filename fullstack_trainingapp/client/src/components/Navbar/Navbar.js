import React, { useState, useEffect, useContext } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import DrawerComponent from "./Drawer";
import axios from "axios";
import { AuthContext } from "../Auth/AuthContext";
import "./Navbar.css";

function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { isLoggedIn, token } = useContext(AuthContext);
  const [first_name, setFirstName] = useState("");

  useEffect(() => {
    if (isLoggedIn && token) {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      axios
        .get("http://localhost:5000/getUsername", config)
        .then((response) => {
          console.log("User Data:", response.data); // Check the response
          // Use the correct field name from the server's response
          setFirstName(response.data.first_name); // Setting first_name here
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, [isLoggedIn, token]);
  
  
  

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h4" className="logo">
          Employee Training Database
        </Typography>
        <div className="username-display">
          {first_name ? `Welcome, ${first_name}` : ""}
        </div>

        {isMobile ? (
          <DrawerComponent />
        ) : (
          <div className="navlinks">
            <Link to="/" className="link">
              Home
            </Link>
            <Link to="/smart-form" className="link">
              Submit Training Form
            </Link>
            <Link to="/search" className="link">
              Search Training Database
            </Link>
            {!isLoggedIn && (
              <Link to="/login" className="link">
                Login
              </Link>
            )}
            {isLoggedIn && (
              <Link to="/logout" className="link">
                Logout
              </Link>
            )}
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
