<template>
  <span>
    <span class="countdown-number-digit">{{prizeCloseTimeCounter}}</span>
    <span :id="'uid_' + _uid" class="countdown-number countdown-number--half"></span>
    <span class="countdown-number"></span>
  </span>
</template>

<script>
import { animate } from 'quasar';

export default {
  name: 'flipCounter',
  props: ['prizeCloseTimeCounter', 'finalPos'],
  data() {
    return {
      udid: this._uid,
    };
  },
  watch: {
    prizeCloseTimeCounter() {
      const animateFinalPos = this.finalPos;
      const el = document.querySelector(`#uid_${this.udid}`);
      animate.start({
        from: 20,
        to: 0,
        duration: 400,
        apply(boardHeight) {
          el.style.height = `${boardHeight}px`;
          el.style.top = `${-(boardHeight) + 90}px`;
        },
        done() {
          el.style.height = '20px';
          el.style.top = `${animateFinalPos}px`;
        },
      });
    },
  },
};
</script>
