import Stock from "./Stock.js";
import { MESSAGES } from "../constants/messages.js";

class Cart {
  #cart;

  constructor(cart) {
    this.#validate(cart);
    this.#cart = cart;
  }

  getCart() {
    return this.#cart;
  }

  addCartProduct() {
    const product = this.#cart.split(',');
    const splitProduct = product.map((element) => element.replace('[', '').replace(']', '').replace('-', ','));

    splitProduct.forEach((product) => {
      const [name, quantity] = product.split(',');
      const stock = new Stock({
        name: name.trim(),
        quantity: parseInt(quantity, 10),
      });
    });
  }

  #validate(cart) {
    this.#validateForm(cart);
  }

  #validateForm(cart) {
    const product = cart.split(',');

    product.forEach((item) => {
      this.#validateProductForm(item);
      this.#validateIsCountTypeNumber(item);
    });
  }

  #validateProductForm(item) {
    const isFirstStringSquareBrackets = item.startsWith('[');
    const isLastStringSquareBrackets = item.endsWith(']');
    const formError = !(isFirstStringSquareBrackets) || !(isLastStringSquareBrackets);
    if (formError) {
      throw new Error(MESSAGES.error.productAndCountForm);
    }
  }

  #validateIsCountTypeNumber(item) {
    const dashIndex = item.indexOf('-');
    const countTypeNumber = parseInt((item[dashIndex + 1]), 10);
    if (!countTypeNumber) {
      throw new Error(MESSAGES.error.productAndCountForm);
    }
  }
}

export default Cart;
