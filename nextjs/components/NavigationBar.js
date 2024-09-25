import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Button,
} from '@mui/material';
import { useRouter } from 'next/router';
import Link from 'next/link';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const NavigationLayout = ({ children }) => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);

  // List of routes where NavigationBar should be hidden
  const hideNavRoutes = ['/login', '/signup'];

  // Check if the current route is in the list of routes where nav is hidden
  if (hideNavRoutes.includes(router.pathname)) {
    return <main>{children}</main>;
  }

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Function to check if the current route matches the link
  const isActive = (pathname) => router.pathname === pathname;

  return (
    <>
      <AppBar position="sticky" elevation={0} sx={{ backgroundColor: 'white', borderBottom: '1px solid #ddd' }}>
        <Toolbar>
          {/* Left section: Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img
              src="/logo.png" // Change this to your logo path
              alt="RA Logo"
              style={{ height: '40px', marginRight: '10px' }}
            />
          </Box>

          {/* Middle section: Centered Links */}
          <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'center', gap: '100px' }}>
            <Link href="/home" passHref>
              <Button
                sx={{
                  color: 'black',
                  fontSize: '16px',
                  fontWeight: 500,
                  borderBottom: isActive('/home') ? '2px solid black' : 'none', // Underline if active
                }}
              >
                Home
              </Button>
            </Link>
            <Link href="/dashboard" passHref>
              <Button
                sx={{
                  color: 'black',
                  fontSize: '16px',
                  fontWeight: 500,
                  borderBottom: isActive('/dashboard') ? '2px solid black' : 'none', // Underline if active
                }}
              >
                Dashboard
              </Button>
            </Link>
            <Link href="/myprofile" passHref>
              <Button
                sx={{
                  color: 'black',
                  fontSize: '16px',
                  fontWeight: 500,
                  borderBottom: isActive('/myprofile') ? '2px solid black' : 'none', // Underline if active
                }}
              >
                My Profile
              </Button>
            </Link>
            <Link href="/aboutus" passHref>
              <Button
                sx={{
                  color: 'black',
                  fontSize: '16px',
                  fontWeight: 500,
                  borderBottom: isActive('/aboutus') ? '2px solid black' : 'none', // Underline if active
                }}
              >
                About us
              </Button>
            </Link>
          </Box>

          {/* Right section: User icon and Cart */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {/* User Icon with Dropdown */}
            <IconButton
              edge="end"
              aria-controls="profile-menu"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              sx={{ color: 'black' }}
            >
              <PersonIcon />
              <ExpandMoreIcon />
            </IconButton>

            {/* Dropdown Menu */}
            <Menu
              id="profile-menu"
              anchorEl={anchorEl}
              open={isMenuOpen}
              onClose={handleMenuClose}
              MenuListProps={{
                'aria-labelledby': 'profile-menu',
              }}
            >
              <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <Link href="/login" underline="none" sx={{ fontWeight: 500, color: '#fff' }}>
                  Logout
                </Link>
              </MenuItem>
            </Menu>

            {/* Cart Icon */}
            <Link href="/cart" passHref>
              <IconButton sx={{ color: 'black' }}>
                <ShoppingBagIcon />
                <Typography sx={{ marginLeft: '5px', fontSize: '16px', fontWeight: 500 }}>Cart</Typography>
              </IconButton>
            </Link>
          </Box>
        </Toolbar>
      </AppBar>

      <main>{children}</main>
    </>
  );
};

export default NavigationLayout;
