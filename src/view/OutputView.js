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

  static printReceipt(receiptData) {
    const equalSign = '=';
    const giveaway = equalSign.padEnd(13, '=')
      + '증'.padEnd(7)
      + '정'
      + equalSign.padEnd(15, '=');
    const details = '상품명'.padEnd(18) + '수량'.padEnd(8) + '금액'.padEnd(6);

    MissionUtils.Console.print('==============W 편의점================');
    MissionUtils.Console.print(details);

    receiptData.items.forEach(item => {
      const nameColumn = item.name.length * 2 <= 12
        ? item.name.padEnd(12, ' ')
        : item.name.padEnd(10, ' ');
      const quantityColumn = String(item.quantity).padStart(2, ' ').padEnd(6, ' ');
      const priceColumn = addNumberComma(item.price).padStart(7, ' ');
      MissionUtils.Console.print(`${nameColumn}${quantityColumn}${priceColumn}`);
    });

    if (receiptData.giveawayItems.length > 0) {
      MissionUtils.Console.print(giveaway);
      receiptData.giveawayItems.forEach(item => {
        const nameColumn = item.name.length * 2 <= 12
          ? item.name.padEnd(12, ' ')
          : item.name.padEnd(10, ' ');
        const quantityColumn = String(item.quantity).padStart(2, ' ');
        MissionUtils.Console.print(`${nameColumn}${quantityColumn}`);
      });
    }

    MissionUtils.Console.print(equalSign.padEnd(38, '='));

    const baseNamePadding = 18;
    const amountPadding = 10;

    const totalQuantity = String(receiptData.items[0].quantity).padStart(2, ' ').padEnd(6, ' ');
    const totalAmount = addNumberComma(receiptData.totalAmount).padStart(amountPadding, ' ');
    MissionUtils.Console.print(`${'총구매액'.padEnd(baseNamePadding, ' ')}${totalQuantity}${totalAmount}`);

    const discountAmount = `-${addNumberComma(receiptData.promotionDiscount)}`.padStart(amountPadding, ' ');
    MissionUtils.Console.print(`${'행사할인'.padEnd(baseNamePadding + 4, ' ')}${discountAmount}`);

    const membershipAmount = `-${addNumberComma(receiptData.membershipDiscount)}`.padStart(amountPadding, ' ');
    MissionUtils.Console.print(`${'멤버십할인'.padEnd(baseNamePadding + 4, ' ')}${membershipAmount}`);

    const finalAmount = addNumberComma(receiptData.finalAmount).padStart(amountPadding, ' ');
    MissionUtils.Console.print(`${'내실돈'.padEnd(baseNamePadding + 4, ' ')}${finalAmount}`);
  }

  static printNewLine() {
    MissionUtils.Console.print('');
  }
}

export default OutputView;
