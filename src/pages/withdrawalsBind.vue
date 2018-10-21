<template>
  <q-page class="withdrawals-bind">
    <div class="col-12 row layout-page">
      <!-- side menu -->
      <div class="layout-page-side">
        <memberSideBar></memberSideBar>
      </div>

      <!-- Title bar -->
      <div class="layout-page-main">
        <memberTitleBar :title="title"></memberTitleBar>
        <!-- content -->
        <div class="layout-page-content">
          <div class="account-manage-header">
            <q-icon name="icon-bind-card"></q-icon>
            您还没有绑定银行卡，请立即绑定！
          </div>
          <q-list class="col-12 account-manage__list"
          v-show="!loadingVisible"
          :class="defaultGlobal.includes(styleName) ? 'row' : ''">
            <div :class="defaultGlobal.includes(styleName) ? 'form-content col-6' : ''">
              <q-item class="account-manage__item">
                <q-field
                  label="真实姓名："
                  class="field-normal"
                  :error="$v.inputForm.realName.$error"
                  error-label="请输入真实姓名"
                >
                  <q-input
                    maxLength="20"
                    v-model="inputForm.realName"
                    placeholder="请输入您的真实姓名"
                    clearable
                    hide-underline
                    :error="$v.inputForm.realName.$error"
                    @blur="triggerTouch(realName)"
                    @input="triggerTouch(realName)"
                  ></q-input>
                </q-field>
              </q-item>
              <q-item class="account-manage__item">
                <q-field
                  label="银行名称："
                  class="field-normal"
                  :error="$v.inputForm.bankName.$error"
                  error-label="必填"
                >
                  <q-select
                    v-model="inputForm.bankName"
                    placeholder="请选择"
                    :options="bankList"
                    hide-underline
                    :error="$v.inputForm.bankName.$error"
                    @blur="triggerTouch(bankName)"
                    @input="triggerTouch(bankName)"
                  />
                </q-field>
              </q-item>
              <q-item class="account-manage__item">
                <q-field
                  label="开户行："
                  class="field-normal"
                  :error="$v.inputForm.bankDeposit.$error"
                  error-label="请输入开户行地址（如:北京市海淀区xx分行"
                >
                  <q-input
                    maxLength="50"
                    v-model="inputForm.bankDeposit"
                    placeholder="如:北京市海淀区中关村支行"
                    clearable
                    hide-underline
                    :error="$v.inputForm.bankDeposit.$error"
                    @blur="triggerTouch(bankDeposit)"
                    @input="triggerTouch(bankDeposit)"
                  ></q-input>
                </q-field>
              </q-item>
              <q-item class="account-manage__item">
                <q-field
                  label="银行卡号："
                  class="field-normal"
                  :error="$v.inputForm.bankCardNo.$error"
                  error-label="请输入正确银行卡"
                >
                  <q-input
                    maxLength="21"
                    v-model="inputForm.bankCardNo"
                    placeholder="请输入取款银行卡号"
                    clearable
                    hide-underline
                    :error="$v.inputForm.bankCardNo.$error"
                    @blur="triggerTouch(bankCardNo)"
                    @input="triggerTouch(bankCardNo)"
                  ></q-input>
                </q-field>
              </q-item>
              <q-item class="account-manage__item">
                <q-field
                  label="手机号："
                  class="field-normal"
                  :error="$v.inputForm.mobile.$error"
                  error-label="请输入正确的手机号码"
                >
                  <q-input
                    v-model="inputForm.mobile"
                    placeholder="请输入11位手机号码"
                    clearable
                    hide-underline
                    :error="$v.inputForm.mobile.$error"
                    @blur="triggerTouch(mobile)"
                    @input="triggerTouch(mobile)"
                  ></q-input>
                </q-field>
              </q-item>
              <q-item class="account-manage__item">
                <div class="col-12 row justify-center">
                  <q-btn
                    class="btn-primary btn-lg"
                    icon="icon-check"
                    @click="commitForm()"
                    label="确定"
                  />
                </div>
              </q-item>
            </div>
          </q-list>
          <q-inner-loading :visible="loadingVisible">
            <q-spinner-gears size="50px" color="primary"></q-spinner-gears>
          </q-inner-loading>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import globalMixin from 'src/globalMixin';

import memberSideBar from 'components/member/memberSideBar';
import memberTitleBar from 'components/member/memberTitleBar';
import { required, minLength, maxLength, numeric } from 'vuelidate/lib/validators';
import {
  validatePhoneNumber,
  validateRealName,
  validateBankDeposit,
} from 'src/consts/validators';

export default {
  name: 'withdrawalsBind',
  mixins: [globalMixin],
  data() {
    return {
      title: '我要提款',
      bankCode: '',
      inputForm: {
        realName: '',
        bankCardNo: '',
        bankName: '',
        bankDeposit: '',
        mobile: '',
        bankCode: '',
      },
      bankList: [],
      originBankList: [],
      loadingVisible: true,
      audit: {
        auditStatus: 1,
        auditDeduction: 0,
        differenceAmount: 0,
      },
    };
  },
  components: {
    memberSideBar,
    memberTitleBar,
  },
  validations: {
    inputForm: {
      realName: {
        required,
        validateRealName,
      },
      bankName: {
        required,
      },
      bankDeposit: {
        required,
        validateBankDeposit,
      },
      bankCardNo: {
        required,
        numeric,
        minLength: minLength(16),
      },
      mobile: {
        required,
        numeric,
        minLength: minLength(11),
        maxLength: maxLength(11),
        validatePhoneNumber,
      },
    },
    validationGroup: [
      'inputForm.realName',
      'inputForm.bankName',
      'inputForm.bankDeposit',
      'inputForm.bankCardNo',
      'inputForm.mobile',
    ],
  },
  created() {
    this.init();
    // 更新余额
    this.getMemberBalance();
  },
  methods: {
    // 触发输入匡验证
    triggerTouch(key) {
      if (this.isIE) return;
      this.$v.inputForm[key].$touch();
    },
    async init() {
      this.$store.dispatch('setPageHeaderTitle', this.title);
      if (this.isLoggedIn) {
        const res = await this.withdrawalBankInfo();
        this.inputForm = res;
        if (!res || res.bindType === null) {
          this.openDialog({
            content: '获取提款必要资讯错误, 即将导回首页...',
            type: 'negative',
            dialogAutoClose: true,
            dialogType: 'negative',
          });
          setTimeout(() => {
            this.$router.push('/');
          }, 1000);
          return;
        }
        if (res.bindType === 2) {
          this.$router.replace(this.getRoutePath('withdrawals'));
          return;
        }
        this.getBankList().then((res2) => {
          this.originBankList = res2.result.list;
          res2.result.list.forEach((item) => {
            this.bankList.push({
              label: item.bankName,
              value: item.bankName,
            });
          });
        });
        setTimeout(() => {
          this.loadingVisible = false;
        }, 0);
      } else {
        this.$router.push('/');
      }
    },
    commitForm() {
      this.$v.validationGroup.$touch();
      if (!this.$v.validationGroup.$error) {
        const { bankCode } = this.originBankList.find(i => i.bankName === this.inputForm.bankName);
        this.inputForm.bankCode = bankCode;
        this.withDrawalsBindCommit(this.inputForm).then((res) => {
          if (res.apistatus === 1) {
            this.openDialog({
              content: '绑定成功',
              type: 'positive',
              dialogAutoClose: true,
              dialogType: 'check',
            });
            setTimeout(() => {
              this.$router.replace(this.getRoutePath('withdrawals'));
            }, 1000);
          } else {
            this.openDialog({
              content: res.errorMsg ? res.errorMsg : res.errorMsgEn,
              type: 'negative',
              dialogAutoClose: true,
              dialogType: 'negative',
            });
          }
        }).catch((err) => {
          this.openDialog({
            content: err.data.errorMsg ? err.data.errorMsg : err.data.errorMsgEn,
            type: 'negative',
            dialogAutoClose: true,
            dialogType: 'negative',
          });
        });
      }
    },
  },
};
</script>

<style>
</style>
