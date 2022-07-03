import apiService from '../services/api';

export const createOrUpdateCoin = async (latestData: any[]) => {
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
        const findCoin = await apiService.findUniqueCoin(code);
        if (findCoin) {
          const up = await apiService.updateCoin(
            code,
            price,
            marketCap,
            h24,
            rank
          );
        } else {
          const cp = await apiService.createCoin(
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
};
