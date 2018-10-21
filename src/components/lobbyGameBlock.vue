<template>
  <q-list class="lobby-game-block col-12">
    <q-collapsible v-if="slider"
      class="collapsible"
      :opened="open"
      header-class="collapsible__header"
      icon="icon-tool icon-lottery"
      collapse-icon="icon-tool icon-arrow-down"
      :label="item.groupName" >
      <q-item
        class="lobby-game-item"
        v-for="(lottery, lotteryIndex) in item.list"
        :key="`lottery-${lotteryIndex}`"
        :to="lottery.url" >
        <q-btn>
          <img :src="lottery.imgUrl" />
          {{lottery.name}}
        </q-btn>
      </q-item>
    </q-collapsible>

    <div v-else class="collapsible">
      <q-icon name="icon-tool icon-lottery"></q-icon>
      <span class="tabs-panel__title">{{item.groupName}}</span>
      <i class="fa-chevron-right"></i>
      <div class="lobby-game-box">
        <q-item
          class="lobby-game-item"
          v-for="(lottery, lotteryIndex) in item.list"
          :key="`lottery-${lotteryIndex}`"
          :to="lottery.url" >
          <q-btn>
            <img :src="lottery.imgUrl" />
            {{lottery.name}}
          </q-btn>
        </q-item>
      </div>
    </div>

  </q-list>
</template>

<script>
import globalMixin from 'src/globalMixin';

export default {
  name: 'lobbyGameBlock',
  mixins: [globalMixin],
  props: ['item', 'open', 'slider', 'hover'],
  data() {
    return {
      showing: false,
    };
  },
};
</script>

<style lang="stylus" scoped>

</style>

