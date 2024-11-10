class Promotion {
  #name
  #buy
  #get
  #startDate
  #endDate

  constructor(promotion) {
    this.#name = promotion.name;
    this.#buy = promotion.buy;
    this.#get = promotion.get;
    this.#startDate = promotion.startDate;
    this.#endDate = promotion.endDate;
  }

  getPromotion() {
    return {
      name: this.#name,
      buy: this.#buy,
      get: this.#get,
      startDate: this.#startDate,
      endDate: this.#endDate,
    }
  }
}

export default Promotion;
