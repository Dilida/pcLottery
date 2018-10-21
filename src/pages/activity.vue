<template>
  <q-page class="activity-page">
    <div class="bread-crumbs">
      <span class="bread-crumbs__item">优惠活动</span>
    </div>
    <q-list class="activity-list"
      v-if="sscIndex.includes(styleName) || sscIndex.includes(styleNameNumber)">
      <q-item
        v-for="item in datas"
        :key="item.cid"
        class="activity-item"
        @click.native="getInfo(item)" >
        <q-list class="activity-item__wrap">
          <q-item class="activity-item__img">
            <img :src="item.titlePic" alt="">
          </q-item>
          <q-item class="activity-item__info">
            <q-list-header class="activity-item__header"> {{item.title}} </q-list-header>
            <q-item class="activity-item__content" v-show="item.show" v-html="item.content">
            </q-item>
            <q-item class="activity-item__btn-bar" v-show="!item.show">
              <q-btn
                class="btn-action btn-activity" >
                了解详情
              </q-btn>
            </q-item>
            <q-item class="activity-item__btn-bar" v-show="item.show">
              <q-btn
                class="btn-action btn-activity" >
                收合详情
              </q-btn>
            </q-item>
          </q-item>
        </q-list>
      </q-item>
    </q-list>
    <q-list class="activity-list" v-else>
      <q-item
      v-for="item in datas"
      :key="item.cid"
      class="activity-item"
      @click.native="getInfo(item)" >
        <q-list class="activity-item__wrap">
          <q-list-header class="activity-item__header">
            <q-icon
              :class="defaultIndex.includes(styleName)
              || defaultIndex.includes(styleNameNumber) ? 'icon-tag-reverse' : ''"></q-icon>
            {{item.title}} </q-list-header>
          <q-item class="activity-item__img">
            <img :src="item.titlePic" alt="">
          </q-item>
          <q-item class="activity-item__btn-bar" v-show="!item.show">
            <q-btn
              class="btn-action btn-activity" >
              查看详情
            </q-btn>
          </q-item>
          <q-item class="activity-item__content" v-show="item.show" v-html="item.content">
          </q-item>
        </q-list>
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
      // pageTitle: '优惠活动',
      title: '优惠活动',
      datas: [],
      page: 1,
      rowsPerPage: 10,
    };
  },
  created() {
    this.$store.commit('setPageHeaderTitle', this.title);
    this.methodsGetActivity();
  },
  updated() {
    this.modifyTableAlignment();
  },
  methods: {
    async methodsGetActivity() {
      const params = {
        page: this.page,
        count: this.rowsPerPage,
      };
      const res = await this.getActivity(params);
      this.datas = res.list.map((item) => {
        item.titlePic = this.getPicUrl(item.titlePic);
        return { ...item, show: false };
      });
    },
    // 使用者设定table置中时，改变style让它置中
    modifyTableAlignment() {
      const tables = document.querySelectorAll('table[align=center]');
      tables.forEach((item) => {
        item.style.margin = '0 auto';
      });
    },
    getInfo(item) {
      if (item.show) {
        item.show = false;
      } else if (item.content === null) {
        // TODO: 沒資料的話 需要打其他接口?
        this.getActiveityInfo(item.cid).then((response) => {
          if (response !== null) {
            this.datas.forEach((res) => {
              res.show = false;
              if (res.cid === item.cid) {
                res.content = response;
                res.show = true;
              }
            });
          }
        });
      } else {
        this.datas.forEach((res) => {
          res.show = res.cid === item.cid;
        });
      }
    },
  },
  components: {
  },
};
</script>

<style lang="stylus" scoped>
// .img
//   img
//     width 100%
// .info-content
//   display block
</style>

