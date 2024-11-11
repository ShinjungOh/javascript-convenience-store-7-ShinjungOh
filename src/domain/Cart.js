class Cart {
  #cart;

  constructor() {
    this.#cart = new Map();
  }

  getCart() {
    return this.#cart;
  }

  print() {
    this.#cart.forEach((cartIem) => {
      console.log(cartIem.getCartItem());
    });
  }
}

export default Cart;
