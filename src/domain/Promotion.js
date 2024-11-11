import { MissionUtils } from "@woowacourse/mission-utils";

class Promotion {
  #name;
  #buy;
  #get;
  #startDate;
  #endDate;

  constructor(promotion) {
    this.#name = promotion.name;
    this.#buy = promotion.buy;
    this.#get = promotion.get;
    this.#startDate = new Date(promotion.startDate);
    this.#endDate = new Date(promotion.endDate);
  }

  getPromotion() {
    return {
      name: this.#name,
      buy: this.#buy,
      get: this.#get,
      startDate: this.#startDate,
      endDate: this.#endDate,
    }
  }

  isPromotionSeason() {
    const today = MissionUtils.DateTimes.now();
    return today >= this.#startDate && today <= this.#endDate;
  }
}

export default Promotion;
