<template>
    <div class="lottery-award-history">
      <div class="text-strong lottery-issue-alias">
        {{ isMmcPlay ? "上" : "第" }}
        <span class="text-important" v-if="!isMmcPlay">{{data.issueAlias}}</span>期开奖号码
      </div>
      <div class="col-12 bead-pastview"
      v-if="data.winNumberArr && $_lodash.isArray(data.winNumberArr)">
        <span v-for="(n, j) in data.winNumber.split(',')" :key="j"
      class="bead-pastview__item">
          <span :class="`bead-lottery-${data.lotteryId} num_${n} historyBead`">{{n}}</span>
        </span>
      </div>
      <div class="col-12 bead-pastview" v-else>
        <span v-for="(n, j) in data.winNumberArr.first" :key="`first${j}`"
        class="bead-pastview__item">
          <span :class="`bead-lottery-${data.lotteryId} num_${n} historyBead`">{{n}}</span>
        </span>
        {{[10,110].includes(data.lotteryId) ? "+" : "="}}
        <span class="bead-pastview__item">
          <span :class="`bead-lottery-${data.lotteryId} num_${data.winNumberArr.last} historyBead`">
            {{data.winNumberArr.last}}</span>
        </span>
      </div>
      <div class="double-row">
        <div class="pastview-blockchain" v-if="data.block">
          <a :href="data.blockChainList" target="_blank">区块高度{{data.block}}</a>
        </div>
        <span class="double-row__item" v-for="(item, i) in data.doubleData" :key="i">
          <span class="double-name">{{item}}</span>
        </span>
      </div>
    </div>
</template>

<script>

export default {
  name: 'lotteryAwardHistory',
  props: ['data', 'isMmcPlay'],
  data() {
    return {
      previousWinNumber: '',
    };
  },
  watch: {
    data(val) {
      if (val.winNumber !== this.previousWinNumber) {
        this.beadAnimation();
        this.previousWinNumber = val.winNumber;
      }
    },
  },
  mounted() {
    this.previousWinNumber = this.data.winNumber;
    this.beadAnimation();
  },
  methods: {
    beadAnimation() {
      this.$TweenMax.staggerFrom('.historyBead', 0.4, {
        x: 100,
        opacity: 0,
        rotation: 360,
      }, 0.2);
      this.$TweenMax.staggerFrom('.double-row__item', 0.5, { scaleY: 0, opacity: 0, ease: this.$Bounce.easeOut }, 0.3);
    },
  },
};
</script>

<style lang="stylus">
</style>
