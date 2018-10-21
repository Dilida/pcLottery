<template>
  <div class="bet-item-group__header">
    <div class="bet-item-group__title">
    {{item.name}}
    </div>
    <div v-if="payoffHide" class="bet-item-group__payoff">
      赔率：<span>{{groupBetPayOff==='-'? '-': payoffFormat(groupBetPayOff)}}</span>
    </div>
  </div>
</template>

<script>
import betOrderMixin from 'src/betOrderMixin';
import { mapGetters } from 'vuex';

export default {
  name: 'playHeader',
  mixins: [betOrderMixin],
  props: ['item'],
  data() {
    return {
      // 群组选注预设赔率 自选不中 合肖
      groupBetPayOff: '-',
    };
  },
  computed: {
    ...mapGetters({
      playGroups: 'game/getPlayGroups',
    }),
    payoffHide() {
      if ([1170000, 1130000].includes(this.playGroupId)) {
        return true;
      }
      return false;
    },
  },
  watch: {
    bet() {
      this.getPayOff();
    },
  },
  methods: {
    /**
     * 客制化投注 自选不中/合肖
     * 需依照下注数量取得payoff & cid
     */
    getPayOff() {
      this.groupBetPayOff = '-';
      const key = this.playGroupId.toString().substr(0, 3);
      let size = 0;

      switch (key) {
        case '117': // 自选不中
          size = 4; // 选注5-12
          break;
        case '113': // 合肖
          size = 1; // 选注 2-12
          break;
        default:
          return;
      }
      this.$_lodash.get(this.playGroups, '0.payoffGroup', [])
        .forEach((f) => {
          const limit = (this.bet.length - size) + parseInt(`${key}1100`, 10);
          if (f.cid === limit) {
            this.$store.commit('game/updateBetData', f);
            this.groupBetPayOff = f.oddsData.payoff;
          }
        });
    },
  },
};
</script>

<style lang="stylus" scoped>
.q-item, .q-list
  padding 0
</style>
