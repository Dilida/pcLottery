export default {
  lotteryId: 0,
  lotteryName: '',
  lotteryPre: [],
  lotteryNow: [],
  lotteryNext: [],
  lottery: [],
  pastPrize: [],
  betListHistory: [],
  loadBeadList: [],
  loadBeadKeyValue: [],
  isMmcPlay: false,
  // 玩法树
  playTree: [],
  // 玩法组cid
  playGroupId: '',
  // 玩法组子页签
  playGroupTabs: [],
  playGroupTabId: 0,
  // 玩法类
  playTypeArr: ['grouped', 'yzycombine', 'combine', 'normal'],
  playType: '',
  playLayoutType: '',
  // 投注
  bet: [],
  betSub: [],
  betCount: 0,
  betData: [],
  // 封盘中
  betClose: false,
  // 未开盘
  betNotOpen: true,
  // 本期开奖预设
  priodData: {
    prePriod: {
      winNumberArr: [],
    },
  },
  showBetDialog: false,
  betAmount: 1,
  // 输入金额时取消视窗滚动置顶处理
  focusAmount: false,
  lotteryCloseDialogBlackList: [],
  isShowBlock: false,
};
