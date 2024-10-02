import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Sidebar from '../components/dashboard/Sidebar'; // Assuming Sidebar exists

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false); // Modal for adding new user
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // Modal for delete confirmation
  const [selectedUser, setSelectedUser] = useState(null); // Store user to be deleted
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '' });

  // Fetch users from the FastAPI backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/users_with_borrow_count');
        setUsers(response.data);
      } catch (err) {
        setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Add a new user
  const handleAddUser = async () => {
    try {
      const response = await axios.post('/api/users/create', {
        username: newUser.username,
        email: newUser.email,
        password_hash: newUser.password, // Assuming you pass the plain password here
      });
      setUsers([...users, response.data]); // Add the new user to the state
      setOpen(false); // Close the modal
      setNewUser({ username: '', email: '', password: '' }); // Reset form
    } catch (err) {
      setError('Failed to add user');
    }
  };

  // Open the confirmation dialog for deleting a user
  const handleOpenDeleteDialog = (user) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true); // Open delete confirmation dialog
  };

  // Close the confirmation dialog
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  // Confirm delete action
  const handleDeleteUser = async () => {
    if (selectedUser) {
      try {
        await axios.delete(`/api/users/${selectedUser.user_id}`);
        setUsers(users.filter(user => user.user_id !== selectedUser.user_id)); // Remove the user from the state
        setDeleteDialogOpen(false); // Close the delete confirmation dialog
      } catch (err) {
        setError('Failed to delete user');
      }
    }
  };

  // Handle opening and closing the add user modal
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  if (loading) return <Typography>Loading users...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar */}
      <Sidebar />

      <Container sx={{ marginLeft: '200px', paddingTop: '20px' }}>
        <Typography variant="h4" gutterBottom>
          Current Users
        </Typography>

        {/* Table for displaying users */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>User ID</strong></TableCell>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Email Address</strong></TableCell>
                <TableCell><strong>Total Borrows</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.user_id}>
                  <TableCell>{user.user_id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.total_borrows}</TableCell>
                  <TableCell>
                    {/* Delete button */}
                    <IconButton onClick={() => handleOpenDeleteDialog(user)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        

        {/* Add User Button */}
        <Button variant="contained" color="primary" onClick={handleClickOpen} sx={{ marginTop: '20px' }}>
          Add New User
        </Button>

        {/* Add User Modal */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Add New User</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Username"
              type="text"
              fullWidth
              value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Email"
              type="email"
              fullWidth
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Password"
              type="password"
              fullWidth
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleAddUser} variant="contained" color="primary">Add</Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
          <DialogTitle>Delete User</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete the user: {selectedUser?.username}?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
            <Button onClick={handleDeleteUser} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
};

export default Users;
