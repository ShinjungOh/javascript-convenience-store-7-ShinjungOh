import * as fs from "node:fs";
import Promotion from "./Promotion.js";

class ConvenienceStore {
  #products;

  async buy() {
    await this.getPromotionList();
  }

  async getPromotionList() {
    try {
      const data = fs.readFileSync('public/promotions.md', "utf-8");
      const [promotionHeader, ...promotionBody] = data.trim().split('\n');
      const promotionMap = new Map();

      promotionBody.forEach((element) => {
        const body = element.split(',');
        const key = body[0];
        const promotion = new Promotion({
          name: body[1],
          buy: parseInt(body[2], 10),
          get: parseInt(body[3], 10),
          startDate: new Date(body[4]),
          endDate:  new Date(body[5]),
        });
        promotionMap.set(key, promotion);
      });
    return promotionMap;
    } catch (e) {
      console.log(e);
      return [];
    }
  }
}

export default ConvenienceStore;
