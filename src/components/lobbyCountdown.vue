<template>
  <div class="promo-secondary__time">
    <span class="promo-secondary__time-label">
      {{displayText}}
    </span>
    <flipClock v-if="hours!==0 || day!==0"
          :prizeCloseTimeCounter="(day*24 + hours).toString().padStart(2,0)"/>
        <span v-if="hours!==0 || day!==0" class="q-px-sm">:</span>
    <flipClock :prizeCloseTimeCounter="min"/>
    <span class="promo-secondary__time-gap">:</span>
    <flipClock :prizeCloseTimeCounter="sec"/>
  </div>
</template>

<script>
import flipClock from 'components/counter/flipClock';
import betOrderMixin from 'src/betOrderMixin';

export default {
  name: 'lobbyCountdown',
  components: {
    flipClock,
  },
  mixins: [betOrderMixin],
  props: ['countdownTime', 'countdownId', 'nowTime', 'countdownTimeDisplay'],
  data() {
    return {
      localCountdownTime: 0,
    };
  },
  watch: {
    countdownTime: {
      handler(newVal) {
        if (!this.nowTime) {
          // 處理初始取不到nowTime情況
          setTimeout(() => {
            if (this.nowTime && newVal - this.nowTime > 0) {
              this.localCountdownTime = newVal;
            }
          }, 1000);
        } else if (newVal - this.nowTime > 0) {
          this.localCountdownTime = newVal;
        } else {
          this.$emit('getNewCountdownTime', this.countdownId, this.countdownTime);
        }
      },
      immediate: true,
    },
    nowToTime(newVal) {
      if (newVal <= 0) {
        if (this.localCountdownTime) {
          this.localCountdownTime = 0;
          this.$emit('getNewCountdownTime', this.countdownId, this.countdownTime);
        }
      }
    },
  },
  computed: {
    nowToTime() {
      if (!this.nowTime) return 0;
      if (this.localCountdownTime > 0) {
        return (this.localCountdownTime - this.nowTime);
      }
      return 0;
    },
    nowToTimeDisplay() {
      const displayTime = this.nowToTime - (this.localCountdownTime - this.countdownTimeDisplay);
      if (displayTime < 0 && this.nowToTime > 0) return this.nowToTime;
      else if (this.nowToTime <= 0) return 0;
      return displayTime;
    },
    nowToTimeObject() {
      return this.$moment.duration(this.nowToTimeDisplay);
    },
    displayText() {
      if (this.nowToTime === this.nowToTimeDisplay) return '等待开奖';
      return '距离封盘';
    },
    day() {
      return this.nowToTimeObject.days();
    },
    hours() {
      return this.nowToTimeObject.hours();
    },
    min() {
      return this.nowToTimeObject.minutes().toString().padStart(2, 0);
    },
    sec() {
      return this.nowToTimeObject.seconds().toString().padStart(2, 0);
    },
  },
  methods: {
  },
};
</script>
