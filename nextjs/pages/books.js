import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container, Typography, IconButton, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Select, MenuItem, CircularProgress, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Grid
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Sidebar from '../components/dashboard/Sidebar';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [newBook, setNewBook] = useState({ book_name: '', book_quantity: 1, book_description: '', book_pic: '', genre_id: '' });
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  // Fetch books and genres from the FastAPI backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const booksResponse = await axios.get('/api/books');
        const genresResponse = await axios.get('/api/genres');
        setBooks(booksResponse.data);
        setGenres(genresResponse.data);
      } catch (err) {
        setError('Failed to fetch books or genres');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Open the modal to add a new book
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Add a new book and fetch updated books list immediately
  const handleAddBook = async () => {
    try {
      await axios.post('/api/books/create', newBook);
      const booksResponse = await axios.get('/api/books');
      setBooks(booksResponse.data);
      setNewBook({ book_name: '', book_quantity: 1, book_description: '', book_pic: '', genre_id: '' });
      setOpen(false);
    } catch (err) {
      setError('Failed to add book');
    }
  };

  // Open delete confirmation dialog
  const handleOpenDeleteDialog = (book) => {
    setSelectedBook(book);
    setDeleteDialogOpen(true);
  };

  // Close delete confirmation dialog
  const handleCloseDeleteDialog = () => {
    setSelectedBook(null);
    setDeleteDialogOpen(false);
  };

  // Delete a book
  const handleDeleteBook = async () => {
    if (!selectedBook) return;
    try {
      await axios.delete(`/api/books/${selectedBook.book_id}`);
      setBooks(books.filter(book => book.book_id !== selectedBook.book_id)); // Remove the deleted book from the list
      setDeleteDialogOpen(false);
      setSelectedBook(null);
    } catch (err) {
      setError('Failed to delete book');
    }
  };

  // Increase book quantity
  const handleIncreaseQuantity = async (book) => {
    try {
      const updatedBook = { ...book, book_quantity: book.book_quantity + 1 };
      await axios.put(`/api/books/${book.book_id}`, updatedBook);
      setBooks(books.map(b => (b.book_id === book.book_id ? updatedBook : b))); // Update the book quantity in the state
    } catch (err) {
      setError('Failed to update book quantity');
    }
  };

  // Decrease book quantity
  const handleDecreaseQuantity = async (book) => {
    if (book.book_quantity > 0) {
      try {
        const updatedBook = { ...book, book_quantity: book.book_quantity - 1 };
        await axios.put(`/api/books/${book.book_id}`, updatedBook);
        setBooks(books.map(b => (b.book_id === book.book_id ? updatedBook : b)));
      } catch (err) {
        setError('Failed to update book quantity');
      }
    }
  };

  // Sort books by book_id in ascending order before rendering
  const sortedBooks = books.sort((a, b) => a.book_id - b.book_id);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Grid container>
      {/* Sidebar */}
      <Grid item xs={2} style={{ height: '100vh', position: 'fixed', overflowY: 'auto' }}>
        <Sidebar />
      </Grid>

      {/* Main Content */}
      <Grid item xs={10} style={{ marginLeft: '16.67%', padding: '20px' }}> {/* Set margin to accommodate the sidebar width */}
        <Container>
          <Typography variant="h4" gutterBottom>Book List</Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Book Name</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Genre</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedBooks.map((book) => (
                  <TableRow key={book.book_id}>
                    <TableCell component="th" scope="row">
                      {book.book_name}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleDecreaseQuantity(book)}><RemoveIcon /></IconButton>
                      {book.book_quantity}
                      <IconButton onClick={() => handleIncreaseQuantity(book)}><AddIcon /></IconButton>
                    </TableCell>
                    <TableCell align="right">{book.genre_name}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleOpenDeleteDialog(book)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Add New Book Button */}
          <Button variant="contained" color="primary" onClick={handleClickOpen} style={{ marginTop: '20px' }}>
            Add New Book
          </Button>

          {/* Add New Book Modal */}
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add a New Book</DialogTitle>
            <DialogContent>
              <TextField
                label="Book Name"
                fullWidth
                value={newBook.book_name}
                onChange={(e) => setNewBook({ ...newBook, book_name: e.target.value })}
                margin="dense"
              />
              <TextField
                label="Description"
                fullWidth
                value={newBook.book_description}
                onChange={(e) => setNewBook({ ...newBook, book_description: e.target.value })}
                margin="dense"
              />
              <TextField
                label="Image URL"
                fullWidth
                value={newBook.book_pic}
                onChange={(e) => setNewBook({ ...newBook, book_pic: e.target.value })}
                margin="dense"
              />
              <TextField
                label="Quantity"
                type="number"
                fullWidth
                value={newBook.book_quantity}
                onChange={(e) => setNewBook({ ...newBook, book_quantity: parseInt(e.target.value, 10) })}
                margin="dense"
              />

              {/* Genre Selection */}
              <Select
                fullWidth
                value={newBook.genre_id}
                onChange={(e) => setNewBook({ ...newBook, genre_id: e.target.value })}
                margin="dense"
              >
                {genres.map((genre) => (
                  <MenuItem key={genre.genre_id} value={genre.genre_id}>
                    {genre.genre_name}
                  </MenuItem>
                ))}
              </Select>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handleAddBook} variant="contained" color="primary">Add</Button>
            </DialogActions>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
            <DialogTitle>Delete Book</DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to delete the book: {selectedBook?.book_name}?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
              <Button onClick={handleDeleteBook} color="error" variant="contained">
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Grid>
    </Grid>
  );
};

export default BookList;
