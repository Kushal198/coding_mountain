import { Request, Response, NextFunction } from 'express';
import { generateToken } from '../../jwt';
import ScrapData from '../../scrapper';
import { ApiService } from '../services/api';
import { Coin, WishList, ScrappedData } from '../types/type';

export default class ApiController {
  private apiService;
  constructor() {
    this.apiService = new ApiService();
  }

  /**@Get Price Feed Controller */
  getPriceFeed = async (req: Request, res: Response, next: NextFunction) => {
    //Get access token from cookies
    const user = req.cookies['tokenSignature']
      ? req.cookies['tokenSignature']
      : null;

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
        res.cookie('tokenSignature', `Bearer ${token}`, {
          maxAge: 540 * 60 * 60 * 1000,
        });
      }
    }
    try {
      //Scrap latest data
      const latestData: ScrappedData[] = await new ScrapData().getPriceFeed();

      if (latestData) {
        for (let item of latestData) {
          let name = item.allCoins.name;
          let code = item.allCoins.code;
          let image = item.allCoins.image;
          let rank = item.allCoins.rank;
          let price = item.price;
          let marketCap = item.marketCap;
          let h24 = item['24h'];

          if (code !== '') {
            const findCoin = await this.apiService.findUniqueCoin(code);
            if (findCoin) {
              await this.apiService.updateCoin(
                code,
                price,
                h24,
                marketCap,
                rank
              );
            } else {
              await this.apiService.createCoin(
                name,
                image,
                h24,
                price,
                rank,
                code,
                marketCap
              );
            }
          }
        }
      }
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
      const userInfo = req.user;

      let favorites;
      if (userInfo) {
        //Get watchList from body
        let watchList: WishList = req.body ?? null;

        let minVal = parseInt(watchList.minimumPrice);
        let maxVal = parseInt(watchList.maximumPrice);

        //Find coin
        const coin = await this.apiService.findUniqueCoin(watchList.code);

        //Find Client
        const user = await this.apiService.findUniqueClient(userInfo.uuid);

        //create watchlist for client with specified minimumPrice and maximumPrice
        await this.apiService.createWatchList(minVal, maxVal, coin, user);

        favorites = await this.apiService.clientWatchList(user);
      }
      return res.status(201).json(favorites?.map((item) => item.coin));
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
      }
      return res.status(200).json({ results: favorites?.map((c) => c.coin) });
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
      console.log(id);
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

      return res.status(200).json({ results: favorites?.map((c) => c.coin) });
    } catch (err) {
      console.log(err);
    }
  };
}
