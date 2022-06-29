import express, { NextFunction } from 'express';
import controller from '../controllers/api';
const router = express.Router();
import { generateToken } from '../jwt';
import { authenticate } from '../auth';

router.get('/price-feed', authenticate(), controller.getPriceFeed);
router.get('/watch-list', authenticate(), controller.getWatchList);
router.put('/favorite-coins', authenticate(), controller.updateWatchList);
router.delete('/watch-list', authenticate(), controller.removeWatchList);
router.get('/favorite-coins', authenticate(), controller.getFavoriteCoins);
router.post('/test', (req, res) => {
  let data: any = req.body.id;
  const token = generateToken(data);
  return res.status(201).json({ token });
});

// router.get('/dum', authenticate(), (req, res) => {
//   console.log('yup');
// });

export = router;
