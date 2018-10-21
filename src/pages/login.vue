<template>
  <q-modal
    v-model="dialogShow"
    class="modal login modal--login">
      <div class="modal__header">
        <div class="modal__header-title">用户登录</div>
        <q-btn
          class="modal__close"
          icon="icon-tool icon-close"
          @click="$emit('dialogShowChange', false);"
        />
      </div>
      <div class="modal__body">
        <div class="row justify-center">
          {{loginErrMsg}}
        </div>
        <div class="login-wrap">
          <q-item>
            <q-field
              class="field-normal"
              label="账号：" >
              <q-input
                ref="loginForm"
                autofocus
                clearable
                hide-underline
                placeholder="请输入帐号"
                v-model.trim="loginForm.name" />
            </q-field>
          </q-item>
          <q-item>
            <q-field
              class="field-normal"
              label="密码：" >
              <q-input
                type="password"
                hide-underline
                placeholder="请输入密码"
                v-model="loginForm.password" />
            </q-field>
          </q-item>
          <q-item>
            <q-field
              class="field-normal field-code"
              label="验证码：" >
              <q-input
                hide-underline
                placeholder="请输入验证码"
                v-model="loginForm.code"
                @keyup.enter="methodCheckLogin" />
              <div class="field-code__img">
                <img
                  :src="yzmcodeImg"
                  @click="methodGetCode()">
              </div>
            </q-field>
          </q-item>
          <q-item class="login__check-item">
            <q-checkbox
              v-model="loginForm.freeLogin"
              checked-icon="check_box"
              unchecked-icon="check_box_outline_blank"
              label="七天内免登录" />
          </q-item>
          <q-item class="login__btn">
            <q-btn
              class="btn-primary btn-lg"
              @click="methodCheckLogin">登录</q-btn>
          </q-item>
          <q-item class="justify-center login__btn-group">
            <q-btn label="马上注册"
              flat
              @click="closeLoginDialog()"/>
            <q-btn label="免费试玩"
              flat
              @click="methodDemoPlay()"/>
            <q-btn label="联络客服"
              flat
              @click.native="customService" />
          </q-item>
        </div>
      </div>
  </q-modal>
</template>
<script>
import { globalMixin } from 'src/globalMixin';
import { cloneDeep } from 'lodash';
import { mapGetters } from 'vuex';

export default {
  name: 'ModalLogin',
  mixins: [globalMixin],
  model: {
    prop: 'propDialogShow',
    event: 'dialogShowChange',
  },
  props: {
    propDialogShow: {
      required: true,
    },
  },
  data() {
    return {
      dialogShow: this.propDialogShow,
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
    ...mapGetters(['cusUrl']),
  },
  watch: {
    dialogShow(newVal) {
      if (newVal !== this.propDialogShow) {
        if (newVal) {
          this.clearLoginForm();
          this.$refs.loginForm.focus();
        }
        this.$emit('dialogShowChange', newVal);
      }
    },
    propDialogShow(newVal) {
      if (newVal !== this.dialogShow) {
        if (newVal) {
          this.clearLoginForm();
          this.$refs.loginForm.focus();
        }
        this.dialogShow = this.propDialogShow;
      }
    },
  },
  methods: {
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
    closeLoginDialog() {
      this.$emit('dialogShowChange', false);
      this.$router.push('/reg');
    },
    async methodGetCode() {
      const res = await this.getCode();
      if (res) {
        this.yzmcodeImg = `data:image/png;base64,${res.code}` || '';
        this.loginForm.clientId = res.clientId;
      }
    },
    async methodDemoPlay() {
      // this.$emit('dialogShowChange', false);
      const res = await this.demoPlay();
      if (res === true) {
        // this.openDialog2('成功', 'positive');
        this.$emit('dialogShowChange', false);
      } else {
        // this.openDialog2('失败', 'negative');
      }
    },
    async methodCheckLogin() {
      const res = await this.memberLogin(cloneDeep(this.loginForm));
      if (res === true) {
        // this.openDialog2('成功', 'positive');
        this.getMemberBalance();
        this.$emit('dialogShowChange', false);
        this.$router.push('/');
      } else {
        this.loginErrMsg = res;
        this.methodGetCode();
        // this.openDialog2('失败', 'negative');
      }
    },
  },
};
</script>

<style>
</style>
