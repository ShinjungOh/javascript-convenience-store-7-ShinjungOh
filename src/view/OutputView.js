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
      const totalQuantity = productData.quantity.getQuantity().total;
      const promotionQuantity = productData.quantity.getQuantity().promotion;
      const normalQuantity = totalQuantity - promotionQuantity;
      const productPromotion = productData.promotion ? productData.promotion.getPromotion().name : null;

      // 행사
      if (promotionQuantity > 0) {
        const result = `- ${productName} ${productPrice}원 ${promotionQuantity}개 ${productPromotion}`;
        OutputView.printMenu(result);
      }
      // 일반
      if (normalQuantity > 0) {
        const result = `- ${productName} ${productPrice}원 ${normalQuantity}개`;
        OutputView.printMenu(result);
      }
      // 행사 재고 없음
      if (totalQuantity === 0) {
        const result = `- ${productName} ${productPrice}원 재고 없음 ${productPromotion}`;
        OutputView.printMenu(result);
      }
      // 일반 재고 없음
      if (normalQuantity === 0) {
        const result = `- ${productName} ${productPrice}원 재고 없음`;
        OutputView.printMenu(result);
      }
    });
  }

  static printNewLine() {
    MissionUtils.Console.print('');
  }
}

export default OutputView;
