<template>
  <nav class="nav">
    <div class="layout-width row justify-between">
      <div class="logo col-auto">
        <img
          class="brand-logo"
          @click="$router.push(getRoutePath('Home'))"
          :src="logoUrl" >
      </div>
      <div class="login-bar col-auto">
        <!--已登入-->
        <q-list class="row login-bar-loged" v-if="isLoggedIn || isDemoUser">
          <q-item>
            <logoutPopover
              :classArr="`user-name`"
              :labelName="userName" >
              <q-btn class="btn-logout" @click="methodCheckLogout">登出</q-btn>
              <div>{{time2Date(loginTime)}}</div>
            </logoutPopover>
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
            <q-btn class="btn-primary btn-login" @click="methodCheckLogin">登录</q-btn>
            <q-btn class="btn-reg" @click="$router.push('/reg')">免费注册</q-btn>
            <q-btn flat class="btn-demoplay" @click="demoPlay()">免费试玩</q-btn>
            <!-- <q-btn flat class="btn-alink" @click="customService">联络客服</q-btn> -->
          </q-item>
        </q-list>
      </div>
    </div>
    <div class="navbar">
      <div class="layout-width row">
        <span class="all-game-title">
          <q-icon name="icon-lottery"></q-icon>
          热门彩种
        </span>
        <btnGroup
          :classArr="`col-auto btn-nav-group`"
          :buttonGroupList="menuList" />
      </div>
    </div>
  </nav>
</template>

<script>
import btnGroup from 'components/layoutBtnGroup';
import logoutPopover from 'components/layoutPopover';
import memberBalance from 'components/layoutBalance';
import { mapState, mapGetters } from 'vuex';
import { globalMixin } from 'src/globalMixin';
import { cloneDeep } from 'lodash';

export default {
  name: 'lobbyKingNav',
  mixins: [globalMixin],
  components: {
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
    ...mapState(['isLoggedIn', 'isDemoUser', 'userName', 'loginTime']),
    ...mapGetters(['logoUrl', 'cusUrl']),
    menuList() {
      return [
        { value: this.getRoutePath('Home'), label: '首页', icon: 'icon-nav icon-nav-home' },
        {
          label: '彩票游戏',
          icon: 'icon-nav icon-nav-dice',
          type: 'dropdown',
        },
        {
          label: this.lottery.find(item => item.id === 110).name,
          icon: 'icon-nav icon-nav-dice',
          chip: '火',
          value: this.getRouteLotteryPath(110),
        },
        {
          label: this.lottery.find(item => item.id === 118).name,
          icon: 'icon-nav icon-nav-dice',
          chip: '火',
          value: this.getRouteLotteryPath(118),
        },
        { value: this.getRoutePath('activity'), label: '优惠活动', icon: 'icon-nav icon-nav-tag' },
        { value: this.getRoutePath('accountManage'), label: '个人中心', icon: 'icon-nav icon-nav-personal' },
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
        this.clearLoginForm();
      } else {
        this.loginErrMsg = res;
        this.methodGetCode();
      }
    },
  },
};
</script>

<style lang="stylus">
</style>
