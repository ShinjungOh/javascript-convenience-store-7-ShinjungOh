import ConvenienceStore from "./domain/ConvenienceStore.js";

class App {
  async run() {
    const convenienceStore = new ConvenienceStore();
    await convenienceStore.buy();
  }
}

export default App;
