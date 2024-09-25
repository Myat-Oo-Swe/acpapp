import React, { useEffect, useState } from 'react';
import axios from 'axios';  // For making API requests
import { Container, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, CircularProgress } from '@mui/material';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch books from the FastAPI backend
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('/api/books');  // Adjust URL if necessary
        setBooks(response.data);
      } catch (err) {
        setError('Failed to fetch books');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) return <CircularProgress />;  // Spinner while loading
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Book List
      </Typography>
      <List>
        {books.map((book) => (
          <ListItem key={book.book_id}>
            <ListItemAvatar>
              <Avatar alt={book.book_name} src={book.book_pic} />
            </ListItemAvatar>
            <ListItemText
              primary={book.book_name}
              secondary={`Quantity: ${book.book_quantity}, Description: ${book.book_description || 'No description available'}`}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default BookList;
