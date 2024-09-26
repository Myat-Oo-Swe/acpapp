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
import axios from 'axios';

const HomePage = () => {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [openGenres, setOpenGenres] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('/api/books'); // Adjust the URL as per your setup
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get('/api/genres-with-books'); // Adjust the URL as per your setup
        setGenres(response.data);
        const initialOpenState = {};
        response.data.forEach((genre) => {
          initialOpenState[genre.genre_name] = false;
        });
        setOpenGenres(initialOpenState);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchGenres();
  }, []);

  const handleToggleGenre = (genreName) => {
    setOpenGenres((prev) => ({
      ...prev,
      [genreName]: !prev[genreName],
    }));
  };

  const filteredBooks = books.filter((book) =>
    book.book_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.genre_name.toLowerCase().includes(searchTerm.toLowerCase()) // Optional: also filter by genre name
  );

  return (
    <Grid container>
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
                    {genre.books.length > 0 ? (
                      genre.books.map((book) => (
                        <ListItem key={book.book_id}>
                          <ListItemText inset primary={book.book_name} />
                        </ListItem>
                      ))
                    ) : (
                      <ListItem>
                        <ListItemText inset primary="No books available" />
                      </ListItem>
                    )}
                  </List>
                </Collapse>
              </React.Fragment>
            ))}
          </List>
        </Box>
      </Grid>

      <Grid item xs={12} md={9} sx={{ padding: '20px' }}>
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

        <Typography variant="h4" sx={{ fontWeight: 'bold', paddingBottom: '20px' }}>
          Our Books Collection
        </Typography>

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
                      Available: {book.book_quantity}
                    </Typography>
                    <Typography variant="body2" align="center" sx={{ color: '#888' }}>
                      {book.genre_name}
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
