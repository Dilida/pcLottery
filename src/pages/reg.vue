<template>
  <q-page class="reg">
    <div class="page-header">
      <span class="icon-page icon-page-reg"></span>
      <span class="page-title">注册</span>
    </div>
    <q-list class="reg-wrap row">
      <q-item class="col-12" v-if="content !== ''">
        <div v-html="content" class="reg-desc"></div>
      </q-item>
      <div
      :class="defaultGlobal.includes(styleName) ? ' form-content col-8' : 'col-12'">
        <q-item
          class=""
          v-if="item.ifView === 1"
          :key="item.item"
          v-for="item in registerConfigList">
          <q-field
            :label="label[item.item] + '：'"
            class="field-normal"
            :class="{'field-code': item.item === 'code'}"
            :error="$v.inputForm[item.item].$error"
            :error-label="errorLabel[item.item]"
          >
            <q-input
              :maxlength="item.limitLength"
              :type="item.type"
              :disable="item.item === 'promoteCode'"
              v-if="item.item !== 'bankId'"
              v-model="inputForm[item.item]"
              :placeholder="placeHolder[item.item]"
              :error="$v.inputForm[item.item].$error"
              clearable
              hide-underline
              @blur="triggerTouch(item.item)"
              @input="triggerTouch(item.item)"
              @keyup.enter="enterCommit(item.item)"/>
            <q-select
              :type="item.type"
              v-if="item.item === 'bankId'"
              :options="bankList"
              v-model="inputForm[item.item]"
              :placeholder="placeHolder[item.item]"
              :error="$v.inputForm[item.item].$error"
              clearable
              hide-underline
              @blur="triggerTouch(item.item)"
              @input="triggerTouch(item.item)" />
            <div class="field-code__img" v-if="item.item === 'code'">
              <img
                :src="`data:image/png;base64,${verifyImgSrc}`"
                class="c-input-code"
                @click="getVerifyImgSrc">
            </div>
          </q-field>
        </q-item>
        <q-item class="reg__btn">
          <q-btn
            ref="commitBtn"
            class="btn-primary btn-lg"
            icon="icon-check"
            @click="commitForm()"
            label="注册"
          />
        </q-item>
        <q-item class="col-12">
          <div class="reg__msg">已有帐号？
            <a @click="$emit('openLogin')" href="javascript:;">马上登录</a>
          </div>
        </q-item>
      </div>
    </q-list>
  </q-page>
</template>

<script>
import globalMixin from 'src/globalMixin';

import { required, minLength, maxLength, sameAs, numeric } from 'vuelidate/lib/validators';
import {
  validatePhoneNumber,
  validateRealName,
  validateEngNumUnderline,
  checkEmail,
  checkWechat,
  checkqq,
  checkRequired,
  validateBankDeposit,
} from 'src/consts/validators';
import { setTimeout, clearTimeout } from 'timers';

export default {
  mixins: [globalMixin],
  data() {
    return {
      title: '注册',
      registerConfigList: [],
      bankList: [],
      timeOutSaver: null,
      timeOuterCounts: 0,
      verifyImgSrc: '',
      clientId: null,
      haveTimeOut: false,
      inputForm: {
        name: '',
        password: '',
        confirmPassword: '',
        realName: '',
        bankCardNo: '',
        bankId: null,
        bankDeposit: '',
        mobile: '',
        payPassword: '',
        protocolCheck: false,
        qq: '',
        wechat: '',
        email: '',
        code: '',
        promoteCode: '',
      },
      placeHolder: {
        name: '请输入帐号',
        password: '请输入密码',
        confirmPassword: '请输入确认密码',
        realName: '请输入真实姓名',
        bankCardNo: '请输入取款银行卡号',
        bankId: '请选择银行',
        bankDeposit: '如:北京市海淀区中关村支行',
        mobile: '请输入手机号码',
        payPassword: '请输入4位数字取款密码',
        qq: '请输入QQ号',
        wechat: '请输入微信号',
        email: '请输入电子邮箱',
        code: '请输入验证码',
        promoteCode: '请输入推广码',
      },
      label: {
        name: '帐号',
        password: '登录密码',
        confirmPassword: '确认密码',
        realName: '真实名称',
        bankCardNo: '银行卡号',
        bankId: '选择银行',
        bankDeposit: '开户行',
        mobile: '手机号码',
        payPassword: '取款密码',
        qq: 'QQ',
        wechat: '微信',
        email: '电子邮箱',
        code: '验证码',
        promoteCode: '推广码',
      },
      errorLabel: {
        name: '请输入4~15位英数账号',
        password: '请输入6～20位英数密码',
        confirmPassword: '两次密码输入不一致',
        realName: '请输入真实姓名',
        bankCardNo: '请输入正确的银行卡',
        bankId: '必填',
        bankDeposit: '请输入开户行地址 (如:北京市海淀区xx分行)',
        mobile: '请输入正确的手机号码',
        payPassword: '请输入4位数字取款密码',
        qq: '请输入正确的QQ号',
        wechat: '请输入正确的微信账号',
        email: '请输入正确的邮箱地址',
        code: '必填',
        promoteCode: '必填',
      },
      // 註冊提示
      content: '',
    };
  },
  validations() {
    return {
      inputForm: {
        name: {
          required,
          minLength: minLength(4),
          maxLength: maxLength(15),
          validateEngNumUnderline,
          checkAccount(value) {
            if (value.length >= 4 && value.length <= 15) {
              clearTimeout(this.timeOutSaver);
              return new Promise((resolve) => {
                this.timeOutSaver = setTimeout(() => {
                  this.checkMemberAccount(value).then((response) => {
                    if (!response) {
                      this.errorLabel.name = '用户名重复';
                    }
                    this.haveTimeOut = false;
                    resolve(response);
                  });
                }, 500);
              });
            }
            this.errorLabel.name = '请输入4~15位英数账号';
            return false;
          },
        },
        password: {
          required,
          minLength: minLength(6),
          maxLength: maxLength(20),
          validateEngNumUnderline,
        },
        confirmPassword: {
          required,
          sameAsPassword: sameAs('password'),
        },
        payPassword: {
          required,
          numeric,
          minLength: minLength(4),
          maxLength: maxLength(4),
        },
        code: {
          required,
        },
        // 以下依照后端要求来判断是否必填
        realName: {
          validateRequired(value) {
            return this.pageCheckRequired('realName', value);
          },
          validateRealName,
          minLength: minLength(2),
        },
        bankCardNo: {
          validateRequired(value) {
            return this.pageCheckRequired('bankCardNo', value);
          },
          numeric,
          minLength: minLength(16),
        },
        bankId: {
          validateRequired(value) {
            return this.pageCheckRequired('bankId', value);
          },
        },
        bankDeposit: {
          validateRequired(value) {
            return this.pageCheckRequired('bankDeposit', value);
          },
          validateBankDeposit,
        },
        mobile: {
          validateRequired(value) {
            return this.pageCheckRequired('mobile', value);
          },
          numeric,
          minLength: minLength(11),
          maxLength: maxLength(11),
          validatePhoneNumber,
        },
        qq: {
          validateRequired(value) {
            return this.pageCheckRequired('qq', value);
          },
          checkqq,
        },
        wechat: {
          validateRequired(value) {
            return this.pageCheckRequired('wechat', value);
          },
          checkWechat,
        },
        email: {
          validateRequired(value) {
            return this.pageCheckRequired('email', value);
          },
          checkEmail,
        },
        promoteCode: {
          validateRequired(value) {
            return this.pageCheckRequired('promoteCode', value);
          },
        },
      },
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.$store.commit('setPageHeaderTitle', this.title);
      this.getRegisterConfig().then((res) => {
        const list = res.result;
        // 手动添加验证码输入匡规则(后端configlist不会给)
        const codeObj = {
          ifDisabled: 1,
          ifRequired: 1,
          ifView: 1,
          item: 'code',
          type: 'text',
        };
        list.push(codeObj);
        list.forEach((item) => {
          const limitLength = {
            realName: 20,
            bankDeposit: 50,
            bankCardNo: 21,
            qq: 20,
            email: 30,
            wechat: 30,
            payPassword: 4,
          };
          item.limitLength = limitLength[item.item];
          if (item.item === 'password' || item.item === 'confirmPassword' || item.item === 'payPassword') {
            item.type = 'password';
          } else if (item.item === 'bankId') {
            item.type = 'select';
          } else {
            item.type = 'text';
          }
        });
        const promoteCodeShow = this.getPromoteCode();
        list.splice(
          list.length - 1,
          0,
          promoteCodeShow,
        );
        this.registerConfigList = list;
        this.registerConfigList.forEach((item) => {
          // 获取银行下拉列表, 假如有要求bankName才打接口
          if (item.item === 'bankId') {
            this.getBankList().then((response) => {
              const resList = response.result.list;
              this.$_lodash.forEach(resList, (obj, index) => {
                const { bankName, id } = { ...obj };
                resList[index] = { ...obj, label: bankName, value: id };
              });
              this.bankList = resList;
            });
          }
        });
      });
      // 注册说明
      this.getCopyright('2', 'ZT03').then((res) => {
        this.content = res.content;
      });
      // 获取验证码
      this.getVerifyImgSrc();
    },
    // 触发输入匡验证
    triggerTouch(key) {
      if (this.isIE) return;
      this.$v.inputForm[key].$touch();
    },
    // 确认输入匡是否需要通过require验证规则
    pageCheckRequired(key, value) {
      let test = false;
      this.registerConfigList.forEach((item) => {
        if (item.item === key && item.ifRequired === 1) {
          test = true;
        }
      });
      return checkRequired(test, value);
    },
    enterCommit(key) {
      if (key === 'code') {
        this.$refs.commitBtn.click();
      }
    },
    /**
     * 邀请码取得
    */
    getVerifyImgSrc() {
      this.getCode().then((res) => {
        if (res.code && res.clientId) {
          this.verifyImgSrc = res.code;
          this.clientId = res.clientId;
        }
      });
    },
    /**
     * 推广码取得
     */
    getPromoteCode() {
      const codeNameKey = 'promoteCode';
      if (this.$_lodash.has(this.$route.query, ['f'])) {
        this.setCookie(codeNameKey, this.$route.query.f);
      }
      if (this.hasCookie(codeNameKey)) {
        this.inputForm.promoteCode = this.getCookie(codeNameKey);
        return {
          ifDisabled: 0,
          ifRequired: 0,
          ifView: 1,
          item: 'promoteCode',
          label: '推广码',
          type: 'text',
        };
      }
      return '';
    },
    /**
     * 提交表单
     */
    commitForm() {
      let canCommit = true;
      const data = {};
      this.registerConfigList.forEach((item) => {
        // 验证每个有显示的输入匡
        if (item.ifView === 1) {
          this.triggerTouch(item.item);
          // 其中有一个规则没过就不送
          if (this.$v.inputForm[item.item].$error) {
            canCommit = false;
          }
          if (
            item.item !== 'confirmPassword' &&
            item.item !== 'bankId'
          ) {
            data[item.item] = this.inputForm[item.item];
          }
        }
      });
      if (canCommit) {
        if (this.inputForm.bankId) {
          const { bankCode, bankName } =
            this.bankList.find(obj => obj.id === this.inputForm.bankId);
          data.bankCode = bankCode;
          data.bankName = bankName;
        }
        this.registerLogin(data, this.clientId).then((res) => {
          if (res.apistatus === 1) {
            this.openDialog({
              content: '注册成功，自动登入',
              type: 'positive',
              dialogAutoClose: true,
              dialogType: 'check',
            });
            const cookieTime = 1 * 24 * 60 * 60 * 1000;
            if (this.hasCookie('promoteCode')) {
              this.removeCookie('promoteCode');
            }
            this.setCookie('access_pcToken', res.result.token, cookieTime);
            this.setCookie('username', res.result.username, cookieTime);
            this.setCookie('loginTime', res.serverTime);
            this.$store.dispatch('setLoginState', true);
            this.$store.dispatch('setDemoState', false);
            this.removeCookie('isDemoUser');
            this.setCookie('isDemoUser', false);
            this.getMemberBalance();
            this.$router.push('/');
          } else {
            this.getVerifyImgSrc();
          }
        }).catch((err) => {
          this.openDialog({
            content: err.data.errorMsg ? err.data.errorMsg : err.data.errorMsgEn,
            type: 'negative',
            dialogAutoClose: true,
            dialogType: 'negative',
          });
          this.getVerifyImgSrc();
        });
      }
    },
  },
};
</script>

<style lang="stylus" scoped>

</style>

