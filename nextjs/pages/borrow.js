import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, IconButton
} from '@mui/material';
import Sidebar from '../components/dashboard/Sidebar'; // Assuming Sidebar exists

const Borrow = () => {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch borrow records from FastAPI backend
  useEffect(() => {
    const fetchBorrows = async () => {
      try {
        const response = await axios.get('/api/borrows');
        setBorrows(response.data);
      } catch (err) {
        setError('Failed to fetch borrow records');
      } finally {
        setLoading(false);
      }
    };

    fetchBorrows();
  }, []);

  // Mark a borrow as returned by updating the return_date
  const handleReturnBorrow = async (borrow_id) => {
    try {
      // Format the current date without the 'Z' suffix
      const currentDate = new Date().toISOString().split('.')[0]; // Removes milliseconds and 'Z'
  
      // Send PUT request to update the return_date
      const response = await axios.put(`/api/borrows/${borrow_id}`, {
        return_date: currentDate,
      });
  
      // If successful, update the local state to reflect the change
      if (response.status === 200) {
        setBorrows(borrows.map(borrow => 
          borrow.borrow_id === borrow_id 
            ? { ...borrow, return_date: response.data.return_date } // Use return_date from the response
            : borrow
        ));
      } else {
        setError('Failed to mark the borrow as returned');
      }
    } catch (err) {
      setError('Failed to mark the borrow as returned');
    }
  };
  

  if (loading) return <Typography>Loading borrow records...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar */}
      <Sidebar />

      <Container sx={{ marginLeft: '200px', paddingTop: '20px' }}>
        <Typography variant="h4" gutterBottom>
          Borrow Records
        </Typography>

        {/* Table for displaying borrow records */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Borrow ID</strong></TableCell>
                <TableCell><strong>User Name</strong></TableCell>
                <TableCell><strong>Book Name</strong></TableCell>
                <TableCell><strong>Borrow Quantity</strong></TableCell>
                <TableCell><strong>Borrow Date</strong></TableCell>
                <TableCell><strong>Return Date</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {borrows.map((borrow) => (
                <TableRow key={borrow.borrow_id}>
                  <TableCell>{borrow.borrow_id}</TableCell>
                  <TableCell>{borrow.username}</TableCell> {/* Assuming user_name is included in the response */}
                  <TableCell>{borrow.book_name}</TableCell> {/* Assuming book_name is included in the response */}
                  <TableCell>{borrow.borrow_quantity}</TableCell>
                  <TableCell>{new Date(borrow.borrow_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {borrow.return_date ? new Date(borrow.return_date).toLocaleDateString() : 'Not Returned'}
                  </TableCell>
                  <TableCell>
                    {!borrow.return_date && (
                      <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={() => handleReturnBorrow(borrow.borrow_id)}
                      >
                        Mark as Returned
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </div>
  );
};

export default Borrow;
