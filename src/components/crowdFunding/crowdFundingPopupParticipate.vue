<template>
  <q-modal
    class="modal modal--md"
    v-model="showing">
    <div class="modal__header">
      <div class="modal__header-title">
        {{ modalTitle }}
      </div>
      <q-btn
        class="modal__close"
        icon="icon-tool icon-close"
        @click="closeModal()"/>
    </div>
    <div class="modal__body">
      <!--title-->
      <div class="row crowdfunding-lottery">
        <div class="col-4 column crowdfunding-lottery__name">
          <span><img :src="logoImg" /></span>
          <span>{{newList.lotteryName}}</span>
        </div>
        <div class="col-8 column">
          <div class="col row justify-between crowdfunding-lottery__date">
            <span>第{{newList.issueAlias}}期</span>
            <span>众筹编号{{newList.crowdFundingNum}}</span>
          </div>
          <div class="col row justify-between crowdfunding-lottery__info">
            <span>发起人{{newList.founderAccount}}</span>
            <span>众筹盈利统计 {{newList.profitPercentage ? newList.profitPercentage:0}}%</span>
          </div>
          <div class="col row justify-between crowdfunding-lottery__info">
            <span>剩余{{newList.remainCopies ? newList.remainCopies:0}}份</span>
            <span>累计奖金 {{roundAmt(newList.totalJackpot ? newList.totalJackpot:0)}}</span>
          </div>
        </div>
      </div>
      <!--content-->
      <div class="crowdfunding-popup-participate">
        <div class="row justify-between crowdfunding-list">
          <div class="row col-12 crowdfunding-list__title">
            <span class="text-strong">众筹信息</span>
          </div>
          <div class="row crowdfunding-list__item">
            <div class="col-4">每份：
              <span>
                {{roundAmt(newList.copyAmount ? newList.copyAmount : 0 )}}元
              </span>
            </div>
            <div class="col-4">总份数：
              <span>
                {{newList.totalCopies ? newList.totalCopies : 0}}
              </span>
            </div>
            <div class="col-4">佣金：
              <span>
                {{roundAmt(newList.copyCommission ? newList.copyCommission : 0)}}元/份
              </span>
            </div>
            <div class="col-4">自购：
              <span>
                {{newList.selfpurchaseCopies ? newList.selfpurchaseCopies : 0}}份
              </span>
            </div>
            <div class="col-4">已参与：
              <span>
                {{newList.addCopies ? newList.addCopies : 0}}份
              </span>
            </div>
            <div class="col-4">距截止：
              <span>
                {{realTime ? realTime : 0}}
              </span>
            </div>
          </div>

          <div class="row crowdfunding-list__item">
            <div class="col-6">
              <span>众筹投注</span>
              <span>参与后可查看</span>
            </div>

            <div class="col-6 text-right">
              <span>佣金</span>
              <span>仅盈利后支付</span>
            </div>

            <div class="col-6 crowdfunding-list__item-date">
              <span>发起日期</span>
              <span>{{time2Date(newList.startTime ? newList.startTime : 0)}}</span>
            </div>

            <div class="col-6 crowdfunding-list__item-date text-right">
              <span>截止日期</span>
              <span>{{time2Date(newList.endTime ? newList.endTime : 0)}}</span>
            </div>

          </div>
        </div>
      </div>
    </div>
    <div class="modal__footer">
      <div class="row">
        <div class="col row items-center">
          <span class="col-3">购买</span>
          <q-input type='tel'
            class="col bet-input"
            numeric-keyboard-toggle
            clearable
            hide-underline
            color="white"
            v-model='amount'
            />
          <span class="col-3">份</span>
        </div>
        <q-btn
        class="btn-bet"
        icon="icon-bet"
        @click="confirmParticipate()">参与众筹</q-btn>
        <!-- <q-btn
          color="primary"
          @click="closeModal()">关闭</q-btn> -->
      </div>
    </div>
  </q-modal>
</template>

<script>
import { globalMixin } from 'src/globalMixin';
import { crowdFundingMixin } from 'src/crowdFundingMixin';

export default {
  mixins: [globalMixin, crowdFundingMixin],
  props: ['modalShow', 'modalTitle', 'selectShow'],
  data() {
    return {
      showing: this.modalShow,
      newList: [],
      realTime: '',
      amount: 0,
      logoImg: '',
      selectOptions: this.$q.sessionStorage.get.item('crowdFundingLottery'),
    };
  },
  watch: {
    showing(val) {
      this.$emit('closeModal', val);
    },
  },
  created() {
    // console.log(`${this.modalTitle} modalCreated`);
  },
  destroyed() {
    // console.log(`${this.modalTitle} modalDestroyed`);
  },
  mounted() {
    this.getcrowdFundingDetail();
  },
  methods: {
    confirmParticipate() {
      this.amount = parseInt(this.amount, 10);
      if (this.amount === '' || Number.isNaN(this.amount) || this.amount === 0 || this.amount < 0) {
        this.amount = '';
        this.openDialog({
          content: '请输入整数的投注份数',
          dialogType: 'negative',
        });
        return;
      }
      if (this.amount > this.newList.remainCopies) {
        this.amount = '';
        this.openDialog({
          content: '剩余份数不足',
          dialogType: 'negative',
        });
        return;
      }
      this.newList = {
        ...this.newList,
        selectCopies: this.amount,
      };
      this.$emit('submitModal', this.newList);
    },
    closeModal() {
      this.showing = false;
    },
    // 取得眾籌清單的資料
    async getcrowdFundingDetail() {
      const res = await this.getCrowdFundingProcessingDetail({
        UserAccount: this.username,
        crowdfundingNum: this.selectShow,
      });
      if (!res) {
        setTimeout(() => this.closeModal(), 500);
        return;
      }
      this.newList = res;
      this.realTime = this.changeEndTime();
      this.logoImg = this.selectOptions.find(data =>
        data.id === this.newList.lotteryId).lotteryImgUrl;
    },

    /**
     * @name 算出截止時間
     */
    changeEndTime() {
      if (this.newList.endTime < Date.now()) {
        return '已截止';
      }
      const remainTime = new Date(this.newList.endTime - Date.now());
      const minutes = 1000 * 60;
      const hours = minutes * 60;
      const days = hours * 24;
      const hoursNum = Math.floor(remainTime / hours);
      const minutesNum = Math.floor(((remainTime % days) % hours) / minutes);
      if (hoursNum > 0) {
        return `${hoursNum}小时${minutesNum}分钟`;
      }
      return `${minutesNum}分钟`;
    },
  },
};
</script>

<style>
</style>
