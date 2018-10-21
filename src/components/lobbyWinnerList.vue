<template>
  <div class="lobby-winner-list">
    <div class="site-panel">
      <div v-if="!defaultIndex.includes(styleName)" class="site-panel__header">
        <div class="site-panel__header-title">
          <q-icon name="icon-tool icon-badge"></q-icon>
          {{getType}}
        </div>
      </div>
      <table class="table winner-list">
        <thead>
          <tr>
            <th>排行</th>
            <th>用戶</th>
            <th>{{amountLabel}}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, i) in testData"
            :key="i">
            <td><span class="icon-ranking">{{item.ranking}}</span></td>
            <td>{{item.userAccount}}</td>
            <td>{{roundAmt(item.revenue)}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { globalMixin } from 'src/globalMixin';

export default {
  mixins: [globalMixin],
  name: 'lobbyWinnerList',
  props: ['getType', 'testData'],
  computed: {
    amountLabel() {
      if (this.getType === '彩神榜') return '盈利金额';
      return '中奖金额';
    },
  },
};
</script>

<style>
</style>
