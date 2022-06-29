import { Request, Response, NextFunction } from 'express';
import axios, { AxiosResponse } from 'axios';
import scrapData from '../scrapper';
import prisma from '../db/prisma';
import { generateToken } from '../jwt';
import ScrapData from '../scrapper';

interface Coin {
  name: String;
  image: String;
  code: String;
  price: String;
  marketCap: String;
  h24: String;
}
export interface UserData {
  uuid: string;
  iat: string;
  exp: string;
}

export interface UserRequest extends Request {
  user: UserData;
}

const getPriceFeed = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.cookies['tokenSignature']
    ? req.cookies['tokenSignature']
    : null;

  if (!user) {
    let dt = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
      }
    );
    const userExists = await prisma.client.findUnique({
      where: {
        uuid,
      },
    });

    if (!userExists) {
      await prisma.client.create({
        data: {
          uuid,
        },
      });

      const token = generateToken(uuid);

      res.cookie('tokenSignature', `Bearer ${token}`, {
        maxAge: 540 * 60 * 60 * 1000,
      });
    }
  }
  try {
    const latestData = await new ScrapData().getPriceFeed();
    for (let item of latestData) {
      let name: string = item.allCoins.name;
      let code: string = item.allCoins.code;
      let image: string = item.allCoins.image;
      let rank: number = item.allCoins.rank;
      let price: string = item.price;
      let marketCap: string = item.marketCap;
      let h24: string = item['24h'];

      if (code != '') {
        const findCoin = await prisma.coin.findUnique({
          where: {
            code,
          },
        });
        if (findCoin) {
          await prisma.coin.update({
            where: {
              code,
            },
            data: {
              price,
              marketCap,
              h24,
              rank,
            },
          });
        } else {
          await prisma.coin.create({
            data: {
              name,
              image,
              h24,
              price,
              rank,
              code,
              marketCap,
            },
          });
        }
      }
    }
    const listPrice: Coin[] = await prisma.coin.findMany({
      orderBy: {
        rank: 'asc',
      },
    });
    return res.status(200).json({ result: listPrice });
  } catch (err) {
    console.log(err);
  }
};

const updateWatchList = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  const userInfo = req.user;
  let favorites;
  if (userInfo) {
    let watchList = req.body ?? null;

    let minVal = parseInt(watchList.minimumPrice);
    let maxVal = parseInt(watchList.maximumPrice);

    const coin = await prisma.coin.findUnique({
      where: {
        code: watchList.code,
      },
    });

    const user = await prisma.client.findUnique({
      where: {
        uuid: userInfo.uuid,
      },
    });
    console.log(user, coin);

    await prisma.wishlist.create({
      data: {
        coin: {
          connect: {
            id: coin?.id,
          },
        },
        user: {
          connect: {
            id: user?.id,
          },
        },
        minimumValue: minVal,
        maximumValue: maxVal,
      },
    });

    favorites = await prisma.wishlist.findMany({
      where: {
        user: {
          uuid: userInfo.uuid,
        },
      },
      include: {
        user: true,
        coin: true,
      },
    });
  }
  console.log(favorites);

  return res.status(200).json(favorites?.map((item) => item.coin));
};

const getWatchList = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  let favorites;
  if (req.user) {
    const uuid = req.user.uuid;
    favorites = await prisma.wishlist.findMany({
      where: {
        user: {
          uuid,
        },
      },
      include: {
        user: true,
        coin: true,
      },
    });
  }
  console.log(favorites);

  return res.status(200).json({ results: favorites?.map((c) => c.coin) });
};

const removeWatchList = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  const id = req.body.id;

  const coin = await prisma.coin.findUnique({
    where: {
      id,
    },
  });

  const uuid = req.user.uuid;
  const user: any = await prisma.client.findUnique({
    where: { uuid },
  });

  if (coin) {
    await prisma.wishlist.delete({
      where: {
        coinId_userId: {
          coinId: coin.id,
          userId: user?.id,
        },
      },
    });
  }

  let favorites;

  if (req.user) {
    const uuid = req.user.uuid;
    favorites = await prisma.wishlist.findMany({
      where: {
        user: {
          uuid,
        },
      },
      include: {
        user: true,
        coin: true,
      },
    });
  }

  return res.status(200).json({ results: favorites?.map((c) => c.coin) });
};

const getFavoriteCoins = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  let favorites;
  if (req.user) {
    const uuid = req.user.uuid;
    favorites = await prisma.wishlist.findMany({
      where: {
        user: {
          uuid,
        },
      },
      include: {
        user: true,
        coin: true,
      },
    });
  }

  return res.status(200).json({ results: favorites?.map((item) => item.coin) });
};

export default {
  getPriceFeed,
  updateWatchList,
  getWatchList,
  removeWatchList,
  getFavoriteCoins,
};
