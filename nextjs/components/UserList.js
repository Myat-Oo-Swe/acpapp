// components/UserList.js
import React from 'react';
import { List, ListItem, ListItemText, Typography } from '@mui/material';

const UserList = ({ users }) => {
  if (!users.length) {
    return <Typography>No users found.</Typography>;
  }

  return (
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
  );
};

export default UserList;
