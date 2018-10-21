<template>
  <q-page class="about">
    <div class="page-title page-title--about">
      <span class="icon-title"></span>
      <span class="page-title__title">关于我们</span>
    </div>
    <!-- This is where pages get injected -->
    <q-list class="page-default">
      <q-item class="page-default__content" v-html="content">
      </q-item>
    </q-list>
  </q-page>
</template>

<script>
import globalMixin from 'src/globalMixin';

export default {
  // name: 'PageName',
  mixins: [globalMixin],
  data() {
    return {
      title: '关于我们',
      content: '',
      model: '',
    };
  },
  watch: {
    model() {
      this.title = this.datas[this.model].title;
      this.content = this.datas[this.model].content;
    },
  },
  created() {
    this.$store.commit('setHideHeadMenu');
    this.$store.commit('setPageHeaderTitle', this.title);

    this.getCopyright('1', 'BT04').then((res) => {
      const { content } = res.find(f => f.version === 0);
      this.content = content;
    });
  },
  methods: {
  },
};
</script>

<style lang="stylus" scoped>

</style>

