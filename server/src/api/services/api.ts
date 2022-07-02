import { Coin, Client } from '../types/type';
import { PrismaClient } from '.prisma/client';

class ApiService {
  private database: PrismaClient;
  constructor() {
    this.database = new PrismaClient();
  }

  createClient(uuid: string): Promise<any> | null {
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
  ): Promise<any> | null {
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
  ): Promise<any> | undefined {
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

  findUniqueCoin(code: string): Promise<any> | null {
    if (!code) {
      return null;
    }
    return this.database.coin.findUnique({
      where: {
        code,
      },
    });
  }

  findUniqueCoinId(id: number): Promise<any> | null {
    if (!id) {
      return null;
    }
    return this.database.coin.findUnique({
      where: {
        id,
      },
    });
  }

  deleteWishList(user: Client, coin: Coin): Promise<any> {
    return this.database.wishlist.delete({
      where: {
        coinId_userId: {
          coinId: coin.id,
          userId: user.id,
        },
      },
    });
  }
  findUniqueClient(uuid: string): Promise<any> | null {
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
  ): Promise<any> | null {
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

  clientWatchList(uuid: string): Promise<any> {
    return this.database.wishlist.findMany({
      where: {
        user: {
          uuid: uuid,
        },
      },
      include: {
        user: true,
        coin: true,
      },
    });
  }

  uniqueCoinClientWatchList(userId: number, coinId: number): Promise<any> {
    return this.database.wishlist.findUnique({
      where: {
        coinId_userId: {
          coinId: coinId,
          userId: userId,
        },
      },
    });
  }

  findAllCoins(): Promise<any[]> {
    return this.database.coin.findMany({
      orderBy: {
        rank: 'asc',
      },
    });
  }
}

export default new ApiService();
