<template>
  <div class="layout-full history">
    <Bar
      @countIssueChange="methodCountIssueChange"
      @lotteryIdChange="methodLotteryIdChange"
      :lotteryId="historyLotteryId"
      :countIssue="countIssue"
      :selectOptions="methodGetLotteryList()"
    />
    <Table
      :lotteryId="historyLotteryId"
      :tableBody="tableBody"
      :paginationConfig="paginationConfig"
      @methodPageCountChange="methodPageCountChange"
    />
  </div>
</template>

<script>
import { globalMixin } from 'src/globalMixin';

import { keys } from 'lodash';

import Bar from 'components/historyBar';
import Table from 'components/historyTable';

export default {
  name: 'history',
  mixins: [globalMixin],
  components: {
    Bar,
    Table,
  },
  data() {
    return {
      countIssue: 30,
      historyLotteryId: this.methodGetPreviousLotteryId(),
      tableBody: [],
      paginationConfig: {
        totalNumber: 0,
        count: 20,
        page: 1,
      },
    };
  },
  mounted() {
    this.methodGetLotteryList();
    this.methodGetHistoryPrizeLists();
  },
  methods: {
    // 取得來自上一頁的lottery id
    methodGetPreviousLotteryId() {
      const previousLotteryId = Number(this.$route.query.lotteryId);
      const lotteryList = this.methodGetLotteryList();
      const result = lotteryList.find(lotteryItem => lotteryItem.value === previousLotteryId);
      if (!previousLotteryId || !result) {
        return lotteryList[0].value;
      }
      return previousLotteryId;
    },
    // 取得彩种列表
    methodGetLotteryList() {
      const lotteryList = this.$store.state.game.lottery;
      const lotterySelectList = [];
      lotteryList.forEach((lottery) => {
        lotterySelectList.push({
          value: lottery.id,
          label: lottery.name,
          imgUrl: lottery.imgUrl,
        });
      });

      return lotterySelectList;
    },
    // 取得往期开奖记录/号码走势
    async methodGetHistoryPrizeLists() {
      if (this.historyLotteryId === 116 || this.historyLotteryId === 118) {
        this.countIssue = 50;
      }
      const params = {
        lotteryId: this.historyLotteryId,
        countIssue: this.countIssue,
        page: this.paginationConfig.page,
        count: this.paginationConfig.count,
      };
      const res = await this.getHistoryPrizeList(params);
      if (res && res.list.length > 0) {
        res.list.forEach((element) => {
          // 轉換winNumber成array
          if (typeof element.winNumber === 'string') {
            element.winNumber = element.winNumber.split(',').map(elm => elm);
          }

          // 个别lottery设置
          if (
            // 快3
            element.lotteryId === 6 ||
            element.lotteryId === 20 ||
            element.lotteryId === 22 ||
            element.lotteryId === 106 ||
            // 快8
            element.lotteryId === 34 ||
            element.lotteryId === 42 ||
            element.lotteryId === 44
          ) {
            element.winNumber = {
              winNumber: element.winNumber,
            };
          }
        });

        this.paginationConfig.totalNumber = res.total;
        // this.paginationConfig.count = res.count;
        // this.paginationConfig.page = res.page;

        if (res && keys(res.list).length > 0) {
          this.tableBody = res.list.map((item) => {
            const {
              issueAlias, winNumber, doubleData, block,
            } = item;
            if (block) {
              return {
                issueAlias,
                winNumber,
                block,
                doubleData,
              };
            }
            return {
              issueAlias,
              winNumber,
              doubleData,
            };
          });
        }
      } else {
        this.tableBody = [];
      }
    },
    // 30, 50, 今日
    methodCountIssueChange(val) {
      this.countIssue = val;
      this.paginationConfig.page = 1;
      this.methodGetHistoryPrizeLists();
    },
    // 切換彩種
    methodLotteryIdChange(val) {
      this.historyLotteryId = val;
      this.countIssue = 30;
      this.paginationConfig.page = 1;
      this.methodGetHistoryPrizeLists();
    },
    // 上下頁
    methodPageCountChange(val) {
      this.paginationConfig.page = val.page;
      this.paginationConfig.count = val.count;
      this.methodGetHistoryPrizeLists();
    },
  },
  beforeDestroy() {
    this.removeCookie('fromLottery');
  },
};
</script>

<style lang="stylus">

</style>
