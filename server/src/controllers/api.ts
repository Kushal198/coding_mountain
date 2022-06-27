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
  console.log('here');
  const listPrice: Coin[] = await prisma.coin.findMany();
  return res.status(200).json({ result: listPrice });
};

export default { getPriceFeed };
