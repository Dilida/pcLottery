<template>
          <div class="lobby-promo">
            <q-tabs no-pane-border class="tabs">
              <!-- Tabs - notice slot="title" -->
              <q-tab slot="title" v-for="(item, key) in hotLotteryListLabel"
              :label="item" :key="key" :default="key===0" @click="changeTab(key)"/>
              <div class="q-tab-pane row">
                <q-list class="col-4 lottery-item-group"
                  v-for="(item, key) in selectedData" :key="key">
                  <q-item class="row justify-between">
                    <div class="col-auto lottery-item-name">{{item.lotteryName}}</div>
                    <div class="col-auto lottery-item-padate">
                      第<span class="text-strong">{{item.pre.issueAlias}}</span>期
                    </div>
                  </q-item>
                  <q-item class="lottery-item-wrap">
                      <BallShow v-if="item.pre.winNumberArr" :data="item.pre" />
                    <div class="lottery-item-btns">
                      <q-btn class="btn-trend"
                        @click="$router.push(`/history?lotteryId=${item.lotteryId}`)">号码走势</q-btn>
                      <q-btn class="btn-go-bet"
                        @click.native="methodToLottery(item.lotteryId)">
                      立即投注</q-btn>
                    </div>
                  </q-item>
                </q-list>
              </div>
            </q-tabs>
          </div>
</template>

<script>
import { globalMixin } from 'src/globalMixin';
import BallShow from 'components/play/ballShow';
import { setTimeout, clearTimeout } from 'timers';

export default {
  name: 'lobbyBillBoard',
  mixins: [globalMixin],
  components: {
    BallShow,
  },
  data() {
    return {
      hotLotteryListLabel: ['高频开奖', '低频开奖', '境外玩法'],
      allLotteryId: [108, 102, 106, 16, 30, 10, 112, 114, 24],
      selectedData: [],
      hotLotterySelected: 0,
      hotLotteryListData: [],
      timer: '',
    };
  },
  created() {
  },
  watch: {
    hotLotterySelected(newValue, oldValue) {
      if (newValue === oldValue) return;
      this.selectedData = this.hotLotteryListData[this.hotLotterySelected];
    },
  },
  mounted() {
    this.getAllData();
  },
  destroyed() {
    clearTimeout(this.timer);
  },
  methods: {
    getNewData() {
      // 每分鐘更新一次資料
      this.timer = setTimeout(() => {
        this.getAllData();
      }, 1000 * 60);
    },
    async getAllData() {
      const callBackData = [];
      await Promise.all(this.allLotteryId.map(async (item) => {
        const res = await this.getRecentPrize(item);
        callBackData.push(res);
      }));
      // 固定住順序 & 調整winnmber
      const adjustData = this.allLotteryId.map((item) => {
        const newData = callBackData
          .find(item2 => item2.lotteryId === item);
        const adjustWinNumber = {
          ...newData,
          pre: this.newPreData(item, newData.pre),
        };
        return adjustWinNumber;
      });
      this.hotLotteryListData = this.$_lodash.chunk(adjustData, 3);
      this.selectedData = this.hotLotteryListData[this.hotLotterySelected];
      this.getNewData();
    },
    changeTab(selected) {
      this.hotLotterySelected = selected;
    },
  },
};
</script>

<style>
</style>
