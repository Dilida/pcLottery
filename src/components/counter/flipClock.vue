<template>
  <div class="flip-clock">
    <span :id="'uid_' + _uid" class="flip-clock__piece flip">
      <b class="flip-clock__card card">
        <b class="card__top">{{prizeCloseTimeCounter}}</b>
        <b class="card__bottom" :data-value="prizeCloseTimeCounter"></b>
        <b class="card__back" :data-value="prizeCloseTimeCounter">
          <b class="card__bottom" :data-value="prizeCloseTimeCounter"></b>
        </b>
      </b>
    </span>
  </div>
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
      const el = document.querySelector(`#uid_${this._uid}`);
      this.$_lodash.delay(() => {
        animate.start({
          duration: 950,
          apply() {
            el.classList.add('flip');
          },
          done() {
            el.classList.remove('flip');
          },
        });
      }, 700);
    },
  },
};
</script>
