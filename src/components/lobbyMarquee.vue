<template>
  <div class="lobby-marquee">
    <div class="lobby-marquee__label">
      <i class="icon-tool icon-louder"></i>
      <span>最新消息</span>
    </div>
    <div class="lobby-marquee__content">
      <marquee
        direction="left"
        scrollamount="5"
        class="lobby-marquee__content-text"
        align="left"
        behavior="scroll"
        loop="-1"
        scrolldelay="30"
        v-html="marqueeText"
      >
      </marquee>
    </div>
  </div>
</template>

<script>
import { globalMixin } from 'src/globalMixin';

export default {
  mixins: [globalMixin],
  data() {
    return {
      marqueeText: '自动化测试回归数据:首页公告!',
    };
  },
  created() {
    this.getMarquee().then((res) => {
      if (res.apistatus && !this.$_lodash.isEmpty(res.result.list)) {
        res.result.list.sort((x, y) => y.weight - x.weight);
        this.marqueeText = res.result.list.map(item => item.content).join("<span class='space'></span>");
      }
    });
  },
};

</script>
<style lang="stylus" scope>
  .space{
    padding-right: 55rem;
  }
</style>
