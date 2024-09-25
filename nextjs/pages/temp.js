import React, { useEffect, useState } from 'react';
import axios from 'axios';  // For making API requests
import { Container, Typography, List, ListItem, ListItemText } from '@mui/material';

const Home = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch users from the FastAPI backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('api/users');  // Correct URL
        setUsers(response.data);
      } catch (err) {
        setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <Typography>Loading users...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        User List
      </Typography>
      <List>
        {users.map((user) => (
          <ListItem key={user.user_id}>
            <ListItemText
              primary={user.username}
              secondary={`Email: ${user.email}`}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default Home;
