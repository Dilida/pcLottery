<template>
  <div
    v-if="playTabs"
    class="bet-play-tab">
    <q-btn-toggle
      class="btn-group-flat"
      flat
      v-model="tabId"
      toggle-color="primary"
      :options="playTabs"
    />
  </div>
</template>

<script>
import betOrderMixin from 'src/betOrderMixin';
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'playTabs',
  mixins: [betOrderMixin],
  data() {
    return {};
  },
  computed: {
    ...mapGetters('game', { playTabs: 'getPlayTabs' }),
    tabId: {
      get() {
        // 没有就预设第一个
        return this.playGroupTabId;
      },
      set(data) {
        this.setPlayGroupTabId(data);
      },
    },
  },
  watch: {
    tabId(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.clearBetData();
      }
    },
  },
  methods: {
    ...mapMutations('game', ['setPlayGroupTabId']),
  },
};
</script>

<style lang="stylus" scoped>
.q-item, .q-list
  padding 0
</style>
