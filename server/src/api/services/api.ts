import { Coin, Client } from '../types/type';
import { PrismaClient } from '.prisma/client';

export class ApiService {
  private database: PrismaClient;
  constructor() {
    this.database = new PrismaClient();
  }

  createClient(uuid: string) {
    if (!uuid) {
      return null;
    }
    return this.database.client.create({ data: { uuid } });
  }

  createCoin(
    name: string,
    image: string,
    h24: string,
    price: string,
    rank: number,
    code: string,
    marketCap: string
  ) {
    return this.database.coin.create({
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

  updateCoin(
    code: string,
    price: string,
    marketCap: string,
    h24: string,
    rank: number
  ) {
    if (code) {
      return this.database.coin.update({
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
    }
  }

  findUniqueCoin(code: string) {
    if (!code) {
      return null;
    }
    return this.database.coin.findUnique({
      where: {
        code,
      },
    });
  }

  findUniqueCoinId(id: number) {
    if (!id) {
      return null;
    }
    return this.database.coin.findUnique({
      where: {
        id,
      },
    });
  }

  deleteWishList(user: Client, coin: Coin) {
    return this.database.wishlist.delete({
      where: {
        coinId_userId: {
          coinId: coin.id,
          userId: user.id,
        },
      },
    });
  }
  findUniqueClient(uuid: string) {
    if (!uuid) {
      return null;
    }
    return this.database.client.findUnique({
      where: {
        uuid,
      },
    });
  }

  createWatchList(
    minVal: number,
    maxVal: number,
    coin: Coin | null,
    user: Client | null
  ) {
    return this.database.wishlist.create({
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
  }

  clientWatchList(user: Client | null) {
    return this.database.wishlist.findMany({
      where: {
        user: {
          uuid: user?.uuid,
        },
      },
      include: {
        user: true,
        coin: true,
      },
    });
  }

  findAllCoins() {
    return this.database.coin.findMany({
      orderBy: {
        rank: 'asc',
      },
    });
  }
}
