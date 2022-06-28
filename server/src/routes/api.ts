import express from 'express';
import controller from '../controllers/api';
const router = express.Router();

router.get('/price-feed', controller.getPriceFeed);
router.get('/watch-list', controller.getWatchList);
router.put('/favorite-coins', controller.updateWatchList);

export = router;
