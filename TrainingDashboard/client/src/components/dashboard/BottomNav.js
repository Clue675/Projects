import React from 'react';
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';
import { Link } from 'react-router-dom';

const actions = [
  { icon: <DashboardIcon />, name: 'Dashboard', link: '/dashboard' },
  { icon: <PeopleIcon />, name: 'User Management', link: '/user-management' },
  { icon: <SettingsIcon />, name: 'Admin Settings', link: '/admin-setting' },
  { icon: <AssignmentIcon />, name: 'Training Details', link: '/training-details' },
  { icon: <BarChartIcon />, name: 'Required Training', link: '/required-training' },
  { icon: <LayersIcon />, name: 'Start Training', link: '/training-form' },
];

const SpeedDialTooltipOpen = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box sx={{ height: 330, transform: 'translateZ(0px)', flexGrow: 1 }}>
      <Backdrop open={open} />
      <SpeedDial
        ariaLabel="SpeedDial tooltip example"
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={<div style={{ marginTop: '8px' }}>{action.name}</div>}
            tooltipPlacement="top"
            component={Link}
            to={action.link}
            onClick={handleClose}
          />
        ))}
      </SpeedDial>
    </Box>
  );
};

export default SpeedDialTooltipOpen;
