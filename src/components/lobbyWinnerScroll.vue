<template>
  <div class="lobby-winner-scroll">
    <div class="site-panel">
      <div class="site-panel__header">
        <div class="site-panel__header-title">
          <q-icon name="icon-tool icon-list"></q-icon>
          获奖名单
        </div>
      </div>
      <table class="table winner-scroll">
        <tbody>
          <tr v-for="(item, i) in data" :key="i" v-if="i<10">
            <td>{{item.userAccount}}</td>
            <td>{{item.lotteryName}}</td>
            <td>${{roundAmt(item.revenue)}}</td>
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
  name: 'lobbyWinnerScroll',
  props: ['data'],
  data() {
  },
};
</script>

<style>
</style>
