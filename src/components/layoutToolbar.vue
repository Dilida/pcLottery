<template>
  <q-toolbar
    color="toolbar" >
    <!-- default版 -->
    <div
      v-if="defaultToolbar.includes(styleName) || defaultToolbar.includes(styleNameNumber)"
      class="layout-width justify-between">
      <div class="top-slogan">欢迎来到{{this.productName}}！祝您赚大钱</div>
      <btnGroup
        :classArr="`col-auto btn-top-group`"
        :buttonGroupList="menuList" />
    </div>

    <!--其它版-->
    <div
      v-else
      class="layout-width">
      <template v-if="isLoggedIn || isDemoUser">
        <btnDropdown
          class="header-account"
          :btnLabel="`我的账户`"
          :btnIcon="'icon-user-pic'"
          :dropdownList="myAccoutMenuList" />
        <q-toolbar-title class="row">
          <logoutPopover
            :classArr="``"
            :labelName="userName" >
            <q-btn class="logout" @click="methodCheckLogout">登出</q-btn>
            <div>{{time2Date(loginTime)}}</div>
          </logoutPopover>
          <!-- king版 -->
          <div
            class="top-notice"
            v-if="!isDemoUser &&
              (kingToolbar.includes(styleName) || kingToolbar.includes(styleNameNumber)) ">
            <q-icon
              name="icon-tool icon-mail"
              :class="{ active: haveUnreadMail }"
              @click.native="$router.push(getRoutePath('accountNotification'))" />
          </div>
          <memberBalance :isLoggedIn="isLoggedIn" />
        </q-toolbar-title>
      </template>
      <template v-else>
        <div class="header-login-btn">
          <q-btn @click="$emit('openLogin')">登录</q-btn>
          <q-btn @click="$router.push(getRoutePath('reg'))">注册</q-btn>
          <q-toolbar-title class="row"></q-toolbar-title>
        </div>
      </template>
      <!-- king版 -->
      <template v-if="kingToolbar.includes(styleName) || kingToolbar.includes(styleNameNumber)">
        <btnGroup
          :classArr="`top-btns-help`"
          v-if="layoutShow.includes('lotteryLeftOptions')"
          :buttonGroupList="lotteryLeftKingOptions" />
        <btnGroup
          :classArr="`top-btns-help`"
          v-else
          :buttonGroupList="lobbyLeftOptions" />
        <btnGroup
          :classArr="`top-btns-account`"
          :buttonGroupList="lobbyRightOptions" />
      </template>
    </div>
  </q-toolbar>
</template>

<script>
import btnDropdown from 'components/layoutBtnDropdown';
import btnGroup from 'components/layoutBtnGroup';
import memberBalance from 'components/layoutBalance';
import logoutPopover from 'components/layoutPopover';
import { mapGetters, mapState } from 'vuex';
import { globalMixin } from 'src/globalMixin';

export default {
  name: 'layoutToolbar',
  mixins: [globalMixin],
  props: ['leftDrawerOpen'],
  components: {
    btnDropdown,
    btnGroup,
    memberBalance,
    logoutPopover,
  },
  data() {
    return {
      popoverShow: false,
    };
  },
  computed: {
    ...mapState(['isLoggedIn', 'isDemoUser', 'userName', 'haveUnreadMail', 'loginTime']),
    ...mapGetters(['cusUrl', 'getApp']),
    menuList() {
      return [
        { value: this.customAppdownload, label: '手机投注' },
        { value: this.getRoutePath('helpCenterJoin'), label: '代理加盟' },
        { value: this.getRoutePath('helpCenterTutorial'), label: '帮助中心' },
        { value: this.getRoutePath('helpCenterAbout'), label: '关于我们' },
        { value: this.customService, label: '联系我们' },
      ];
    },
    lotteryLeftKingOptions() {
      return [
        { value: this.getRoutePath('Home'), label: '返回首页' },
        {
          // value: () => { this.$store.commit('toggleLotteryListDialog', true); },
          label: '全部彩票',
          callDialog: true,
          type: 'dropdown',
        },
      ];
    },
    lobbyLeftOptions() {
      return [
        { value: this.customAppdownload, label: '手机投注' },
        { value: this.getRoutePath('helpCenterJoin'), label: '代理加盟' },
        { value: this.getRoutePath('helpCenterTutorial'), label: '帮助中心' },
      ];
    },
    lobbyRightOptions() {
      return [
        { value: this.getRoutePath('deposit'), label: '充值', icon: 'icon-top-deposit' },
        { value: this.getRoutePath('withdrawals'), label: '提款', icon: 'icon-top-withdrawals' },
        {
          value: this.customService, label: '在线客服', type: 'open', icon: 'icon-top-service',
        },
      ];
    },
    myAccoutMenuList() {
      return [
        { value: this.getRoutePath('accountManage'), label: '帐户管理' },
        { value: this.getRoutePath('betRecord'), label: '投注管理' },
        { value: this.getRoutePath('accountInfo'), label: '资金管理' },
        { value: this.getRoutePath('accountNotification'), label: '公告管理' },
      ];
    },
    // lotteryLeftDefaultOptions() {
    //   return [
    //     { value: this.getRoutePath('Home'), label: '返回首页' },
    //  // { value: () => { this.$store.commit('toggleLotteryListDialog', true); }, label: '全部彩票' },
    //     { type: 'dropdown', label: '全部彩票' },
    //     { value: this.getRoutePath('deposit'), label: '充值' },
    //     { value: this.getRoutePath('withdrawals'), label: '提款' },
    //   ];
    // },
    // lobbyDefaultOptions() {
    //   return [
    //     {
    //       name: 'icon-service',
    //       func: () => { window.open(this.cusUrl, '_blank'); },
    //     },
    //     {
    //       name: 'icon-mail',
    //       func: () => { this.methodRoutePUsh(this.getRoutePath('accountNotification')); },
    //       condition: this.isDemoUser,
    //       active: this.haveUnreadMail,
    //     },
    //     {
    //       name: 'icon-logout',
    //       func: () => { this.methodCheckLogout(); },
    //       condition: !this.isLoggedIn,
    //     },
    //   ];
    // },
  },
  methods: {
    methodRoutePUsh(path) {
      this.$router.push(path);
    },
    methodCheckLogout() {
      this.memberLogout({ name: this.userName }).then((res) => {
        if (res) this.$router.push(this.getRoutePath('Home'));
      });
    },
    customService() {
      const win = window.open(this.cusUrl, '_blank');
      win.focus();
    },
    customAppdownload() {
      if (this.getApp.downloadUrl) {
        window.open(this.getApp.downloadUrl, '_blank');
      } else {
        this.$router.push(this.getRoutePath('appDownload'));
      }
    },
  },
};
</script>

<style>
</style>
