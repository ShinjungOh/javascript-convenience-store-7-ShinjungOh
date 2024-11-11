class Cart {
  #cart;

  constructor() {
    this.#cart = new Map();
  }

  getCart() {
    return this.#cart;
  }

  setItem(name, cartItem) {
    this.#cart.set(name, cartItem);
  }

  print() {
    this.#cart.forEach((cartIem) => {
      console.log(cartIem.getCartItem());
    });
  }
}

export default Cart;
