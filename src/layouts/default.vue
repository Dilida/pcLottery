<template>
  <q-layout
    :class="bodyClass"
    :view="sscIndex.includes(styleName) || sscIndex.includes(styleNameNumber)
    || defaultIndex.includes(styleName) || defaultIndex.includes(styleNameNumber)?
    'lhh lpr lff':'lHh Lpr lff'">
    <q-layout-header class="header">
      <Toolbar
        class="default-toolbar"
        :leftDrawerOpen="leftDrawerOpen"
        @openLogin="dialogLogin = true"
        :kingToolbar="kingToolbar"
        :defaultToolbar="defaultToolbar" />
      <king-nav v-if="kingNav.includes(styleName) || kingNav.includes(styleNameNumber)" />
      <default-nav v-if="defaultNav.includes(styleName) || defaultNav.includes(styleNameNumber)" />
      <ssc-nav v-if="sscNav.includes(styleName) || sscNav.includes(styleNameNumber)" />
    </q-layout-header>
    <Drawer :leftDrawerOpen="leftDrawerOpen"/>
    <q-page-container class="layout-width page-bg row">
      <router-view @openLogin="dialogLogin = true" />
    </q-page-container>
    <!-- 提示彈窗 -->
    <globalAlertDialog></globalAlertDialog>
    <!-- 种列表弹窗 -->
    <lotteryEntryGroupDialog></lotteryEntryGroupDialog>
    <Footer class="footer" />
    <modal-login v-model="dialogLogin" />
    <!-- 增加“平台申诉“入口 -->
    <!-- <helpDialog v-if="this.$store.state.isLoggedIn && layoutShow.includes('helpDialog')"/> -->
  </q-layout>
</template>

<script>
import Drawer from 'components/layoutDrawer';
import Footer from 'components/layoutFooter';
import Toolbar from 'components/layoutToolbar';
import kingNav from 'components/lobbyKingNav';
import defaultNav from 'components/lobbyDefaultNav';
import sscNav from 'components/lobbySscNav';
import ModalLogin from 'pages/login';
import globalAlertDialog from 'components/dialog/globalAlertDialog';
import lotteryEntryGroupDialog from 'components/dialog/lotteryEntryGroupDialog';
import { globalMixin } from 'src/globalMixin';
import helpDialog from 'components/dialog/helpDialog';

export default {
  name: 'LayoutDefault',
  mixins: [globalMixin],
  components: {
    Drawer,
    Footer,
    Toolbar,
    kingNav,
    defaultNav,
    sscNav,
    ModalLogin,
    globalAlertDialog,
    lotteryEntryGroupDialog,
    helpDialog,
  },
  data() {
    return {
      leftDrawerOpen: false,
      dialogLogin: false,
    };
  },
};
</script>

<style>
</style>
