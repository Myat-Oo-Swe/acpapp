// nextjs/components/WeeklyBorrowingsChart.js
import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';

const WeeklyBorrowingsChart = ({ data }) => {
  return (
    <Paper sx={{ padding: '20px' }}>
      <Typography variant="h6" sx={{ marginBottom: '20px' }}>
        Weekly Borrowings
      </Typography>
      <LineChart
        series={data.series}
        height={300}
        xAxis={[data.xAxis]}
        margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
      />
    </Paper>
  );
};

export default WeeklyBorrowingsChart;
