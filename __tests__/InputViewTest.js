import { MissionUtils } from "@woowacourse/mission-utils";
import InputView from "../src/view/InputView.js";
import { MESSAGES } from "../src/constants/messages.js";

const mockQuestions = (inputs) => {
  const messages = [];

  MissionUtils.Console.readLineAsync = jest.fn((prompt) => {
    messages.push(prompt);
    const input = inputs.shift();

    if (input === undefined) {
      throw new Error("NO INPUT");
    }

    return Promise.resolve(input);
  });

  MissionUtils.Console.readLineAsync.messages = messages;
};

describe("InputView 클래스 Cart 입력값 유효성 테스트", () => {
  test("올바른 형식으로 입력한 경우", async () => {
    mockQuestions(['[콜라-10],[사이다-3]']);
    await expect(InputView.readLineAddCartItemList()).resolves.not.toThrow();
  });

  test("형식이 맞지 않는 경우 예외 처리한다. - 대괄호가 없는 경우", async () => {
    mockQuestions(['콜라-10],[사이다-3']);
    try {
      await InputView.readLineAddCartItemList();
    } catch (error) {
      expect(error.message).toBe(MESSAGES.error.productAndCountForm);
    }
  });

  test("형식이 맞지 않는 경우 예외 처리한다. - 수량의 형식이 숫자가 아닌 경우", async () => {
    mockQuestions(['[콜라-ㅇ]']);
    try {
      await InputView.readLineAddCartItemList();
    } catch (error) {
      expect(error.message).toBe(MESSAGES.error.productAndCountForm);
    }
  });

  test("형식이 맞지 않는 경우 예외 처리한다. - 수량의 형식이 올바르지 않은 경우", async () => {
    mockQuestions(['[콜라-"1"]']);
    try {
      await InputView.readLineAddCartItemList();
    } catch (error) {
      expect(error.message).toBe(MESSAGES.error.productAndCountForm);
    }
  });

  test("형식이 맞지 않는 경우 예외 처리한다. - 수량이 0인 경우", async () => {
    mockQuestions(['[콜라-0]']);
    try {
      await InputView.readLineAddCartItemList();
    } catch (error) {
      expect(error.message).toBe(MESSAGES.error.productAndCountForm);
    }
  });
});

describe("InputView 클래스 Y/N 입력값 유효성 테스트", () => {
  test("Y로 답변하기 - 멤버십을 적용하는 경우", async () => {
    mockQuestions(['Y']);
    await expect(InputView.applyMembership()).resolves.not.toThrow();
  });

  test("N으로 답변하기 - 멤버십을 적용하지 않는 경우", async () => {
    mockQuestions(['N']);
    await expect(InputView.applyMembership()).resolves.not.toThrow();
  });

  test("형식이 맞지 않는 경우 예외 처리한다. - Y 또는 N가 아닌 경우", async () => {
    mockQuestions(['abc']);
    try {
      await InputView.applyMembership();
    } catch (error) {
      expect(error.message).toBe(MESSAGES.error.invalidInput);
    }
  });
});
