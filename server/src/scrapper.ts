import axios, { AxiosResponse } from 'axios';
import cheerio from 'cheerio';

export default class ScrapData {
  constructor() {}

  public async getPriceFeed() {
    try {
      const coinArray: any = [];
      const siteUrl: string = 'https://coinranking.com/';
      const { data }: AxiosResponse = await axios({
        method: 'GET',
        url: siteUrl,
      });

      const $: any = cheerio.load(data);

      const keys = ['allCoins', 'price', 'marketCap', '24h'];

      const elemSelector = '#__layout > div > section > table > tbody > tr';

      $(elemSelector).each((parentIdx: number, parentElem: HTMLElement) => {
        let keyIdx = 0;

        let coinObj: any = {};

        if (parentIdx <= 50) {
          $(parentElem)
            .children()
            .each((childrenIdx: number, childrenElem: HTMLElement) => {
              let tdValue = $(childrenElem).text().replace(/\s\s+/g, '');

              if (tdValue) {
                if (keyIdx === 0) {
                  const image = $(
                    'div>span.profile__logo-background',
                    $(childrenElem).html()
                  )
                    .find('img')
                    .attr('src');

                  const rank = $(
                    'div>span.profile__rank',
                    $(childrenElem).html()
                  )
                    .text()
                    .trim();

                  const name = $(
                    'div>span.profile__name>a.profile__link',
                    $(childrenElem).html()
                  )
                    .text()
                    .trim();

                  const code = $(
                    'div>span.profile__name>span.profile__subtitle',
                    $(childrenElem).html()
                  )
                    .text()
                    .trim();

                  tdValue = {
                    image,
                    code,
                    name,
                    rank: parseInt(rank),
                  };
                }
                if (keyIdx === 1) {
                  tdValue = $('div:first-child', $(childrenElem).html())
                    .text()
                    .replace(/\s\s+/g, '');
                }
                coinObj[keys[keyIdx]] = tdValue;
                keyIdx++;
              }
            });

          coinArray.push(coinObj);
        }
      });
      return coinArray;
    } catch (err) {
      console.log(err);
    }
  }
}
