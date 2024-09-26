// nextjs/components/MostBorrowedBooks.js
import React from 'react';
import { Paper, Typography, List, ListItem, ListItemText } from '@mui/material';

const MostBorrowedBooks = ({ books }) => {
  return (
    <Paper sx={{ padding: '20px', marginBottom: '20px' }}>
      <Typography variant="h6" sx={{ marginBottom: '10px' }}>
        Most Borrowed Books
      </Typography>
      <List>
        {books.map((book, index) => (
          <ListItem key={index}>
            <ListItemText primary={`${index + 1}. ${book.title}`} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default MostBorrowedBooks;
