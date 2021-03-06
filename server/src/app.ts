import express, { Express } from 'express';
import morgan from 'morgan';
import routes from './api/routes/api';
const cors = require('cors');
const cookieParser = require('cookie-parser');
import apiService from './api/services/api';

const app: Express = express();

/** Logging */
// app.use(morgan('dev'));

/** Parse the request */
app.use(express.urlencoded({ extended: false }));

/** Cookie parser middleware */
app.use(cookieParser());

/** Takes care of JSON data */
app.use(express.json());

app.use(
  cors({
    credentials: true,
  })
);

/** Middlewares */
app.use((req, res, next) => {
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
app.use('/api', routes(apiService));

/** Error handling */
app.use((req, res, next) => {
  const error = new Error('not found');
  return res.status(404).json({
    message: error.message,
  });
});

export default app;
