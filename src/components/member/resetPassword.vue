<template>
  <div class="reset-password"
  :class="defaultGlobal.includes(styleName) ? 'row' : ''">
    <div
    :class="defaultGlobal.includes(styleName) ? 'form-content col-6' : 'col-12'">
      <q-item class="account-manage__item">
        <q-field
      label="原密码："
      class="field-normal"
      >
        <q-input
          :maxlength="isDepositPassword && 4"
          hide-underline
          v-model="oldPassword"
          type="password"
          :placeholder="`请输入${customConfig.placeholder}`"></q-input>
      </q-field>
      </q-item>
          <q-item class="account-manage__item">
            <q-field
            label="新密码："
            class="field-normal"
            >
              <q-input
                :maxlength="isDepositPassword && 4"
                hide-underline
                v-model="newPassword"
                type="password"
                :placeholder="`请输入新${this.customConfig.placeholder}`"></q-input>
            </q-field>
          </q-item>
          <q-item class="account-manage__item">
            <q-field
          label="确认密码："
          class="field-normal"
          >
            <q-input
              :maxlength="isDepositPassword && 4"
              hide-underline
              v-model="confirmPassword"
              type="password"
              :placeholder="`请再次输入新${this.customConfig.placeholder}`"></q-input>
          </q-field>
        </q-item>
        <div class="reset-password__btn">
          <q-btn
            class="btn-primary btn-lg"
            :loading="loading"
            @click="submit()"
          >
            <q-icon name="icon-bet" class="icon-check on-left"></q-icon>
            确定
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 修改登入密碼與修改取款密碼僅差在api
 * 從父層傳遞customConfig來決定
 * customConfig: {
 *  placeholder: 'input框內定義不同文字',
 *  apiPath: '確認修改時所call的api'
 * }
 */
// import httpMixin from 'src/httpMixin';
import globalMixin from 'src/globalMixin';

export default {
  name: 'resetPassword',
  mixins: [globalMixin],
  props: {
    customConfig: {
      type: Object,
    },
  },
  data() {
    return {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      loading: false,
    };
  },
  computed: {
    isDepositPassword() {
      return this.customConfig.placeholder === '取款密码';
    },
  },
  methods: {
    submit() {
      this.loading = true;
      if (this.oldPassword === this.newPassword) {
        this.$store.commit('openDialog', {
          title: '提示',
          content: '原密码和新密码不能相同',
          dialogType: 'negative',
        });
        this.loading = false;
      } else if (this.newPassword === this.confirmPassword) {
        // do submit
        const passwordObj = {
          oldPassword: this.oldPassword,
          newPassword: this.newPassword,
        };
        if (this.acceptOnlyEngNum(passwordObj.newPassword)) {
          this.resetPassword(this.customConfig.type, passwordObj).then((res) => {
            if (res.apistatus === 1) {
              this.$store.commit('openDialog', {
                title: '提示',
                content: '修改密码成功',
                dialogType: 'check',
              });
            } else {
              this.$store.commit('openDialog', {
                title: '提示',
                content: res,
                dialogType: 'negative',
              });
            }
            this.loading = false;
          });
        } else {
          this.$store.commit('openDialog', {
            title: '提示',
            content: '密码只能为字母、数字',
            dialogType: 'negative',
          });
          this.loading = false;
        }
      } else {
        this.loading = false;
        this.$store.commit('openDialog', {
          title: '提示',
          content: '确认密码错误',
          dialogType: 'negative',
        });
      }
    },
  },
};
</script>
