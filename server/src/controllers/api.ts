import { Request, Response, NextFunction } from 'express';
import axios, { AxiosResponse } from 'axios';
import scrapData from '../scrapper';
import prisma from '../db/prisma';

interface Coin {
  name: String;
  image: String;
  code: String;
  price: String;
  marketCap: String;
  h24: String;
}

const getPriceFeed = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const listPrice: Coin[] = await prisma.coin.findMany();
  return res.status(200).json({ result: listPrice });
};

const updateWatchList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(req.cookies);

  let favorites = req.cookies['favorites']
    ? JSON.parse(req.cookies['favorites'])
    : [];
  // get the data from req.body

  let watchList = req.body ?? null;

  favorites.push(watchList);

  favorites = JSON.stringify(favorites);

  res.cookie('favorites', favorites, {
    maxAge: 540 * 60 * 60 * 1000,
  });

  // if (favorites.some((e: any) => e.code === watchList.code)) {
  //   favorites.pop(watchList);
  // } else {
  //   favorites.push(watchList);
  // }
  // favorites = JSON.stringify(favorites);

  // res.cookie('favorites', favorites, {
  //   maxAge: 1000 * 60 * 10,
  //   httpOnly: false,
  // });
  const favArray = JSON.parse(favorites);

  let resultArr = [];
  if (favArray) {
    for (let item of favArray) {
      let i = await prisma.coin.findUnique({
        where: {
          code: item.code,
        },
      });
      resultArr.push(i);
    }
  }

  return res.status(200).json(resultArr);

  // update the post
  // let response: AxiosResponse = await axios.put(`https://jsonplaceholder.typicode.com/posts/${id}`, {
  //     ...(title && { title }),
  //     ...(body && { body })
  // });
  // return response
  // return res.status(200).json({
  //     message: response.data
  // });
};

const getWatchList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const favArray =
    req.cookies['favorites'] && JSON.parse(req.cookies['favorites']);
  // let result: AxiosResponse = await axios.get(`https://jsonplaceholder.typicode.com/posts`);
  // let posts: [Post] = result.data;
  // return res.status(200).json({
  //     message: posts
  // });

  let resultArr = [];
  if (favArray) {
    for (let item of favArray) {
      let i = await prisma.coin.findUnique({
        where: {
          code: item.code,
        },
      });
      resultArr.push(i);
    }
  }

  return res.status(200).json({ results: resultArr });
};

export default { getPriceFeed, updateWatchList, getWatchList };
