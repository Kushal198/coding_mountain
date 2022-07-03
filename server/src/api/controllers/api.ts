import { Request, Response, NextFunction } from 'express';
import { generateToken } from '../../jwt';
import ScrapData from '../../scrapper';
import { Coin, WishList, ScrappedData, Client } from '../types/type';
import { createOrUpdateCoin } from '../utility/coinData';
// import * as apiService from '../services/api';

// type ApiService = typeof apiService;

export class ApiController {
  private apiService;
  constructor(apiService: any) {
    this.apiService = apiService;
  }

  /**@Get Price Feed Controller */
  getPriceFeed = async (
    req: Request | any,
    res: Response,
    next: NextFunction
  ) => {
    //Get user from request
    const user = req.user;

    if (!user) {
      let dt = new Date().getTime();

      //Generating unique id for browser
      const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
        /[xy]/g,
        function (c) {
          var r = (dt + Math.random() * 16) % 16 | 0;
          dt = Math.floor(dt / 16);
          return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
        }
      );

      const userExists = await this.apiService.findUniqueClient(uuid);
      //Create client if not exists and set cookie
      if (!userExists) {
        await this.apiService.createClient(uuid);

        const token = generateToken(uuid);

        res.cookie('tokensignature', `Bearer ${token}`, {
          maxAge: 3600 * 24 * 60 * 60,
        });
      }
    }
    try {
      //Scrap latest data
      const latestData: ScrappedData[] = await new ScrapData().getPriceFeed();

      await createOrUpdateCoin(latestData);

      const listPrice: Coin[] = await this.apiService.findAllCoins();
      return res.status(200).json({ result: listPrice });
    } catch (err) {
      console.log(err);
    }
  };

  /**@Update Watch Controller */
  updateWatchList = async (
    req: Request | any,
    res: Response,
    next: NextFunction
  ) => {
    try {
      //get user from request
      const userInfo: Client = req.user;

      let favorites;
      if (userInfo) {
        //Get watchList from body
        let watchList: WishList = req.body ?? null;

        let minVal = parseInt(watchList.minimumPrice);
        let maxVal = parseInt(watchList.maximumPrice);

        // //Find coin
        const coin = await this.apiService.findUniqueCoin(watchList.code);

        // //Find Client
        const user = await this.apiService.findUniqueClient(userInfo.uuid);

        // Find if coin already exists in watchlist of client
        const watch = await this.apiService.uniqueCoinClientWatchList(
          user.id,
          coin.id
        );

        if (!watch) {
          //create watchlist for client with specified minimumPrice and maximumPrice
          await this.apiService.createWatchList(minVal, maxVal, coin, user);
        }

        favorites = await this.apiService.clientWatchList(user.uuid);
      }
      return res.status(201).json(favorites?.map((item: any) => item.coin));
    } catch (err) {
      console.log(err);
    }
  };

  /**@Get WatchList Controller */
  getWatchList = async (
    req: Request | any,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let favorites;

      if (req.user) {
        //Get user
        const uuid = req.user.uuid;

        //get client watchlists
        favorites = await this.apiService.clientWatchList(uuid);

        return res
          .status(200)
          .json({ results: favorites?.map((c: any) => c.coin) });
      }
      return res.status(200).json({ results: [] });
    } catch (err) {
      console.log(err);
    }
  };

  /**@Remove WatchList Controller */
  removeWatchList = async (
    req: Request | any,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = req.body.id;

      //find unique coin
      const coin = await this.apiService.findUniqueCoinId(id);

      //Get user from request
      const uuid = req.user.uuid;

      //find unique client
      const user: any = await this.apiService.findUniqueClient(uuid);

      //if coin present unique with coin then delete coin from user wishlist
      if (coin) {
        await this.apiService.deleteWishList(user, coin);
      }

      let favorites;

      if (req.user) {
        //get watchlist for user after deletion
        favorites = await this.apiService.clientWatchList(uuid);
      }

      return res
        .status(200)
        .json({ results: favorites?.map((c: any) => c.coin) });
    } catch (err) {
      console.log(err);
    }
  };
}
