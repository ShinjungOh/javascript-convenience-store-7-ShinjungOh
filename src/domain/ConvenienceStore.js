import * as fs from "node:fs";
import Product from "./Product.js";
import Quantity from "./Quantity.js";
import Promotion from "./Promotion.js";
import OutputView from "../view/OutputView.js";

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
      const [_, ...promotionBody] = data.trim().split('\n');
      const promotionMap = new Map();

      promotionBody.forEach((element) => {
        const body = element.split(',');
        const [name, buy, get, startDate, endDate] = body;
        const promotion = new Promotion({
          name,
          buy: parseInt(buy, 10),
          get: parseInt(get, 10),
          startDate: new Date(startDate),
          endDate: new Date(endDate),
        });
        promotionMap.set(name, promotion);
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
      const [_, ...productBody] = data.trim().split('\n');
      const productMap = new Map();
      const promotionList = await this.getPromotionList();

      productBody.forEach((element) => {
        const body = element.split(',');
        const [name, price, quantity, promotion] = body;
        const hasProduct = productMap.has(name);

        // 처음, 행사
        if (!hasProduct && promotion !== 'null') {
          const product = new Product({
            name,
            price: parseInt(price, 10),
            quantity: new Quantity({
              total: parseInt(quantity, 10),
              promotion: parseInt(quantity, 10),
            }),
            promotion: promotionList.get(promotion),
          });
          productMap.set(name, product);
        }

        // 처음, 널
        if (!hasProduct && promotion === 'null') {
          const product = new Product({
            name,
            price: parseInt(price, 10),
            quantity: new Quantity({
              total: parseInt(quantity, 10),
              promotion: 0,
            }),
            promotion: null,
          });
          productMap.set(name, product);
        }

        // 중복, 행사
        if (hasProduct && promotion !== 'null') {
          const product = productMap.get(name);
          product.setPromotion(promotion);
          product.quantity.setIncreasePromotion(parseInt(quantity, 10));
        }

        // 중복, 널
        if (hasProduct && promotion === 'null') {
          const product = productMap.get(name);
          product.quantity.setIncreaseTotal(parseInt(quantity, 10));
        }
      });
      console.log(productMap.forEach((data) => {
        data.printProducts()
      }));
      console.log(productMap.size)
      return productMap;
    } catch (e) {
      console.log(e);
      return [];
    }
  }
}

export default ConvenienceStore;
