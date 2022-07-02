import ScrapData from '../scrapper';

describe('Getting Price feed functionality', () => {
  it('return price feed array', async () => {
    const data = await new ScrapData().getPriceFeed();
    expect(data).toBeDefined();
    expect(data.length).toBeGreaterThan(0);
    expect(data[0]).toMatchObject({
      allCoins: {
        image: expect.any(String),
        code: expect.any(String),
        name: expect.any(String),
        rank: expect.any(Number),
      },
      price: expect.any(String),
      marketCap: expect.any(String),
      '24h': expect.any(String),
    });
  });
});
