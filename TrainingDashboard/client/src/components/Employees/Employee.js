import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import axios from 'axios';

function Row({ row }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" align="left">
          {row.firstName} {row.lastName}
        </TableCell>
        <TableCell align="left">{row.badgeNumber}</TableCell> {/* Align badge number left */}
        <TableCell align="left">{row.department?.name}</TableCell> {/* Align department left */}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Training Information
              </Typography>
              <Typography variant="subtitle1" gutterBottom component="div">
                Required Trainings
              </Typography>
              <Table size="small" aria-label="required-trainings">
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell align="right">Completion Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.requiredTrainings.map(training => (
                    <TableRow key={training._id}>
                      <TableCell component="th" scope="row">
                        {training.title}
                      </TableCell>
                      <TableCell align="right">{new Date(training.completionDate).toLocaleDateString('en-US')}</TableCell> {/* Format completion date */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Typography variant="subtitle1" gutterBottom component="div">
                Completed Trainings
              </Typography>
              <Table size="small" aria-label="completed-trainings">
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell align="right">Completion Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.completedTrainings.map(training => (
                    <TableRow key={training._id}>
                      <TableCell component="th" scope="row">
                        {training.title}
                      </TableCell>
                      <TableCell align="right">{new Date(training.completionDate).toLocaleDateString('en-US')}</TableCell> {/* Format completion date */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function CollapsibleTable() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('/api/employees/employees');
        setRows(response.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };
    fetchEmployees();
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Employee Name</TableCell>
            <TableCell>Badge Number</TableCell> {/* Align badge number left */}
            <TableCell>Department</TableCell> {/* Align department left */}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <Row key={row._id} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
