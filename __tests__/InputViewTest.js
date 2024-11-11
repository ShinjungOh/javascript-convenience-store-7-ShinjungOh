import { MissionUtils } from "@woowacourse/mission-utils";
import InputView from "../src/view/InputView.js";

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
    await expect(InputView.readLineAddCartItemList()).resolves.toBeDefined();
  });
});

describe("InputView 클래스 Y/N 입력값 유효성 테스트", () => {
  test("Y로 답변하기 - 멤버십을 적용하는 경우", async () => {
    mockQuestions(['Y']);
    await expect(InputView.applyMembership()).resolves.toBe('Y');
  });

  test("N으로 답변하기 - 멤버십을 적용하지 않는 경우", async () => {
    mockQuestions(['N']);
    await expect(InputView.applyMembership()).resolves.toBe('N');
  });
});
