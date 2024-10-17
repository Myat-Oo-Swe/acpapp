import React, { useEffect, useState } from 'react'; 
import { Box, Button, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper, Grid } from '@mui/material';
import axios from 'axios';
import Sidebar from '../components/dashboard/Sidebar'; // Assuming Sidebar exists

export default function Report() {
  const [booksByGenresData, setBooksByGenresData] = useState(null);
  const [totalUniqueBooks, setTotalUniqueBooks] = useState(0);
  const [totalBooks, setTotalBooks] = useState(0);
  const [availableBooks, setAvailableBooks] = useState(0);
  const [totalBorrows, setTotalBorrows] = useState(0);
  const [totalMembers, setTotalMembers] = useState(0);
  const [weeklyBorrowingsData, setWeeklyBorrowingsData] = useState([]);

  useEffect(() => {
    const fetchBooksByGenresCount = async () => {
      try {
        const response = await axios.get('/api/books/genres/count');
        setBooksByGenresData(response.data);
      } catch (error) {
        console.error('Error fetching books by genre count:', error);
      }
    };

    const fetchWeeklyBorrowingsData = async () => {
      try {
        const response = await axios.get('/api/borrows/weekly-stats');
        const transformedData = response.data.xAxis.data.map((day, index) => ({
          day,
          borrow_count: response.data.series[0].data[index],
        }));
        setWeeklyBorrowingsData(transformedData);
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
          axios.get('/api/users/count'),
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

  // Function to handle export
  const handleExport = () => {
    const reportData = {
      totalUniqueBooks,
      totalBooks,
      availableBooks,
      totalBorrows,
      totalMembers,
      booksByGenresData,
      weeklyBorrowingsData,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'library_report.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div sx={{ display: 'flex', padding: '20px', flexGrow: 1 }}>
      {/* Sidebar */}
      <Sidebar />

      <Box sx={{ marginLeft: '240px', padding: '20px', flexGrow: 1 }}>
        <Typography variant="h4" gutterBottom>
          Library Report
        </Typography>

        {/* Export Button */}
        <Button variant="contained" color="primary" onClick={handleExport} sx={{ marginBottom: '20px' }}>
          Export Report
        </Button>

        {/* Summary Section */}
        <Paper sx={{ padding: '20px', marginBottom: '20px' }}>
          <Typography variant="h6" gutterBottom>
            Summary
          </Typography>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Total Unique Books</TableCell>
                <TableCell>{totalUniqueBooks}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Total Books</TableCell>
                <TableCell>{totalBooks}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Available Books</TableCell>
                <TableCell>{availableBooks}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Total Borrows</TableCell>
                <TableCell>{totalBorrows}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Total Members</TableCell>
                <TableCell>{totalMembers}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Paper>

        {/* Books by Genre Section */}
        <Paper sx={{ padding: '20px', marginBottom: '20px' }}>
          <Typography variant="h6" gutterBottom>
            Books by Genre
          </Typography>
          {booksByGenresData ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Genre</TableCell>
                  <TableCell>Number of Unique Books</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {booksByGenresData.map((genre) => (
                  <TableRow key={genre.genre_name}>
                    <TableCell>{genre.genre_name}</TableCell>
                    <TableCell>{genre.book_count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Typography>No data available</Typography>
          )}
        </Paper>

        {/* Weekly Borrowings Section */}
        <Paper sx={{ padding: '20px' }}>
          <Typography variant="h6" gutterBottom>
            Weekly Borrowings
          </Typography>
          {weeklyBorrowingsData.length > 0 ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Day of the Week</TableCell>
                  <TableCell>Number of Borrows</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {weeklyBorrowingsData.map((entry, index) => (
                  <TableRow key={index}>
                    <TableCell>{entry.day}</TableCell>
                    <TableCell>{entry.borrow_count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Typography>No data available</Typography>
          )}
        </Paper>
      </Box>
    </div>
  );
}
