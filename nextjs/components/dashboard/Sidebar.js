import React from 'react';
import { Box, List, ListItem, ListItemText } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import BarChartIcon from '@mui/icons-material/BarChart';
import Link from 'next/link';

const Sidebar = () => {
  return (
    <Box
      sx={{
        width: 180,
        backgroundColor: '#f4f5f7',
        height: '100vh',
        padding: '20px',
        position: 'fixed',
        top: 0,
        left: 0,
        overflowY: 'auto',
      }}
    >
      <List>
        <ListItem button>
          <DashboardIcon sx={{ marginRight: '10px' }} />
          <Link href="/dashboard" passHref>
            <ListItemText primary="Dashboard" />
          </Link>
        </ListItem>

        <ListItem button>
          <PeopleIcon sx={{ marginRight: '10px' }} />
          <Link href="/users" passHref>
            <ListItemText primary="Users" />
          </Link>
        </ListItem>

        <ListItem button>
          <ShoppingCartIcon sx={{ marginRight: '10px' }} />
          <Link href="/borrow" passHref>
            <ListItemText primary="Borrow" />
          </Link>
        </ListItem>

        <ListItem button>
          <InventoryIcon sx={{ marginRight: '10px' }} />
          <Link href="/books" passHref>
            <ListItemText primary="Books" />
          </Link>
        </ListItem>

        <ListItem button>
          <BarChartIcon sx={{ marginRight: '10px' }} />
          <Link href="/report" passHref>
            <ListItemText primary="Report" />
          </Link>
        </ListItem>
      </List>
    </Box>
  );
};

export default Sidebar;
