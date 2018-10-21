/*
export const someGetter = (state) => {}

this.$store.getters['game/getLotteryBetRecordNameList']
 */
import { Cookies } from 'quasar';
import { selectRules, payoffFormat, monAmt } from 'src/consts/BetOrder';
import _ from 'lodash';

export const getLotteryUrlList = state => state.lottery.map(l => ({
  name: l.name,
  lotteryImgUrl: l.imgUrl,
  cid: l.id,
  url: l.url,
}));

export const getLotteryId = (state) => {
  if (Cookies.has('lotteryId') && state.lotteryId !== Cookies.get('lotteryId')) {
    return Cookies.get('lotteryId');
  }
  return state.lotteryId;
};

/**
 * 取得投注注数
 */
export const getBetCount = (state) => {
  let count = state.betData.length;
  if (count === 0) return count;

  let playId = state.playGroupTabId;
  if (!playId || playId === '') {
    playId = state.playGroupId;
  }
  const rule = selectRules[playId];
  if (_.has(rule, 'fun')) {
    if (rule.fun) {
      count = rule.fun(state.betData);
    // } else if (count === rule.max) {
    //   count = 1; // 用户点击足够多的球后，设置组合玩法注数为1
    } else {
      count = 0;
    }
  }
  return count;
};
/**
 * 取得kinds投注注数
 */
export const getBetSubCount = (state) => {
  const sub = new Map();
  state.betSub.forEach((item) => {
    if (!sub.has(item.gid)) {
      sub.set(item.gid, [item.cid]);
    } else {
      sub.get(item.gid).push(item.cid);
    }
  });
  return sub;
};


/**
 * 投注确认
 * {
 *  name
 *  parentItem
 *  payoff
 * }
 */
export const getConfirmBetDataList = (state) => {
  if (state.bet.length === 0) return [];

  const tmp = state.betData.map(b => ({
    playId: b.cid,
    name: b.name,
    payoffFormat: b.payoffFormat,
    playName: b.playName,
    amount: b.amount || state.betAmount,
  }));
  // 特殊
  const play = _.get(state.betData, '0', {});
  // 1注
  if (state.playType === 'combine') {
    return {
      playId: play.cid,
      name: state.betData.map(m => m.name).join(),
      payoffFormat: play.payoffFormat,
      playName: play.playName,
      amount: state.betAmount,
    };
  }
  // 組合
  if (['group', 'k10group'].includes(state.playType)) {
    const group = _.get(selectRules, `${play.parentId}.combin`, false);
    if (group) {
      const ctmp = group(state.betData).map((item) => {
        let payoff = _.get(item, '0.payoffFormat');
        if (state.playType === 'group') {
          const payoffArr = item.map(m => m.orpayoff);
          payoff = Math.max(...payoffArr);
          if (state.playGroupId === 1110000) {
            payoff = Math.min(...payoffArr);
          }
          payoff = payoffFormat(payoff);
        }
        return {
          playId: _.get(item, '0.cid', ''),
          name: item.map(m => m.name).join(),
          payoffFormat: payoff,
          playName: _.get(item, '0.playName', ''),
          amount: state.betAmount,
        };
      });
      return ctmp;
    }
  }
  return tmp;
};

export const getLotteryCloseDialogBlackList = state => (id) => {
  if (state.lotteryCloseDialogBlackList.includes(id)) {
    return true;
  }
  return false;
};
/**
 * @name 取得玩法组类
 */
export const getPlayKinds = (state) => {
  if (state.playGroupId && _.has(state.playTree, ['kinds'])) {
    return _.get(state.playTree, 'kinds', []);
  }
  return [];
};

/**
 * @name 取得玩法组
 */
export const getPlayGroups = (state) => {
  const data = getPlayKinds(state).find(f => f.cid === state.playGroupId);
  if (_.has(data, ['tabs']) && state.playGroupTabId) {
    return data.groups.filter(f => f.parentId === state.playGroupTabId);
  }
  if (_.has(data, ['groups'])) {
    return data.groups;
  }
  return [];
};

/**
 * @name 取得玩法分页
 */
export const getPlayTabs = (state) => {
  const data = getPlayKinds(state).find(f => f.cid === state.playGroupId);
  return _.get(data, 'tabs', false);
};

/**
 * @name 清除选注设定
 */
export const getPlayClearStatus = (state) => {
  const data = getPlayKinds(state);
  if (!data) return true;
  return data.clear;
};

/**
 * @name 取得分组后的彩种列表
 */
export const getLotteryGroup = (state) => {
  const lotteryGroup = [];
  state.lottery.forEach((lottery) => {
    if (lotteryGroup.length <= lottery.group) {
      lotteryGroup.push({ groupName: lottery.groupName, list: [] });
    }
    const {
      imgUrl, id, name, url,
    } = lottery;
    lotteryGroup[lottery.group].list.push({
      imgUrl, id, name, url,
    });
  });
  return lotteryGroup;
};

export const getTotalAmount = (state) => {
  if (state.playType !== '') {
    const betCount = getBetCount(state);
    return state.betAmount * betCount;
  }
  let totalAmount = 0;
  getConfirmBetDataList(state).forEach((item) => {
    if (item.amount) {
      totalAmount += parseInt(item.amount, 10);
    } else {
      totalAmount += parseInt(state.betAmount, 10);
    }
  });
  return totalAmount;
};

/**
 * @name 取得投注列表
 * @url http://mock.bccp.com/project/93/interface/api/482
 * @param {Int} betAmount 下注金额，元的模式下需要 x100传值，角的模式下 x10
 * @param {String} betContent //下注内容，如1,5,8,3,7
 * @param {Int} betCount 注单数
 * @param {Int} betMode 下注模式(预留)
 * @param {Int} chaseCount 追号期数(含当期),默认1
 * @param {Int} ifChase 是否追号,0不追号，1追号
 * @param {Int} moneyMode 付款类型：元y，角j，分f
 * @param {Number} multiple 倍数最少为1 (投注金额)
 * @param {Int} payoff 派彩
 * @param {Number} playId 玩法
 * @param {String} remark 备注
 */
export const getBetOrderList = (state) => {
  if (!state.betData) return [];
  const defaultBetData = {
    betMode: 0,
    chaseCount: 1,
    ifChase: 0,
    moneyMode: 'y',
    remark: '无',
  };
  const betCount = getBetCount(state);
  if (betCount === 0) return [];
  // 秒秒彩免pcode
  const pcode = _.get(state.lotteryNow, 'pcode', '');
  let list = [];

  let betContent = '';
  if (state.playType === 'k10group') {
    // 前后码 单一下注金额
    const zero = state.betData.filter(f => f.group === 0).map(m => m.name).join(',');
    const one = state.betData.filter(f => f.group === 1).map(m => m.name).join(',');
    betContent = `${zero}|${one}`;
  } else {
    betContent = state.betData.map(item => item.betName).join(',');
  }
  if (['combine', 'k10group'].includes(state.playType)) {
    // 任选,连码 单一下注金额
    list.push({
      betAmount: monAmt(Number(getTotalAmount(state))),
      betContent,
      betCount,
      playId: _.get(state.betData, '0.betCid'),
      // multiple: Number(getTotalAmount(state)),
      multiple: Number(state.betAmount),
      ...defaultBetData,
    });
  } else if (state.playType === 'group') {
    // 特殊
    list = getConfirmBetDataList(state).map(item => ({
      betContent: item.name.replace(/尾/ig, ''),
      betAmount: monAmt(item.amount),
      multiple: Number(item.amount),
      // multiple: 1,
      playId: item.playId,
      betCount: 1,
      ...defaultBetData,
    }));
  } else {
    // default
    state.betData.forEach((item) => {
      const betAmount = Number(item.amount || state.betAmount);
      list.push({
        betAmount: monAmt(betAmount),
        betContent: item.betName,
        betCount: 1,
        playId: item.betCid,
        multiple: Number(betAmount),
        // multiple: 1,
        ...defaultBetData,
      });
    });
  }
  return {
    list,
    amount: monAmt(getTotalAmount(state)), // 总金额，此金额=所有注单总金额
    lotteryId: state.lotteryId, // 彩种id
    // operType: 0, // 下注类型，1下注
    // pcode: Number(state.lotteryNow.pcode - 1),
    pcode,
    remark: '无', // 备注，可用于测试
  };
};
