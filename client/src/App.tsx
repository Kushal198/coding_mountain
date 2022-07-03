import React, { useState, useEffect, useContext } from 'react';
import './App.css';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Menu,
  MenuItem,
} from '@mui/material';
import HomePage from './pages/HomePage';
import { SocketContext, SocketProvider } from './socketContext';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

function App() {
  const socket = useContext(SocketContext);

  const [notification, setNotification] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null);

  /** Listen for notification from server when favorite coin price goes below or above the cap specifed*/
  useEffect(() => {
    socket.on('notification', (arg: any) => {
      setNotification(arg.data);
    });
  });

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {notification.map((item: any) => {
        return (
          <MenuItem key={item.id} onClick={handleMenuClose}>
            {item.coin.name} price has changed by {item.coin.h24} and is{' '}
            {item.coin.price}
          </MenuItem>
        );
      })}
    </Menu>
  );

  return (
    <SocketProvider>
      <div className="App">
        <Box sx={{ flexGrow: 1, mb: 8 }}>
          <AppBar>
            <Toolbar variant="dense" style={{ display: 'flex' }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <Badge color="secondary" badgeContent={notification.length}>
                  <NotificationsNoneIcon />
                </Badge>
              </IconButton>
              <Typography variant="h6" color="inherit" component="div">
                Coding Mountain
              </Typography>
            </Toolbar>
          </AppBar>
          {renderMenu}
        </Box>
        <Box
          sx={{
            fontSize: 'h5.fontSize',
            textAlign: 'center',
            color: '#002358',
            fontWeight: '800',
            textTransform: 'uppercase',
            my: 4,
          }}
        >
          Crypto Currency Price Rate
        </Box>
        <HomePage />
      </div>
    </SocketProvider>
  );
}

export default App;
