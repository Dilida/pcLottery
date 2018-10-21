<template>
  <div class="sheng-xiao" v-if="isTeMa">
    <q-list class="sheng-xiao__list row justify-between" >
      <q-item
      v-for="(item, index) in shengXiaoList"
      :key="`sx${index}`"
      class="col">
      <q-checkbox :label="item" :val="item"
      checked-icon="check_box"
      unchecked-icon="check_box_outline_blank"
      @input="checkSelect(item)"
      v-model="selectShengXiao" />
      </q-item>
    </q-list>
  </div>
</template>

<script>
import betOrderMixin from 'src/betOrderMixin';
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'shengXiaoSelect',
  mixins: [betOrderMixin],
  data() {
    return {
      selectShengXiao: [],
      shengXiaoList: [],
      shengXiaoData: [],
    };
  },
  computed: {
    ...mapGetters({
      playGroups: 'game/getPlayGroups',
    }),
    isTeMa() {
      return [1010000].includes(this.playGroupId) && this.playGroupTabId !== '';
    },
    groups() {
      return this.playGroups
        .find(f => f.name.includes('特码'));
    },
    betGroup() {
      return this.groups.childrens;
    },
  },
  watch: {
    playGroupId() {
      this.selectShengXiao = [];
    },
    playGroupTabId() {
      this.selectShengXiao = [];
    },
    betData(newData) {
      const newKey = newData.map(m => m.name);
      this.selectShengXiao = [];
      this.shengXiaoData.forEach((sxItem) => {
        const tmepKeyCount = sxItem.key.filter(f => !newKey.includes(f.name));
        if (tmepKeyCount.length === 0) {
          this.selectShengXiao.push(sxItem.name);
        }
      });
    },
  },
  created() {
    this.shengXiaoData = this.shengXiao();
    this.shengXiaoList = this.shengXiaoData.map(m => m.name);
  },
  methods: {
    ...mapMutations('game', ['setBetData']),
    /**
     * @name 特码用 生肖选号
     */
    checkSelect(item) {
      if (this.betClose) {
        this.selectShengXiao = [];
        return;
      }
      const isBet = this.selectShengXiao.includes(item);
      const selectKey = this.shengXiaoData.find(f => f.name === item).key.map(m => m.name);
      this.betGroup.filter(f => selectKey.includes(f.name))
        .forEach((bet) => {
          const betInArr = this.bet.includes(`${bet.cid}${bet.name}`);
          if ((betInArr && !isBet) || (!betInArr && isBet)) {
            this.betItem(bet);
          }
        });
    },
  },
};
</script>

<style lang="stylus" scoped>
.q-list
  padding 0
</style>

