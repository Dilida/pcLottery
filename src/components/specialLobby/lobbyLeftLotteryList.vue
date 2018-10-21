<template>
          <q-list class="lobby-hot-game">
            <!-- 眾籌 -->
            <q-item
            v-if="showCrowdFunding"
            class="lobby-hot-game__item"
            @click.native="methodToLottery(998)">
              <div class="lobby-hot-game__icon logo-crowdfunding">
              </div>
              <div class="lobby-hot-game__name">
                <span>目前累积众筹</span>
                <span class="after-chip">
                  <q-chip floating>火</q-chip>
                </span>
              </div>
              <div class="lobby-hot-game__people">
                <span>{{currencies(statusData.users)}}</span>人
              </div>
            </q-item>
            <!-- 一条 -->
            <q-item class="lobby-hot-game__item"
            v-for="(item, key) in showData" :key="key"
            @click.native="methodToLottery(item.id)">
              <div class="lobby-hot-game__icon">
                <img :src="getPicUrl(item.imgUrl)" alt="">
              </div>
              <div class="lobby-hot-game__name">
                <span>{{item.name}}</span>
                <span class="after-chip">
                  <q-chip floating v-if="item.ifHot">火</q-chip>
                  <q-chip floating v-if="item.ifNew">新</q-chip>
                </span>
              </div>
              <div class="lobby-hot-game__periods">{{item.periodContent}}</div>
            </q-item>
          </q-list>
</template>

<script>
import { globalMixin } from 'src/globalMixin';
import { crowdFundingMixin } from 'src/crowdFundingMixin';

export default {
  name: 'lobbyLeftLotteryList',
  mixins: [globalMixin, crowdFundingMixin],
  props: ['showCrowdFunding'],
  data() {
    return {
      showData: [],
      statusData: [],
    };
  },
  created() {
  },

  mounted() {
    this.getLotteryList();
    this.getCrowdFundingInfo();
  },
  methods: {
    async getCrowdFundingInfo() {
      this.statusData = await this.getCrowdStats();
    },
    async getLotteryList() {
      const result = await this.getThreeBossHotLotteryList();
      this.showData = result;
    },
  },
};
</script>

<style>
</style>
