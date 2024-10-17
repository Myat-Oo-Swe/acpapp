import React, { useState } from 'react';
import { Box, List, ListItem, ListItemText, Snackbar, Alert } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import BarChartIcon from '@mui/icons-material/BarChart';

const Sidebar = () => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('error');

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleLinkClick = (roleRequired, path) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    if (!userInfo || userInfo.role_id !== roleRequired) {
      setSnackbarMessage('Cannot Access! Contact the Developers to be an Admin to Access this Page!');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }

    // Navigate to the desired path if the role is correct
    window.location.href = path; // Redirect to the page
  };

  return (
    <Box
      sx={{
        width: 180,
        backgroundColor: '#ffffff',
        height: '100vh',
        padding: '20px',
        position: 'fixed',
        top: 0,
        left: 0,
        boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
        transition: 'background-color 0.3s ease',
        '&:hover': {
          backgroundColor: '#f7f9fc',
        },
        overflowY: 'auto',
      }}
    >
      <List>
        <ListItem
          button
          onClick={() => handleLinkClick(2, '/dashboard')}
          sx={{
            marginBottom: '15px',
            padding: '10px',
            borderRadius: '8px',
            '&:hover': {
              backgroundColor: '#e3f2fd',
              color: '#1976d2',
              transition: 'all 0.3s ease',
            },
          }}
        >
          <DashboardIcon sx={{ marginRight: '12px', color: '#1976d2' }} />
          <ListItemText primary="Dashboard" sx={{ fontWeight: 'bold' }} />
        </ListItem>

        <ListItem
          button
          onClick={() => handleLinkClick(2, '/users')}
          sx={{
            marginBottom: '15px',
            padding: '10px',
            borderRadius: '8px',
            '&:hover': {
              backgroundColor: '#e3f2fd',
              color: '#1976d2',
              transition: 'all 0.3s ease',
            },
          }}
        >
          <PeopleIcon sx={{ marginRight: '12px', color: '#1976d2' }} />
          <ListItemText primary="Users" sx={{ fontWeight: 'bold' }} />
        </ListItem>

        <ListItem
          button
          onClick={() => handleLinkClick(2, '/borrow')}
          sx={{
            marginBottom: '15px',
            padding: '10px',
            borderRadius: '8px',
            '&:hover': {
              backgroundColor: '#e3f2fd',
              color: '#1976d2',
              transition: 'all 0.3s ease',
            },
          }}
        >
          <ShoppingCartIcon sx={{ marginRight: '12px', color: '#1976d2' }} />
          <ListItemText primary="Borrow" sx={{ fontWeight: 'bold' }} />
        </ListItem>

        <ListItem
          button
          onClick={() => handleLinkClick(2, '/books')}
          sx={{
            marginBottom: '15px',
            padding: '10px',
            borderRadius: '8px',
            '&:hover': {
              backgroundColor: '#e3f2fd',
              color: '#1976d2',
              transition: 'all 0.3s ease',
            },
          }}
        >
          <InventoryIcon sx={{ marginRight: '12px', color: '#1976d2' }} />
          <ListItemText primary="Books" sx={{ fontWeight: 'bold' }} />
        </ListItem>

        <ListItem
          button
          onClick={() => handleLinkClick(2, '/report')}
          sx={{
            marginBottom: '15px',
            padding: '10px',
            borderRadius: '8px',
            '&:hover': {
              backgroundColor: '#e3f2fd',
              color: '#1976d2',
              transition: 'all 0.3s ease',
            },
          }}
        >
          <BarChartIcon sx={{ marginRight: '12px', color: '#1976d2' }} />
          <ListItemText primary="Report" sx={{ fontWeight: 'bold' }} />
        </ListItem>
      </List>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Sidebar;
