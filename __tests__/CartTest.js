import Cart from "../src/domain/Cart.js";

describe("카트 클래스 테스트", () => {
  test("정상적인 형식으로 입력할 경우, 카트에 제대로 담긴다. - 상품 케이스1", () => {
    expect(() => {
      new Cart('[콜라-10],[사이다-3]');
    }).not.toThrow();
  });

  test("정상적인 형식으로 입력할 경우, 카트에 제대로 담긴다. - 상품 케이스2", () => {
    expect(() => {
      new Cart('[비타민워터-3],[컵라면-5]');
    }).not.toThrow();
  });
});
