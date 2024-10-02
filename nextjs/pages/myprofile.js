import React from 'react';
import { Box, Grid, Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar, Button, Link, IconButton } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookIcon from '@mui/icons-material/Book';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import EditIcon from '@mui/icons-material/Edit';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { styled } from '@mui/system';

// Custom styling for the cards
const StatCard = styled(Card)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(2),
  borderRadius: '16px',
}));

// Data for current borrowed books and history
const currentBorrowed = [
  { orderNo: 2133, item: 'Harry Potter', rentDate: '23-07-2021', returnDate: '23-07-2021', genre: 'Fantasy' },
  { orderNo: 2133, item: 'Game Of Thrones', rentDate: '23-07-2021', returnDate: '23-07-2021', genre: 'Action' },
];

const readerHistory = [
  { orderNo: 2133, item: 'Harry Potter', status: 'Returned', rentDate: '23-07-2021', returnDate: '23-07-2021' },
  { orderNo: 2133, item: 'Game Of Thrones', status: 'Returned', rentDate: '23-07-2021', returnDate: '23-07-2021' },
];

export default function MyProfile() {
  return (
    <Box sx={{ p: 4 }}>
      {/* Header */}
      <Typography variant="h4" gutterBottom>
        Welcome, Dany
      </Typography>

      {/* Stat Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard sx={{ backgroundColor: '#ffe4e4' }}>
            <CardContent>
              <LibraryBooksIcon sx={{ fontSize: 40, color: '#ff5252' }} />
              <Typography variant="h5">23</Typography>
              <Typography variant="body2">Total Borrowed</Typography>
            </CardContent>
          </StatCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard sx={{ backgroundColor: '#fff1cf' }}>
            <CardContent>
              <BookIcon sx={{ fontSize: 40, color: '#ffca28' }} />
              <Typography variant="h5">2</Typography>
              <Typography variant="body2">Current Borrowed</Typography>
            </CardContent>
          </StatCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard sx={{ backgroundColor: '#ffe0f1' }}>
            <CardContent>
              <FavoriteIcon sx={{ fontSize: 40, color: '#ff5252' }} />
              <Typography variant="h5">10</Typography>
              <Typography variant="body2">Favorite</Typography>
            </CardContent>
          </StatCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard sx={{ backgroundColor: '#ffefd5' }}>
            <CardContent>
              <BookIcon sx={{ fontSize: 40, color: '#ffca28' }} />
              <Typography variant="h5">Fantasy</Typography>
              <Typography variant="body2">Most read genre</Typography>
            </CardContent>
          </StatCard>
        </Grid>
      </Grid>

      {/* Current Borrowed Books */}
      <Typography variant="h6" gutterBottom>
        Current Borrowed Books
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order no</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Rent Date</TableCell>
              <TableCell>Return Date</TableCell>
              <TableCell>Genre</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentBorrowed.map((borrow) => (
              <TableRow key={borrow.orderNo}>
                <TableCell>{borrow.orderNo}</TableCell>
                <TableCell>
                  <Avatar
                    alt={borrow.item}
                    src={`/images/${borrow.item.toLowerCase().replace(/\s/g, '-')}.jpg`} // Replace with actual image path
                    sx={{ width: 56, height: 56, mr: 2 }}
                  />
                  {borrow.item}
                </TableCell>
                <TableCell>{borrow.rentDate}</TableCell>
                <TableCell>
                  <Link href="#" target="_blank">{borrow.returnDate}</Link>
                  <IconButton size="small">
                    <EditIcon fontSize="small" />
                  </IconButton>
                </TableCell>
                <TableCell>{borrow.genre}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Reader's History */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Reader's History
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order no</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Rented Date</TableCell>
              <TableCell>Returned Date</TableCell>
              <TableCell>Re-Order</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {readerHistory.map((history) => (
              <TableRow key={history.orderNo}>
                <TableCell>{history.orderNo}</TableCell>
                <TableCell>
                  <Avatar
                    alt={history.item}
                    src={`/images/${history.item.toLowerCase().replace(/\s/g, '-')}.jpg`} // Replace with actual image path
                    sx={{ width: 56, height: 56, mr: 2 }}
                  />
                  {history.item}
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<CheckCircleIcon />}
                    disabled
                  >
                    {history.status}
                  </Button>
                </TableCell>
                <TableCell>{history.rentDate}</TableCell>
                <TableCell>
                  <Link href="#" target="_blank">{history.returnDate}</Link>
                </TableCell>
                <TableCell>
                  <Button size="small" endIcon={<ArrowForwardIcon />}>
                    Re-Order
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
