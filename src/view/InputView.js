import { MissionUtils } from "@woowacourse/mission-utils";

class InputView {
  static async readItem(message) {
    return await MissionUtils.Console.readLineAsync(message);
  }
}

export default InputView;
