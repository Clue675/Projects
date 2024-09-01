import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Table, TableBody, TableCell, TableHead, TableRow, Button,
  Dialog, DialogActions, DialogContent, TextField, DialogTitle, IconButton, Typography, Paper, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    divisionRef: ''
  });

  useEffect(() => {
    document.body.style.backgroundColor = "#f0f0f0";
    fetchUsers();
    fetchDivisions();
    return () => {
      document.body.style.backgroundColor = ""; // Reset to default or previous color
    };
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchDivisions = async () => {
    try {
      const response = await axios.get('/api/divisions/');
      setDivisions(response.data);
    } catch (error) {
      console.error('Error fetching divisions:', error);
    }
  };

  const handleOpenDialog = (user = null) => {
    setIsEdit(!!user);
    setCurrentUser(user || {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      divisionRef: ''
    });
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (isEdit) {
        await axios.put(`/api/users/${currentUser._id}`, currentUser);
      } else {
        await axios.post('/api/users', currentUser);
      }
      fetchUsers();
      handleDialogClose();
    } catch (error) {
      console.error('Error saving the user:', error);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`/api/users/${userId}`);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting the user:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>User Management</Typography>
      <Button startIcon={<AddIcon />} variant="contained" color="primary" onClick={() => handleOpenDialog()}>Add User</Button>
      <Paper sx={{ margin: '24px 0', overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Division</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => (
              <TableRow key={user._id}>
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.lastName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{divisions.find(div => div._id === user.divisionRef)?.name || 'N/A'}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(user)}><EditIcon /></IconButton>
                  <IconButton onClick={() => handleDelete(user._id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>{isEdit ? 'Edit User' : 'Add New User'}</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" name="firstName" label="First Name" fullWidth variant="outlined" value={currentUser.firstName} onChange={handleInputChange} />
          <TextField margin="dense" name="lastName" label="Last Name" fullWidth variant="outlined" value={currentUser.lastName} onChange={handleInputChange} />
          <TextField margin="dense" name="email" label="Email" fullWidth variant="outlined" value={currentUser.email} onChange={handleInputChange} />
          { !isEdit && <TextField margin="dense" name="password" label="Password" type="password" fullWidth variant="outlined" value={currentUser.password} onChange={handleInputChange} /> }
          <FormControl fullWidth margin="dense">
            <InputLabel>Division</InputLabel>
            <Select
              name="divisionRef"
              value={currentUser.divisionRef}
              onChange={handleInputChange}
              label="Division"
            >
              {divisions.map((division) => (
                <MenuItem key={division._id} value={division._id}>
                  {division.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleSubmit}>{isEdit ? 'Update' : 'Add'}</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserManagement;
