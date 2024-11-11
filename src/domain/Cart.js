class Cart {
  #cart;
  #isMembership;

  constructor() {
    this.#cart = new Map();
    this.#isMembership = false;
  }

  get cart() {
    return this.#cart;
  }

  get isMembership() {
    return this.#isMembership;
  }

  setItem(name, cartItem) {
    this.#cart.set(name, cartItem);
  }

  applyMembership() {
    this.#isMembership = true;
  }

  clear() {
    this.#cart.clear();
    this.#isMembership = false;
  }

  print() {
    this.#cart.forEach((cartIem) => {
      console.log(cartIem.getCartItem());
    });
  }
}

export default Cart;
