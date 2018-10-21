
/**
 * @name 眾籌彩參與内容确认
 * @param {Boolean} show
 * @param {Int} amount
 */
export const setCrowdFundingDialog = (state, { show, data, betOrderList }) => {
  state.showCrowdDialog = show;
  state.crowdDialogData = data;
  state.crowdFundingBetOrderList = betOrderList;
};

/* 从筹详情的资料 */
export const setCrowdFundingDetail = (state, data) => {
  state.crowdFundingDetail = data;
};

/* 折叠rankingList */
export const toggleRankingListOpenTab = (state) => {
  state.isRankingListOpenTab = !state.isRankingListOpenTab;
};

/* 收合rankingList */
export const closeRankingListOpenTab = (state) => {
  state.isRankingListOpenTab = false;
};

export const hideRankingList = (state) => {
  state.isRankingListShow = false;
};

/* 眾籌彩彩種篩選id */
export const changeCrowdFundingFilterID = (state, data) => {
  state.crowdFundingFilterID = data;
};

/* 眾籌彩篩選是否要秀 */
export const hideCrowdFilterFun = (state) => {
  state.hideCrowdFilter = !state.hideCrowdFilter;
};

export const setIssueAlias = (state, data) => {
  state.issueAlias = data;
};
