/**
 * @name 將lotteryCid陣列轉成映射區間
 * @param {originLotteryList} 原始陣列
 * @param {groupSelector} 分區選擇器，二維陣列
 * @param {type} 狀態值，判斷原始陣列是否需要格式化(對原始陣列為: 非lotteryId陣列)
 */
export default class LotteryGroup {
  constructor(originLotteryList, groupSelector = [[]], type = true) {
    // cid陣列，未分區
    this.originLotteryCidList = [];
    if (type) {
      originLotteryList.forEach((lotteryItem) => {
        if (lotteryItem.cid) {
          this.originLotteryCidList.push(lotteryItem.cid);
        } else {
          this.originLotteryCidList.push(lotteryItem);
        }
      });
      this.originLotteryCidList.sort((x, y) => x - y);
    } else {
      this.originLotteryCidList = [...originLotteryList];
    }
    // 分區數
    this.groupLength = groupSelector.length + 1;
    // 原cid陣列最大元素值，分區基數
    this.originMaxElement = this.originLotteryCidList[this.originLotteryCidList.length - 1];
    // 新cid陣列
    this.newLotteryList = [];
    this.firstGroup = [];
    const tmpLotteryList = [];
    // 遍歷分區元素
    this.originLotteryCidList.forEach((listItem) => {
      // 狀態碼，判斷當前元素是否匹配分區
      let status = 1;
      groupSelector.forEach((groupItem, groupIndex) => {
        if (groupItem.includes(listItem)) {
          tmpLotteryList.push(listItem + ((groupIndex + 1) * this.originMaxElement));
          status = 0;
        }
      });
      if (status) {
        this.firstGroup.push(listItem);
      }
    });
    this.firstGroupLength = this.firstGroup.length;
    // 合併陣列，獲得新cid陣列，已分區
    this.newLotteryList = [
      ...this.firstGroup,
      ...tmpLotteryList,
    ];
  }
  checkNonintersection(lotteryId) {
    let baseIndex = 0;
    for (let tmp = 0; tmp < this.groupLength; tmp += 1) {
      if (
        this.newLotteryList.includes(
          lotteryId,
          baseIndex * this.firstGroupLength,
        )
      ) {
        return tmp + 1;
      }
      lotteryId += this.originMaxElement;
      baseIndex = 1;
    }
    return undefined;
  }
  checkIntersection(lotteryId) {
    const selectorData = [];
    let baseIndex = 0;
    for (let tmp = 0; tmp < this.groupLength; tmp += 1) {
      if (
        this.newLotteryList.includes(
          lotteryId,
          baseIndex * this.firstGroupLength,
        )
      ) {
        selectorData.push(tmp + 1);
      }
      lotteryId += this.originMaxElement;
      baseIndex = 1;
    }
    return selectorData;
  }
  getFirstGroup() {
    return this.firstGroup;
  }
}
