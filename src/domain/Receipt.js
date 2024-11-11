class Receipt {
  static makeReceiptData(products, order) {
    const orderList = Receipt.#makeReceipt(products, order.list);
    return Receipt.#combineOrders(orderList);
  }

  static #makeReceipt(products, orderList) {
    return orderList.map(order => {
      const details = Receipt.#makeOrderDetails(order, products);
      const withMembership = Receipt.#addMembershipDiscount(order, details);
      return Receipt.#calculateFinalAmount(withMembership);
    });
  }

  static #makeOrderDetails(order, products) {
    const details = Receipt.#getInitialData();
    const items = Receipt.#makeItems(order.cart, products);

    return {
      ...details,
      ...items
    };
  }

  static #makeItems(cart, products) {
    const result = {
      items: [],
      giveawayItems: [],
      totalAmount: 0,
      promotionDiscount: 0
    };

    for (const [name, cartItem] of cart) {
      const product = products.get(name);
      const normalItem = Receipt.#makeNormalItem(name, cartItem, product);
      const freeItem = Receipt.#makeFreeItem(name, cartItem, product);

      result.items.push(normalItem);
      result.totalAmount += normalItem.price;

      if (freeItem) {
        result.giveawayItems.push(freeItem);
        result.promotionDiscount += freeItem.quantity * product.price;
      }
    }

    return result;
  }

  static #makeNormalItem(name, cartItem, product) {
    const total = cartItem.quantity.total;
    return {
      name,
      quantity: total,
      price: total * product.price
    };
  }

  static #makeFreeItem(name, cartItem, product) {
    const free = cartItem.quantity.promotion;
    return free > 0 ? { name, quantity: free } : null;
  }

  static #addMembershipDiscount(order, details) {
    if (!order.cart.isMembership) {
      return { ...details, membershipDiscount: 0 };
    }

    const price = details.totalAmount - details.promotionDiscount;
    return {
      ...details,
      membershipDiscount: Membership.calculateDiscount(price)
    };
  }

  static #calculateFinalAmount(details) {
    return {
      ...details,
      finalAmount: details.totalAmount - details.promotionDiscount - details.membershipDiscount
    };
  }

  static #getInitialData() {
    return {
      items: [],
      giveawayItems: [],
      totalAmount: 0,
      promotionDiscount: 0,
      membershipDiscount: 0,
      finalAmount: 0
    };
  }

  static #combineOrders(orders) {
    return orders.reduce((total, current) => ({
      items: [...total.items, ...current.items],
      giveawayItems: [...total.giveawayItems, ...current.giveawayItems],
      totalAmount: total.totalAmount + current.totalAmount,
      promotionDiscount: total.promotionDiscount + current.promotionDiscount,
      membershipDiscount: total.membershipDiscount + current.membershipDiscount,
      finalAmount: total.finalAmount + current.finalAmount
    }), Receipt.#getInitialData());
  }
}

export default Receipt;
