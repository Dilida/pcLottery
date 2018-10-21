<template>
  <div class="col-12 lobby-bill-bord">
    <div class="col-12 row promo-secondary-wrap">
      <div class="promo-secondary__tag" v-if="isTag">
        <q-btn v-for="(item, i) in hotLotteryList"
        :key="i"
        :label="item.label"
        :class="i == nowTag ? 'tag':''"
        @click.prevent="changeTag(i)"/>
      </div>
      <div v-if="isTag"
        class="promo-secondary"
        :class="'col-12'" >
        <div v-if="defaultIndex.includes(styleName)" class="promo-secondary__item">
          <div class="promo-secondary__icon">
            <img :src="hotLotteryList[nowTag].imgUrl" />
          </div>
          <p>{{hotLotteryList[nowTag].name}} 第<span>{{"123456789"}}</span>期</p>
          <p>
            累计派彩金额: <span>{{"123,456,789"}}</span>
            <lobbyCountdown
              :countdownId="hotLotteryList[nowTag].id"
              :countdownTimeDisplay="hotLotteryList[nowTag].prizeCloseTime"
              :countdownTime="hotLotteryList[nowTag].endTime"
              :nowTime="nowTime"
              @getNewCountdownTime="methodGetNewCountdownTime" />
          </p>
          <div class="promo-secondary__btn">
            <q-btn
              class="btn-action"
              @click.native="methodToLottery(hotLotteryList[nowTag].id)" >
                立即參与
            </q-btn>
          </div>
        </div>
        <div v-else class="promo-secondary__item">
          <div class="promo-secondary__icon">
            <img :src="hotLotteryList[nowTag].imgUrl" />
            <span>{{hotLotteryList[nowTag].name}}</span>
          </div>
          <div class="promo-secondary__label">
            {{hotLotteryList[nowTag].label}}
          </div>
          <lobbyCountdown
            :countdownId="hotLotteryList[nowTag].id"
            :countdownTimeDisplay="hotLotteryList[nowTag].prizeCloseTime"
            :countdownTime="hotLotteryList[nowTag].endTime"
            :nowTime="nowTime"
            @getNewCountdownTime="methodGetNewCountdownTime" />
          <div class="promo-secondary__btn">
            <q-btn
              class="btn-action"
              @click.native="methodToLottery(hotLotteryList[nowTag].id)" >
                立即投注
            </q-btn>
          </div>
        </div>
      </div>
      <div v-else
        v-for="(item, i) in hotLotteryList"
        :key="i"
        class="promo-secondary"
        :class="'col-4'"
        >
        <div class="promo-secondary__item">
          <div class="promo-secondary__icon">
            <img :src="item.imgUrl" />
            <span>{{item.name}}</span>
          </div>
          <div class="promo-secondary__label">
            {{item.label}}
          </div>
          <lobbyCountdown
            :countdownId="item.id"
            :countdownTimeDisplay="item.prizeCloseTime"
            :countdownTime="item.endTime"
            :nowTime="nowTime"
            @getNewCountdownTime="methodGetNewCountdownTime" />
          <div class="promo-secondary__btn">
            <q-btn
              class="btn-action"
              @click.native="methodToLottery(item.id)" >
                立即投注
            </q-btn>
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
  name: 'lobbyBillBoard',
  mixins: [globalMixin, crowdFundingMixin],
  props: ['isTag'],
  components: {
    lobbyCountdown,
  },
  data() {
    return {
      hotLotteryList: [],
      hotLotteryWhiteList: [],
      hotLotteryListLabel: ['最新玩法', '中奖率高', '闪电开奖'],
      countdownInterval: [null, null, null],
      getSetTimeout: null,
      // 倒数用
      nowTime: '',
      // 计时器
      interval: '',
      nowTag: 0,
    };
  },
  created() {
    this.setNowTime();
  },
  destroyed() {
    clearInterval(this.interval);
  },
  mounted() {
    this.methodGetHotLotteryList();
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
    async methodGetHotLotteryList() {
      // 取得热门彩种列表
      const res = await this.getHotLotteryList();
      if (res) {
        const { countdown } = res;
        if (countdown) {
          const ids = [];
          this.hotLotteryList = countdown.map((lotteryItem, lotteryIndex) => {
            const { id, name, imgUrl } = lotteryItem;
            const label = this.hotLotteryListLabel[lotteryIndex];
            const prizeCloseTime = 0;
            const endTime = 0;
            ids.push(id);
            return {
              id,
              name,
              imgUrl,
              label,
              prizeCloseTime,
              endTime,
            };
          });
          if (ids.length) {
            this.hotLotteryWhiteList = [...ids];
            this.methodGetHotLotteryCycleList(ids);
          }
        }
      }
    },
    // 热门彩种下注倒计时获取
    async methodGetHotLotteryCycleList(ids, triggerLotteryId, lastCountdownTime) {
      const param = { ids: ids.toString() };
      const result = await this.getHotLotteryCycle(param);
      if (result.length) {
        // 檢查倒計時id與熱門彩種id差異
        const whiteList = [];
        this.hotLotteryWhiteList.forEach((whiteLotteryId) => {
          const tmp = result.find(lotteryItem => lotteryItem.lotteryId === whiteLotteryId);
          if (tmp) whiteList.push(whiteLotteryId);
        });
        this.hotLotteryWhiteList = [...whiteList];
        // 獲取熱門彩種倒計時
        result.forEach((cycleItem) => {
          const cycleHotLottery = this.hotLotteryList
            .find(lotteryItem => lotteryItem.id === cycleItem.lotteryId);
          if (cycleHotLottery) {
            if (triggerLotteryId &&
              cycleHotLottery.id === triggerLotteryId &&
              cycleHotLottery.endTime === cycleItem.endTime &&
              lastCountdownTime === cycleItem.endTime) {
              setTimeout(() => {
                this.methodGetNewCountdownTime(triggerLotteryId, lastCountdownTime);
              }, 1000);
            }
            cycleHotLottery.prizeCloseTime = cycleItem.prizeCloseTime;
            cycleHotLottery.endTime = cycleItem.endTime;
          }
        });
      }
    },
    methodGetNewCountdownTime(lotteryId, lastCountdownTime) {
      if (this.hotLotteryWhiteList.length) {
        this.methodGetHotLotteryCycleList(
          this.hotLotteryWhiteList,
          lotteryId,
          lastCountdownTime,
        );
      }
    },
    methodWaitPrize() {
      console.log('waitPrize');
    },
    changeTag(index) {
      this.nowTag = index;
    },
  },
};
</script>

<style>
</style>
