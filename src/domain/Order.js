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

  calculateTotal() {
    // TODO 주문 정보 계산
  }
}

export default Order;
