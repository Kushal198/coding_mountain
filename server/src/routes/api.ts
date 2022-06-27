import express from 'express';
import controller from '../controllers/api';
const router = express.Router();

router.get('/price-feed', controller.getPriceFeed);

export = router;
