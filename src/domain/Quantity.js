class Quantity {
  #total;
  #promotion;

  constructor({ total, promotion }) {
    this.#total = total;
    this.#promotion = promotion;
  }

  get total() {
    return this.#total;
  }

  get promotion() {
    return this.#promotion;
  }

  getQuantity() {
    return {
      total: this.#total,
      promotion: this.#promotion,
    }
  }

  setIncreaseTotal(quantity) {
    this.#total = this.#total + quantity;
  }

  setDecreaseTotal(quantity) {
    this.#total = this.#total - quantity;
  }

  setIncreasePromotion(quantity) {
    this.#total = this.#total + quantity;
    this.#promotion = this.#promotion + quantity;
  }

  setDecreasePromotion(quantity) {
    this.#total = this.#total - quantity;
    this.#promotion = this.#promotion - quantity;
  }
}

export default Quantity;
