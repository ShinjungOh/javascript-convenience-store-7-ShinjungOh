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

describe("InputView 클래스 입력값 유효성 테스트", () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  test("형식이 맞지 않는 경우 예외 처리한다. - 대괄호가 없는 경우", async () => {
    mockQuestions(['콜라-10],[사이다-3']);
    try {
      await InputView.addCart();
    } catch (error) {
      expect(error.message).toBe(MESSAGES.error.productAndCountForm);
    }
  });

  test("형식이 맞지 않는 경우 예외 처리한다. - 수량의 형식이 숫자가 아닌 경우", async () => {
    mockQuestions(['[콜라-ㅇ]']);
    try {
      await InputView.addCart();
    } catch (error) {
      expect(error.message).toBe(MESSAGES.error.productAndCountForm);
    }
  });

  test("형식이 맞지 않는 경우 예외 처리한다. - 수량의 형식이 올바르지 않은 경우", async () => {
    mockQuestions(['[콜라-"1"]']);
    try {
      await InputView.addCart();
    } catch (error) {
      expect(error.message).toBe(MESSAGES.error.productAndCountForm);
    }
  });

  test("형식이 맞지 않는 경우 예외 처리한다. - 수량이 0인 경우", async () => {
    mockQuestions(['[콜라-0]']);
    try {
      await InputView.addCart();
    } catch (error) {
      expect(error.message).toBe(MESSAGES.error.productAndCountForm);
    }
  });
});
