<template>
  <div class="col-12 lobby-bill-bord">
    <div class="col-12 row promo-primary-wrap">
      <div v-if="defaultIndex.includes(styleName)" class="col-12 promo-primary">
        <div class="promo-primary__item">
          <div class="promo-primary__icon">
            <img :src="getPicUrl(togetherLottery.lotteryImg)"
            v-if="!$_lodash.isEmpty(togetherLottery)"/>
            <!-- NOTE:先做成背景，这样才可以在切换风格的时候变图 -->
            <span class="logo-crowdfunding" v-else></span>
          </div>
          <div class="promo-primary__label">
            合购推荐
          </div>
          <span class="lobby-primary-text" v-if="!$_lodash.isEmpty(togetherLottery)">
            {{togetherLottery.lotteryName}}
          </span>
          <span v-else>众筹彩</span>
          <span class="jackpot-money">
            当前合买人数:
            {{currencies(statusData.users)}}
          </span>
          <div class="promo-primary__btn">
            <q-btn
              @click.native="methodToLottery(998)">立即投注</q-btn>
          </div>
        </div>
      </div>
      <div v-else class="col-12 promo-primary">
        <div class="promo-primary__item">
          <div class="promo-primary__icon">
            <img :src="getPicUrl(togetherLottery.lotteryImg)"
            v-if="!$_lodash.isEmpty(togetherLottery)"/>
            <!-- NOTE:先做成背景，这样才可以在切换风格的时候变图 -->
            <span class="logo-crowdfunding" v-else></span>
          </div>
          <div class="promo-primary__label">
            合买推荐
          </div>
          <div class="promo-primary__text">
            <div class="jackpot-label">
              <span class="lobby-primary-text" v-if="!$_lodash.isEmpty(togetherLottery)">
                {{togetherLottery.lotteryName}}</span>
              <span v-else>众筹彩- 当前合买人数</span>
            </div>
            <div class="jackpot-money">{{currencies(statusData.users)}}</div>
          </div>
          <div class="promo-primary__btn">
            <q-btn
              class="btn-strong"
              @click.native="methodToLottery(998)" >立即投注</q-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { globalMixin } from 'src/globalMixin';
import { crowdFundingMixin } from 'src/crowdFundingMixin';
import lobbyCountdown from 'components/lobbyCountdown';

export default {
  name: 'lobbyCrowdFunding',
  mixins: [globalMixin, crowdFundingMixin],
  components: {
    lobbyCountdown,
  },
  data() {
    return {
      togetherLottery: {},
      statusData: [],
    };
  },
  created() {
    this.setNowTime();
  },
  mounted() {
    this.getCrowdFundingInfo();
  },
  watch: {
    isLoggedIn: {
      handler(newVal) {
        this.togetherLottery = [];
        if (newVal && !this.isDemoUser) {
          this.getCrowdFundingLottery();
        }
      },
      immediate: true,
    },
  },
  methods: {
    async getCrowdFundingInfo() {
      this.statusData = await this.getCrowdStats();
    },
    async getCrowdFundingLottery() {
      if (this.isDemoUser) return;
      const res = await this.getLoginedCrowdStats();
      const { name: lotteryName, imgLeftUrl: lotteryImg, id: lotteryId } = res;
      this.togetherLottery = { lotteryName, lotteryImg, lotteryId };
    },
  },
};
</script>

<style>
</style>
