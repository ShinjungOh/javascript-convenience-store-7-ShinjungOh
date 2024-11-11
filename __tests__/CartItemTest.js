import CartItem from "../src/domain/CartItem.js";

describe("카트 아이템 클래스 테스트", () => {
  test("카트 아이템 생성 및 조회하기", () => {
    const input = { name: '콜라', quantity: 10 }
    const cartItem = new CartItem(input);

    const result = cartItem.getCartItem();

    expect(result).toEqual({
      name: '콜라',
      quantity: 10,
    })
  });
});
