import * as fs from "node:fs";
import Product from "./Product.js";
import Quantity from "./Quantity.js";
import Promotion from "./Promotion.js";
import Cart from "./Cart.js";
import OutputView from "../view/OutputView.js";
import InputView from "../view/InputView.js";

class ConvenienceStore {
  #products;
  #cart;

  async buy() {
    this.getPromotionList();
    this.#products = this.getProductList();
    this.printMenu();
    await this.#addCart();
    this.#cart.print();
  }

  printMenu() {
    OutputView.printWelcomeGreeting();
    OutputView.printProducts(this.#products);
    OutputView.printNewLine();
  }

  async #addCart() {
    const cartItemList = await InputView.readLineAddCartItemList();
    this.#cart = new Cart();
    this.#cart.initial(cartItemList);

    // TODO 재고 확인
  }

  getPromotionList() {
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
      return new Map();
    }
  }

  getProductList() {
    try {
      const data = fs.readFileSync('public/products.md', "utf-8");
      const [_, ...productBody] = data.trim().split('\n');
      const productMap = new Map();
      const promotionList = this.getPromotionList();

      productBody.forEach((element) => {
        const body = element.split(',');
        const [name, price, quantity, promotion] = body;
        const hasProduct = productMap.has(name);

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

        if (hasProduct && promotion !== 'null') {
          const product = productMap.get(name);
          product.setPromotion(promotion);
          product.quantity.setIncreasePromotion(parseInt(quantity, 10));
        }

        if (hasProduct && promotion === 'null') {
          const product = productMap.get(name);
          product.quantity.setIncreaseTotal(parseInt(quantity, 10));
        }
      });
      return productMap;
    } catch (e) {
      console.log(e);
      return new Map();
    }
  }
}

export default ConvenienceStore;
