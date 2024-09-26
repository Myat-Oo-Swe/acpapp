// nextjs/components/BooksByGenresChart.js
import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';

const BooksByGenresChart = ({ data }) => {
  return (
    <Paper sx={{ padding: '20px' }}>
      <Typography variant="h6" sx={{ marginBottom: '10px' }}>
        Books by Genre
      </Typography>
      <BarChart
        series={data.series}
        height={250}
        xAxis={[data.xAxis]}
        margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
      />
    </Paper>
  );
};

export default BooksByGenresChart;
