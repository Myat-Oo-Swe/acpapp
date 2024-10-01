import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const MainContent = ({ filteredBooks }) => {
  return (
    <Box sx={{ padding: '20px' }}>
      {/* Title */}
      <Typography variant="h4" sx={{ fontWeight: 'bold', paddingBottom: '20px' }}>
        Our Books Collection
      </Typography>

      {/* Books grid */}
      <Grid container spacing={3}>
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <Grid item xs={12} sm={6} md={4} key={book.book_id}>
              <Card sx={{ borderRadius: '10px' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={book.book_pic || '/default_book_image.png'}
                  alt={book.book_name}
                  sx={{ objectFit: 'contain', padding: '10px' }}
                />
                <CardContent>
                  <Typography variant="h6" align="center">
                    {book.book_name}
                  </Typography>
                  <Typography variant="body2" align="center" sx={{ color: '#888' }}>
                    Available: {book.available_quantity}
                  </Typography>
                  <Typography variant="body2" align="center" sx={{ color: '#888' }}>
                    {book.genre_name}  {/* Display the genre */}
                  </Typography>
                </CardContent>
                <CardActions>
                  <IconButton aria-label="borrow book" sx={{ margin: 'auto' }}>
                    <AddIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body1" align="center">
            No books found.
          </Typography>
        )}
      </Grid>
    </Box>
  );
};

export default MainContent;
