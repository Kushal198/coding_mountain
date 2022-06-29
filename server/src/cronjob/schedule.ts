import * as schedule from 'node-schedule';
import prisma from '../db/prisma';
import ScrapData from '../scrapper';
import { Coin } from '../controllers/api';

/**
 * @Schedule Job class to fetch price feed every 5 minutes
 */
class Job {
  constructor() {}

  public coinRefresh() {
    let rule = new schedule.RecurrenceRule();
    rule.minute = rule.minute = new schedule.Range(0, 59, 1);
    schedule.scheduleJob(rule, async function () {
      try {
        const latestData = await new ScrapData().getPriceFeed();
        for (let item of latestData) {
          let name: string = item.allCoins.name;
          let code: string = item.allCoins.code;
          let image: string = item.allCoins.image;
          let rank: number = item.allCoins.rank;
          let price: string = item.price;
          let marketCap: string = item.marketCap;
          let h24: string = item['24h'];

          if (code != '') {
            const findCoin = await prisma.coin.findUnique({
              where: {
                code,
              },
            });
            if (findCoin) {
              await prisma.coin.update({
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
            } else {
              await prisma.coin.create({
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
          }
        }
      } catch (err) {
        console.log(err);
      }
    });
  }
}

export default new Job();
