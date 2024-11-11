class Membership {
  static #DISCOUNT_RATE = 0.3;

  static #MAX_DISCOUNT_PRICE = 8_000;

  static calculateDiscount(price) {
    if (price === 0) {
      return 0;
    }

    const membershipDiscount = Math.floor(price * Membership.#DISCOUNT_RATE);
    return Math.min(membershipDiscount, Membership.#MAX_DISCOUNT_PRICE);
  }
}

export default Membership;
