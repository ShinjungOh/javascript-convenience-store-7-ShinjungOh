import * as fs from "node:fs";
import Promotion from "./Promotion.js";
import OutputView from "../view/OutputView.js";
import Product from "./Product.js";

class ConvenienceStore {
  #products;

  async buy() {
    await this.getPromotionList();
    await this.getProductList();
    this.printMenu();
  }

  printMenu() {
    OutputView.printWelcomeGreeting();

    // TODO 상품 목록 출력 - 상품명, 가격, 프로모션 이름, 재고

    OutputView.printProducts();
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
          endDate: new Date(body[5]),
        });
        promotionMap.set(key, promotion);
      });
      return promotionMap;
    } catch (e) {
      console.log(e);
      return [];
    }
  }

  async getProductList() {
    try {
      const data = fs.readFileSync('public/products.md', "utf-8");
      const [productHeader, ...productBody] = data.trim().split('\n');
      const productMap = new Map();
      const promotionList = this.getPromotionList();
      // console.log(promotionList)

      productBody.forEach((element) => {
        const body = element.split(',');
        const key = body[0]
        const product = new Product({
          name: body[1],
          price: parseInt(body[2], 10),
          quantity: body[3],
          promotion: body[4],
        });
        productMap.set(key, product);
      });
      console.log(productMap)
      return productMap;
    } catch (e) {
      console.log(e);
      return [];
    }
  }
}

export default ConvenienceStore;
