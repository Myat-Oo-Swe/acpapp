import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, CardMedia, CardContent, Button, IconButton, Snackbar, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import axios from 'axios';  // Ensure axios is imported for making API calls

const CartPage = ({ confirmBorrow }) => {
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const groupedItems = storedItems.reduce((acc, book) => {
      const existingBook = acc.find(item => item.book_id === book.book_id);
      if (existingBook) {
        existingBook.quantity += 1;
      } else {
        acc.push({ ...book, quantity: 1 });
      }
      return acc;
    }, []);
    setCartItems(groupedItems);
    const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (storedUserInfo) {
      setUserId(storedUserInfo.userId);
    }
  }, []);

  const handleConfirm = async (book) => {
    try {
      const response = await axios.post('/api/borrows/create', {
        user_id: userId,  // Replace with actual user ID from context or state
        book_id: book.book_id,
        borrow_quantity: book.quantity,
      });
      if (response.data) {
        setNotification({
          open: true,
          message: response.data.message || 'Borrow created successfully!',
          severity: 'success',
        });
        const updatedCart = cartItems.filter(item => item.book_id !== book.book_id);
        setCartItems(updatedCart);
        localStorage.setItem('cartItems', JSON.stringify(updatedCart));
      }
    } catch (error) {
      setNotification({
        open: true,
        message: error.response?.data?.detail || 'Failed to create borrow',
        severity: 'error',
      });
    }
  };

  const handleRemove = (book) => {
    const updatedCart = cartItems.filter(item => item.book_id !== book.book_id);
    setCartItems(updatedCart);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
  };

  const handleIncreaseQuantity = (index) => {
    const updatedCart = [...cartItems];
    updatedCart[index].quantity += 1;
    setCartItems(updatedCart);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
  };

  const handleDecreaseQuantity = (index) => {
    const updatedCart = [...cartItems];
    if (updatedCart[index].quantity > 1) {
      updatedCart[index].quantity -= 1;
      setCartItems(updatedCart);
      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    } else {
      handleRemove(updatedCart[index]);
    }
  };

  const handleCloseNotification = () => {
    setNotification({ open: false, message: '', severity: 'success' });
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', paddingBottom: '20px' }}>
        Cart
      </Typography>

      {cartItems.length === 0 ? (
        <Typography variant="body1" align="center">
          Your cart is empty.
        </Typography>
      ) : (
        <Box>
          {cartItems.map((book, index) => (
            <Grid container key={index} spacing={2} sx={{ marginBottom: '20px', alignItems: 'center' }}>
              <Grid item xs={3}>
                <CardMedia
                  component="img"
                  height="150"
                  image={book.book_pic || '/default_book_image.png'}
                  alt={book.book_name}
                  sx={{ objectFit: 'contain', padding: '10px' }}
                />
              </Grid>
              <Grid item xs={3}>
                <CardContent>
                  <Typography variant="h6">{book.book_name}</Typography>
                  <Typography variant="body2" sx={{ color: '#888' }}>
                    Available: {book.available_quantity}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#888' }}>
                    {book.genre_name}
                  </Typography>
                </CardContent>
              </Grid>
              <Grid item xs={3}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton onClick={() => handleDecreaseQuantity(index)}>
                    <RemoveIcon />
                  </IconButton>
                  <Typography variant="body1" sx={{ padding: '0 10px' }}>
                    {book.quantity}
                  </Typography>
                  <IconButton onClick={() => handleIncreaseQuantity(index)}>
                    <AddIcon />
                  </IconButton>
                </Box>
              </Grid>
              <Grid item xs={3}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleConfirm(book)}
                    sx={{ marginBottom: '10px' }}
                  >
                    Confirm Borrow
                  </Button>
                  <IconButton onClick={() => handleRemove(book)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Grid>
            </Grid>
          ))}
        </Box>
      )}

      <Snackbar open={notification.open} autoHideDuration={3000} onClose={handleCloseNotification}>
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CartPage;
