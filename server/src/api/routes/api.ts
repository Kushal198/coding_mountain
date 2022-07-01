import express from 'express';
import ApiController from '../controllers/api';
const router = express.Router();
import { authenticate } from '../../auth';

/**
 * @Route Get Price Feed for all scrapped crypto
 */
router.get('/price-feed', authenticate(), new ApiController().getPriceFeed);

/**
 * @Route Get Crypto Added To WatchList
 */
router.get('/watch-list', authenticate(), new ApiController().getWatchList);

/**
 * @Route Add or Update WatchList Crypto
 */
router.put('/watch-list', authenticate(), new ApiController().updateWatchList);

/**
 * @Route Delete Crypto from Watch List
 */
router.delete(
  '/watch-list',
  authenticate(),
  new ApiController().removeWatchList
);

export = router;
