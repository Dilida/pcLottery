<template>
    <q-modal minimized
    class="modal modal--free modal-bet"
    v-model="showBetDialog"
    >
    <div class="">
      <div class="modal__header">
        <div class="modal__header-title">下注清单</div>
        <q-btn
          v-close-overlay
          icon="icon-tool icon-close"
          :disable="betOrderLoading"
          class="modal__close" />
      </div>
      <!-- This or use "message" prop on <q-dialog> -->
      <div class="modal__body">
        <p class="modal-bet__body__title">请核对您的下注信息</p>
          <!-- NOTE: -->
          <template v-if="['combine', 'grouped'].includes(playType)">
            <div class="row">
              <div class="col-12">【{{betDataList.playName}}-
                {{betDataList.name}}】</div>
            </div>
            <div class="row justify-end">
              <div class="col payoff-text">@{{betDataList.payoffFormat}} </div>
              <div class="col-auto">X {{betDataList.amount}}</div>
            </div>
          </template>
          <template v-else>
            <div
            v-for="(bet,b) in betDataList"
            :key="`bet_${b}`"
            class="row">
              <div class="col">【{{bet.playName}} - {{bet.name}}】</div>
              <div class="col-auto payoff-text">@{{bet.payoffFormat}}</div>
              <div class="col-auto">X {{bet.amount}}</div>
            </div>
          </template>
        <p class="modal-bet__body__count">【总计】总注数：{{betCount}} 总金额：{{totalAmount}}</p>
      </div>
      <div class="modal__footer">
        <q-btn
          class="btn-cancel btn-md"
          :disable="betOrderLoading"
          @click="closeBetConfirm()"
          label="取消" />
        <q-btn
          class="btn-primary btn-md"
          :loading="betOrderLoading"
          @click="sendBetOrder()"
          label="确定" />
      </div>
    </div>
  </q-modal>
</template>

<script>
// 投注共用
import betOrderMixin from 'src/betOrderMixin';
import crowdFundingMixin from 'src/crowdFundingMixin';
import { mapState, mapGetters, mapMutations } from 'vuex';

export default {
  name: 'ConfirmBetDialog',
  mixins: [betOrderMixin, crowdFundingMixin],
  data() {
    return {
      // 等待下注结果
      betOrderLoading: false,
    };
  },
  computed: {
    ...mapState(['memberBalance']),
    ...mapState('game', [
      'playType',
      'lotteryId',
      'lotteryName',
      'betData',
      'betCount',
      'priodData',
      'lotteryNow',
    ]),
    ...mapState('crowd', ['crowdFundingStartType']),
    ...mapGetters('game', {
      totalAmount: 'getTotalAmount',
      betDataList: 'getConfirmBetDataList',
      betCount: 'getBetCount',
      betOrderList: 'getBetOrderList',
    }),
    showBetDialog: {
      get() {
        return this.$store.state.game.showBetDialog;
      },
      set() {
        this.betOrderLoading = false;
        this.closeBetConfirm();
      },
    },
  },
  watch: {
    // playGroupId(newValue) {
    //   console.info('playGroupId', newValue);
    // },
  },
  created() {
  },
  methods: {
    ...mapMutations('game', ['setBetDialog']),
    closeBetConfirm() {
      this.setBetDialog(false);
      this.betOrderLoading = false;
    },
    sendBetOrder() {
      this.betOrderLoading = true;
      if (this.memberBalance < this.monAmt(this.totalAmount)) {
        this.openDialog({
          content: '余额不足',
          type: 'negative',
        });
        this.betOrderLoading = false;
        this.closeBetConfirm();
        return;
      }

      if (this.isCrowd) {
        // 先判斷身分是否可以
        const checkCrowdUser = this.$q.cookies.get('crowdFundingStartType');
        if (checkCrowdUser === 0 && this.monAmt(this.totalAmount < 1000 * 100)) {
          this.betOrderLoading = false;
          this.closeBetConfirm();
          this.openDialog({
            content: '因您从未上榜众筹方案金额必须大于1000元',
            dialogType: 'negative',
          });
          return;
        }
        const crowdData = {
          lotteryId: this.lotteryId, // 彩种id
          lotteryName: this.lotteryName,
          remark: '无', // 备注，可用于测试
          source: 'PC', // 来源：h5
          sourceType: '1', // 1是pc端，2是h5
          betDataList: this.betDataList,
          betCount: this.betCount,
          totalAmount: this.totalAmount,
          endTime: this.lotteryNow.endTime,
          startTime: this.lotteryNow.startTime,
          pCode: this.lotteryNow.pcode,
          pDate: this.lotteryNow.pdate,
        };
        this.closeBetConfirm();
        this.setCrowdFundingDialog({
          show: true, data: crowdData, betOrderList: this.betOrderList,
        });
        return;
      }
      this.closeBetConfirm();
      this.$emit('betOrder');
    },
  },
};
</script>

<style lang="stylus" scoped>
.payoff-text
    text-align right
    margin-right .1875rem
</style>

