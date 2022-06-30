import React, { createContext } from 'react';
import { io, Socket } from 'socket.io-client';

const socket = io('http://localhost:5050/notification', {
    transports: ['websocket', 'pooling'],
  }),
  SocketContext = createContext<Socket>(socket);

socket.on('connect', () => console.log('connected to socket'));

socket.on('notification', (data) => console.log(data));

const SocketProvider = ({ children }: any) => {
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
export { SocketContext, SocketProvider };
