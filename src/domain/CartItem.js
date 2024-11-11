class CartItem {
  #name;
  #quantity; // 총합
  #quantityPromotion; // 증정받는 수량

  constructor(cart) {
    this.#name = cart.name;
    this.#quantity = cart.quantity;
    this.#quantityPromotion = cart.quantityPromotion;
  }

  getCartItem() {
    return {
      name: this.#name,
      quantity: this.#quantity,
      quantityPromotion: this.#quantityPromotion,
    }
  }
}

export default CartItem;
