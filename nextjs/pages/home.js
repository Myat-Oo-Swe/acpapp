import React, { useState, useEffect } from 'react';
import {
  Grid,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Collapse,
  IconButton,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  TextField,
  InputAdornment,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import axios from 'axios'; // Using axios to fetch data

const HomePage = () => {
  const [books, setBooks] = useState([]); // State to store books data
  const [genres, setGenres] = useState([]); // State to store genres
  const [openGenres, setOpenGenres] = useState({}); // State to manage open/close genre descriptions
  const [searchTerm, setSearchTerm] = useState(''); // State to store search term

  // Fetch books from FastAPI backend
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('api/books'); // Adjust this URL as per your setup
        setBooks(response.data); // Store the fetched books
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []);

  // Fetch genres from FastAPI backend
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get('api/genres'); // Adjust this URL as per your setup
        setGenres(response.data); // Store the fetched genres
        const initialOpenState = {};
        response.data.forEach((genre) => {
          initialOpenState[genre.genre_name] = false; // Initially close all genres
        });
        setOpenGenres(initialOpenState);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchGenres();
  }, []);

  // Toggle genre description visibility
  const handleToggleGenre = (genreName) => {
    setOpenGenres((prev) => ({
      ...prev,
      [genreName]: !prev[genreName],
    }));
  };

  // Filter books by search term
  const filteredBooks = books.filter((book) =>
    book.book_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Grid container>
      {/* Sidebar */}
      <Grid item xs={12} md={3} sx={{ padding: '20px' }}>
        <Box sx={{ position: 'sticky', top: '90px', borderRight: '1px solid #ddd', paddingRight: '20px' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', paddingBottom: '10px' }}>
            Genres
          </Typography>
          <List>
            {genres.map((genre) => (
              <React.Fragment key={genre.genre_id}>
                <ListItem button onClick={() => handleToggleGenre(genre.genre_name)}>
                  <ListItemText primary={genre.genre_name} />
                  {openGenres[genre.genre_name] ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={openGenres[genre.genre_name]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItem>
                      <ListItemText inset primary={genre.genre_description} />
                    </ListItem>
                  </List>
                </Collapse>
              </React.Fragment>
            ))}
          </List>
        </Box>
      </Grid>

      {/* Main content area */}
      <Grid item xs={12} md={9} sx={{ padding: '20px' }}>
        {/* Search bar */}
        <Box sx={{ display: 'flex', justifyContent: 'center', paddingBottom: '20px' }}>
          <TextField
            variant="outlined"
            fullWidth
            placeholder="Search A Book"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ maxWidth: '600px' }}
          />
        </Box>

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
                    image={book.book_pic || '/default_book_image.png'} // Use default image if book_pic is not available
                    alt={book.book_name}
                    sx={{ objectFit: 'contain', padding: '10px' }}
                  />
                  <CardContent>
                    <Typography variant="h6" align="center">
                      {book.book_name}
                    </Typography>
                    <Typography variant="body2" align="center" sx={{ color: '#888' }}>
                      Available: {book.book_quantity}
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
      </Grid>
    </Grid>
  );
};

export default HomePage;
