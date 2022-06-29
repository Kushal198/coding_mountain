import React, { useState, useEffect } from 'react';
import './App.css';
import { Box } from '@mui/material';
import HomePage from './pages/HomePage';
import { io } from 'socket.io-client';

function App() {
  useEffect(() => {
    const socket = io('http://localhost:5050', { transports: ['websocket'] });

    socket.on('hello', (arg: any) => {
      console.log(arg);
    });

    socket.emit('howdy', 'stranger');
  }, []);

  return (
    <div className="App">
      <Box
        sx={{
          fontSize: 'h6.fontSize',
          textAlign: 'center',
          color: '#002358',
          fontWeight: '800',
          textTransform: 'uppercase',
          my: 3,
        }}
      >
        Crypto Currency Price Rate
      </Box>
      <HomePage />
    </div>
  );
}

export default App;
