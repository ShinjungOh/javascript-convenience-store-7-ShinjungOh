class CartItem {
  #name;
  #quantity;

  constructor(cartIem) {
    this.#name = cartIem.name;
    this.#quantity = cartIem.quantity;
  }

  get name() {
    return this.#name;
  }

  get quantity() {
    return this.#quantity;
  }

  getCartItem() {
    return {
      name: this.#name,
      quantity: this.#quantity,
    }
  }
}

export default CartItem;
