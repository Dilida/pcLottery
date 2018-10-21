<template>
  <div class="history-bar row justify-start">
    <!-- 彩种名称 -->
    <div class="history-bar__name">
      <img :src="historyBarLotteryName.imgUrl">
      {{historyBarLotteryName.label}}
    </div>
    <!-- 选择彩种 -->
    <div class="history-bar__filter">
      <span class="history-bar__select">
        <label>彩种：</label>
        <q-select
          type="list"
          hide-underline
          v-model="historyBarLotteryId"
          :options="selectOptions"
          @input="methodLotteryIdChange"
        ></q-select>
      </span>
      <span class="history-bar__btns">
        <q-btn
          class="btn-secondary btn-sm"
          v-for="(item, index) in countIssueButton"
          :key="index"
          :class="item.rows===countIssue ? 'active' : ''"
          @click="methodcountIssueChange(item.rows)"
        >
          {{item.title}}
        </q-btn>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'historyBar',
  props: {
    lotteryId: {
      required: true,
    },
    lotteryName: {
      type: String,
    },
    countIssue: {
      type: Number,
      required: true,
    },
    selectOptions: {
      type: Array,
      required: true,
    },
  },
  computed: {
    countIssueButton() {
      if (this.historyBarLotteryId === 10) {
        return this.rowsList.slice(0, 2);
      } else if (this.historyBarLotteryId === 116 ||
                  this.historyBarLotteryId === 118) {
        return this.rowsList.slice(1, 2);
      }
      return this.rowsList;
    },
    historyBarLotteryName() {
      return this.selectOptions.find(lotteryItem => lotteryItem.value === this.historyBarLotteryId);
    },
  },
  watch: {
    lotteryId(newValue, oldValue) {
      if (newValue === oldValue) return;
      this.historyBarLotteryId = newValue;
    },
  },
  data() {
    return {
      historyBarLotteryId: this.lotteryId,
      select: '',
      rowsList: [
        {
          title: '近30期',
          rows: 30,
        }, {
          title: '近50期',
          rows: 50,
        }, {
          title: '今日数据',
          rows: 0,
        },
      ],

    };
  },
  mounted() {
  },
  methods: {
    methodLotteryIdChange(val) {
      this.$emit('lotteryIdChange', val);
    },
    methodcountIssueChange(val) {
      this.$emit('countIssueChange', val);
    },
  },
};
</script>

<style lang="stylus">
</style>
