// import { date } from 'quasar';

/* NOTE: 预设资讯 */
export const setProduct = (state, data) => {
  state.siteIsGet = true;
  state.site = data;
  state.productName = data.name;
  state.logosrc = data.logoPic ? `${state.action.picurl}${data.logoPic}/0` : '';
  // iconUrl存在兩個。iconUrl, h5IconUrl
  state.iconsrc = `${state.action.picurl}${data.iconPic}/0`;
  // state.iconsrc = `${state.action.picurl}${data.iconUrl}/0`;
  state.sitesrc = data.h5SiteUrl;
};
export const setCust = (state, url) => {
  state.cust = url;
  state.custIsGet = true;
};
/* NOTE: 登入状态 */
export const setIsLogin = (state, data) => {
  state.isLoggedIn = data;
};
export const setDemoState = (state, data) => {
  state.isDemoUser = data;
};
export const setUserName = (state, data) => {
  state.userName = data;
};
export const setLoginTime = (state, data) => {
  state.loginTime = data;
};
export const setAppUrl = (state, url) => {
  state.appUrlIsGet = true;
  state.appUrl = url;
};
export const setBankList = (state, list) => {
  state.bankListIsGet = true;
  state.bankList = list;
};
/* NOTE: 系统时间 */
export const setSysTime = (state, data) => {
  state.sysTime = data;
  state.diffTime = parseInt(new Date().getTime() / 1000, 10) - parseInt(data / 1000, 10);
};
/* NOTE: 用户余额 */
export const setMemberBalance = (state, data) => {
  state.memberBalance = data;
};
export const setMyWinSum = (state, data) => {
  state.myWinSum = data;
};
/* NOTE: 首页用 显示登入/试玩/注册 leftMenu */
export const setIndexPage = (state) => {
  state.showLobbyMenu = true;
  state.showLobbyAction = true;
  state.showLotterySelectMenu = false;
};
/* NOTE: Lobby 不显示 action & leftMenu & rightMenu */
export const setHideHeadMenu = (state) => {
  state.showLobbyMenu = false;
  state.showLobbyAction = false;
  state.showLotterySelectMenu = false;
};
/* NOTE: lobby 只显示 rightMenu (筛选) */
export const setLotteryMenu = (state) => {
  state.showLobbyMenu = false;
  state.showLobbyAction = false;
  state.showLotterySelectMenu = true;
};
/* NOTE: 设定page header title */
export const setPageHeaderTitle = (state, title) => {
  state.pageHeaderTitle = title;
};
export const setLeftDrawer = (state) => {
  state.layoutLeftDrawer = !state.layoutLeftDrawer;
};
export const setRightDrawer = (state) => {
  state.layoutRightDrawer = !state.layoutRightDrawer;
};
/* NOTE: 從下彈出畫面共用 */
export const setDownDrawer = (state, status) => {
  state.layoutDownDrawer = status;
};
export const setLotteryLeftDrawer = (state, status) => {
  state.lotteryLeftDrawer = status;
};

export const closeDialog = (state) => {
  state.dialogShow = false;
  state.dialogTitle = '';
  state.dialogContent = '';
  state.dialogCaption = '';
  state.dialogAutoClose = false;
  state.dialogAutoClosePeriod = 2000;
};

// Setting Dialog
// 全局呼叫基本提示dialog
export const openDialog = (state, {
  title = '提示',
  content = '',
  caption = '',
  htmlContent = '',
  dialogCloseCallback = null,
  dialogAutoClose = false,
  dialogAutoClosePeriod = 2000,
  dialogType = '',
  confirmBetData = '',
}) => {
  state.dialogTitle = title;
  state.dialogContent = content;
  state.dialogCaption = caption;
  state.dialogHtmlContent = htmlContent;
  state.dialogShow = true;
  state.dialogCloseCallback = dialogCloseCallback;
  state.dialogAutoClose = dialogAutoClose;
  state.dialogAutoClosePeriod = dialogAutoClosePeriod;
  state.dialogType = dialogType;
  state.confirmBetData = confirmBetData;

  if (state.dialogAutoClose) {
    setTimeout(() => {
      closeDialog(state);
    }, state.dialogAutoClosePeriod);
  }
};

/* NOTE: 开启/关闭彩种列表弹窗 */
export const toggleLotteryListDialog = (state, status) => {
  state.LotteryListDialogShow = status;
};

export const showCrowdfundingIcon = (state, { status = true }) => {
  state.isCrowdfundingIconShow = status;
};

export const setRouteTree = (state, treeMap) => {
  state.treeMap = treeMap;
};

export const setUnreadMailStatus = (state, status) => {
  state.haveUnreadMail = !!status;
};

export const setBalanceStatus = (state, status) => {
  state.balanceShow = status;
};

/* NOTE: 維護頁資訊 */
export const setMaintainInfo = (state, data) => {
  state.maintainEvent = data;
};
