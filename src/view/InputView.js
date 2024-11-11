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
}

export default InputView;
