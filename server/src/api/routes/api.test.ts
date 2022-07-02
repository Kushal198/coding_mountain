import app from '../../app';
import request from 'supertest';
import { jest } from '@jest/globals';
import { Coin, Client } from '../types/type';
import apiService from '../services/api';

/** Mocking API Service for database Calls */
jest.mock('../services/api');

const coins: Coin[] = [];
const clients: Client[] = [];
let cookie: any = null;
const watchLists: any[] = [];

/** All are database mock functions */
apiService.findUniqueClient = jest.fn((uuid: string) => {
  const user = clients.find((ele) => ele.uuid === uuid);
  if (!user) return null;
  return Promise.resolve(user);
});

apiService.createClient = jest.fn((uuid: string) => {
  const client = {
    id: Math.floor(Math.random() * 999999),
    uuid,
  } as Client;
  clients.push(client);
  return Promise.resolve(client);
});

apiService.findUniqueCoin = jest.fn((code: string) => {
  const coin = coins.find((ele) => ele.code === code);
  if (!coin) return null;
  return Promise.resolve(coin);
});

apiService.createCoin = jest.fn(
  (
    name: string,
    image: string,
    h24: string,
    price: string,
    rank: number,
    code: string,
    marketCap: string
  ) => {
    const coin = {
      id: Math.floor(Math.random() * 999999),
      name,
      rank,
      image,
      marketCap,
      price,
      code,
      h24,
    } as Coin;
    coins.push(coin);
    return Promise.resolve(coin);
  }
);

apiService.updateCoin = jest.fn(
  (
    code: string,
    price: string,
    marketCap: string,
    h24: string,
    rank: number
  ) => {
    const coin = coins.find((ele) => ele.code === code);

    if (coin) {
      coin.price = price;
      coin.marketCap = marketCap;
      coin.h24 = h24;
      coin.rank = rank;
      return Promise.resolve(coin);
    }
    return undefined;
  }
);

apiService.findAllCoins = jest.fn(() => {
  return Promise.resolve(coins);
});

apiService.uniqueCoinClientWatchList = jest.fn(
  (userId: number, coinId: number) => {
    return Promise.resolve(
      watchLists.find(
        (ele: any) => ele.coinId === coinId && ele.userId === userId
      )
    );
  }
);

apiService.findUniqueCoinId = jest.fn((id: number) => {
  let coin = coins.find((ele) => ele.id === id);
  if (!coin) return null;
  return Promise.resolve(coin);
});

apiService.createWatchList = jest.fn(
  (minVal: number, maxVal: number, coin: Coin | null, user: Client | null) => {
    const watchlist = {
      userId: user?.id,
      coinId: coin?.id,
      minimumValue: minVal,
      maximumValue: maxVal,
    };

    return Promise.resolve(watchlist);
  }
);

/**@Route @GET /api/price-feed Integration Testing */
describe('Get Price Feed', () => {
  beforeEach(() => {});

  afterEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
  });

  it('1. No user token cookie present in header then set cookie in response and if coin doesnot exist create one, at last return allCoins from database', async () => {
    const response: any = await request(app).get('/api/price-feed');
    expect(response.statusCode).toEqual(200);
    expect(response.headers['set-cookie'][0].split(';')[0].split('=')[0]).toBe(
      'tokensignature'
    );

    /** Setting cookie to make cookie available in next request */
    cookie = response.headers['set-cookie'][0].split(';')[0].split('=')[1];

    expect(response.body.result.length).toBeGreaterThan(0);
    for (let item of response.body.result) {
      expect(item).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
        rank: expect.any(Number),
        image: expect.any(String),
        price: expect.any(String),
        marketCap: expect.any(String),
        h24: expect.any(String),
        code: expect.any(String),
      });
    }
  });

  it('2. User exists update the coin data if exists in db and finally return allCoins from database', async () => {
    const response: any = await request(app)
      .get('/api/price-feed')
      .set('Cookie', [`tokensignature=${cookie}`, 'myApp-other=blah']);
    expect(response.statusCode).toEqual(200);
    expect(response.body.result.length).toBeGreaterThan(0);
    for (let item of response.body.result) {
      expect(item).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
        rank: expect.any(Number),
        image: expect.any(String),
        price: expect.any(String),
        marketCap: expect.any(String),
        h24: expect.any(String),
        code: expect.any(String),
      });
    }
  });
});

/**@Route @GET /api/watch-list Integration Testing */
describe('Get Watch List Of client', () => {
  beforeEach(() => {});

  afterEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
  });

  it('Empty Watch list if user has not added to watch list', async () => {
    const response: any = await request(app).get('/api/watch-list');
    expect(response.body.results.length).toBe(0);
    expect(response.body).toHaveProperty('results');
  });
});
