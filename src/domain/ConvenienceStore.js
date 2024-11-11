import { MissionUtils } from "@woowacourse/mission-utils";
import * as fs from "node:fs";
import Product from "./Product.js";
import Promotion from "./Promotion.js";
import Quantity from "./Quantity.js";
import Cart from "./Cart.js";
import CartItem from "./CartItem.js";
import Order from "./Order.js";
import Receipt from "./Receipt.js";
import InputView from "../view/InputView.js";
import OutputView from "../view/OutputView.js";
import { MESSAGES } from "../constants/messages.js";

class ConvenienceStore {
  #products;
  #cart;
  #order;

  constructor() {
    this.#cart = new Cart();
    this.#order = new Order();
    this.#products = null;
  }

  async buy() {
    if (!this.#products) {
      this.getPromotionList();
      this.#products = this.getProductList();
    }
    await this.#startShopping();
  }

  printMenu() {
    OutputView.printWelcomeGreeting();
    OutputView.printProducts(this.#products);
    OutputView.printNewLine();
  }

  async #startShopping() {
    this.printMenu();
    await this.#addCart();
    await this.#applyMembership();
    this.#order.add(this.#cart);
    this.#printReceipt();

    const continueShoppingAnswer = await InputView.askContinueShopping();
    if (continueShoppingAnswer === 'Y') {
      this.#cart.clear();
      return this.#startShopping();
    }
  }

  #printReceipt() {
    const receiptData = Receipt.makeReceiptData(this.#products, this.#order);
    OutputView.printReceipt(receiptData);
  }

  async #applyMembership() {
    const applyMembershipAnswer = await InputView.applyMembership();
    if (applyMembershipAnswer === 'Y') {
      this.#cart.applyMembership();
    }
  }

  async #addCart() {
    try {
      const cartItemList = await InputView.readLineAddCartItemList();

      for await (const cartItem of cartItemList) {
        this.#validateIsExistProduct(cartItem.name);
        this.#validateIsOutOfStock(cartItem);

        const currentProduct = this.#products.get(cartItem.name);
        const promotion = currentProduct.promotion;

        if (!promotion || !promotion.isPromotionSeason()) {
          currentProduct.quantity.setDecreaseTotal(cartItem.quantity);
          this.#createCartItem(cartItem.name, cartItem.quantity, 0);
          continue;
        }

        const leftQuantity = currentProduct.quantity.promotion;
        const count = Math.floor(cartItem.quantity / promotion.buy);
        const freeQuantity = count * promotion.get;

        if (count > 0) {
          const giveaway = (count * promotion.buy + promotion.get) - cartItem.quantity;
          if (giveaway > 0) {
            const applyPromotionAnswer = await InputView.askApplyPromotion(cartItem.name);

            if (applyPromotionAnswer === 'Y') {
              const total = count * promotion.buy + promotion.get;

              if (total <= leftQuantity) {
                currentProduct.quantity.setDecreasePromotion(total);
                this.#createCartItem(cartItem.name, total, promotion.get);
                continue;
              }
            }
          }
        }

        if (cartItem.quantity > leftQuantity) {
          const normalNeed = cartItem.quantity - leftQuantity;
          const applyNormalPriceAnswer = await InputView.askCanNotApplyPromotion(cartItem.name, normalNeed);

          if (applyNormalPriceAnswer === 'Y') {
            const count = Math.floor(leftQuantity / promotion.buy);
            const free = count * promotion.get;

            currentProduct.quantity.setDecreasePromotion(leftQuantity);
            currentProduct.quantity.setDecreaseTotal(normalNeed);

            this.#createCartItem(
              cartItem.name,
              cartItem.quantity + free,
              free
            );
          } else {
            const count = Math.floor(leftQuantity / promotion.buy);
            const base = count * promotion.buy;
            const free = count * promotion.get;

            currentProduct.quantity.setDecreasePromotion(base);
            this.#createCartItem(cartItem.name, base + free, free);
          }
          continue;
        }

        currentProduct.quantity.setDecreasePromotion(cartItem.quantity);
        this.#createCartItem(
          cartItem.name,
          cartItem.quantity + freeQuantity,
          freeQuantity
        );
      }
    } catch (e) {
      MissionUtils.Console.print(e.message);
      await this.#addCart();
    }
  }

  #createCartItem(name, total, promotion) {
    const quantity = new Quantity({
      total,
      promotion,
    });

    this.#cart.setItem(
      name,
      new CartItem({
        name,
        quantity,
      })
    );
  }

  #validateIsExistProduct(item) {
    const isExistProduct = this.#products.has(item);

    if (!isExistProduct) {
      throw new Error(MESSAGES.error.notExistProduct);
    }
  }

  #validateIsOutOfStock(item) {
    const product = this.#products.get(item.name);
    const availableQuantity = product.quantity.total;

    if (item.quantity > availableQuantity) {
      throw new Error(MESSAGES.error.outOfStock);
    }
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
      MissionUtils.Console.print(e);
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
      MissionUtils.Console.print(e);
      return new Map();
    }
  }
}

export default ConvenienceStore;
