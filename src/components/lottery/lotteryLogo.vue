<template>
    <div class="lottery-logo">
      <div class="lottery-title">
        <div class="lottery-title__icon">
          <img :src="data.lotteryImgUrl" />
        </div>
        <span class="lottery-title__name">
          {{data.name}}
          <!-- <template v-if="styleName === 'default'">
            <q-btn
              @click="$router.push(`/history?lotteryId=${lotteryId}`)"
              icon="icon-pastview"
              class="btn-secondary btn-sm">
              往期开奖
            </q-btn>
          </template> -->
        </span>
      </div>
    </div>
</template>

<script>
import { globalMixin } from 'src/globalMixin';

export default {
  name: 'lotteryLogo',
  mixins: [globalMixin],
  props: ['data'],
  data() {
    return {
    };
  },
};
</script>

<style lang="stylus">
  // .lottery-logo
  //   img
  //     width 90px
</style>
