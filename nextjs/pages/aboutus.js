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
                image="/logo.png" // Update to your actual logo path
                alt="RAI Logo"
                sx={{ maxWidth: '100%' }}
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
                At RAI, we believe that luxury should be accessible to everyone. Our mission is to provide a seamless rental
                experience for the finest luxury brands, allowing you to enjoy high-end products without the long-term commitment.
              </Typography>
              <Typography variant="body1" color="textSecondary" paragraph>
                Whether for a special occasion or to elevate your everyday style, we offer a curated selection of exclusive items
                to help you make a statement, effortlessly.
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Bottom Section - Rent, Experience, Repeat */}
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="h3" gutterBottom>
            Rent, <br />
            Experience, <br />
            Repeat.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
