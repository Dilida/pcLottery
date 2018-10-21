<template>
  <div class="lottery-last-award">
    <div class="site-panel">
      <div class="site-panel__header">
        <div class="col-auto site-panel__header-title">
          <q-icon name="icon-tool icon-pastview"></q-icon>
          往期开奖
        </div>
        <div class="col-auto site-panel__header-btn">
          <q-btn class="btn-more"
          @click="$router.push(`/history?lotteryId=${lotteryId}`)">更多</q-btn>
        </div>
      </div>
      <div v-if="sscIndex.includes(styleName) || sscIndex.includes(styleNameNumber)">
        <table class="table last-award">
          <thead>
            <th>期号</th>
            <th>开奖号</th>
          </thead>
          <tbody>
            <tr v-for="(item, i) in data" :key="i">
              <td>{{item.issueAlias}}</td>
              <td>
                <template
                v-if="item.winNumberArr && $_lodash.isArray(item.winNumberArr)">
                  <span v-for="(n, j) in item.winNumber.split(',')" :key="j"
                    class="pastview-win-number">
                    {{n}}
                  </span>
                </template>
                <template v-else>
                  <span v-for="(n, j) in item.winNumberArr.first" :key="`first${j}`"
                    class="pastview-win-number lhc-beads">
                    {{n}}
                  </span>
                  {{[10,110].includes(lotteryId) ? "+" : "="}}
                  <span class="pastview-win-number">
                    {{item.winNumberArr.last}}
                  </span>
                </template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- other -->
      <div class="site-panel__body" v-else>
        <div class="site-panel__list">
          <div class="row site-panel__item" v-for="(item, i) in data" :key="i">
              <div class="site-panel__item-date">
                <span class="text-strong">开奖号</span>
                <span>第{{item.issueAlias}}期</span></div>
              <div class="col-12 bead-pastview site-panel__item-bead"
              v-if="item.winNumberArr && $_lodash.isArray(item.winNumberArr)">
                <span v-for="(n, j) in item.winNumber.split(',')" :key="j"
                  :class="`bead-lottery-${lotteryId} num_${n}`">
                  {{n}}
                </span>
              </div>
              <div class="col-12 bead-pastview site-panel__item-bead" v-else>
                <span v-for="(n, j) in item.winNumberArr.first" :key="`first${j}`"
                  :class="`bead-lottery-${lotteryId} num_${n}`">
                  {{n}}
                </span>
                {{[10,110].includes(lotteryId) ? "+" : "="}}
                <span :class="`bead-lottery-${lotteryId} num_${item.winNumberArr.last} last`">
                  {{item.winNumberArr.last}}
                </span>
              </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { globalMixin } from 'src/globalMixin';

export default {
  name: 'lotteryLastAward',
  props: ['data'],
  mixins: [globalMixin],
  computed: {
    ...mapState('game', ['lotteryId']),
  },
  data() {
  },
  created() {
  },
  methods: {
  },
};
</script>

<style lang="stylus">
</style>
