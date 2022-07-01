import * as schedule from 'node-schedule';
import prisma from '../db/prisma';
import ScrapData from '../scrapper';
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
    //Schedule every minute
    rule.minute = rule.minute = new schedule.Range(0, 59, 1);
    schedule.scheduleJob(rule, async function () {
      const { data }: any = await axios.get(
        'http://localhost:5050/api/price-feed'
      );
      io.emit('priceChange', { results: data.result });
    });
  }

  public notify() {
    let io = getIO();

    let rule = new schedule.RecurrenceRule();

    //Schedule every 5 minute
    rule.minute = rule.minute = new schedule.Range(0, 59, 5);
    schedule.scheduleJob(rule, async function () {
      try {
        const { data }: any = await axios.get(
          'http://localhost:5050/api/price-feed'
        );

        //Get connected sockets from table
        const sockets = await prisma.socket.findMany();

        //Loop through sockets
        for (let item of sockets) {
          //get client watchlist
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

          //if watchlist exists
          if (wish.length) {
            //Notify user when the coin price goes below specified minimum or above specified maximum price
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

            //Emit notification to client listening on notification namespace
            io.of('/notification').to(item.socketId).emit('notification', {
              data: filtered,
            });
          }
        }
      } catch (err) {
        console.log(err);
      }
    });
  }
}

export default new Job();
