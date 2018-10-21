<template>
  <div class="lottery-main-bet-area">
    <div class="bet-item-group row">
      <div class="bet-item-group__column"
        :class="`${blockClass} bet-group-${playGroupId}`"
        v-for="(item,i) in playGroups"
        :key="`group_${i}`"
      >
        <playHeader :item="item" />
        <!-- NOTE: 两面、前中后 -->
        <div class="bet-item-wrap">
        <playItem
          v-for="(child, i) in item.childrens"
          :key="i"
          :parent="item"
          :item="child"
        />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import betOrderMixin from 'src/betOrderMixin';
import playItem from 'components/play/item';
import playHeader from 'components/play/header';
import { mapGetters, mapMutations } from 'vuex';
import { setTimeout } from 'timers';

export default {
  name: 'playGroup',
  mixins: [betOrderMixin],
  components: {
    playItem,
    playHeader,
  },
  data() {
    return {
    };
  },
  computed: {
    ...mapGetters('game', { playGroups: 'getPlayGroups' }),
    blockClass() {
      return [1170000].includes(this.playGroupId) ? 'play-tree__block--1170000' : '';
    },
  },
  watch: {
    playGroups() {
      this.devRandomBet();
    },
  },
  mounted() {
    setTimeout(() => {
      this.devRandomBet();
    }, 1000);
  },
  methods: {
    ...mapMutations('game', ['setBetData', 'setBetAmount']),
    // 测试时用 自动选注
    devRandomBet() {
      if (!this.isDev) return;
      this.clearBetData();
      let child = [];
      this.playGroups.forEach((item) => {
        child = [...child, ...item.childrens];
      });
      this.setBetAmount(this.$_lodash.random(1, 10));
      const betItem = this.$_lodash.sampleSize(child, 5);
      betItem.forEach((item) => {
        item.amount = this.$_lodash.random(2, 15);
        this.betItem(item);
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
.play-tree__block:last-of-type
  padding-bottom 3rem
</style>

