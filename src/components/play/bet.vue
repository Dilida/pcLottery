<template>
  <div class="play-bet">
    <div class="play-bet__info row justify-between no-wrap">
      <div class="play-bet__input row items-center">
        <span class="col-3">预设金额</span>
        <q-input
          class="bet-input"
          type='tel'
          hide-underline
          v-model='betAmount'/>
        <span>元</span>
      </div>
      <div v-if="defaultGlobal.includes(styleName)" class="play-bet__count text-right">
        已选
        <span class="text-strong">{{betCount}}</span>注 <span class="text-gray"> | </span>
        共
        <span class="text-strong">{{totalAmount ? totalAmount : 0}}</span>元
      </div>
      <div v-else class="play-bet__count text-right">
        已选
        <span class="text-strong">{{betCount}}</span>注，
        共
        <span class="text-strong">{{totalAmount ? totalAmount : 0}}</span>元
      </div>
    </div>
    <div class="play-bet__btn text-right">
      <q-btn @click="clearBet()" class="btn-reset">重置</q-btn>
      <q-btn @click="confirmBet()" class="btn-bet">
        <q-icon name="icon-tool icon-bet"></q-icon>
        {{ isCrowd? "发起众筹" : "下注" }}
      </q-btn>
    </div>
  </div>
</template>

<script>
import betOrderMixin from 'src/betOrderMixin';
import { globalMixin } from 'src/globalMixin';
import { mapGetters, mapMutations } from 'vuex';
import { crowdFundingMixin } from 'src/crowdFundingMixin';

export default {
  mixins: [
    globalMixin,
    betOrderMixin,
    crowdFundingMixin,
  ],
  props: ['data'],
  data() {
    return {
      amount: '',
      showNormal: true,
    };
  },
  watch: {
    lotteryId(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.amount = '';
      }
    },
    isCrowd(newData) {
      if (!newData) return;
      this.showNormal = false;
    },
  },
  computed: {
    ...mapGetters({
      betCount: 'game/getBetCount',
      totalAmount: 'game/getTotalAmount',
    }),
    betAmount: {
      get() {
        return this.$store.state.game.betAmount;
      },
      set(data) {
        this.setBetAmount(data);
      },
    },
  },
  methods: {
    ...mapMutations('game', ['setBetAmount', 'setBetDialog']),
    // 清除选取的注号
    clearBet() {
      this.clearBetData();
    },
    confirmBet() {
      const reg = /^[1-9]\d*$/;
      if (!this.data) {
        this.openDialog({
          content: '无法取得当期期号，暂时无法投注',
          dialogType: 'negative',
        });
        return;
      }
      if (this.betCount === 0) {
        this.openDialog({
          content: '请选择投注项目',
          dialogType: 'negative',
        });
        return;
      }
      if (!this.totalAmount || !reg.test(this.betAmount) || this.totalAmount <= 0) {
        this.openDialog({
          content: '请输入整数的投注金额',
          dialogType: 'negative',
        });
        return;
      }
      if (this.isCrowd && this.totalAmount < 1000) {
        if (this.$q.cookies.get('crowdFundingStartType') === 0) {
          this.openDialog({
            content: '因您从未上榜众筹方案金额必须大于1000元',
            dialogType: 'negative',
          });
          return;
        }
      }
      this.setIssueAlias(this.data.issueAlias);
      this.setBetDialog(true);
    },

  },
};
</script>

<style>
</style>
