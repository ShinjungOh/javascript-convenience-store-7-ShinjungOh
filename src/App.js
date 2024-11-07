import InputView from "./view/InputView.js";
import OutputView from "./view/OutputView.js";

class App {
  async run() {
    OutputView.printWelcomeGreeting();
    OutputView.printProducts();
    await InputView.readItem();
  }
}

export default App;
