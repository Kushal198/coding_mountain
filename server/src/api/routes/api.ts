import express from 'express';
import { ApiController } from '../controllers/api';
const router = express.Router();
import { middleware } from '../../middleware';

export default function (apiService: any) {
  const controller = new ApiController(apiService);
  /**
   * @Route Get Price Feed for all scrapped crypto
   */
  router.get('/price-feed', middleware(), controller.getPriceFeed);

  /**
   * @Route Get Crypto Added To WatchList
   */
  router.get('/watch-list', middleware(), controller.getWatchList);

  /**
   * @Route Add or Update WatchList Crypto
   */
  router.put('/watch-list', middleware(), controller.updateWatchList);

  /**
   * @Route Delete Crypto from Watch List
   */
  router.delete('/watch-list', middleware(), controller.removeWatchList);
  return router;
}
