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
          <span>{{data.lotteryName}}</span>
        </div>
        <div class="col-8 column">
          <div class="col row justify-between crowdfunding-lottery__date">
            <span>第{{data.issueAlias}}期</span>
            <span>众筹编号{{data.crowdFundingNum}}</span>
          </div>
          <div class="col row justify-between crowdfunding-lottery__info">
            <span v-if="selectedID==1">发起人{{data.founderAccount}}</span>
            <span v-if="data.crowdFundingStatus==1">
              <p>{{data.listPayoff === 0 ? `未中奖` : `派奖${roundAmt(data.listPayoff)}元`}}</p>
              <p v-if="selectedID === 1">
                {{`已扣佣金${roundAmt(data.commission ? data.commission : 0)}元`}}
              </p>
              <p v-else>
                {{`已收佣金${roundAmt(data.earnCommission ? data.earnCommission :0)}元`}}
              </p>
            </span>
            <span v-else>
              {{setStatus(data.crowdFundingStatus)}}
            </span>
            {{(selectedID === 1) ? '购买份数' : '自购份数'}}: {{data.callCopies}}
          </div>
        </div>
      </div>
      <!--infomation-->
      <!-- 众筹详情 -->
      <div class="crowdfunding-list">
        <div class="crowdfunding-list__title">
          <span class="text-strong">众筹详情</span>
        </div>
        <div class="row justify-between crowdfunding-list__item"
        v-for="(item, key) in data. betList"
        :key="key" >
          <div class="crowdfunding-list__item-name">
            <div>{{item.playName}}</div>
            <div><span class="text-important">{{roundAmt(item.betAmount)}}</span>元</div>
          </div>
          <div class="crowdfunding-list__right" v-if="data.crowdFundingStatus === 1">
            <div>{{showPayoffStatus(item.detailPayoff)}}
              <span class="text-important" v-show="item.detailPayoff !== 0">
              {{roundAmt(item.detailPayoff)}}</span><span v-show="item.detailPayoff !== 0">元</span>
            </div>
          </div>
          <div class="crowdfunding-list__right" v-else>
            <div>等待开奖</div>
          </div>
        </div>
      </div>
      <div class="row crowdfunding-footer">
        <div class="col-12 row crowdfunding-footer__count">
          <div class="col">方案总奖金</div>
          <div class="col text-right">
            {{data.totalPayoff === -1 ? '等待开奖' : roundAmt(data.totalPayoff)}}
          </div>
        </div>
        <div class="col-12 row justify-end crowdfunding-footer__right">
          <span v-if="selectedID === 1">参与日期：</span>
          <span v-else>发起日期：</span>
          <span>{{time2Date(data.followCreateTime)}}</span>
        </div>
      </div>
    </div>
    <div class="modal__footer">
      <q-btn
        class="btn-primary btn-lg"
        @click="closeModal()">关闭</q-btn>
    </div>
  </q-modal>
</template>

<script>
import { globalMixin } from 'src/globalMixin';

export default {
  mixins: [globalMixin],
  props: ['modalShow', 'modalTitle', 'data', 'selectedID'],
  data() {
    return {
      showing: this.modalShow,
      showStatus: {
        0: '等待开奖',
        3: '取消',
        4: '撤单',
      },
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
    console.log(`${this.modalTitle} modalCreated`);
  },
  destroyed() {
    console.log(`${this.modalTitle} modalDestroyed`);
  },
  mounted() {
    this.logoImg = this.selectOptions.find(data => data.id === this.data.lotteryId).lotteryImgUrl;
  },
  methods: {
    showPayoffStatus(value) {
      if (value === 0) {
        return '未中奖';
      } else if (value > 0) {
        return '已派彩';
      } else if (value === -1) {
        return '未派彩';
      }
      return false;
    },

    setStatus(crowdFundingStatus) {
      return this.showStatus[crowdFundingStatus];
    },
    closeModal() {
      this.showing = false;
    },
  },
};
</script>

<style>
</style>
