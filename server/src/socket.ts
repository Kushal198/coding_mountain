import { Server } from 'socket.io';

let io: any;

export const setUpIo = (server: any) => {
  io = new Server().listen(server);
  return io;
};

export const getIO = () => {
  return io;
};
