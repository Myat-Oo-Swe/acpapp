import React from 'react';
import { Box, Container, Grid, Typography, CardMedia, IconButton } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

export default function AboutUs() {
  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        {/* Top Section with Logo and About Us Text */}
        <Grid container spacing={4} alignItems="center">
          {/* RAI Logo and Stars */}
          <Grid item xs={12} sm={6}>
            <Box sx={{ position: 'relative', textAlign: 'center' }}>
              <CardMedia
                component="img"
                image="/logo.jpg" // Update to your actual logo path
                alt="Dracarys logo"
                sx={{ maxWidth: '90%' }}
              />
            </Box>
          </Grid>

          {/* About Us Text */}
          <Grid item xs={12} sm={6}>
            <Box sx={{ borderLeft: 2, borderColor: 'lightgray', pl: 2 }}>
              <Typography variant="h4" gutterBottom>
                About Us
              </Typography>
              <Typography variant="body1" color="textSecondary" paragraph>
              Welcome to Dracarys Library, your digital gateway to a world of knowledge and imagination! Developed by two passionate Robotics and AI Engineering students, Matthew and San, Dracarys Library was born from a love of technology and a desire to make reading more accessible.
              </Typography>
              <Typography variant="body1" color="textSecondary" paragraph>
              Our platform allows you to easily browse and borrow books online, giving you the freedom to explore new genres, dive into research, or lose yourself in a novel—all from the comfort of your own device. Whether you're a casual reader or a dedicated book lover, Dracarys Library is here to ignite your curiosity and fuel your learning journey.
              Discover, Learn, Grow with us as you embark on a limitless adventure through books!
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Bottom Section - Rent, Experience, Repeat */}
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="h3" gutterBottom>
          Discover, Learn, Grow
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
