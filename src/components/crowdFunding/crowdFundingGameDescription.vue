<template>
  <q-modal
    class="modal modal--md"
    v-model="showing">
    <div class="modal__header">
      <div class="modal__header-title">
        {{ modalTitle }}
      </div>
      <q-btn
        class="modal__close"
        icon="icon-tool icon-close"
        @click="closeModal()"/>
    </div>
    <div class="modal__body">
      <div class="crowdfunding-game-description playing-doc">
        <div class="playtext" v-html="lotteryPlayingDocHtml"></div>
      </div>
    </div>
    <div class="modal__footer">
      <q-btn
        class="btn-primary btn-lg"
        @click="closeModal()">确定</q-btn>
    </div>
  </q-modal>
</template>

<script>
import lotteryConst from 'src/consts/lotteryConst';

export default {
  props: ['modalShow', 'modalTitle'],
  data() {
    return {
      showing: this.modalShow,
      lotteryPlayingDocHtml: lotteryConst.crowdFundingInfo,
    };
  },
  watch: {
    showing(val) {
      this.$emit('closeModal', val);
    },
  },
  created() {
    // console.log(`${this.modalTitle} modalCreated`);
  },
  destroyed() {
    // console.log(`${this.modalTitle} modalDestroyed`);
  },
  methods: {
    closeModal() {
      this.showing = false;
    },
  },
};
</script>

<style>
</style>
