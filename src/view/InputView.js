import { MissionUtils } from "@woowacourse/mission-utils";
import { MESSAGES } from "../constants/messages.js";

class InputView {
  static async readItem(message) {
    return await MissionUtils.Console.readLineAsync(message);
  }

  static async readLineAddCartItemList() {
    const input = await this.readItem(MESSAGES.input.askProductAndCount);
    this.#validateCart(input);
    return input.split(',')
      .map((cartItemString) => {
        const [name, quantity] = cartItemString.replace('[', '').replace(']', '').split('-');
        return { name, quantity: parseInt(quantity, 10) };
      });
  }

  static async askApplyPromotion(productName) {
    const input = await MissionUtils.Console.readLineAsync(`현재 ${productName}은(는) 1개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)\n`);

    this.#validateYesOrNo(input);

    return input;
  }

  static async askCanNotApplyPromotion(productName, quantity) {
    const input = await MissionUtils.Console.readLineAsync(`현재 ${productName} ${quantity}개는 프로모션 할인이 적용되지 않습니다. 그래도 구매하시겠습니까? (Y/N)\n`);

    this.#validateYesOrNo(input);

    return input;
  }

  static async applyMembership() {
    const input = await this.readItem(MESSAGES.input.askApplyMembership);

    this.#validateYesOrNo(input);

    return input;
  }

  static async askContinueShopping() {
    const input = await InputView.readItem(MESSAGES.input.askContinueShopping);

    this.#validateYesOrNo(input);

    return input;
  }

  static #validateCart(cart) {
    this.#validateCartForm(cart);
  }

  static #validateCartForm(cart) {
    const product = cart.split(',');

    product.forEach((item) => {
      this.#validateCartProductForm(item);
      this.#validateIsCountTypeNumber(item);
    });
  }

  static #validateCartProductForm(item) {
    const isFirstStringSquareBrackets = item.startsWith('[');
    const isLastStringSquareBrackets = item.endsWith(']');
    const formError = !(isFirstStringSquareBrackets) || !(isLastStringSquareBrackets);
    if (formError) {
      throw new Error(MESSAGES.error.productAndCountForm);
    }
  }

  static #validateIsCountTypeNumber(item) {
    const dashIndex = item.indexOf('-');
    const countTypeNumber = parseInt((item[dashIndex + 1]), 10);
    if (!countTypeNumber) {
      throw new Error(MESSAGES.error.productAndCountForm);
    }
  }

  static #validateYesOrNo(membership) {
    this.#validateYesOtNoForm(membership);
  }

  static #validateYesOtNoForm(string) {
    if (string !== 'Y' && string !== 'N') {
      throw new Error(MESSAGES.error.invalidInput);
    }
  }
}

export default InputView;
