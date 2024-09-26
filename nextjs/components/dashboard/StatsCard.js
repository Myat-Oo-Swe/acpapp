// nextjs/components/StatsCard.js
import React from 'react';
import { Paper, Typography } from '@mui/material';

const StatsCard = ({ label, value, change, color }) => {
  return (
    <Paper
      sx={{
        padding: '20px',
        backgroundColor: color,
        color: '#fff',
        borderRadius: '10px',
      }}
    >
      <Typography variant="h6">{value}</Typography>
      <Typography variant="body1">{label}</Typography>
      {change && (
        <Typography variant="body2">{change}</Typography>
      )}
    </Paper>
  );
};

export default StatsCard;
