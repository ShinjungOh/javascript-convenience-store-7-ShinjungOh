class CartItem {
  #name;
  #quantity;

  constructor(cart) {
    this.#name = cart.name;
    this.#quantity = cart.quantity;
  }

  getCartItem() {
    return {
      name: this.#name,
      quantity: this.#quantity,
    }
  }
}

export default CartItem;
