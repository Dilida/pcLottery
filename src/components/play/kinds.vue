<template>
  <div ref="playSide" class="lottery-bet-tags">
      <!-- swiper -->
      <div class="bet-tags-wrap">
        <swiper :options="defaultIndex.includes(styleName) ? swiperOption2 : swiperOption1"
          class="btn-group-flat">
          <swiper-slide
            v-for="(k, i) in kinds"
            :active="k.cid === playGroupId"
            :key="`kinds_${i}`"
            class="tag"
            @click.native="setPlayGroupId(k.cid)"
          >
          {{k.name}}
          <!-- 只有秒秒彩开奖彩种需要 -->
          <q-chip
          v-if="showBetSubCount(k.cid)"
          class="play-kinds__chip"
          floating color="warning">{{subCount.get(k.cid).length}}</q-chip>
          <!-- <span v-if="[116].includes((lotteryId))" class="left-menu_bet-count"
            v-show="betSub">{{betSubCount[index]}}</span> -->
          </swiper-slide>
        </swiper>
        <div class="btn-group-control">
          <q-btn class="btn-left" slot="button-prev"></q-btn>
          <q-btn class="btn-right" slot="button-next"></q-btn>
        </div>
      </div>

  </div>
</template>

<script>
import betOrderMixin from 'src/betOrderMixin';
import { mapState, mapGetters, mapMutations } from 'vuex';
import 'swiper/dist/css/swiper.css';
import { swiper, swiperSlide } from 'vue-awesome-swiper';

export default {
  // name: 'ComponentName',
  mixins: [betOrderMixin],
  components: {
    swiper,
    swiperSlide,
  },
  data() {
    return {
      swiperOption1: {
        slidesPerView: 7,
        spaceBetween: 3,
        slidesPerGroup: 3,
        loop: false,
        loopFillGroupWithBlank: false,
        simulateTouch: false,
        navigation: {
          nextEl: '.bet-tags-wrap .btn-right',
          prevEl: '.bet-tags-wrap .btn-left',
          hideOnClick: true,
          hiddenClass: 'btn-hidden',
        },
      },
      swiperOption2: {
        slidesPerView: 5,
        spaceBetween: 3,
        slidesPerGroup: 3,
        loop: false,
        loopFillGroupWithBlank: false,
        simulateTouch: false,
        navigation: {
          nextEl: '.bet-tags-wrap .btn-right',
          prevEl: '.bet-tags-wrap .btn-left',
          hideOnClick: true,
          hiddenClass: 'btn-hidden',
        },
      },
    };
  },
  computed: {
    ...mapGetters({
      subCount: 'game/getBetSubCount',
      needClearBetItem: 'game/getPlayClearStatus',
      kinds: 'game/getPlayKinds',
    }),
    ...mapState('game', ['betSub']),
    kindIds() {
      return this.kinds.map(m => ({
        value: m.cid,
        label: m.name,
      }));
    },
    kindId: {
      get() {
        return this.$store.state.game.playGroupId;
      },
      set(data) {
        this.setPlayGroupId(data);
      },
    },
  },
  created() {
  },
  watch: {
    playGroupId() {
      if (this.needClearBetItem) {
        this.clearBetData();
      }
    },
  },
  methods: {
    ...mapMutations('game', ['setPlayGroupId']),
    showBetSubCount(playId) {
      return [116, 118].includes(this.lotteryId) &&
        this.subCount.get(playId);
    },
  },
};
</script>

