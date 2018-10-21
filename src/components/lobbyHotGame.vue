<template>
  <div class="lobby-hot-game">
    <div class="lobby-titlebar">
      <span class="lobby-titlebar__icon">
        <q-icon name="icon-tool icon-dice"></q-icon>
      </span>
      <span class="lobby-titlebar__text">热门彩种<small>HOT LOTTERY</small></span>
    </div>
    <div
    class="lobby-hot-game__list"
    :class="{'col-12 row':!defaultIndex.includes(styleName)}"
    >
      <q-item
      v-for="(item, i) in hotLotteryList"
      :key="i"
      :to="getRouteLotteryPath(item.id)"
      class="col justify-center">
        <div class="lobby-hot-game__item">
          <div class="lobby-hot-game__icon"><img :src="item.imgUrl" /></div>
          <div class="lobby-hot-game__name">{{item.name}}</div>
        </div>
      </q-item>
    </div>
  </div>
</template>

<script>
import { globalMixin } from 'src/globalMixin';

export default {
  // name: 'ComponentName',
  mixins: [globalMixin],
  data() {
    return {
      hotLotteryList: [],
    };
  },
  mounted() {
    this.methodGetHotLotteryList();
  },
  methods: {
    async methodGetHotLotteryList() {
      // 取得热门彩种列表
      const res = await this.getHotLotteryList();
      this.hotLotteryList = res.list;
    },
  },
};
</script>

<style>
</style>
