<template>
  <div class="maintained">
    <div class="maintained__img"></div>
    <div class="maintained__title">亲爱的会员</div>
    <div class="maintained__text">
      <div>{{maintainEvent.content}}</div>
      <div>维护时间：{{time2Date(maintainEvent.startTime)}}-{{time2Date(maintainEvent.endTime)}}</div>
    </div>
    <div class="maintained__btn" v-if="maintainEvent.maintainUrl">
      <q-btn class="btn-primary" @click="openURL(maintainEvent.maintainUrl)">联络客服</q-btn>
    </div>
  </div>
</template>

<script>
import { globalMixin } from 'src/globalMixin';
import { openURL } from 'quasar';
import { mapState } from 'vuex';

export default {
  name: 'maintained',
  mixins: [globalMixin],
  data() {
    return {
      url: false,
    };
  },
  created() {
  },
  computed: {
    ...mapState([
      'maintainEvent',
    ]),
  },
  mounted() {
    this.errMaintain();
  },
  methods: {
    openURL,
  },
};
</script>

<style>
</style>
