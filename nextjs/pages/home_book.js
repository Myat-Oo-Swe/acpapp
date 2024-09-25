import React, { useEffect, useState } from 'react';
import {
  Grid,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Collapse,
  IconButton,
  TextField,
  InputAdornment,
} from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';

const HomePage = () => {
  const [genres, setGenres] = useState([]);
  const [openGenres, setOpenGenres] = useState({});

  // Fetch genres from the API
  useEffect(() => {
    fetch('api/genres')
      .then((response) => response.json())
      .then((data) => {
        setGenres(data);
        const initialOpenState = {};
        data.forEach((genre) => {
          initialOpenState[genre.genre_name] = false;
        });
        setOpenGenres(initialOpenState);
      });
  }, []);

  const handleToggleGenre = (genreName) => {
    setOpenGenres((prev) => ({
      ...prev,
      [genreName]: !prev[genreName],
    }));
  };

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

      {/* Main content */}
      <Grid item xs={12} md={9} sx={{ padding: '20px' }}>
        {/* Your book cards or other main content goes here */}
      </Grid>
    </Grid>
  );
};

export default HomePage;
