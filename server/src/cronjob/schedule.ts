import * as schedule from 'node-schedule';
import prisma from '../db/prisma';
import ScrapData from '../scrapper';

class Job {
  constructor() {}

  public coinRefresh() {
    let rule = new schedule.RecurrenceRule();
    rule.minute = rule.minute = new schedule.Range(0, 59, 1);
    schedule.scheduleJob(rule, async function () {
      const latestData = await new ScrapData().getPriceFeed();
      // console.log(latestData);
      for (let item of latestData) {
        let name: string = item.allCoins.name;
        let code: string = item.allCoins.code;
        let image: string = item.allCoins.image;
        let rank: number = item.allCoins.rank;
        let price: string = item.price;
        let marketCap: string = item.marketCap;
        let h24: string = item['24h'];

        if (code !== '') {
          await prisma.coin.upsert({
            where: {
              code,
            },
            update: {
              price,
              marketCap,
              rank,
              h24,
            },
            create: {
              name,
              code,
              rank,
              image,
              price,
              marketCap,
              h24,
            },
          });
        }
      }
    });
  }
}

export default new Job();
