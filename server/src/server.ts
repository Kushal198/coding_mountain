import http from 'http';
import express, { Express, NextFunction, request } from 'express';
import morgan from 'morgan';
import routes from './routes/api';
import job from './cronjob/schedule';
import { setUpIo } from './socket';
import { validateToken } from './jwt';
import { parse } from 'cookie';
import prisma from './db/prisma';
const cors = require('cors');
const cookieParser = require('cookie-parser');

const router: Express = express();

/** Logging */
router.use(morgan('dev'));

/** Parse the request */
router.use(express.urlencoded({ extended: false }));

/** Cookie parser middleware */
router.use(cookieParser());

/** Takes care of JSON data */
router.use(express.json());

router.use(cors());

/** Middlewares */
router.use((req, res, next) => {
  // set the CORS policy
  res.header('Access-Control-Allow-Origin', '*');
  // set the CORS headers
  res.header(
    'Access-Control-Allow-Headers',
    'origin, X-Requested-With,Content-Type,Accept, Authorization'
  );
  // set the CORS method headers
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET PATCH DELETE POST');
    return res.status(200).json({});
  }
  next();
});

/** Routes */
router.use('/api', routes);

/** Error handling */
router.use((req, res, next) => {
  const error = new Error('not found');
  return res.status(404).json({
    message: error.message,
  });
});

/** Server */
const httpServer: http.Server = http.createServer(router);

let io = setUpIo(httpServer);

const notificationNameSpace = io.of('/notification');

io.on('connection', (socket: any) => {
  const cDecoded = decodeURIComponent(socket.handshake.headers.cookie);
  const cArr = cDecoded.split(';');
  let name = 'tokenSignature' + '=';
  let res;
  console.log('op');
  // cArr.forEach(async (val) => {
  //   // console.log(val.indexOf(name));
  //   // if (val.indexOf(name) === 0) res = val.substring(name.length);
  //   if (val.indexOf(name)) console.log(await validateToken(val.split('=')[1]));
  // });

  // console.log(token.tokenSignature.split(' '));

  socket.emit('hello', 'world');

  socket.on('howdy', (arg: any) => {
    console.log(arg);
  });
});

notificationNameSpace.use(async (socket: any, next: any) => {
  try {
    const token: any = parse(socket.handshake.headers.cookie);
    const decode: any = await validateToken(token.tokenSignature);
    const sockets = await prisma.socket.findMany({
      where: {
        uuid: decode.uuid,
      },
    });
    if (sockets.length === 0) {
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
    next();
  } catch (err) {
    console.log(err);
  }
  next();
});
notificationNameSpace.on('connection', function (socket: any) {
  console.log('yup');
  socket.on('disconnect', function () {
    console.log(socket.id + 'disconnected');
    console.log('Client Disconnected');
  });
});

const PORT: string | number = process.env.PORT ?? 5050;
httpServer.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`);
  job.coinRefresh();
});

export default httpServer;
