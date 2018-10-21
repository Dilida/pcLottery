<template>
  <q-carousel
    @slide="carouselSlider"
    class="layout-carousel"
    :easing="overshoot"
    infinite
    :autoplay="autoplay"
    color="white"
    quick-nav
    quick-nav-icon="icon-tool icon-dot"
    arrows
    ref="carousel"
  >
    <q-carousel-slide
      v-for="(item, n) in slide" :key="`anim-${n}`"
      class="layout-carousel__side"
      :class="[`bg-${colors[n % 5]} `,
              currentSlider === n ? 'active' : '',
              currentSlider + 1 === n ? 'next' : '',
              currentSlider - 1 === n ? 'previous' : '']" >
      <div class="layout-carousel__block">
        <a :href="item.link">
          <img :src="item.picture" alt="">
        </a>
      </div>
    </q-carousel-slide>
  </q-carousel>
</template>

<script>
import { easing } from 'quasar';
import { globalMixin } from 'src/globalMixin';
// easing is a collection;
// we're picking "overshoot" from it

export default {
  mixins: [globalMixin],
  data() {
    return {
      overshoot: easing.overshoot,
      colors: [
        'primary',
        'secondary',
        'yellow',
        'red',
        'orange',
        'grey-2',
      ],
      slide: [],
      currentSlider: 0,
      autoplay: true,
      interval: null,
    };
  },
  created() {
    this.getCarousel().then(({ delayTime = 0, resData }) => {
      if (resData.length) {
        this.slide = resData;
      }
      if (!delayTime && delayTime !== 0) {
        this.autoplay = delayTime;
      } else {
        delayTime = delayTime === 0 ? 10000 : delayTime;
        this.autoplay = false;
        this.interval = window.setInterval(() => {
          this.$refs.carousel.next();
        }, delayTime);
      }
    });
  },
  destroyed() {
    clearInterval(this.interval);
  },
  methods: {
    carouselSlider(index) {
      this.currentSlider = index;
    },
  },
};
</script>

<style lang="stylus" scoped>

</style>
