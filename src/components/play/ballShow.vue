<template>
    <div class="lobby-bead" v-if="Array.isArray(data.winNumberArr)">
      <span v-for="(n, j) in data.winNumberArr"
      :key="j" :class="`bead-lottery-${data.lotteryId} num_${n}`">{{n}}
      </span>
    </div>
    <div class="lobby-bead" v-else>
      <span v-for="(n, j) in data.winNumberArr.first" :key="`first${j}`"
      :class="`bead-lottery-${data.lotteryId} num_${n}`">{{n}}</span>
      {{[10,110].includes(data.lotteryId) ? "+" : "="}}
      <span :class="`bead-lottery-${data.lotteryId}
        num_${data.winNumberArr.last}`">
        {{data.winNumberArr.last}}</span>
    </div>

</template>

<script>
import { globalMixin } from 'src/globalMixin';

export default {
  name: 'lobbyLeftLotteryList',
  props: ['data'],
  mixins: [globalMixin],
  data() {
    return {
    };
  },
  computed: {

  },
  mounted() {
  },
  methods: {},
};
</script>

<style>
</style>
