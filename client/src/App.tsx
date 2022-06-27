import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Box} from '@mui/material';
import HomePage from './pages/HomePage';

function App() {
  return (
    <div className="App">
       <Box sx={{ fontSize: 'h6.fontSize', 
                textAlign: 'center' ,
                color: '#002358',
                fontWeight: '800',
                textTransform: 'uppercase',
                my: 3,
                }}>
        Crypto Currency Price Rate
        </Box>
        <HomePage/>
    </div>
  );
}

export default App;
