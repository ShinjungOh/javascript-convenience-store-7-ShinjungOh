class Order {
  #list;

  constructor() {
    this.#list = [];
  }

  get list() {
    return this.#list;
  }

  add(cart) {
    this.#list.push(cart);
  }
}

export default Order;
