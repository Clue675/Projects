import React, { useState } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
// import Avatar from '@mui/material/Avatar';
// import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
// import HelpIcon from '@mui/icons-material/Help';
import IconButton from '@mui/material/IconButton';
// import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
// import Typography from '@mui/material/Typography';
import { useNavigate, useLocation } from 'react-router-dom';

// Dynamically defined tabs based on application routes and titles
const tabRoutes = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'User Management', path: '/users' },
  { label: 'Settings', path: '/admin-setting' },
  { label: 'Training Details', path: '/training-details' },
  { label: 'Required Training', path: '/required-training' },
  { label: 'Training Form', path: '/training-form' },
  // Add more routes as needed
];

function Header(props) {
  const { onDrawerToggle } = props;
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState(tabRoutes.findIndex(tab => tab.path === location.pathname));

  const handleChangeTab = (event, newValue) => {
    setSelectedTab(newValue);
    navigate(tabRoutes[newValue].path);
  };

  return (
    <React.Fragment>
      <AppBar color="primary" position="sticky" elevation={0}>
        <Toolbar>
          <Grid container spacing={1} alignItems="center">
            <Grid sx={{ display: { sm: 'none', xs: 'block' } }} item>
              <IconButton color="inherit" aria-label="open drawer" onClick={onDrawerToggle} edge="start">
                <MenuIcon />
              </IconButton>
            </Grid>
            <Grid item xs />
            <Grid item>
              <Tooltip title="Alerts • No alerts">
                <IconButton color="inherit">
                  <NotificationsIcon />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item>
              <IconButton color="inherit" sx={{ p: 0.5 }}>
                {/* <Avatar src="/static/images/avatar/1.jpg" alt="My Avatar" /> */}
              </IconButton>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      {/* Dynamic tabs based on routes */}
      <AppBar component="div" color="primary" position="static" elevation={0} sx={{ zIndex: 0 }}>
        <Tabs value={selectedTab} onChange={handleChangeTab} textColor="inherit" variant="scrollable" scrollButtons="auto">
          {tabRoutes.map((tab, index) => (
            <Tab key={index} label={tab.label} />
          ))}
        </Tabs>
      </AppBar>
    </React.Fragment>
  );
}

Header.propTypes = {
  onDrawerToggle: PropTypes.func.isRequired,
};

export default Header;
