import { MissionUtils } from "@woowacourse/mission-utils";
import { addNumberComma } from "../utils/utils.js";

class OutputView {
  static printWelcomeGreeting() {
    MissionUtils.Console.print("안녕하세요. W편의점입니다.\n현재 보유하고 있는 상품입니다.");
    this.printNewLine();
  }

  static printMenu(product) {
    MissionUtils.Console.print(product);
  }

  static printProducts(products) {
    products.forEach((product) => {
      const productData = product.getProduct();
      const productName = productData.name;
      const productPrice = addNumberComma(productData.price);
      const totalQuantity = productData.quantity.total;
      const promotionQuantity = productData.quantity.promotion;
      const normalQuantity = totalQuantity - promotionQuantity;
      const productPromotion = productData.promotion ? productData.promotion.name : null;

      this.#printProductPromotion(productName, productPrice, promotionQuantity, productPromotion);
      this.#printProductNormal(productName, productPrice, normalQuantity);
      this.#printProductOutOfStock(productName, productPrice, totalQuantity, normalQuantity, productPromotion);
    });
  }

  static #printProductPromotion(productName, productPrice, promotionQuantity, productPromotion) {
    if (promotionQuantity > 0) {
      const result = `- ${productName} ${productPrice}원 ${promotionQuantity}개 ${productPromotion}`;
      this.printMenu(result);
    }
  }

  static #printProductNormal(productName, productPrice, normalQuantity) {
    if (normalQuantity > 0) {
      const result = `- ${productName} ${productPrice}원 ${normalQuantity}개`;
      this.printMenu(result);
    }
  }

  static #printProductOutOfStock(
    productName,
    productPrice,
    totalQuantity,
    normalQuantity,
    productPromotion) {
    if (totalQuantity === 0) {
      const result = `- ${productName} ${productPrice}원 재고 없음 ${productPromotion}`;
      this.printMenu(result);
    }

    if (normalQuantity === 0) {
      const result = `- ${productName} ${productPrice}원 재고 없음`;
      this.printMenu(result);
    }
  }

  static printNewLine() {
    MissionUtils.Console.print('');
  }
}

export default OutputView;
