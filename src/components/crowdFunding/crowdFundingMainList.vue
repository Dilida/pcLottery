<template>
    <tr>
        <td>{{list.lotteryName}}</td>
        <td>第{{list.issueAlias ? list.issueAlias:0}}期</td>
        <td>{{list.remainCopies ? list.remainCopies:0}}份</td>
        <td>{{time2Date(list.startTime ? list.startTime : 0)}}</td>
        <td>{{time2Date(list.endTime ? list.endTime : 0)}}</td>
        <td>{{list.profitPercentage ? list.profitPercentage:0}}%</td>
        <td>{{roundAmt(list.totalJackpot ? list.totalJackpot:0)}}</td>
        <td>
            {{list.founderAccount ? list.founderAccount:''}}
            <!-- 人 -->
            <q-icon v-if="list.isfounder"
                    name="icon-crowdfunding icon-crowdfunding--user"
            ></q-icon>
            <!-- 有奖杯 -->
            <div v-if="crowdFundingCup && !list.isfounder">
            <q-icon name="icon-crowdfunding icon-crowdfunding--cup">{{list.ranking}}</q-icon>
            <span>周榜</span>
            </div>
            <!-- 票 -->
            <q-icon v-if="!crowdFundingCup && !list.isfounder"
                    name="icon-crowdfunding icon-crowdfunding--ticket"
            ></q-icon>
        </td>
        <td><q-btn class="btn-secondary btn-sm" label="点击参与"
        @click="selectShow(list.crowdFundingNum)"/></td>
    </tr>
</template>

<script>
import { globalMixin } from 'src/globalMixin';
import { crowdFundingMixin } from 'src/crowdFundingMixin';

export default {
  mixins: [globalMixin, crowdFundingMixin],
  props: ['list'],
  computed: {
    // crowdFunding的icon，奖杯 true，票 false
    crowdFundingCup() {
      if (this.list.ranking > 0 && this.list.ranking <= 10) {
        return true;
      }
      return false;
    },
  },
  methods: {
    selectShow(value) {
      this.$emit('showSelect', value);
    },
  },
};
</script>

<style>
</style>
