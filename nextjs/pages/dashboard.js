import React, { useEffect, useState } from 'react';
import { Box, Grid } from '@mui/material';
import Sidebar from '../components/dashboard/Sidebar';
import StatsCard from '../components/dashboard/StatsCard';
import WeeklyBorrowingsChart from '../components/dashboard/WeeklyBorrowingsChart';
import BooksByGenresChart from '../components/dashboard/BooksByGenresChart';
import axios from 'axios';


export default function Dashboard() {
  const [booksByGenresData, setBooksByGenresData] = useState(null);
  const [totalUniqueBooks, setTotalUniqueBooks] = useState(0);
  const [totalBooks, setTotalBooks] = useState(0);
  const [availableBooks, setAvailableBooks] = useState(0);
  const [totalBorrows, setTotalBorrows] = useState(0);
  const [totalMembers, setTotalMembers] = useState(0);
  const [weeklyBorrowingsData, setWeeklyBorrowingsData] = useState(null);

  useEffect(() => {
    const fetchBooksByGenresCount = async () => {
      try {
        const response = await axios.get('/api/books/genres/count');
        const genreData = response.data;

        const chartData = {
          series: [{ label: 'Books', data: genreData.map(item => item.book_count) }],
          xAxis: { data: genreData.map(item => item.genre_name), scaleType: 'band' }
        };

        setBooksByGenresData(chartData);
      } catch (error) {
        console.error('Error fetching books by genre count:', error);
      }
    };

    const fetchWeeklyBorrowingsData = async () => {
      try {
        const response = await axios.get('/api/borrows/weekly-stats');
        setWeeklyBorrowingsData(response.data);
      } catch (error) {
        console.error('Error fetching weekly borrowing stats:', error);
      }
    };

    const fetchSummaryData = async () => {
      try {
        const [uniqueBooksRes, totalBooksRes, availableBooksRes, borrowsRes, membersRes] = await Promise.all([
          axios.get('/api/books/unique_count'),
          axios.get('/api/books/total-count'),
          axios.get('/api/books/available-count'),
          axios.get('/api/borrows/count'),
          axios.get('/api/users/count')
        ]);

        setTotalUniqueBooks(uniqueBooksRes.data.total_unique_books);
        setTotalBooks(totalBooksRes.data.total_books);
        setAvailableBooks(availableBooksRes.data.available_books);
        setTotalBorrows(borrowsRes.data.total_borrows);
        setTotalMembers(membersRes.data.total_members);
      } catch (error) {
        console.error('Error fetching summary data:', error);
      }
    };

    fetchBooksByGenresCount();
    fetchWeeklyBorrowingsData();
    fetchSummaryData();
  }, []);

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar />

      <Box sx={{ flexGrow: 1, marginLeft: '200px', padding: '20px' }}>
        {/* Summary Cards */}
        <Grid container spacing={2}>
          <Grid item xs={6} sm={4} md={2}>
            <StatsCard label="Unique Books" value={totalUniqueBooks} color="#640D5F" />
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <StatsCard label="Total Books" value={totalBooks} color="#D91656" />
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <StatsCard label="Available Books" value={availableBooks} color="#EE66A6" />
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <StatsCard label="Total Borrows" value={totalBorrows} color="#387478" />
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <StatsCard label="Total Members" value={totalMembers} color="#798645" />
          </Grid>
        </Grid>

        {/* Charts */}
        <Grid container spacing={3} sx={{ marginTop: '20px' }}>
          <Grid item xs={12} md={8}>
          {weeklyBorrowingsData && <WeeklyBorrowingsChart data={weeklyBorrowingsData} />}
          </Grid>

          <Grid item xs={12} md={10}>
            {booksByGenresData && <BooksByGenresChart data={booksByGenresData} />}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
