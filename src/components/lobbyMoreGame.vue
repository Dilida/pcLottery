<template>
  <div class="row">
    <div class="lobby-titlebar">
      <span class="lobby-titlebar__icon">
        <q-icon name="icon-tool icon-dice"></q-icon>
      </span>
      <span class="lobby-titlebar__text">全部彩种<small>ALL LOTTERY</small></span>
    </div>
    <div class="col-12 row">
      <lobby-game-block
        v-for="(item, groupIndex) in lotteryGroup"
        :key="`lottery-group-${groupIndex}`"
        :open="groupIndex < defaultOpenNum"
        :item="item"
        :slider="slider"
        :hover="hover"
        />
    </div>
  </div>
</template>

<script>
import lobbyGameBlock from 'components/lobbyGameBlock';

export default {
  name: 'lobbyMoreGame',
  components: {
    lobbyGameBlock,
  },
  props: {
    lotteryGroup: {
      type: Array,
      default: () => [],
    },
    slider: Boolean,
    hover: Boolean,
  },
  data() {
    return {
      defaultOpenNum: 4,
    };
  },
};
</script>

<style>
</style>
