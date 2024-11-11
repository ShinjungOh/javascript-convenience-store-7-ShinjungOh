import { MissionUtils } from "@woowacourse/mission-utils";
import { MESSAGES } from "../constants/messages.js";
import CartItem from "../domain/CartItem.js";

class InputView {
  static async readItem(message) {
    return await MissionUtils.Console.readLineAsync(message);
  }

  static async readLineAddCartItemList() {
    const input = await this.readItem(MESSAGES.input.askProductAndCount);

    this.#validateCart(input);

    const splitInput = input.split(',');
    const cartItemList = new Map();
    splitInput.forEach((cartItemString) => {
      const [name, quantity] = cartItemString.replace('[', '').replace(']', '').split('-');
      const cartItem  = new CartItem({
        name: name.trim(),
        quantity: parseInt(quantity, 10),
      });
      cartItemList.set(name, cartItem);
    });

    return cartItemList;
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
