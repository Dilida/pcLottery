<template>
    <div class="lottery-countdown">
      <div class="text-strong lottery-issue-alias">
        第
        <span class="text-important">{{data.issueAlias}}</span>
        期
      </div>
      <div class="lottery-countdown-closed">
        <span class="lottery-countdown-tag">
          {{closeLabel}}
        </span>
        <flipClock v-if="hours!==0 || day!==0"
          :prizeCloseTimeCounter="(day*24 + hours).toString().padStart(2,0)"/>
        <span v-if="hours!==0 || day!==0" class="q-px-sm">:</span>
        <flipClock :prizeCloseTimeCounter="min"/>
        <span class="q-px-sm">:</span>
        <flipClock :prizeCloseTimeCounter="sec"/>
      </div>
      <div class="lottery-countdown-closed">
        <span class="lottery-countdown-tag">距离开奖</span>
        <span class="text-important">{{nowToOpen}}</span>
      </div>
    </div>
</template>

<script>
import betOrderMixin from 'src/betOrderMixin';
import flipClock from 'components/counter/flipClock';
import { mapMutations, mapState } from 'vuex';
import { has } from 'lodash';

export default {
  name: 'LotteryCountdown',
  mixins: [betOrderMixin],
  props: ['name', 'data'],
  components: {
    flipClock,
  },
  data() {
    return {
      // 倒数用
      nowTime: '',
      // 计时器
      interval: '',
      // 等待开奖
      isWaitOpen: false,
      // 延迟开奖
      isOpenLag: false,
    };
  },
  computed: {
    ...mapState('game', ['lotteryNext']),
    notOpen() {
      if (!this.nowTime) return true;
      return this.data.startTime > this.nowTime;
    },
    nowToMs() {
      let closeTime = this.$_lodash.get(this.data, 'prizeCloseTime', 0);
      // 未开盘
      if (this.notOpen) {
        closeTime = this.$_lodash.get(this.data, 'startTime', 0);
      }
      let nowToMs = closeTime - this.nowTime;
      if (nowToMs < 0) {
        nowToMs = 0;
      }
      if (Number.isNaN(nowToMs)) {
        nowToMs = 0;
      }
      if (!this.nowTime) {
        nowToMs = 0;
      }
      return nowToMs;
    },
    nowToTime() {
      return this.$moment.duration(this.nowToMs);
    },
    day() {
      return this.nowToTime.days();
    },
    hours() {
      return this.nowToTime.hours(); // .padStart(2, 0);
    },
    min() {
      return this.nowToTime.minutes().toString().padStart(2, 0);
    },
    sec() {
      return this.nowToTime.seconds().toString().padStart(2, 0);
    },
    nowToOpen() {
      if (!this.nowTime) {
        return '';
      }
      const nowToMs = this.getNowToTime(this.data.endTime, -1);
      if (nowToMs === -1) {
        return -1;
      }
      this.changeFirstShow(true);
      return nowToMs;
    },
    closeLabel() {
      if (this.notOpen) {
        this.setBetNotOpen(true);
        return '距离封盘';
      }
      this.changeFirstShow(true); // 第一次不顯示遮罩，之後都要顯示
      this.setBetNotOpen(false);
      if (this.nowToMs === 0) {
        this.setBetClose(true);
        this.setBetDialog(false);
        return '已封盘';
      }
      this.setBetClose(false);
      return '距离封盘';
    },
    /**
     * @name 轮询更新开奖接口检查封盘时间
     * 时时彩(lotteryId:2) 6分钟以内 1分钟更新
     * lotteryid: 32 3秒钟更新一次
     * 1分钟以内 10秒更新
     * 2分钟以内 20秒更新
     * 3分钟以内 30秒更新
     * 剩30秒时更新 (进不去的奇怪条件)
     */
    reload() {
      if (!this.$_lodash.has(this.data, 'prizeCloseTime')) return false;
      const nowToCloseSec = (this.data.prizeCloseTime - this.nowTime) / 1000; // 秒(单位)
      // 时时彩(lotteryId:2) 6分钟以内 1分钟更新
      if (this.lotteryId === 2 && nowToCloseSec < 6 * 60 && nowToCloseSec % 60 === 0) {
        return true;
      }
      if (!has(this.lotteryNext, 'pcode') && nowToCloseSec % 5 === 0) {
        console.info('setReload');
        return true;
      }
      // lotteryid: 32 3秒钟更新一次
      if (this.lotteryId === 32 && nowToCloseSec % 3 === 0) {
        return true;
      }
      // 1分钟以内 10秒更新
      if (nowToCloseSec <= 60 && nowToCloseSec % 10 === 0) {
        console.info('reload 10sec');
        return true;
      }
      // 2分钟以内 20秒更新
      if (nowToCloseSec <= 60 * 2 && nowToCloseSec % 20 === 0) {
        console.info('reload 20sec');
        return true;
      }
      // 3分钟以内 30秒更新
      if (nowToCloseSec <= 60 * 3 && nowToCloseSec % 30 === 0) {
        console.info('reload 30sec');
        return true;
      }
      return false;
    },
  },
  watch: {
    nowToOpen(newValue, oldValue) {
      if (newValue !== oldValue && newValue === -1) {
        this.updateLotteryNextToNow();
      }
    },
    reload(newValue) {
      if (newValue === true) {
        this.getNowPriodData(this.lotteryId);
      }
    },
  },
  created() {
    this.setNowTime();
  },
  destroyed() {
    clearInterval(this.interval);
  },
  methods: {
    ...mapMutations('game', ['updateLotteryNextToNow', 'setBetDialog']),
  },
};
</script>

<style lang="stylus">
</style>
