import { globalMixin } from './globalMixin';
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex';
import { betContent, selectRules, shengXiao, getItemClass } from 'src/consts/BetOrder';
import { lotteryConst } from './consts/lotteryConst';

export const betOrderMixin = {
  plugin: [

  ],
  mixins: [globalMixin],
  data() {
    return {
    };
  },
  computed: {
    ...mapState('game', [
      'bet',
      'betAmount',
      'betClose', // 封盘状态
      'betNotOpen', // 未开盘
      'betData',
      'playGroupId',
      'playGroupTabId',
      'playType',
      'isShowBlock',
    ]),
    ...mapState([
      // 用户剩额(分)
      'memberBalance',
      // 游戏选单
      'lotteryLeftDrawer',
    ]),
    ...mapGetters('game', {
      totalAmount: 'getTotalAmount',
      getLotteryCloseDialogBlackList: 'getLotteryCloseDialogBlackList',
    }),

    isMmcPlay() {
      return lotteryConst.datetimeLotteryIds.includes(this.lotteryId);
    },
  },
  created() {
    // 此 JS 文件属于全局引用，禁止在此实作代码
  },
  mounted() {
    // 此 JS 文件属于全局引用，禁止在此实作代码
  },
  methods: {
    shengXiao,
    ...mapMutations('game', [
      'setLotteryHeader', 'setPastPrize', 'setBetListHistory',
      'setLoadBead', 'setDoubleLong', 'clearLoadBeadKeyValue',
      'clearBetData', 'setBetNotOpen', 'setLotteryCloseDialogBlackList',
      'setBetClose', 'setShowBlock',
    ]),
    ...mapActions('game', ['setPlayTree']),
    // lottery page loading init
    initLotteryPage(lotteryId) {
      if (!lotteryId) return;
      this.setBetClose(false);
      this.setBetNotOpen(true);
      // 玩法树
      this.getPlayTree(lotteryId);
      // clear bet Data
      this.clearBetData();

      // clear lottery info
      this.setLotteryHeader({ pre: [], now: [], next: [] });
      // 还原遮罩狀態
      this.changeFirstShow(false);
      // 强制更新页面
      this.$forceUpdate();
    },

    async getDouble(lotteryId) {
      const res = await this.getLoadBead(lotteryId);
      const res2 = await this.getDoubleLong(lotteryId);
      this.setLoadBead(res);
      if (this.$_lodash.isEmpty(res2.open) && this.$_lodash.isEmpty(res2.unOpen)) {
        console.log('nodoublelong');
      } else {
        this.setDoubleLong(res2);
      }
    },

    /**
     * @name 更新奖期 轮询更新页面资料
     */
    getNowPriodData(lotteryId) {
      // lottery rcentPrize
      this.getRecentPrize(lotteryId).then((response) => {
        this.setLotteryHeader(response);
      });
      // 彩种页投注记录
      this.getBetListHistory(lotteryId);
      // 往期开奖（彩种右侧，只展示 最近八期数据）
      this.getPastPrize(lotteryId).then((res) => {
        if (!res) return;
        const newObj = res.list.map(item => ({
          ...item,
          lotteryId: this.lotteryId,
        })).map(item => this.setWinNumber(item));
        this.setPastPrize(newObj);
      });
      this.getMemberBalance();
    },
    /**
     * 格式化赔率
     * @param {String, Number} val
     */
    payoffFormat(val) {
      return (Number(val) / 10000).toFixed(3);
    },
    /**
     * @name cid设定的宽度大小
     * @param {Int} cid
     */
    getClass(cid) {
      return getItemClass(cid);
    },
    /**
     * @name 投注错误说明dialog
     * @param {Obj} res
     */
    betOrderError(res) {
      let errMsg = res.msg;
      if (res.data && res.data.params) {
        errMsg = res.data.params.ErrInfo;
      }
      this.openDialog({
        title: '投注错误',
        content: errMsg,
        dialogType: 'negative',
      });
    },
    /**
     * 下注
     * @param {Object} item
     */
    betItem(item, deleteAmount = true) {
      if (this.betClose || this.betNotOpen) {
        return;
      }
      if (deleteAmount) {
        this.$_lodash.unset(item, 'amount');
      }
      const betCount = this.betData.length;
      const playId = this.playGroupTabId || this.playGroupId;
      const inBet = this.bet.includes(`${item.cid}${item.name}`);
      const rule = selectRules[playId];
      if (!inBet && rule) {
        if (rule.max) {
          if (betCount === rule.max) {
            this.openDialog({
              title: '投注项目超过规定数量',
              content: `最多只可选择${rule.max}注`,
              dialogType: 'negative',
            });
            return;
          }
        }
      }
      if (!item.betCid) {
        item.betCid = item.cid;
      }
      // 比对替换投注名称 但保留原名称
      item.betName = betContent.get(item.cid) || item.name;

      this.setBetData(item);
    },

    changeFirstShow(status) {
      this.setShowBlock(status);
    },
  },
};

export { betOrderMixin as default };
