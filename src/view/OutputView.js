import { MissionUtils } from "@woowacourse/mission-utils";

class OutputView {
  static printWelcomeGreeting() {
    MissionUtils.Console.print("안녕하세요. W편의점입니다.\n현재 보유하고 있는 상품입니다.");
    this.printNewLine();
  }

  static printProducts() {
    MissionUtils.Console.print("- 콜라 1,000원 10개 탄산2+1");
  }

  static printNewLine() {
    MissionUtils.Console.print('');
  }
}

export default OutputView;
