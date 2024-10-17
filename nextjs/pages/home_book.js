import React, { useState, useEffect } from "react";
import axios from "axios";
import { Grid, Card, Typography, CircularProgress } from "@mui/material";
import useBearStore from '../store/useBearStore'; // Correct import for default export
// Assuming Zustand is used for global state management

const Dashboard = () => {
  const [totalBooks, setTotalBooks] = useState(null);
  const [totalUsers, setTotalUsers] = useState(null);
  const [totalBorrows, setTotalBorrows] = useState(null);
  const [loading, setLoading] = useState(true);
  const appName = useBearStore((state) => state.appName); // Example from Zustand

  // Fetch data for dashboard
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch total books count
        const booksResponse = await axios.get("/api/books");
        setTotalBooks(booksResponse.data.length);

        // Fetch total users count
        const usersResponse = await axios.get("/api/users");
        setTotalUsers(usersResponse.data.length);

        // Fetch total borrow transactions
        const borrowsResponse = await axios.get("/api/borrows");
        setTotalBorrows(borrowsResponse.data.length);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Welcome to {appName} Dashboard
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3}>
          {/* Total Books */}
          <Grid item xs={12} sm={4}>
            <Card sx={{ padding: 3 }}>
              <Typography variant="h6" gutterBottom>
                Total Books
              </Typography>
              <Typography variant="h3">{totalBooks}</Typography>
            </Card>
          </Grid>

          {/* Total Users */}
          <Grid item xs={12} sm={4}>
            <Card sx={{ padding: 3 }}>
              <Typography variant="h6" gutterBottom>
                Total Users
              </Typography>
              <Typography variant="h3">{totalUsers}</Typography>
            </Card>
          </Grid>

          {/* Total Borrows */}
          <Grid item xs={12} sm={4}>
            <Card sx={{ padding: 3 }}>
              <Typography variant="h6" gutterBottom>
                Total Borrow Transactions
              </Typography>
              <Typography variant="h3">{totalBorrows}</Typography>
            </Card>
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default Dashboard;
