<template>
  <div class="lobby-recommend">
    <q-tabs class="tabs">
    <!-- Tabs - notice slot="title" -->
    <q-tab slot="title" v-for="(item, key) in hotLotteryListLabel"
    :label="item" :key="key" :default="key===0" @click="changeTab(key)"/>
    <div class="q-tab-pane" v-if="!$_lodash.isEmpty(selectedData)">
      <q-list class="row lottery-item-group lobby-recommend__top">
          <q-item class="row justify-between lobby-recommend__header">
            <div class="col-auto lottery-item-pdate">
              第<span class="text-strong">{{selectedData.pre.issueAlias}}</span>期
            </div>
            <div class="col-auto lottery-item-history">
              <div class="double-row">
                <span class="pastview-blockchain" v-if="preData.block">
                  <a :href="preData.blockChainList" target="_blank">
                    区块高度{{preData.block}}
                  </a>
                </span>
                <span class="double-row__item"
                  v-for="(item, key) in selectedData.pre.doubleData"
                  :key="key"
                >
                  <span class="double-name">{{item}}</span>
                </span>
              </div>
            </div>
          </q-item>
          <q-item class="row lobby-recommend__main">
            <div class="lottery-item-icon">
              <img :src="selectedImg">
            </div>
            <BallShow :data="preData"/>
          </q-item>
        </q-list>
        <q-list class="row lottery-item-group lobby-recommend__bottom">
          <q-item class="row justify-between lobby-recommend__header">
            <div class="col-auto lottery-item-pdate">
              第<span class="text-strong">{{selectedData.now.issueAlias}}</span>期
            </div>
          </q-item>
          <q-item class="row justify-between lobby-recommend__main">
            <div class="col-auto">
                <lobbyCountdown
                  :countdownId="selectedData.lotteryId"
                  :countdownTimeDisplay="selectedData.now.endTime"
                  :countdownTime="selectedData.now.endTime"
                  :nowTime="nowTime"
                  @getNewCountdownTime="methodGetNewCountdownTime" />
            </div>
            <div class="col-auto">
              <q-btn class="btn-trend"
              @click="$router.push(`/history?lotteryId=${selectedData.lotteryId}`)">
              号码走势</q-btn>
              <q-btn class="btn-go-bet"
              @click.native="methodToLottery(selectedData.lotteryId)" >立即投注</q-btn>
            </div>
          </q-item>
        </q-list>
    </div>
    </q-tabs>
  </div>
</template>

<script>
import { globalMixin } from 'src/globalMixin';
import lobbyCountdown from 'components/lobbyCountdown';
import BallShow from 'components/play/ballShow';
import { setTimeout } from 'timers';

export default {
  name: 'lobbyThreeTopLottery',
  mixins: [globalMixin],
  components: {
    lobbyCountdown,
    BallShow,
  },
  data() {
    return {
      hotLotteryListData: [],
      hotLotteryListLabel: [],
      hotLotterySelected: 0,
      selectListId: new Map([
        [901, '48,50,52'], // 區塊鏈彩
        [902, '8,2,10'], // 時時彩
        [903, '8,2,10'], // 賽馬會
      ]),
      // 倒数用
      nowTime: '',
      timer: '',
    };
  },
  created() {
    this.setNowTime();
  },
  destroyed() {
    clearTimeout(this.timer);
  },
  mounted() {
    this.getThreeLotteryId();
  },
  computed: {
    selectedData() {
      return this.hotLotteryListData[this.hotLotterySelected];
    },
    preData() {
      return this.newPreData(this.selectedData.lotteryId, this.selectedData.pre);
    },
    selectedImg() {
      const getImgUrl =
        this.lottery.find(item => item.id === this.selectedData.lotteryId);
      return getImgUrl.imgUrl;
    },
  },
  methods: {
    changeTab(selected) {
      this.hotLotterySelected = selected;
    },
    methodGetNewCountdownTime(lotteryId, lastCountdownTime) {
      // 先拿下期的擋一下，然後再call api
      const returnNowTime = Date.now();
      if (lastCountdownTime < returnNowTime) {
        this.selectedData.now.issueAlias = this.selectedData.next.issueAlias;
        this.selectedData.now.prizeCloseTime = this.selectedData.next.prizeCloseTime;
        this.selectedData.now.endTime = this.selectedData.next.endTime;
      }
      this.timer = setTimeout(() => {
        this.getThreeLotteryId();
      }, 1000 * 60); // 因為後端1分鐘後才會更新api，所以1分鐘後再重新拿資料
    },
    async getThreeLotteryId() {
      const selectStyleNumber = (this.styleName === 'king' || this.styleName === 'default') ? '903' : this.styleNumber;
      if (this.selectListId.has(Number(selectStyleNumber))) {
        // 先從data selecteListId 篩選出彩種
        const threeID = this.selectListId.get(Number(selectStyleNumber)).split(',').map(x => x);
        // 每個彩種再去 call name回來
        const firstStepData = [];
        await Promise.all(threeID.map(async (item) => {
          const res3 = await this.getRecentPrize(item);
          firstStepData.push(res3);
        }));
        // 組合出彩種的name 且固定住順序
        const newListData = [];
        const newListLable = [];
        threeID.forEach((item) => {
          const newData = firstStepData
            .find(item2 => item2.lotteryId === Number(item));
          newListLable.push(newData.lotteryName);
          newListData.push(newData);
        });
        this.hotLotteryListData = [...newListData];
        this.hotLotteryListLabel = [...newListLable];
      }
    },
  },
};
</script>

<style>
</style>
