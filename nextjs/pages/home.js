import React, { useState, useEffect } from 'react';
import { Grid } from '@mui/material';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';

const HomePage = () => {
  const [books, setBooks] = useState([]); // State to store books data
  const [genres, setGenres] = useState([]); // State to store genres
  const [openGenres, setOpenGenres] = useState({}); // State to manage open/close genre descriptions
  const [searchTerm, setSearchTerm] = useState(''); // State to store search term
  const [selectedGenres, setSelectedGenres] = useState([]); // State to store selected genres
  const [cartNotification, setCartNotification] = useState(''); // State for cart notification

  // Fetch books from FastAPI backend
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('/api/books'); // Adjust this URL as per your setup
        setBooks(response.data); // Store the fetched books
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []);

  // Fetch genres from FastAPI backend
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get('/api/genres-with-books'); // Adjust this URL as per your setup
        setGenres(response.data); // Store the fetched genres
        const initialOpenState = {};
        response.data.forEach((genre) => {
          initialOpenState[genre.genre_name] = false; // Initially close all genres
        });
        setOpenGenres(initialOpenState);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchGenres();
  }, []);

  // Toggle genre description visibility
  const handleToggleGenre = (genreName) => {
    setOpenGenres((prev) => ({
      ...prev,
      [genreName]: !prev[genreName],
    }));
  };

  // Filter by genre and toggle selection
  const filterByGenre = (genreName) => {
    setSelectedGenres((prev) => {
      if (prev.includes(genreName)) {
        return prev.filter((genre) => genre !== genreName);
      } else {
        return [...prev, genreName];
      }
    });
  };

  // Add book to cart and save it in localStorage
  const addToCart = (book) => {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    cartItems.push(book);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    setCartNotification(`${book.book_name} added to cart!`);

    // Hide the notification after 2 seconds
    setTimeout(() => {
      setCartNotification('');
    }, 2000);
  };

  // Filter books by search term and selected genres
  const filteredBooks = books.filter((book) =>
    book.book_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedGenres.length === 0 || selectedGenres.includes(book.genre_name))
  );

  return (
    <Grid container sx={{ height: '100vh' }}> {/* Set full height for the container */}
      {/* Sidebar */}
      <Grid item xs={12} md={3} sx={{ padding: '20px', overflowY: 'auto', height: '100vh' }}>
        <Sidebar
          genres={genres}
          openGenres={openGenres}
          handleToggleGenre={handleToggleGenre}
          filterByGenre={filterByGenre} // Pass the filter function to Sidebar
          selectedGenres={selectedGenres} // Pass the selected genres to Sidebar
          searchTerm={searchTerm} // Pass search term to Sidebar
          setSearchTerm={setSearchTerm} // Pass setSearchTerm to Sidebar
        />
      </Grid>

      {/* Main content area */}
      <Grid item xs={12} md={9} sx={{ padding: '20px', overflowY: 'auto', height: '100vh' }}>
        {cartNotification && (
          <div style={{ color: 'green', marginBottom: '10px' }}>
            {cartNotification}
          </div>
        )}
        <MainContent
          filteredBooks={filteredBooks}
          addToCart={addToCart} // Pass the addToCart function
        />
      </Grid>
    </Grid>
  );
};

export default HomePage;
