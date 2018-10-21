<template>
<div class="lottery-road-bead">
  <div class="lottery-subtitle">路珠</div>
  <div class="lottery-right-main">
  <!-- Tabs - notice slot="title" -->
  <!--需要橫向捲動的版本-->
    <div class="road-tabs">
      <swiper :options="swiperBeadTag" class="btn-group-flat">
        <swiper-slide v-for="(name,i) in keyValue"
        :class="{active:activeTabId===i}"
        @click.native="changeID(i)"
        :key=i>
        {{name}}</swiper-slide>
      </swiper>
      <div class="btn-group-control">
        <q-btn class="btn-left" slot="button-prev"></q-btn>
        <q-btn class="btn-right" slot="button-next"></q-btn>
      </div>
    </div>
  <!-- Targets -->
  <div class="road-content">
    <q-list class="">
      <div class="road-content__list row no-wrap items-start" v-if="$_lodash.isArray(dataInit)">
        <!--单一路珠-->
        <div class="road-column" v-for="(item,i) in dataInit" :key=i>
          <div v-for="(item2,j) in item" :key=j>
          <div :class="`bead-road bead-road--${beadsType[item2]}`">{{item2}}</div>
          </div>
        </div>
      </div>
      <div v-else>
        <!--双面长龙-->
        <div class="row items-stretch dslong" v-if="$_lodash.keys(dataInit)[0]==='open'">
          <div class="col-6 dslong-item" v-for="(item,j) in dataInit" :key=j>
            <div class="dslong-title">{{doubleLongKeyValue[j]}}</div>
            <div class="col-12 row dslong-row" v-for="(item2,i) in item" :key=i>
              <span class="col-6 dslong-name">{{item2.groupName}}</span>
              <span class="col-3 dslong-play">{{item2.playName}}</span>
              <div class="col-3 dslong-count"
                :class="`${item2.count > 6 ? 'color-dslong-5' : countColor[item2.count]}`">
                {{item2.count}}期
              </div>
            </div>
          </div>
        </div>
        <!--路珠-->
        <div v-else>
          <q-item class="column" v-for="(item,i) in dataInit" :key=i>
            <div class="road-bead-tag">{{objectKeyValue[i]}}</div>
            <div class="road-content__list row no-wrap items-start">
              <div class="road-column" v-for="(item2,j) in item" :key=j>
                <span v-for="(item3,x) in item2" :key=x
                :class="`bead-road bead-road--${beadsType[item3]}`">{{item3}}</span>
              </div>
            </div>
          </q-item>
        </div>
      </div>
    </q-list>
  </div>
  </div>
</div>
</template>

<script>
import { globalMixin } from 'src/globalMixin';
import 'swiper/dist/css/swiper.css';
import { swiper, swiperSlide } from 'vue-awesome-swiper';

export default {
  name: 'lotteryBetHistory',
  mixins: [globalMixin],
  props: ['dataInit', 'keyValue', 'activeTabId'],
  components: {
    swiper,
    swiperSlide,
  },
  data() {
    return {
      beadsType: {
        和: 'mid',
        龙: 'dragon',
        大: 'big',
        单: 'odd',
        虎: 'tiger',
        小: 'small',
        双: 'even',
        上: 'top',
        中: 'middle',
        下: 'bottom',
      },
      countColor: {
        3: 'color-dslong-1',
        4: 'color-dslong-2',
        5: 'color-dslong-3',
        6: 'color-dslong-4',
      },
      objectKeyValue: {
        BS: '大/小',
        EO: '单/双',
      },
      doubleLongKeyValue: {
        open: '连续开奖',
        unOpen: '连续未开',
      },
      swiperBeadTag: {
        slidesPerView: 8,
        spaceBetween: 3,
        slidesPerGroup: 5,
        loop: false,
        loopFillGroupWithBlank: false,
        simulateTouch: false,
        navigation: {
          nextEl: '.road-tabs .btn-right',
          prevEl: '.road-tabs .btn-left',
          hideOnClick: true,
          hiddenClass: 'btn-hidden',
        },
      },
    };
  },
  methods: {
    changeID(value) {
      this.$emit('changeTab', value);
    },
  },
};
</script>
