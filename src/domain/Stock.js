class Stock {
  #name;
  #quantity;

  constructor(stock) {
    this.#name = stock.name;
    this.#quantity = stock.quantity;
  }

  getStock() {
    return {
      name: this.#name,
      quantity: this.#quantity,
    }
  }
}

export default Stock;
