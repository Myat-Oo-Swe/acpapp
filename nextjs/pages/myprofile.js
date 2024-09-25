import React from 'react';
import { Box, Grid, Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar, Button, Link } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import StyleIcon from '@mui/icons-material/Style';
import BrandIcon from '@mui/icons-material/LocalOffer'; // placeholder for brand icon
import { styled } from '@mui/system';

// Custom styling for the cards
const StatCard = styled(Card)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(2),
  borderRadius: '16px',
}));

// Data for orders
const currentOrders = [
  { orderNo: 2133, item: 'Cartier', rentDate: '23-07-2021', returnDate: '23-07-2021', price: '$168.20' },
];

const orderHistory = [
  { orderNo: 2133, item: 'Gucci', status: 'Returned', rentDate: '23-07-2021', returnDate: '23-07-2021', price: '$168.20' },
  { orderNo: 2134, item: 'Dior', status: 'Returned', rentDate: '22-07-2021', returnDate: '22-07-2021', price: '$149.80' },
];

export default function MyProfile() {
  return (
    <Box sx={{ p: 4 }}>
      {/* Header */}
      <Typography variant="h4" gutterBottom>
        Welcome, Jim
      </Typography>

      {/* Stat Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard sx={{ backgroundColor: '#ffe4e4' }}>
            <CardContent>
              <CheckCircleIcon sx={{ fontSize: 40, color: '#ff5252' }} />
              <Typography variant="h5">100</Typography>
              <Typography variant="body2">Total Orders</Typography>
            </CardContent>
          </StatCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard sx={{ backgroundColor: '#fff1cf' }}>
            <CardContent>
              <LocalMallIcon sx={{ fontSize: 40, color: '#ffca28' }} />
              <Typography variant="h5">10</Typography>
              <Typography variant="body2">Total Spend</Typography>
            </CardContent>
          </StatCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard sx={{ backgroundColor: '#e8f8ef' }}>
            <CardContent>
              <StyleIcon sx={{ fontSize: 40, color: '#4caf50' }} />
              <Typography variant="h5">Footwear</Typography>
              <Typography variant="body2">Most Rented Category by you</Typography>
            </CardContent>
          </StatCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard sx={{ backgroundColor: '#f2e8ff' }}>
            <CardContent>
              <BrandIcon sx={{ fontSize: 40, color: '#ba68c8' }} />
              <Typography variant="h5">Dior</Typography>
              <Typography variant="body2">Most Rented Brand by you</Typography>
            </CardContent>
          </StatCard>
        </Grid>
      </Grid>

      {/* Current Orders */}
      <Typography variant="h6" gutterBottom>
        Current Orders
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order no</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Rent Date</TableCell>
              <TableCell>Return Date</TableCell>
              <TableCell>Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentOrders.map((order) => (
              <TableRow key={order.orderNo}>
                <TableCell>{order.orderNo}</TableCell>
                <TableCell>
                  <Avatar
                    alt={order.item}
                    src={`/images/${order.item.toLowerCase()}.jpg`} // Replace with actual image path
                    sx={{ width: 56, height: 56, mr: 2 }}
                  />
                  {order.item}
                </TableCell>
                <TableCell>{order.rentDate}</TableCell>
                <TableCell>
                  <Link href="#" target="_blank">{order.returnDate}</Link>
                </TableCell>
                <TableCell>{order.price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Order History */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Order History
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
              <TableCell>Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orderHistory.map((order) => (
              <TableRow key={order.orderNo}>
                <TableCell>{order.orderNo}</TableCell>
                <TableCell>
                  <Avatar
                    alt={order.item}
                    src={`/images/${order.item.toLowerCase()}.jpg`} // Replace with actual image path
                    sx={{ width: 56, height: 56, mr: 2 }}
                  />
                  {order.item}
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<CheckCircleIcon />}
                    disabled
                  >
                    {order.status}
                  </Button>
                </TableCell>
                <TableCell>{order.rentDate}</TableCell>
                <TableCell>
                  <Link href="#" target="_blank">{order.returnDate}</Link>
                </TableCell>
                <TableCell>{order.price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
