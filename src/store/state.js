export default {
  productName: '',
  productCode: `${process.env.STYLE_NAME}${process.env.STYLE_NUMBER}`,
  logosrc: '',
  iconsrc: '',
  sitesrc: '',
  action: process.env.API_URL,
  moreGame: '更多游戏',
  sysTime: null,
  diffTime: null,
  loginTime: null,
  siteIsGet: false,
  site: {},
  appUrlIsGet: false,
  appUrl: {},
  custIsGet: false,
  cust: {},
  bankListIsGet: false,
  bankList: [],
  memberId: '',
  memberBalance: 0, // 余额
  myWinSum: 0, // 今日输赢
  isLoggedIn: false,
  isDemoUser: false,
  userName: '',
  showLotterySelectMenu: false, // 筛选 选单 button 显示
  showLobbyMenu: false, // 彩种 选单显示
  showLobbyAction: false, // 登入/试玩/注册button 显示
  pageHeaderTitle: '',
  layoutLeftDrawer: false,
  layoutRightDrawer: false,
  lotteryLeftDrawer: false,
  layoutDownDrawer: false,
  haveUnreadMail: false,
  treeMap: null,
  // Dialog
  // 根據需求再擴充
  dialogTitle: '', // 主标ex.提示..
  dialogCaption: '', // 副标
  dialogContent: '', // 主要提示內容字串
  dialogHtmlContent: '', // 主要提示內容，html形式
  dialogShow: false,
  dialogCloseCallback: null,
  dialogAutoClose: false, // 自动关闭 启/停 用
  dialogAutoClosePeriod: 2000, // 自动关闭时间预设2秒
  dialogType: '',
  confirmBetData: {},
  // Lottery Dialog
  LotteryListDialogShow: false,
  balanceShow: false, // 显示余额

  // 維護頁的資訊 data
  maintainEvent: [],
};
