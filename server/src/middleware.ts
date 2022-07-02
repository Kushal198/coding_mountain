import { Request, Response, NextFunction } from 'express';
import { validateToken } from './jwt';

/** Middlewares to set User based on cookie */
export const middleware =
  () => async (req: Request | any, res: Response, next: NextFunction) => {
    try {
      let jwt = req.cookies['tokensignature'];

      // verify request has token
      if (!jwt) {
        return next();
      }
      // remove Bearer if using Bearer Authorization mechanism
      if (jwt.toLowerCase().startsWith('bearer')) {
        jwt = jwt.slice('bearer'.length).trim();
      }

      // verify token hasn't expired yet
      const decodedToken = await validateToken(jwt);
      req.user = decodedToken;
      next();
    } catch (error) {
      res.status(500).json({ message: 'Failed' });
    }
  };
