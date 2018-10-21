<template>
  <div class="col-12 row lobby-activity">
    <div class="lobby-titlebar">
      <span class="lobby-titlebar__icon">
        <q-icon name="icon-tool icon-game"></q-icon>
      </span>
      <span class="lobby-titlebar__text">优惠活动<small>ACTIVITY</small></span>
      <q-btn
      class="lobby-titlebar__more"
      @click="$router.push('/activity')"
      >更多</q-btn>
    </div>
    <div class="col-12">
      <div
        v-for="(item, i) in activity"
        v-if="sscIndex.includes(styleName) || sscIndex.includes(styleNameNumber), i < 2"
        :key="i"
        @click="$router.push('/activity')"
        class="lobby-activity__block">
        <div class="lobby-activity__img">
          <img :src="item.titlePic" :alt="item.title">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { globalMixin } from 'src/globalMixin';

export default {
  name: 'lobbyActivity',
  mixins: [globalMixin],
  props: {
    activity: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
  },
};
</script>

<style>
</style>
