import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";
import axios from "axios";

const MyProfile = () => {
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const [currentBorrows, setCurrentBorrows] = useState([]);
  const [borrowHistory, setBorrowHistory] = useState([]);

  useEffect(() => {
    // Fetch user info from localStorage
    const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (storedUserInfo) {
      setUserId(storedUserInfo.userId);
      setUsername(storedUserInfo.username);
    }

    const fetchBorrowData = async () => {
      if (!storedUserInfo?.userId) return;

      try {
        const response = await axios.get(`/api/borrows/user/${storedUserInfo.userId}`);
        const borrows = response.data;

        // Separate current borrows and history based on return_date
        const current = borrows.filter((borrow) => !borrow.return_date);
        const history = borrows.filter((borrow) => borrow.return_date);

        setCurrentBorrows(current);
        setBorrowHistory(history);
      } catch (error) {
        console.error("Error fetching borrow data:", error);
      }
    };

    fetchBorrowData();
  }, []);

  if (!userId || !username) {
    return <Typography variant="h5">Please log in to view your profile.</Typography>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {username}
      </Typography>

      {/* Current Borrowed Books */}
      <Typography variant="h6" gutterBottom>
        Current Borrowed Books
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order No</TableCell>
              <TableCell>Book Name</TableCell>
              <TableCell>Borrow Date</TableCell>
              <TableCell>Return Date</TableCell>
              <TableCell>Quantity</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentBorrows.map((borrow) => (
              <TableRow key={borrow.borrow_id}>
                <TableCell>{borrow.borrow_id}</TableCell>
                <TableCell>{borrow.book_name}</TableCell>
                <TableCell>{new Date(borrow.borrow_date).toLocaleDateString()}</TableCell>
                <TableCell>Not yet returned</TableCell>
                <TableCell>{borrow.borrow_quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Reader's History */}
      <Typography variant="h6" gutterBottom style={{ marginTop: "40px" }}>
        Reader's History
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order No</TableCell>
              <TableCell>Book Name</TableCell>
              <TableCell>Borrow Date</TableCell>
              <TableCell>Return Date</TableCell>
              <TableCell>Quantity</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {borrowHistory.map((borrow) => (
              <TableRow key={borrow.borrow_id}>
                <TableCell>{borrow.borrow_id}</TableCell>
                <TableCell>{borrow.book_name}</TableCell>
                <TableCell>{new Date(borrow.borrow_date).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(borrow.return_date).toLocaleDateString()}</TableCell>
                <TableCell>{borrow.borrow_quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default MyProfile;
