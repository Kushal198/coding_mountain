import express from 'express';
import controller from '../controllers/api';
const router = express.Router();
import { authenticate } from '../auth';

/**
 * @Route Get Price Feed for all scrapped crypto
 */
router.get('/price-feed', authenticate(), controller.getPriceFeed);

/**
 * @Route Get Crypto Added To WatchList
 */
router.get('/watch-list', authenticate(), controller.getWatchList);

/**
 * @Route Add or Update WatchList Crypto
 */
router.put('/watch-list', authenticate(), controller.updateWatchList);

/**
 * @Route Delete Crypto from Watch List
 */
router.delete('/watch-list', authenticate(), controller.removeWatchList);

export = router;
