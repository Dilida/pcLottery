<template>
  <!-- content -->
  <div class="lottery-bet-section">
    <div class="lottery-subtitle">选择幸运号码</div>
    <div class="lottery-right-main row">
      <!-- 玩法组 -->
      <playKinds />
      <buttonArea
        :lotteryId="lotteryId"
        @openLotteryPlayingDocModal="playingruleDialog = true" />
      <!-- 玩法内容 -->
      <div class="lottery-bet-area">
        <playTabs />
        <shengXiaoSelect />
        <div class="col column play-tabs">
          <playGroup/>
        </div>
        <playBet :data="data"/>
        <!-- 第一次loading 不要顯示 -->
        <div v-if="isShowBlock">
          <q-inner-loading :visible="betClose">
            <div class="noTouch">
              <q-icon v-if="defaultIndex.includes(styleName)"
              name="icon-tool icon-error" />
              已封盘</div>
          </q-inner-loading>
          <q-inner-loading :visible="betNotOpen">
            <div class="noTouch">
              <q-icon v-if="defaultIndex.includes(styleName)"
              name="icon-tool icon-error" />
              未开盘
            </div>
          </q-inner-loading>
        </div>
      </div>
    </div>
    <betDialog ref='betDialog' @betOrder="betOrder" />
    <!-- NOTE: 玩法说明 -->
    <PlayingDoc
      :playingruleDialog="playingruleDialog"
      @close="playingruleDialog = false" />
    <mmcPlay ref='mmcPlay'
    v-if="isMmcPlay"
    @betOrder="betOrder"
    @closeBetConfirm="$refs.betDialog.closeBetConfirm()"
    :winNumbers="mmcWinNumber"
    :listOrder="listOrder"
    />
  </div>
</template>

<script>
import betOrderMixin from 'src/betOrderMixin';

import buttonArea from 'components/lottery/lotteryButtonArea';
import betDialog from 'src/components/dialog/confirmBetDialog';
import playBet from 'components/play/bet';
import playGroup from 'components/play/group';
import playKinds from 'components/play/kinds';
import playTabs from 'components/play/tabs';
import PlayingDoc from 'components/dialog/playingDoc';
import shengXiaoSelect from 'components/play/shengXiao';
import mmcPlay from 'components/play/mmcPlay';

import { mapGetters } from 'vuex';

export default {
  name: 'playMainArea',
  mixins: [betOrderMixin],
  props: ['data'],
  components: {
    betDialog,
    buttonArea,
    playBet,
    playGroup,
    PlayingDoc,
    playKinds,
    playTabs,
    shengXiaoSelect,
    mmcPlay,
  },
  data() {
    return {
      playGroupClass: null,
      // 玩法说明弹窗
      playingruleDialog: false,
      // 秒秒彩动画弹窗用
      listOrder: [], // 开奖结果
      mmcWinNumber: [], // 开奖号码
    };
  },
  computed: {
    ...mapGetters('game', {
      totalAmount: 'getTotalAmount', // 总投注金额
      betDataList: 'getConfirmBetDataList', // 投注显示用列表
      betCount: 'getBetCount', // 投注数
      betOrderList: 'getBetOrderList', // 下注用清单
    }),
  },
  watch: {
  },
  created() {
  },
  methods: {
    // 下注
    betOrder() {
      this.betOrderLoading = true;

      if (this.isMmcPlay) {
        if (!this.$refs.mmcPlay.showResult && this.$refs.mmcPlay.showMMCPlay) {
          return;
        }
        this.$refs.mmcPlay.showMMCPlay = true;
        this.$refs.mmcPlay.showResult = false;
      }
      this.setBetOrder(this.betOrderList).then((res) => {
        if (this.$_lodash.has(res.data, 'orderId')) {
          if (this.isMmcPlay) {
            // 秒秒开奖 投注完立即取得 开奖结果 以动画效果显示
            this.listOrder = res.data.listOrder;
            this.mmcWinNumber = res.data.winNumber.split(',');
            return;
          }
          this.openDialog({
            title: '成功',
            htmlContent: `您已经成功支付<br>
              请随时关注开奖信息`,
            icon: 'check',
            dialogType: 'check',
          });
          this.clearBetData(true);
          // 更新余额
          this.getMemberBalance();
          // 彩种页投注记录
          this.getBetListHistory(this.lotteryId);
        } else {
          if (this.isMmcPlay) {
            this.$refs.mmcPlay.showMMCPlay = false;
          }
          this.betOrderError(res);
        }
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
.q-item, .q-list
  padding 0
</style>
