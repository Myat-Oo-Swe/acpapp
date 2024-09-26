import React from 'react';
import { List, ListItem, ListItemText, Collapse, Checkbox, TextField, InputAdornment } from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';

const Sidebar = ({ genres, openGenres, handleToggleGenre, filterByGenre, selectedGenres, searchTerm, setSearchTerm }) => {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Fixed search bar */}
      <div style={{ padding: '20px' }}>
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
          sx={{ marginBottom: '10px' }} // Add some space below the search input
        />
      </div>

      {/* Scrollable genre list */}
      <div style={{ overflowY: 'auto', flexGrow: 1 }}>
        <List>
          {genres.map((genre) => (
            <React.Fragment key={genre.genre_id}>
              <ListItem>
                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  {/* Checkbox for selecting genres */}
                  <Checkbox
                    checked={selectedGenres.includes(genre.genre_name)}
                    onChange={() => filterByGenre(genre.genre_name)} // Toggle genre selection
                    inputProps={{ 'aria-label': `${genre.genre_name} checkbox` }}
                  />
                  <ListItemText
                    primary={genre.genre_name}
                    onClick={() => handleToggleGenre(genre.genre_name)} // Toggle genre description visibility
                    style={{ cursor: 'pointer', flexGrow: 1 }} // Change cursor to pointer for the genre name
                  />
                  {/* Expand/Collapse Icon */}
                  {openGenres[genre.genre_name] ? (
                    <ExpandLess
                      onClick={() => handleToggleGenre(genre.genre_name)}
                      style={{ cursor: 'pointer' }}
                    />
                  ) : (
                    <ExpandMore
                      onClick={() => handleToggleGenre(genre.genre_name)}
                      style={{ cursor: 'pointer' }}
                    />
                  )}
                </div>
              </ListItem>
              <Collapse in={openGenres[genre.genre_name]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {genre.books.length > 0 ? (
                    genre.books.map((book) => (
                      <ListItem key={book.book_id} sx={{ backgroundColor: '#e0f7fa' }}> {/* Light blue for book items */}
                        <ListItemText inset primary={book.book_name} />
                      </ListItem>
                    ))
                  ) : (
                    <ListItem sx={{ backgroundColor: '#fff3e0' }}> {/* Light orange when no books available */}
                      <ListItemText inset primary="No books available" />
                    </ListItem>
                  )}
                </List>
              </Collapse>
            </React.Fragment>
          ))}
        </List>
      </div>
    </div>
  );
};

export default Sidebar;
