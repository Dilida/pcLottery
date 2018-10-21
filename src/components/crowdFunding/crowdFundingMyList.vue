<template>
    <table class="table-normal">
      <thead>
        <tr>
            <th>众筹编号</th>
            <th>彩种名称</th>
            <th>期号</th>
            <th v-if="selectedID===2">总份数</th>
            <th>{{(selectedID === 1) ? '购买份数' : '自购份数'}}</th>
            <th v-if="selectedID===2">剩余份数</th>
            <th>每份价格</th>
            <th>佣金/份</th>
            <th>状态</th>
            <th>{{(selectedID === 1) ? '参与时间' : '发起时间'}}</th>
            <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, key) in list"
            :key="`item_${key}`" >
            <td>{{item.crowdFundingNum}}</td>
            <td>{{item.lotteryName}}</td>
            <td>{{item.issueAlias}}</td>
            <td v-if="selectedID===2">{{item.totalCopies ? item.totalCopies : 0}}</td>
            <td>
              {{(selectedID === 1 ) ? item.callCopies : item.selfpurchaseCopies }}
            </td>
            <td v-if="selectedID===2">{{item.remainCopies ? item.remainCopies : 0}}</td>
            <td>{{roundAmt(item.copyAmount ? item.copyAmount:0)}}</td>
            <td>{{roundAmt(item.copyCommission? item.copyCommission:0)}}</td>
            <td v-if="item.crowdFundingStatus==1">
              <div>{{item.listPayoff === 0 ? `未中奖` : `派奖${roundAmt(item.listPayoff)}元`}}</div>
              <div v-if="selectedID === 1">
                {{`已扣佣金${roundAmt(item.commission ? item.commission : 0)}元`}}
              </div>
              <div v-else>
                {{`已收佣金${roundAmt(item.earnCommission ? item.earnCommission :0)}元`}}
              </div>
            </td>
            <td v-else>
                {{setStatus(item.crowdFundingStatus)}}
            </td>
            <td>{{time2Date(item.followCreateTime ? item.followCreateTime : 0)}}</td>
            <td><q-btn class="btn-secondary btn-sm" @click="selectShow(key)">点我详情</q-btn></td>
        </tr>
      </tbody>
    </table>
</template>

<script>
import { globalMixin } from 'src/globalMixin';

export default {
  // name: 'PageName',
  mixins: [globalMixin],
  props: ['list', 'selectedID'],
  data() {
    return {
      showStatus: {
        0: '等待开奖',
        3: '取消',
        4: '撤单',
      },
    };
  },
  methods: {
    setStatus(crowdFundingStatus) {
      return this.showStatus[crowdFundingStatus];
    },
    selectShow(value) {
      this.$emit('showSelect', value);
    },
  },
};
</script>

<style>
</style>
