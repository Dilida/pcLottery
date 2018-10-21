<template>
  <q-modal
    class="modal modal--md"
    v-model="isShow"
  >
    <div class="modal__header">
      <div class="modal__header-title">{{ title }}</div>
      <q-btn
        class="modal__close"
        icon="icon-tool icon-close"
        @click="closeDialog()"
      />
    </div>
    <div class="modal__body">
    <div class="crowdfunding-started__header">
      <div class="crowdfunding-started__header__lottery">
        <div class="crowdfunding-list__title">
          <span class="text-strong">{{lotteryName}}</span>
          <span>第{{issueAlias}}期</span>
        </div>
      </div>
    </div>
    <div class="crowdfunding__block">
      <div class="crowdfundin-bet-list">
        <template v-if="['combine', 'grouped'].includes(playType)">
            <div class="row">
              <div class="col-12">【{{renderList.playName}}-
                {{renderList.name}}】</div>
            </div>
            <div class="row justify-end">
              <div class="col payoff-text">@{{renderList.payoffFormat}} </div>
              <div class="col-auto">X {{renderList.amount}}</div>
            </div>
          </template>
          <template v-else>
            <div
            v-for="(bet,b) in crowdDialogData.betDataList"
            :key="`bet_${b}`"
            class="row">
              <div class="col">【{{bet.playName}} - {{bet.name}}】</div>
              <div class="col-auto payoff-text">@{{bet.payoffFormat}}</div>
              <div class="col-auto">X {{bet.amount}}</div>
            </div>
          </template>
      </div>
      <div
        class="row justify-between crowdfundin-bet-list__count">
        <div>【总計】总注数：<span class="crowdfunding-text--red">{{crowdDialogData.betCount}}</span></div>
        <div>【总金额】<span class="crowdfunding-text--red">
          <!-- {{roundAmt(pageTotalAmount)}} -->
          {{crowdDialogData.totalAmount}}
          </span>元
        </div>
      </div>
    </div>
    <div class="crowdfunding__block">
      <!-- list -->
      <div class="row justify-between crowdfunding-list__item">
        <div class="crowdfunding-list__item-name">
          <div class="text-strong">我要分成</div>
        </div>
        <div class="crowdfunding-list__right">
          <span class="btn-cancel" @click="subtrackSegmentations()">
            <i class="material-icons">remove</i>
          </span>
          <span class="crowdfunding-list__pair">{{segmentations}}份</span>
          <span class="btn-cancel" @click="addSegmentations()">
            <i class="material-icons">add</i>
          </span>
        </div>
      </div>
      <!-- list -->
      <div class="row justify-between crowdfunding-list__item">
        <div class="crowdfunding-list__item-name">
          <div class="text-strong">我要认购</div>
        </div>
        <div class="crowdfunding-list__right">
          <span class="btn-cancel" @click="subtrackSubscriptions()">
            <i class="material-icons">remove</i>
          </span>
          <span class="crowdfunding-list__pair">{{subscriptions}}份</span>
          <span class="btn-cancel" @click="addSubscriptions()">
            <i class="material-icons">add</i>
          </span>
        </div>
      </div>
      <!-- list -->
      <div class="row justify-between crowdfunding-list__item">
        <div class="crowdfunding-list__item-name">
          <div class="text-strong">佣金</div>
        </div>
        <div class="crowdfunding-list__right text-right">
          <q-btn-group class="btn-group-flat">
            <q-btn
              :class="{active: commissionPercent === 0}"
              @click="changeCommissionPercent(0)"
            >0%</q-btn>
            <q-btn
              :class="{active: commissionPercent === 0.05}"
              @click="changeCommissionPercent(0.05)"
            >5%</q-btn>
            <q-btn
              :class="{active: commissionPercent === 0.1}"
              @click="changeCommissionPercent(0.1)"
            >10%</q-btn>
            <q-btn
              :class="{active: commissionPercent === 0.2}"
              @click="changeCommissionPercent(0.2)"
            >20%</q-btn>
            <q-btn
              :class="{active: commissionPercent === 0.3}"
              @click="changeCommissionPercent(0.3)"
            >30%</q-btn>
          </q-btn-group>
          <div class="crowdfunding-started__brokerage__msg">比例为每份金额所收取佣金比例</div>
        </div>
      </div>
      <!-- 总计 -->
      <div class="row justify-between crowdfunding-list__item">
        <div class="crowdfunding-list__item-name">
          <div>每份 <span class="crowdfunding-text--red">
            {{perSubscriptionMoney}}</span>元
          </div>
        </div>
        <div class="crowdfunding-list__right">
          <div>佣金 <span class="crowdfunding-text--red">
            {{perSubscriptionCommission}}</span>元/份
          </div>
        </div>
      </div>
      <div class="row justify-between crowdfunding-list__item">
        <div class="crowdfunding-list__item-name">
          <div class="text-strong">认购金额
            <span
              class="crowdfunding-started__count__money crowdfunding-text--red"
            >
              {{subscriptionAmount}}
            </span>元
          </div>
        </div>
      </div>
    </div>
    </div>
    <div class="modal__footer">
      <q-btn
        class="btn-cancel btn-lg"
        @click="closeDialog()">关闭</q-btn>
      <q-btn
        class="btn-primary btn-lg"
        :disable="btnDisable"
        @click="submit()">确认</q-btn>
    </div>
  </q-modal>
</template>

<script>
import crowdFundingMixin from 'src/crowdFundingMixin';
import { mapState } from 'vuex';
import { globalMixin } from 'src/globalMixin';
import betOrderMixin from 'src/betOrderMixin';

export default {
  name: 'crowdFundingDialog',
  mixins: [crowdFundingMixin, globalMixin, betOrderMixin],
  data() {
    return {
      renderList: '',
      title: '发起众筹',
      initData: {},
      pageLotteryName: '',
      pagePcode: '',
      // ******页面下方 份数/认购 参数******
      canSegmentationsList: [],
      segmentations: 1,
      subscriptions: 1,
      // 佣金比例
      commissionPercent: 0,
      // 总金额
      pageTotalAmount: 0,
      // 总注数
      pageBetAmount: 0,
      btnDisable: false,
    };
  },
  created() {
    // *** init ***
    this.initData = this.$q.sessionStorage.get.item('crowdFundingStart') || {};
    if (this.initData !== {}) {
      this.pageBetDataList = {};
      this.pageBetDataList = this.initData;
    }
  },
  watch: {
    crowdDialogData() {
      if (this.crowdDialogData.betDataList) {
        this.renderList = this.crowdDialogData.betDataList;
        this.setCanSegmentationsList(
          Number(this.crowdDialogData.totalAmount),
          Number(this.betAmount),
        );
      }
    },
    segmentations() {
      if (this.subscriptions > this.segmentations) {
        this.subscriptions = this.segmentations;
      }
    },
  },
  computed: {
    ...mapState('game', [
      'playGroupId',
      'playType',
      'lotteryId',
      'lotteryName',
      'betCount',
      'betAmount',

    ]),
    ...mapState('crowd', [
      'crowdDialogData',
      'issueAlias',
      'crowdFundingBetOrderList',
    ]),
    ...mapState(['memberBalance', 'isDemoUser']),
    perSubscriptionMoney() {
      return this.crowdDialogData.totalAmount / this.segmentations;
    },
    perSubscriptionCommission() {
      return (this.perSubscriptionMoney * this.commissionPercent).toFixed(2);
    },
    subscriptionAmount() {
      return this.perSubscriptionMoney * this.subscriptions;
    },
    isShow: {
      get() {
        return this.$store.state.crowd.showCrowdDialog;
      },
      set() {
        this.closeDialog();
      },
    },
  },
  methods: {
    resetState() {
      this.canSegmentationsList = [];
      this.segmentations = 1;
      this.subscriptions = 1;
      this.commissionPercent = 0;
      this.btnDisable = false;
    },
    closeDialog() {
      this.resetState();
      this.setCrowdFundingDialog({ show: false, data: {}, betOrderList: {} });
    },
    // ******初始化可配置之份数******
    setCanSegmentationsList(n, k) {
      const factorArr = [];
      const factorArr2 = [];
      const factor = n;
      const factor2 = k;
      if (factor === 1 || factor2 === 1) {
        this.canSegmentationsList.push(1);
      } else {
        for (let divisor2 = 1; divisor2 <= factor2; divisor2 += 1) {
          if (factor2 % divisor2 === 0) {
            factorArr2.push(divisor2);
          }
        }
        for (let divisor = 1; divisor <= factor; divisor += 1) {
          if (factor % divisor === 0) {
            factorArr.push(divisor);
          }
        }
        const setA = new Set(factorArr);
        factorArr2.forEach((item) => {
          const { size } = setA;
          setA.add(item);
          if (size === setA.size) {
            this.canSegmentationsList.push(item);
          }
        });
      }
    },
    // ******份数部份******
    addSegmentations() {
      const index = this.canSegmentationsList.indexOf(this.segmentations);
      if (this.canSegmentationsList[index + 1]) {
        this.segmentations = this.canSegmentationsList[index + 1];
      } else {
        this.segmentations = this.canSegmentationsList[index];
      }
    },
    subtrackSegmentations() {
      const index = this.canSegmentationsList.indexOf(this.segmentations);
      if (this.canSegmentationsList[index - 1]) {
        this.segmentations = this.canSegmentationsList[index - 1];
      } else {
        this.segmentations = this.canSegmentationsList[index];
      }
    },
    // ******认购部份******
    addSubscriptions() {
      if (this.subscriptions < this.segmentations) {
        this.subscriptions += 1;
      }
    },
    subtrackSubscriptions() {
      if (this.subscriptions - 1 > 0) {
        this.subscriptions -= 1;
      }
    },
    // ******佣金比例部份******
    changeCommissionPercent(percent) {
      this.commissionPercent = percent;
    },
    submit() {
      // 先判斷身分是否可以
      const checkCrowdUser = this.$q.cookies.get('crowdFundingStartType');
      if (checkCrowdUser === 0) {
        if (this.subscriptionAmount < 300) {
          this.openDialog({
            content: '因您从未上榜自购金额必须大于300元',
            type: 'negative',
            dialogType: 'negative',
          });
          return;
        }
      }
      // 取得 playname
      this.btnDisable = true;
      const crowdFundingSubmitList = this.crowdFundingBetOrderList.list.map(((item, index) => ({
        ...item,
        lotteryId: this.lotteryId,
        sideType: 2,
        betContent: item.betContent.toString(),
        playName: Array.isArray(this.crowdDialogData.betDataList)
          ? `${this.crowdDialogData.betDataList[index].playName}-${this.crowdDialogData.betDataList[index].name}`
          : `${this.crowdDialogData.betDataList.playName}-${this.crowdDialogData.betDataList.name}`,
      })));

      this.postCrowdFundingStart({
        acType: this.isDemoUser ? 2 : 1,
        betList: crowdFundingSubmitList,
        commission: this.commissionPercent * 100,
        endTime: this.crowdDialogData.endTime,
        issueAlias: this.issueAlias.toString(),
        lotteryId: this.lotteryId,
        pCode: this.crowdDialogData.pCode,
        pDate: this.crowdDialogData.pDate,
        selfpurchaseCopies: this.subscriptions,
        sourceName: 'PC',
        sourceType: 1,
        startTime: this.crowdDialogData.startTime,
        totalAmount: this.crowdDialogData.totalAmount * 100,
        totalCopies: this.segmentations,
      }).then((res) => {
        if (!res) {
          this.btnDisable = false;
          return;
        }
        this.getMemberBalance();
        this.openDialog({
          title: '',
          content: `您已经成功支付
              请随时关注开奖信息`,
          icon: 'check',
          dialogType: 'check',
          dialogCloseCallback: () => this.$router.push('/crowdFunding'),
        });
      });
    },
  },
};
</script>

<style>

</style>
