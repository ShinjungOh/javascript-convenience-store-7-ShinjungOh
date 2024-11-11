import Quantity from '../src/domain/Quantity';

describe('Quantity 클래스 테스트', () => {
  let quantity;

  beforeEach(() => {
    quantity = new Quantity({ total: 10, promotion: 5 });
  });

  test('총 수량 및 프로모션 수량을 반환한다.', () => {
    expect(quantity.total).toBe(10);
    expect(quantity.promotion).toBe(5);
  });

  test('총 수량을 증가시킨다.', () => {
    quantity.setIncreaseTotal(3);
    expect(quantity.total).toBe(13);
  });

  test('총 수량을 감소시킨다.', () => {
    quantity.setDecreaseTotal(1);
    expect(quantity.total).toBe(9);
  });

  test('프로모션 수량을 증가시킨다.', () => {
    quantity.setIncreasePromotion(2);
    expect(quantity.promotion).toBe(7);
  });

  test('프로모션 수량을 감소시킨다.', () => {
    quantity.setDecreasePromotion(4);
    expect(quantity.promotion).toBe(1);
  });
});
