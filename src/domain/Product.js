class Product {
  #name
  #price
  #quantity
  #promotion

  constructor(product) {
    this.#name = product.name;
    this.#price = product.price || 0;
    this.#quantity = product.quantity || 0;
    this.#promotion = product.promotion || null;
  }

  getProduct () {
    return {
      name: this.#name,
      price: this.#price,
      quantity: this.#quantity,
      promotion: this.#promotion,
    }
  }

  printProducts () {
    console.log({
      name: this.#name,
      price: this.#price,
      quantity: this.#quantity,
      promotion: this.#promotion,
    })
  }
}

export default Product;
