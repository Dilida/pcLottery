<template>
    <q-modal
      class="modal modal--md"
      v-model="showDialog"
    >
      <div class="modal__header">
        <div class="modal__header-title">
          {{`${this.lotteryName}${this.lotteryTitle? this.lotteryTitle : origialTitle}`}}
        </div>
        <q-btn
            v-close-overlay
            icon="icon-tool icon-close"
            class="modal__close" />
      </div>
      <div class="modal__body">
        <div class="playing-doc">
          <div class="playtext" v-html="lotteryPlayingDocHtml"></div>
        </div>
      </div>
      <div class="modal__footer">
        <q-btn
          class="btn-primary btn-lg"
          @click="$emit('close')"
          label="确定" />
      </div>
  </q-modal>
</template>

<script>
// 投注共用
import { mapState } from 'vuex';
import { globalMixin } from 'src/globalMixin';

export default {
  name: 'playingDoc',
  props: ['playingruleDialog', 'close', 'lotteryTitle'],
  mixins: [globalMixin],
  data() {
    return {
      origialTitle: '玩法说明',
      lotteryPlayingDocHtml: '',
      lotteryPlayingruleGroup: null,
    };
  },
  computed: {
    showDialog: {
      get() {
        return this.playingruleDialog;
      },
      set() {
        this.$emit('close');
      },
    },
    ...mapState('game', [
      'lotteryId',
      'lotteryName',
    ]),
  },
  created() {
    this.lotteryPlayingruleGroup = this.getLotteryListMap(
      [8, 24, 108, 118],
      [4, 16, 18, 104],
      [6, 20, 22, 106],
      [34, 42, 44],
      [40, 46],
      [38],
      [10, 110],
      [30],
    );
  },
  watch: {
    playingruleDialog(newVal) {
      if (!newVal) return;
      this.lotteryPlayingDocHtml = this.getLotteryPlayingDoc(
        this.lotteryId,
        this.lotteryPlayingruleGroup.checkNonintersection(this.lotteryId),
      );
    },
  },
  methods: {
  },
};
</script>

<style>
</style>
