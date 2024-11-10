import CartItem from "./CartItem.js";

class Cart {
  #cart = new Map();

  getCart() {
    return this.#cart;
  }

  addCart(cart) {
    cart.forEach((product) => {
      const [name, quantity] = product.split(',');
      const cartItem = new CartItem({
        name: name.trim(),
        quantity: parseInt(quantity, 10),
      });
      this.#cart.set(name, cartItem);
    });
  }
}

export default Cart;
