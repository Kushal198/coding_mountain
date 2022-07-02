import job from './cronjob/schedule';
import { setUpIo } from './socket';
import { validateToken } from './jwt';
import { parse } from 'cookie';
import prisma from './db/prisma';
import http from 'http';
import app from './app';

/** Server */
const httpServer: http.Server = http.createServer(app);

let io = setUpIo(httpServer);

/** Notification namespace socket */
const notificationNameSpace = io.of('/notification');

notificationNameSpace.use(async (socket: any, next: any) => {
  try {
    if (typeof socket.handshake.headers.cookie === 'string') {
      let token = parse(socket.handshake.headers.cookie);
      let sockets;
      if (token) {
        const decode: any = await validateToken(token.tokenSignature);
        sockets = await prisma.socket.findUnique({
          where: {
            uuid: decode.uuid,
          },
        });

        if (!sockets) {
          await prisma.socket.create({
            data: {
              uuid: decode.uuid,
              socketId: socket.id,
            },
          });
        } else {
          await prisma.socket.update({
            where: {
              uuid: decode.uuid,
            },
            data: {
              socketId: socket.id,
            },
          });
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
  next();
});
notificationNameSpace.on('connection', async function (socket: any) {
  try {
    if (typeof socket.handshake.headers.cookie === 'string') {
      const token: any = parse(socket.handshake.headers.cookie);
      const decode: any = await validateToken(token.tokenSignature);
      socket.on('disconnect', async function () {
        // const find = await prisma.socket.findUnique({
        //   where: {
        //     socketId: socket.id,
        //   },
        // });
        // if (!find) {
        //   await prisma.socket.delete({
        //     where: {
        //       // socketId: socket.id,s
        //       uuid: decode.uuid,
        //     },
        //   });
        // }

        console.log(socket.id + 'disconnected');
        console.log('Client Disconnected');
      });
    }
  } catch (err) {
    console.log(err);
  }
});

io.on('connection', (socket: any) => {
  socket.on('connection', (arg: any) => {
    console.log(arg);
  });
});

const PORT: string | number = process.env.PORT ?? 5050;
httpServer.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`);
  job.coinRefresh();
  job.notify();
});
