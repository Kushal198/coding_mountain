import * as schedule from 'node-schedule';
import prisma from '../db/prisma';
import ScrapData from '../scrapper';
import { Coin } from '../controllers/api';
import axios from 'axios';
import { getIO } from '../socket';

/**
 * @Schedule Job class to fetch price feed every 5 minutes
 */
class Job {
  constructor() {}

  public coinRefresh() {
    let io = getIO();
    let rule = new schedule.RecurrenceRule();
    rule.minute = rule.minute = new schedule.Range(0, 59, 1);
    schedule.scheduleJob(rule, async function () {
      try {
        const { data }: any = await axios.get(
          'http://localhost:5050/api/price-feed'
        );

        io.emit('priceChange', { results: data.result });

        const sockets = await prisma.socket.findMany();
        for (let item of sockets) {
          const wish = await prisma.wishlist.findMany({
            where: {
              user: {
                uuid: item.uuid,
              },
            },
            include: {
              user: true,
              coin: true,
            },
          });

          if (wish.length) {
            console.log(item);
            const filtered = wish.filter((ele: any) => {
              return data.result.some((item: any) => {
                return (
                  (ele.coin.code === item.code &&
                    parseFloat(item.price.slice(1).replace(/,/g, '')) >
                      ele.minimumValue) ||
                  (ele.coin.code === item.code &&
                    parseFloat(item.price.slice(1).replace(/,/g, '')) <
                      ele.maximumValue)
                );
              });
            });
            // console.log(filtered);
            io.of('/notification').to(item.socketId).emit('notification', {
              data: filtered,
            });
          }
        }
        // const latestData = await new ScrapData().getPriceFeed();
        // for (let item of latestData) {
        //   let name: string = item.allCoins.name;
        //   let code: string = item.allCoins.code;
        //   let image: string = item.allCoins.image;
        //   let rank: number = item.allCoins.rank;
        //   let price: string = item.price;
        //   let marketCap: string = item.marketCap;
        //   let h24: string = item['24h'];

        //   if (code != '') {
        //     const findCoin = await prisma.coin.findUnique({
        //       where: {
        //         code,
        //       },
        //     });
        //     if (findCoin) {
        //       await prisma.coin.update({
        //         where: {
        //           code,
        //         },
        //         data: {
        //           price,
        //           marketCap,
        //           h24,
        //           rank,
        //         },
        //       });
        //     } else {
        //       await prisma.coin.create({
        //         data: {
        //           name,
        //           image,
        //           h24,
        //           price,
        //           rank,
        //           code,
        //           marketCap,
        //         },
        //       });
        //     }
        //   }
        // }
      } catch (err) {
        console.log(err);
      }
    });
  }
}

export default new Job();
