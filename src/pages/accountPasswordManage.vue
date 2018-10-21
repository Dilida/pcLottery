<template>
  <q-page class="account-passward-manage">
    <div class="col-12 row layout-page">
      <div class="layout-page-side">
        <!-- side menu -->
        <memberSideBar></memberSideBar>
      </div>
      <div class="layout-page-main">
        <!-- Title bar -->
        <memberTitleBar :title="title"></memberTitleBar>
        <!-- Content -->
        <div class="layout-page-content">
          <q-tabs
          inverted
          no-pane-border
          class="tabs">
            <q-tab class="tabs__tab" name="resetPassword" slot="title" default>修改登录密码</q-tab>
            <q-tab class="tabs__tab" name="resetWithdrawalPassword" slot="title">修改取款密码</q-tab>
            <!-- Target -->
            <q-tab-pane class="tabs__content" name="resetPassword" keep-alive>
              <resetPassword :customConfig="resetPasswordConfig"></resetPassword>
            </q-tab-pane>
            <q-tab-pane class="tabs__content" name="resetWithdrawalPassword" keep-alive>
              <resetPassword :customConfig="resetWithdrawalPasswordConfig"></resetPassword>
            </q-tab-pane>
          </q-tabs>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import httpMixin from 'src/httpMixin';

import memberSideBar from 'components/member/memberSideBar';
import memberTitleBar from 'components/member/memberTitleBar';
import resetPassword from 'components/member/resetPassword';

export default {
  name: 'accountPasswordManage',
  mixins: [httpMixin],
  data() {
    return {
      title: '密码管理',
      resetPasswordConfig: {
        placeholder: '密码',
        type: 1,
      },
      resetWithdrawalPasswordConfig: {
        placeholder: '取款密码',
        type: 2,
      },
    };
  },
  components: {
    memberSideBar,
    memberTitleBar,
    resetPassword,
  },
};
</script>

