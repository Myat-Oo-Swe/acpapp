import React from 'react';
import {
  AppBar, Toolbar, Typography, Box, Grid, Paper, List, ListItem, ListItemText, IconButton, Divider
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import BarChartIcon from '@mui/icons-material/BarChart';
import { BarChart } from '@mui/x-charts/BarChart';
import Link from 'next/link';

// Mock data for the charts
const revenueData = {
  series: [
    { label: 'Bags and Accessories', data: [12000, 19000, 25000, 15000, 20000, 12000, 14000] },
    { label: 'Watches and Jewelries', data: [5000, 10000, 20000, 15000, 9000, 8000, 17000] },
  ],
  xAxis: { data: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], scaleType: 'band' }
};

const categoryData = {
  series: [
    { label: 'Louis Vuitton', data: [54] },
    { label: 'Dior', data: [20] },
    { label: 'Hermes', data: [26] },
  ],
  xAxis: { data: ['Louis Vuitton', 'Dior', 'Hermes'], scaleType: 'band' }
};

export default function Dashboard() {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: 180,
          backgroundColor: '#f4f5f7',
          height: '100vh', // Ensure full height
          padding: '20px',
          position: 'fixed', // Make the sidebar fixed
          top: 0, // Stick it to the top
          left: 0,
          overflowY: 'auto', // Allow scrolling inside the sidebar if needed
        }}
      >
        <Typography variant="h6" sx={{ marginBottom: '20px' }}>Admin Dashboard</Typography>
        <List>
          <ListItem button>
            <DashboardIcon sx={{ marginRight: '10px' }} />
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button>
            <PeopleIcon sx={{ marginRight: '10px' }} />
            <Link href="/temp" passHref><ListItemText primary="Users" /></Link>
          </ListItem>
          <ListItem button>
            <ShoppingCartIcon sx={{ marginRight: '10px' }} />
            <ListItemText primary="Orders" />
          </ListItem>
          <ListItem button>
            <InventoryIcon sx={{ marginRight: '10px' }} />
            <ListItemText primary="Products" />
          </ListItem>
          <ListItem button>
            <BarChartIcon sx={{ marginRight: '10px' }} />
            <ListItemText primary="Sales Report" />
          </ListItem>
        </List>
      </Box>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, marginLeft: '240px' }}> {/* Add left margin equal to the sidebar width */}
        {/* Sales Summary */}
        <Box sx={{ padding: '20px' }}>
          <Typography variant="h5" sx={{ marginBottom: '10px' }}>Today's Sales</Typography>
          <Typography variant="body1" sx={{ color: '#666' }}>Sales Summary</Typography>

          {/* Summary Cards */}
          <Grid container spacing={3} sx={{ marginTop: '20px' }}>
            {/* Sales Cards */}
            {[
              { label: 'Total Sales', value: '$1k', change: '+8% from yesterday', color: '#ff5252' },
              { label: 'Total Order', value: '50', change: '+5% from yesterday', color: '#ffca28' },
              { label: 'Product Rented', value: '5', change: '+1.2% from yesterday', color: '#66bb6a' },
              { label: 'New Customers', value: '8', change: '0.5% from yesterday', color: '#ba68c8' },
              { label: 'Total Products', value: '100', color: '#ff5252' },
              { label: 'Total Categories', value: '10', color: '#ffca28' },
              { label: 'Total Available Products', value: '80', color: '#66bb6a' },
              { label: 'Total Users', value: '100', color: '#ba68c8' },
            ].map((card, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper
                  sx={{
                    padding: '20px',
                    backgroundColor: card.color,
                    color: '#fff',
                    borderRadius: '10px',
                  }}
                >
                  <Typography variant="h6">{card.value}</Typography>
                  <Typography variant="body1">{card.label}</Typography>
                  {card.change && (
                    <Typography variant="body2">{card.change}</Typography>
                  )}
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Charts */}
          <Grid container spacing={3} sx={{ marginTop: '20px' }}>
            {/* Revenue Chart */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ padding: '20px' }}>
                <Typography variant="h6" sx={{ marginBottom: '20px' }}>Total Revenue</Typography>
                <BarChart
                  series={revenueData.series}
                  height={300}
                  xAxis={[revenueData.xAxis]}
                  margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
                />
              </Paper>
            </Grid>

            {/* Most Rented Products and Categories */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ padding: '20px', marginBottom: '20px' }}>
                <Typography variant="h6" sx={{ marginBottom: '10px' }}>Most Rented Products</Typography>
                <List>
                  {['Louis Vuitton Monogram Bag', 'Louis Vuitton Monogram Bag', 'Louis Vuitton Monogram Bag'].map(
                    (product, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={product} />
                      </ListItem>
                    )
                  )}
                </List>
              </Paper>

              <Paper sx={{ padding: '20px' }}>
                <Typography variant="h6" sx={{ marginBottom: '10px' }}>Rented products by categories</Typography>
                <BarChart
                  series={categoryData.series}
                  height={250}
                  xAxis={[categoryData.xAxis]}
                  margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
                />
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
