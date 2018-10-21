<template>
  <nav class="nav">
    <div class="layout-width row justify-between nav-account">
      <div class ="logo col-auto">
        <img
          class="brand-logo"
          @click="$router.push(getRoutePath('Home'))"
          :src="logoUrl" >
      </div>
      <div class="login-bar col-auto">
        <!--已登入-->
        <q-list class="row login-bar-loged" v-if="isLoggedIn || isDemoUser">
          <q-item>
            <btnDropdown
              class="header-account"
              :btnLabel="`${userName}的账户`"
              :btnIcon="'icon-user-pic'"
              :dropdownList="myAccoutMenuList" />
          </q-item>
          <q-item>
            <q-icon
              name="icon-tool icon-mail"
              :class="{ active: haveUnreadMail }"
              @click.native="$router.push('/member/accountNotification')" />
          </q-item>
          <q-item>
            <memberBalance :isLoggedIn="isLoggedIn" />
          </q-item>
        </q-list>
        <!--未登入-->
        <q-list v-else class="row login-bar-wrap">
          <q-item>
            <q-field class="field-bar">
              <q-input
                class="input-account"
                ref="loginForm"
                hide-underline
                placeholder="帐号"
                v-model.trim="loginForm.name" />
            </q-field>
          </q-item>
          <q-item>
            <q-field class="field-bar">
              <q-input
                class="input-password"
                type="password"
                hide-underline
                placeholder="密码"
                v-model="loginForm.password" />
            </q-field>
          </q-item>
          <q-item>
            <q-field class="field-bar field-bar-code">
              <q-input
                class="input-code"
                hide-underline
                placeholder="验证码"
                v-model="loginForm.code"
                @keyup.enter="methodCheckLogin" />
              <div class="field-bar-code__img">
                <img
                  :src="yzmcodeImg"
                  @click="methodGetCode()">
              </div>
            </q-field>
          </q-item>
          <q-item>
            <q-btn class="btn-login" @click="methodCheckLogin">登录</q-btn>
            <q-btn class="btn-reg" @click="$router.push('/reg')">注册</q-btn>
            <q-btn
            flat
            class="btn-demoplay"
            @click="demoPlay()">
            免费试玩
            </q-btn>
          </q-item>
        </q-list>
      </div>
    </div>
    <div class="nav-full">
      <div class="layout-width row nav-main">
        <div class="all-game-title">
          <q-icon name="icon-dice"></q-icon>
          全部彩种
        </div>
        <btnGroup
          :classArr="`col-auto btn-nav-group`"
          :buttonGroupList="subMenuList" />
      </div>
    </div>
  </nav>
</template>
<script>
import btnDropdown from 'components/layoutBtnDropdown';
import btnGroup from 'components/layoutBtnGroup';
import logoutPopover from 'components/layoutPopover';
import memberBalance from 'components/layoutBalance';
import { mapGetters, mapState } from 'vuex';
import { globalMixin } from 'src/globalMixin';
import { cloneDeep } from 'lodash';

export default {
  name: 'lobbyDefaultNav',
  mixins: [globalMixin],
  components: {
    btnDropdown,
    btnGroup,
    logoutPopover,
    memberBalance,
  },
  data() {
    return {
      loginErrMsg: '',
      yzmcodeImg: '',
      loginForm: {
        name: '',
        password: '',
        code: '',
        freeLogin: false,
        clientId: '',
      },
    };
  },
  computed: {
    ...mapState(['isLoggedIn', 'isDemoUser', 'userName', 'haveUnreadMail', 'loginTime']),
    ...mapGetters(['logoUrl', 'cusUrl', 'getApp']),
    menuList() {
      return [
        { value: this.customAppdownload, label: '手机投注' },
        { value: this.getRoutePath('helpCenterJoin'), label: '代理加盟' },
        { value: this.getRoutePath('helpCenterTutorial'), label: '帮助中心' },
        { value: this.getRoutePath('helpCenterAbout'), label: '关于我们' },
        { value: this.customService, label: '联系我们' },
      ];
    },
    subMenuList() {
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
        { value: this.getRoutePath('deposit'), label: '充值', icon: 'icon-nav icon-deposit' },
        { value: this.getRoutePath('withdrawals'), label: '提款', icon: 'icon-nav icon-withdrawals' },
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
  },
  mounted() {
    this.clearLoginForm();
  },
  methods: {
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
    clearLoginForm() {
      this.loginForm = {
        name: '',
        password: '',
        code: '',
        freeLogin: false,
      };
      this.loginErrMsg = '';
      this.methodGetCode();
    },
    async methodGetCode() {
      const res = await this.getCode();
      if (res) {
        this.yzmcodeImg = `data:image/png;base64,${res.code}` || '';
        this.loginForm.clientId = res.clientId;
      }
    },
    async methodCheckLogin() {
      const res = await this.memberLogin(cloneDeep(this.loginForm));
      if (res === true) {
        this.$router.push('/');
      } else {
        this.loginErrMsg = res;
        this.methodGetCode();
      }
    },
  },
};
</script>

