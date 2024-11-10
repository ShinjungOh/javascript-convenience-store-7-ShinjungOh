import Cart from "../src/domain/Cart.js";

describe("카트 클래스 테스트", () => {
  test("정상적인 형식으로 입력할 경우, 카트에 제대로 담긴다.", () => {
    expect(() => {
      new Cart('[콜라-10],[사이다-3]');
    }).not.toThrow();
  });

  test("형식이 맞지 않는 경우 예외 처리 - 대괄호가 없는 경우", () => {
    expect(() => {
      new Cart('콜라-10],[사이다-3');
    }).toThrow("[ERROR]");
  });

  test("형식이 맞지 않는 경우 - 수량의 형식이 숫자가 아닌 경우", () => {
    expect(() => {
      new Cart('[콜라-ㅇ]');
    }).toThrow("[ERROR]");
  });

  test("형식이 맞지 않는 경우 - 수량의 형식이 올바르지 않은 경우", () => {
    expect(() => {
      new Cart('[콜라-"1"]');
    }).toThrow("[ERROR]");
  });

  test("형식이 맞지 않는 경우 - 수량이 0인 경우", () => {
    expect(() => {
      new Cart('[콜라-0]');
    }).toThrow("[ERROR]");
  });
});
