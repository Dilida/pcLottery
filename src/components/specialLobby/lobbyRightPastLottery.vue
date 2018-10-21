<template>
  <div class="tabs-panel__content" v-bind:class="'slidesToShow' + this.slidesToShow">
    <swiper :options="swiperOption" v-if="!$_lodash.isEmpty(showData)">
        <swiper-slide v-for="(item, key) in showData" :key="key">
          <q-list class="row lottery-item-group"
            v-for="(item2, key) in item" :key="key">
          <q-item class="row justify-between">
            <div class="col-auto lottery-item-name">{{item2.lotteryName}}</div>
            <div class="col-auto lottery-item-padate">
              第<span class="text-strong">{{item2.issueAlias}}</span>期
            </div>
          </q-item>
          <q-item class="lottery-item-wrap">
            <div class="lobby-bead">
                <BallShow :data="item2" />
            </div>
            <div class="lottery-item-btns">
              <q-btn class="btn-go-bet"
              @click.native="methodToLottery(item2.lotteryId)">
              {{defaultIndex.includes(styleName)?'參与':'立即投注'}}
              </q-btn>
            </div>
          </q-item>
        </q-list>
        </swiper-slide>
    </swiper>
    <q-inner-loading :visible="loading">
      <q-spinner-gears size="50px" color="primary"></q-spinner-gears>
    </q-inner-loading>
  </div>
</template>

<script>
import { globalMixin } from 'src/globalMixin';
import BallShow from 'components/play/ballShow';
import 'swiper/dist/css/swiper.css';
import { swiper, swiperSlide } from 'vue-awesome-swiper';

export default {
  name: 'lobbyRightPastLottery',
  mixins: [globalMixin],
  components: {
    BallShow,
    swiper,
    swiperSlide,
  },
  props: ['slidesToShow'],
  data() {
    return {
      showData: [],
      swiperOption: {
        direction: 'vertical',
        spaceBetween: 0,
        centeredSlides: true,
        simulateTouch: false,
        autoplay: {
          delay: 10000,
          disableOnInteraction: false,
        },
      },
      loading: true,
      timer: '',
    };
  },
  created() {},
  destroyed() {
    clearTimeout(this.timer);
  },

  mounted() {
    this.getLotteryList();
  },
  methods: {
    getNewList() {
      const timeCount = this.showData.length * 1000 * 10;
      this.timer = setTimeout(() => {
        this.getLotteryList();
      }, timeCount);
    },
    async getLotteryList() {
      const result = await this.getThreeBossPastLotteryList();
      this.showData = this.$_lodash.chunk(
        result.map(x => this.setWinNumber(x)),
        this.slidesToShow,
      );
      this.getNewList();
      this.loading = false;
    },
  },
  addclass(i) {
    return i;
  },
};


</script>
<style scoped>
.q-inner-loading{
  z-index: 10;
}
</style>
