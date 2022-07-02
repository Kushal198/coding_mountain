export type Client = {
  id: number;
  uuid: string;
};

export interface Coin {
  id: number;
  name: string;
  image: string;
  code: string;
  price: string;
  marketCap: string;
  h24: string;
  rank: number;
}

export type WishList = {
  code: string;
  minimumPrice: string;
  maximumPrice: string;
};

export type ScrappedData = {
  allCoins: {
    image: string;
    code: string;
    name: string;
    rank: number;
  };
  price: string;
  marketCap: string;
  '24h': string;
};
