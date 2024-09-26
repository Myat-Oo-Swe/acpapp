import React, { useState } from "react";
import { TextField, Button, Grid, Typography, Paper, Snackbar, Alert } from '@mui/material';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const router = useRouter();

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (loginEmail.trim() === "" || loginPassword.trim() === "") {
      setSnackbarMessage('Both email and password are required!');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return; // Prevent submission if fields are empty
    }

    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginEmail,
          password_hash: loginPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }

      const data = await response.json();
      setSnackbarMessage('Login successful!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);

      // Delay the redirection to allow the user to see the success message
      setTimeout(() => {
        router.push('/home');
      }, 2000); // Redirect after 2 seconds
    } catch (error) {
      setSnackbarMessage(error.message);
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  return (
    <Grid container spacing={2} style={{ height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
      <Grid item xs={12} sm={6}>
        <Paper elevation={3} style={{ padding: '20px' }}>
          <Typography variant="h5" gutterBottom>
            Login
          </Typography>
          <form onSubmit={handleLoginSubmit}>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              margin="normal"
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required // Ensures browser validation is applied
            />
            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              margin="normal"
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required // Ensures browser validation is applied
            />
            <Button variant="contained" color="primary" fullWidth style={{ marginTop: '16px' }} type="submit">
              Login
            </Button>
          </form>
          <Typography style={{ marginTop: '16px', textAlign: 'center' }}>
            Don't have an account? <Button color="primary" onClick={() => router.push('/register')}>Register</Button>
          </Typography>
        </Paper>
      </Grid>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Grid>
  );
}
