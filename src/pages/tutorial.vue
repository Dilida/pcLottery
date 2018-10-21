<template>
  <q-page class="tutorial">
    <div class="page-title page-title--tutorial">
      <span class="icon-title"></span>
      <span class="page-title__title">新手教程</span>
    </div>
    <!-- This is where pages get injected -->
    <q-list class="page-default">
      <q-item class="btn-toggle">
        <q-btn-toggle
          v-model="model"
          class="btn-toggle__group"
          toggle-color="primary"
          :options="btnOption"
          @input="localGetCopyright(nameCode[model])" />
      </q-item>
      <q-item class="page-default__content" v-html="content">
      </q-item>
    </q-list>
  </q-page>
</template>

<script>
import globalMixin from 'src/globalMixin';

export default {
  name: 'tutorial',
  mixins: [globalMixin],
  data() {
    return {
      datas: {
        one: null,
        two: null,
      },
      model: 'one',
      nameCode: {
        one: 'BT01',
        two: 'BT05',
      },
      btnOption: [
        { label: '新手教程', value: 'one' },
        { label: '充值教程', value: 'two' },
      ],
    };
  },
  computed: {
    title() {
      if (this.datas[this.model]) {
        return this.datas[this.model].title;
      }
      return null;
    },
    content() {
      if (this.datas[this.model]) {
        return this.datas[this.model].content;
      }
      return null;
    },
  },
  created() {
    this.$store.commit('setHideHeadMenu');
    this.$store.commit('setPageHeaderTitle', this.title);
    this.localGetCopyright(this.nameCode[this.model]);
  },
  methods: {
    changeTitle(title) {
      this.$store.commit('setPageHeaderTitle', title);
    },
    localGetCopyright(code = 'BT01') {
      if (this.datas[this.model]) {
        this.changeTitle(this.datas[this.model].title);
        return;
      }
      this.getCopyright('1', code).then((response) => {
        const data = response.find(f => f.version === 0);
        this.datas[this.model] = data;
        this.changeTitle(data.title);
      });
    },
  },
};
</script>

<style lang="stylus" scoped>

</style>

