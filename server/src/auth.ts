import { Request, Response, NextFunction } from 'express';
import { UserRequest } from './controllers/api';
import { validateToken } from './jwt';

/**
 * middleware to check whether user has access to a specific endpoint
 *
 */
export const authenticate =
  () => async (req: Request | any, res: Response, next: NextFunction) => {
    try {
      let jwt = req.cookies.tokenSignature;

      // verify request has token
      if (!jwt) {
        return next();
        // return res.status(401).json({ message: 'Invalid token ' });
      }

      // remove Bearer if using Bearer Authorization mechanism
      if (jwt.toLowerCase().startsWith('bearer')) {
        jwt = jwt.slice('bearer'.length).trim();
      }

      // verify token hasn't expired yet
      const decodedToken: any = await validateToken(jwt);
      req.user = decodedToken;
      next();
    } catch (error) {
      res.status(500).json({ message: 'Failed to authenticate user' });
    }
  };
