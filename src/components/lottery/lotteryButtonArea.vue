<template>
  <div class="lottery-button-area">
    <q-btn class="btn-secondary btn-sm"
      @click="$router.push(`/history?lotteryId=${lotteryId}`)" >
      <q-icon name="icon-tool icon-trend"></q-icon>
      号码走势
    </q-btn>
    <q-btn class="btn-secondary btn-sm"
      @click="$emit('openLotteryPlayingDocModal')" >
      <q-icon name="icon-tool icon-info"></q-icon>
      玩法说明
    </q-btn>
  </div>
</template>

<script>
export default {
  props: ['lotteryId', 'openLotteryPlayingDocModal'],
  data() {
    return {
    };
  },
};
</script>

<style>

</style>
