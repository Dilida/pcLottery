import _ from 'lodash';
import { lotteryConst } from 'src/consts/lotteryConst';
import { Cookies } from 'quasar';
import { playType } from 'src/consts/BetOrder';

/**
 * @name 彩种列表
 * @param {Array} data
 */
export const setLotteryList = (state, data) => {
  state.lottery = data;
};

/**
 * @name 当前彩种id
 * @param {Int} id 彩种cid
 */
export const setLotteryId = (state, id) => {
  state.lotteryId = id;
  if (Cookies.get('lotteryId') !== id) {
    Cookies.set('lotteryId', id);
  }
  state.lottery.forEach((item) => {
    if (item.id === parseInt(id, 10)) {
      state.lotteryName = item.name;
    }
  });
  state.isMmcPlay = false;
  if (lotteryConst.datetimeLotteryIds.includes(id)) {
    state.isMmcPlay = true;
  }
};
/**
 * @name 彩種頁header data
 */
export const setLotteryHeader = (state, data) => {
  // 先判定是否為區塊鏈彩，再加上此參數
  let blockChainList;
  if (lotteryConst.blockChainList.has(data.lotteryId)) {
    blockChainList = lotteryConst.blockChainList.get(data.lotteryId);
  }
  state.lotteryPre = {
    ...data.pre,
    lotteryId: data.lotteryId,
    blockChainList,
  };
  state.lotteryNow = data.now;
  state.lotteryNext = data.next;
};

export const updateLotteryNextToNow = (state) => {
  if (state.lotteryNext.prizeCloseTime) {
    state.lotteryNow = state.lotteryNext;
    state.lotteryNext = [];
  }
};

/**
 * @name 往期开奖（彩种右侧，只展示 最近八期数据）
 */
export const setPastPrize = (state, data) => {
  state.pastPrize = data;
};

/**
 * @name 彩种页投注记录
 */
export const setBetListHistory = (state, data) => {
  state.betListHistory = data;
};

/**
 * @name 露珠记录
 * 要先整理排列順序後再填值
 * 順序是依據lotteryConst.lotteryLoadBead.priority
 * 如果是北京PK10 幸運飛艇 則顯示修正為第一名，第二名
 */
export const setLoadBead = (state, data) => {
  state.loadBeadKeyValue = [];
  state.loadBeadList = [];
  const lotteryLists = lotteryConst.lotteryLoadBead.filter(({ idName }) => (
    _.keys(data).findIndex(i => (i === idName)) >= 0
  ));
  const filterData = _.sortBy(lotteryLists, 'priority');
  filterData.forEach((val) => {
    if (!state.loadBeadKeyValue.includes(val.name)) {
      state.loadBeadKeyValue.push(val.name);
      state.loadBeadList.push(data[val.idName]);
    }
  });
  if (lotteryConst.loadBeadChangeValue.includes(state.lotteryId)) {
    state.loadBeadKeyValue = state.loadBeadKeyValue.map((val) => {
      let returnValue = val.replace(/球/, '名');
      returnValue = returnValue.replace(/第一名/, '冠军');
      returnValue = returnValue.replace(/第二名/, '亚军');
      returnValue = returnValue.replace(/总和/, '冠亚和');
      return returnValue;
    });
  }
};

/**
 * @name 雙面長龍
 */
export const setDoubleLong = (state, data) => {
  const keyLabel = '双面长龙';
  if (!state.loadBeadList.includes(keyLabel)) {
    state.loadBeadList.push(data);
    state.loadBeadKeyValue.push(keyLabel);
  }
};

/**
 * @name 清除露珠objectKeyValue
 */
export const clearLoadBeadKeyValue = (state) => {
  state.loadBeadKeyValue = [];
  state.loadBeadList = [];
};

export const setPlayTree = (state, data) => {
  state.playTree = data;
  state.playLayoutType = data.layout;
};

/**
 * @name 玩法内容
 * @param {*} data
 */
export const setPlayGroup = (state, data) => {
  state.playGroup = data;
};

/**
 * 玩法清单类型
 * @param {*} state
 * @param {*} id
 */
export const setPlayType = (state, id) => {
  if (!id) return;
  state.playType = '';
  _.keys(playType).forEach((item) => {
    if (playType[item].includes(id)) {
      state.playType = item;
    }
  });
};

/**
 * @name 玩法组子ID
 * @param {Int} id
 */
export const setPlayGroupTabId = (state, id) => {
  if (state.playGroupTabId === id) return;
  state.playGroupTabId = id;
  setPlayType(state, id);
};

/**
 * @name 玩法组ID
 * @param {Int} id
 */
export const setPlayGroupId = (state, id) => {
  if (state.playGroupId === id || !_.has(state.playTree, 'kinds')) return;
  state.playGroupId = id;
  setPlayType(state, id);
  const tabId = _.get(state.playTree.kinds.find(f => f.cid === id), 'tabIds.0', '');
  setPlayGroupTabId(state, tabId);
};

/**
 * @name 设定下注item
 * 如已在array内 就是要移除
 * 并整理item active清单 `${cid}${name}` 作为key值
 * {
 *  name 显示用
 *  cid 显示用
 *  payoff 显示用
 *  betName 下注用
 *  betCid 下注用
 * }
 *
 * @param {Obj} item
 */
export const setBetData = (state, item) => {
  if (state.betClose || state.betNotOpen) return;
  if (!_.has(item, 'group')) item.group = '';

  const incName = `${item.group}${item.cid}${item.name}`;

  if (state.bet.includes(incName)) {
    state.betData = state.betData.filter(f => `${f.group}${f.cid}${f.name}` !== incName);
  } else {
    state.betData = [...state.betData, item];
  }
  state.bet = state.betData.map(m => `${m.group}${m.cid}${m.name}`);
  state.betCount = state.bet.length;

  // betSub
  if (state.betSub.find(b => b.pid === item.cid)) {
    state.betSub = state.betSub.filter(f => f.pid !== item.cid);
  } else {
    state.betSub = [...state.betSub, { pid: item.cid, gid: state.playGroupId }];
  }
};

/**
 * @name 清除下注
 */
export const clearBetData = (state, data) => {
  state.bet = [];
  state.betData = [];
  state.betCount = 0;
  state.betSub = [];
  if (!data) {
    state.betAmount = 1;
  }
};

/**
 * @name 下注页彩种开奖下注相关资讯
 * @param {Object} data
 */
export const setPriodData = (state, data) => {
  state.priodData = data;
};
/**
 * @name 切换彩种时清除旧的开奖&奖期资料
 */
export const clearPriodData = (state) => {
  state.priodData = {
    prePriod: {
      winNumberArr: [],
    },
  };
};

/**
 * @name 自选不中update选注playId
 */
export const updateBetData = (state, play) => {
  state.betData.forEach((item) => {
    item.betCid = play.cid;
    item.payoffFormat = play.payoffFormat;
  });
};

/**
 * @name 下注内容确认
 * @param {Boolean} show
 * @param {Int} amount
 */
export const setBetDialog = (state, show) => {
  state.showBetDialog = show;
};

export const setBetAmount = (state, amount) => {
  state.betAmount = amount;
};

/**
 * @name 封盘状态
 * @param {Boolean} isClose
 */
export const setBetClose = (state, isClose) => {
  state.betClose = isClose;
  if (isClose) {
    clearBetData(state);
  }
};
/**
 * @name 未开盘状态
 */
export const setBetNotOpen = (state, notOpen) => {
  if ([116, 118].includes(state.lotteryId)) {
    notOpen = false;
  }
  state.betNotOpen = notOpen;
};

export const setShowBlock = (state, status) => {
  state.isShowBlock = status;
};

