<template>
  <div class="lottery-bet-history">
    <div class="site-panel">
      <div class="site-panel__header">
        <div class="col-auto site-panel__header-title">
          <q-icon name="icon-tool icon-record"></q-icon>
          投注记录
        </div>
        <div class="col-auto site-panel__header-btn">
          <q-btn class="btn-more" @click="goNextPage(lotteryId)">更多</q-btn>
        </div>
      </div>
      <div class="site-panel__body">
        <div class="">
          <div class="row site-panel__tag">
            <div class="col-9 site-panel__tag-item">投注内容</div>
            <div class="col-3 site-panel__tag-item">奖金</div>
          </div>
          <div class="site-panel__list">
            <div class="row site-panel__item" v-for="(item, i) in data" :key="i">
              <div class="col-9 site-panel__item-content">
                <div class="site-panel__record-play">{{item.playName}}</div>
                <div class="site-panel__record-date">期号: {{item.issueAlias}}</div>
                <div class="site-panel__record-amount">下注金额: {{roundAmt(item.betAmount)}}</div>
              </div>
              <div class="col-3 record-status" right
                :class="'status-'+showStatusClass(item.orderStatus)"
              >
                <!-- 开奖状态 -->
                <div>
                  <q-icon :class="'icon-'+showStatusClass(item.orderStatus)"></q-icon>
                  {{item.orderStatusName}} </div>
                <!-- 派彩结果 -->
                <div> {{ item.orderStatus === 32 ? `${fmoney(roundAmt(item.payoff))}元` :""}} </div>
                <div v-if="showReward(item)">
                  <div class="bet-record-all__status--green">
                    返点：{{roundAmt(item.backAmount)}}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import globalMixin from 'src/globalMixin';
import betOrderMixin from 'src/betOrderMixin';

export default {
  name: 'lotteryBetHistory',
  mixins: [globalMixin, betOrderMixin],
  props: ['data'],
  data() {
  },
  methods: {
    goNextPage(value) {
      this.setCookie('fromLottery', value);
      this.$router.push('/betRecord');
    },
    showReward(item) {
      return ['已中奖', '未中奖', '已派彩'].includes(item.orderStatusName) && item.backAmount > 0;
    },
    showStatusClass(statCode) {
      let classStr = '';

      switch (parseInt(statCode, 10)) {
        case 32: // 中奖
          classStr += 'success';
          break;
        case 4: // 用户撤单
        case 5: // 系统撤单
        case 6: // 中奖停追
        case 71: // 存在异常
        case 81: // 异常注单
          classStr += 'error';
          break;
        case 33: // 和局
        case 31: // 未中奖
          classStr += 'default';
          break;
        case 1: // 等待开奖
          classStr += 'waiting';
          break;
        default:
          classStr += 'default';
      }

      return classStr;
    },
  },
};
</script>

<style lang="stylus">
</style>
