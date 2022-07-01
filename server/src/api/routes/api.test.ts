import app from '../../app';
import request from 'supertest';
import prisma from '../../db/prisma';
import { generateToken } from '../../jwt';

type Client = {
  id: number;
  uuid: string;
};
interface User {
  findUnique: (uuid: string) => Promise<Client>;
  createClient: (uuid: string) => Promise<Client>;
  find: (uuid: string) => Promise<Client[]>;
  setCookie: (uuid: string) => any;
}

interface WishListData {
  coinId: number;
  userId: number;
  miniumValue: number;
  maximumValue: number;
}
interface WishList {
  // find: (uuid: string) => Promise<WishList[]>;
  createWishList: (userId: number) => Promise<WishListData>;
}

const standardCoin = {
  id: 1,
  name: 'Bitcoin',
  code: 'BTC',
  rank: 1,
  image: 'https://cdn.coinranking.com/bOabBYkcX/bitcoin_btc.svg?size=30x30',
  price: '$19,431.33',
  marketCap: '$370.77 billion',
  h24: '-3.43%',
};

let fakeUserService: User;
let fakeWishList: WishList;

beforeEach(async () => {
  const users: Client[] = [];
  const wishLists: WishListData[] = [];
  fakeUserService = {
    find: (uuid: string) => {
      const filteredUsers = users.filter((user) => user.uuid === uuid);
      return Promise.resolve(filteredUsers);
    },
    findUnique: (uuid: string) => {
      return Promise.resolve({
        id: 2,
        uuid,
      } as Client);
    },
    createClient: (uuid: string) => {
      const user = {
        id: Math.floor(Math.random() * 999999),
        uuid,
      } as Client;
      users.push(user);
      return Promise.resolve(user);
    },
    setCookie: (token: string) => {
      return { tokenSignature: `Bearer ${token}` };
    },
  };
  fakeWishList = {
    createWishList: (userId: number) => {
      const wishlist = {
        userId,
        coinId: 2,
        miniumValue: 100,
        maximumValue: 200,
      } as WishListData;
      wishLists.push(wishlist);
      return Promise.resolve(wishlist);
    },
  };
});

describe('Get Price Feed', () => {
  it('if cookie exists of user then return price feed', async () => {
    const response: any = await request(app).get('/api/price-feed');
    expect(response.statusCode).toEqual(200);
  });

  it('if cookie not present set cookie', async () => {
    let cookie = null;
    let user = null;
    let token;
    if (!user) {
      const uuid = 'vxf78lo2';
      const noUser = await fakeUserService.findUnique(uuid);
      if (noUser) {
        user = await fakeUserService.createClient(uuid);
        token = generateToken(user.uuid);
        cookie = fakeUserService.setCookie(token);
      }
      const response: any = await request(app).get('/api/price-feed');
      expect(response.statusCode).toEqual(200);
      expect(user).toBeDefined();
      expect(cookie).toBeDefined();
      expect(cookie).toHaveProperty('tokenSignature');
    }
  });

  it('returns empty wish list if no cookie of user is present in browser', async () => {
    const { data }: any = await request(app).get('/api/watch-list');
    expect(data).toBeUndefined();
    // expect(data.statusCode).toEqual(200);
  });

  it('returns wishlist if cookie of user is present', async () => {
    // const wishlists = await
  });
});
