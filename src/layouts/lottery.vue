<template>
  <q-layout view="lHh Lpr lff">
    <q-layout-header class="header">
      <Toolbar
      class="lottery-toolbar"
      :leftDrawerOpen="leftDrawerOpen"
      />
      <default-nav v-if="defaultNav.includes(styleName) || defaultNav.includes(styleNameNumber)" />
    </q-layout-header>
    <Drawer
    :leftDrawerOpen="leftDrawerOpen"
    />
    <q-page-container>
      <router-view />
    </q-page-container>
    <!-- 提示彈窗 -->
    <globalAlertDialog />
    <!-- 种列表弹窗 -->
    <lotteryEntryGroupDialog />
    <crowdFundingDialog />
    <Footer class="footer" />
  </q-layout>
</template>

<script>
import Drawer from 'components/layoutDrawer';
import Footer from 'components/layoutFooter';
import Toolbar from 'components/layoutToolbar';
import defaultNav from 'components/lobbyDefaultNav';
import globalAlertDialog from 'components/dialog/globalAlertDialog';
import lotteryEntryGroupDialog from 'components/dialog/lotteryEntryGroupDialog';
import crowdFundingDialog from 'components/dialog/crowdFundingDialog';
import { globalMixin } from 'src/globalMixin';

export default {
  name: 'LayoutDefault',
  mixins: [globalMixin],
  components: {
    Drawer,
    Footer,
    Toolbar,
    defaultNav,
    globalAlertDialog,
    lotteryEntryGroupDialog,
    crowdFundingDialog,
  },
  data() {
    return {
      leftDrawerOpen: false,
    };
  },
};
</script>

<style>
</style>
