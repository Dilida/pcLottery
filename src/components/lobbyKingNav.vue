<template>
  <nav class="nav">
    <div class="layout-width row justify-between">
      <div class="logo col-auto">
        <img
          class="brand-logo"
          @click="$router.push(getRoutePath('Home'))"
          :src="logoUrl" >
      </div>
      <btnGroup
        :classArr="`col-auto btn-nav-group`"
        :buttonGroupList="menuList" />
    </div>
  </nav>
</template>

<script>
import btnGroup from 'components/layoutBtnGroup';
import { mapGetters } from 'vuex';
import { globalMixin } from 'src/globalMixin';

export default {
  name: 'lobbyKingNav',
  mixins: [globalMixin],
  components: {
    btnGroup,
  },
  data() {
    return {
    };
  },
  computed: {
    ...mapGetters(['logoUrl']),
    menuList() {
      return [
        { value: this.getRoutePath('Home'), label: '首页', icon: 'icon-nav icon-nav-home' },
        {
          // value: () => { this.$store.commit('toggleLotteryListDialog', true); },
          label: '彩票游戏',
          icon: 'icon-nav icon-nav-dice',
          type: 'dropdown',
        },
        { value: this.getRoutePath('activity'), label: '优惠活动', icon: 'icon-nav icon-nav-tag' },
        { value: this.getRoutePath('accountManage'), label: '个人中心', icon: 'icon-nav icon-nav-personal' },
      ];
    },
  },
};
</script>

<style lang="stylus">
</style>
