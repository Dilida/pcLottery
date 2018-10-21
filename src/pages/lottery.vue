<template>
  <q-page class="lottery">
    <div class="row layout-width page-bg">
      <div class="layout-main">
        <div class="col-12 row lottery-header">
          <Logo :data="lotteryInfo"/>
          <LotteryCountdown
            ref="countdown"
            :data="lotteryNow" v-if="!$_lodash.isEmpty(lotteryNow)"/>
          <!-- 秒秒彩的倒数时间以静态图片取代 -->
          <div v-else>
            <div class="lottery-countdown lottery-countdown--mmc">
            </div>
          </div><!-- 秒秒彩 -->
          <AwardHistory :data="setWinNumber(lotteryPre)" :isMmcPlay="isMmcPlay"
          v-if="$_lodash.has(lotteryPre, 'doubleData')"/>
        </div>
        <MainArea :data="lotteryNow"/>
        <LoadBead :keyValue="loadBeadKeyValue"
        :dataInit="loadBeadList[selectedID]"
        :activeTabId="selectedID"
        v-if="!$_lodash.isEmpty(loadBeadKeyValue)"
        @changeTab="changeTabFunc"
        />
      </div>
      <div class="layout-side">
        <LastAward :data="pastPrize" v-if="!$_lodash.isEmpty(pastPrize)"/>
        <BetHistory :data="betListHistory" v-if="!$_lodash.isEmpty(betListHistory)"/>
      </div>
    </div>

  </q-page>
</template>

<script>
import betOrderMixin from 'src/betOrderMixin';

import AwardHistory from 'components/lottery/lotteryAwardHistory';
import BetHistory from 'components/lottery/lotteryBetHistory';
import LastAward from 'components/lottery/lotteryLastAward';
import LoadBead from 'components/lottery/lotteryLoadBead';
import Logo from 'components/lottery/lotteryLogo';
import LotteryCountdown from 'components/lottery/lotteryCountdown';
import MainArea from 'components/play/mainArea';
import { globalMixin } from 'src/globalMixin';

import { mapState } from 'vuex';

export default {
  name: 'Lottery',
  mixins: [
    betOrderMixin,
    globalMixin,
  ],
  components: {
    AwardHistory,
    BetHistory,
    LastAward,
    LoadBead,
    Logo,
    LotteryCountdown,
    MainArea,
  },
  data() {
    return {
      selectedID: 0,
    };
  },
  computed: {
    ...mapState('game', [
      'lotteryId',
      'lotteryName',
      'lotteryPre',
      'lotteryNow',
      'pastPrize',
      'betListHistory',
      'loadBeadList',
      'loadBeadKeyValue',
      'isMmcPlay',
    ]),
    lotteryInfo() {
      const defaultInfo = {
        cid: 0,
        name: '',
        lotteryImgUrl: '',
      };
      return this.lotteryLists.find(f => f.cid === this.lotteryId) || defaultInfo;
    },
    nowTime() {
      const time = parseInt((new Date().getTime() / 1000), 10) - this.diffTime;
      return parseInt(`${time}000`, 10);
    },
  },
  watch: {
    // 彩种变动就更新奖期资料
    lotteryId(data) {
      this.initLotteryPage(data);
      this.initGetData();
      this.selectedID = 0;
    },
    lotteryLists() {
      const cid = this.getLotteryIdByUrl();
      this.setLotteryId(cid);
    },
  },
  created() {
    // this.$q.loading.show();
    const cid = this.getLotteryIdByUrl();
    this.setLotteryId(cid);
    this.initLotteryPage(cid);
  },
  mounted() {
    this.initGetData();
  },
  methods: {
    changeTabFunc(value) {
      this.selectedID = value;
    },
    initGetData() {
      this.getMemberBalance();
      this.getNowPriodData(this.lotteryId);

      // 露珠
      this.getDouble(this.lotteryId);
    },
  },
};
</script>

<style lang="stylus">

</style>
