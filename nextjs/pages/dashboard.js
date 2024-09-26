// nextjs/pages/dashboard.js
import React from 'react';
import { Box, Grid } from '@mui/material';
import Sidebar from '../components/dashboard/Sidebar';
import StatsCard from '../components/dashboard/StatsCard';
import WeeklyBorrowingsChart from '../components/dashboard/WeeklyBorrowingsChart';
import MostBorrowedBooks from '../components/dashboard/MostBorrowedBooks';
import BooksByGenresChart from '../components/dashboard/BooksByGenresChart';

// Mock data for the charts
const weeklyData = {
  series: [{ label: 'Books', data: [50, 60, 70, 80, 60, 40, 30] }],
  xAxis: { data: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], scaleType: 'band' }
};

const booksByGenresData = {
  series: [{ label: 'Books', data: [120, 90, 70, 50, 30] }],
  xAxis: { data: ['Thriller', 'Sci-fi', 'Romance', 'Comedy', 'Horror'], scaleType: 'band' }
};

const mostBorrowedBooks = [
  { title: 'Harry Potter' },
  { title: 'Game of Thrones' },
  { title: 'Lord of the Rings' }
];

export default function Dashboard() {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar />

      <Box sx={{ flexGrow: 1, marginLeft: '200px', padding: '20px' }}>
        {/* Summary Cards */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard label="Total Books" value="1200" color="#FF8C00" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard label="Total Borrows" value="512" color="#FF6347" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard label="Available Books" value="688" color="#4682B4" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard label="Total Members" value="700" color="#32CD32" />
          </Grid>
        </Grid>

        {/* Charts */}
        <Grid container spacing={3} sx={{ marginTop: '20px' }}>
          <Grid item xs={12} md={8}>
            <WeeklyBorrowingsChart data={weeklyData} />
          </Grid>

          <Grid item xs={12} md={4}>
            <MostBorrowedBooks books={mostBorrowedBooks} />
            <BooksByGenresChart data={booksByGenresData} />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
