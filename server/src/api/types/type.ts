export type Client = {
  id: number;
  uuid: string;
};

export interface Coin {
  id: number;
  name: String;
  image: String;
  code: String;
  price: String;
  marketCap: String;
  h24: String;
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
