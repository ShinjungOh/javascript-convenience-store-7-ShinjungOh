import * as fs from "node:fs";
import Product from "./Product.js";
import Quantity from "./Quantity.js";
import Promotion from "./Promotion.js";
import Cart from "./Cart.js";
import OutputView from "../view/OutputView.js";
import InputView from "../view/InputView.js";
import CartItem from "./CartItem.js";
import { MESSAGES } from "../constants/messages.js";

class ConvenienceStore {
  #products;
  #cart;

  constructor() {
    this.#cart = new Cart();
  }

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

    for await (const cartItem of cartItemList) {
      this.#validateIsExistProduct(cartItem.name);
      this.#validateIsOutOfStock(cartItem);

      const currentProduct = this.#products.get(cartItem.name);
      const promotion = currentProduct.promotion;

      // 행사 상품이 아니면 그냥 담기
      if (!promotion || !promotion.isPromotionSeason()) {
        currentProduct.quantity.setDecreaseTotal(cartItem.quantity);
        this.#createCartItem(cartItem.name, cartItem.quantity, 0);
        continue;
      }

      // 행사 상품의 남은 수량 확인하고 계산하기
      const leftQuantity = currentProduct.quantity.promotion;
      const count = Math.floor(cartItem.quantity / promotion.buy);
      const freeQuantity = count * promotion.get;

      // 더 사면 무료로 받을 수 있는지 확인하기
      if (count > 0) {
        const giveaway = (count * promotion.buy + promotion.get) - cartItem.quantity;
        if (giveaway > 0) {
          const applyPromotionAnswer = await InputView.askApplyPromotion(cartItem.name);

          if (applyPromotionAnswer === 'Y') {
            const total = count * promotion.buy + promotion.get;

            // 행사 재고가 충분하면 추가 증정
            if (total <= leftQuantity) {
              currentProduct.quantity.setDecreasePromotion(total);
              this.#createCartItem(cartItem.name, total, promotion.get);
              continue;
            }
          }
        }
      }

      // 행사 상품 재고가 부족할 때
      if (cartItem.quantity > leftQuantity) {
        const normalNeed = cartItem.quantity - leftQuantity;
        const applyNormalPriceAnswer = await InputView.askCanNotApplyPromotion(cartItem.name, normalNeed);

        // 일반 재고로 구매할지 선택
        if (applyNormalPriceAnswer === 'Y') {
          const count = Math.floor(leftQuantity / promotion.buy);
          const free = count * promotion.get;

          // 행사 재고와 일반 재고 모두 사용
          currentProduct.quantity.setDecreasePromotion(leftQuantity);
          currentProduct.quantity.setDecreaseTotal(normalNeed);

          this.#createCartItem(
            cartItem.name,
            cartItem.quantity + free,
            free
          );
        } else {
          // 행사 재고만큼만 구매하기
          const count = Math.floor(leftQuantity / promotion.buy);
          const base = count * promotion.buy;
          const free = count * promotion.get;

          currentProduct.quantity.setDecreasePromotion(base);
          this.#createCartItem(cartItem.name, base + free, free);
        }
        continue;
      }

      // 행사 재고가 충분할 때 정상적으로 처리
      currentProduct.quantity.setDecreasePromotion(cartItem.quantity);
      this.#createCartItem(
        cartItem.name,
        cartItem.quantity + freeQuantity,
        freeQuantity
      );
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
