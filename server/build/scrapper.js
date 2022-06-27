"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = __importDefault(require("cheerio"));
class ScrapData {
    constructor() { }
    getPriceFeed() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const coinArray = [];
                const siteUrl = 'https://coinranking.com/';
                const { data } = yield (0, axios_1.default)({
                    method: 'GET',
                    url: siteUrl,
                });
                const $ = cheerio_1.default.load(data);
                const keys = ['allCoins', 'price', 'marketCap', '24h'];
                const elemSelector = '#__layout > div > section > table > tbody > tr';
                $(elemSelector).each((parentIdx, parentElem) => {
                    let keyIdx = 0;
                    let coinObj = {};
                    if (parentIdx) {
                        $(parentElem)
                            .children()
                            .each((childrenIdx, childrenElem) => {
                            let tdValue = $(childrenElem).text().replace(/\s\s+/g, '');
                            if (tdValue) {
                                if (keyIdx === 0) {
                                    const image = $('div>span.profile__logo-background', $(childrenElem).html())
                                        .find('img')
                                        .attr('src');
                                    const name = $('div>span.profile__name>a.profile__link', $(childrenElem).html())
                                        .text()
                                        .trim();
                                    const code = $('div>span.profile__name>span.profile__subtitle', $(childrenElem).html())
                                        .text()
                                        .trim();
                                    tdValue = {
                                        image,
                                        code,
                                        name,
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
                console.log(coinArray);
                return coinArray;
            }
            catch (err) {
                console.log(err);
            }
        });
    }
}
exports.default = ScrapData;
console.log(new ScrapData().getPriceFeed());
