class Receipt {
  #products;
  #order;

  constructor(products, order) {
    this.#products = products;
    this.#order = order;
  }
}

export default Receipt;
