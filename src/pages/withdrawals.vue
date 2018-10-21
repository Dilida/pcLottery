<template>
  <q-page class="withdrawals">
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
          <q-list v-show="!loadingVisible">
            <div class="form-content">
              <q-item class="">
                <q-field
                  label="真实姓名："
                  class="field-normal" >
                  <q-input
                    v-model="memberInfo.realName"
                    hide-underline
                    disable />
                </q-field>
              </q-item>
              <q-item class="">
                <q-field
                  label="银行名称："
                  class="field-normal" >
                    <q-input
                      v-model="memberInfo.bankName"
                      hide-underline
                      disable />
                </q-field>
              </q-item>
              <q-item class="">
                <q-field
                  label="银行卡号："
                  class="field-normal" >
                  <q-input
                    v-model="memberInfo.bankCardNo"
                    hide-underline
                    disable />
                </q-field>
              </q-item>
              <q-item class="">
                <q-field
                  label="余额："
                  class="field-normal" >
                  <q-input
                    v-model="balance"
                    hide-underline
                    disable />
                </q-field>
              </q-item>
              <q-item class="" v-if="deductStatus === 2">
                <q-field
                  label="提示："
                  class="field-normal">
                  <div class="withdrawals-tip">{{deductErrLabel}}</div>
                </q-field>
              </q-item>
              <q-item class="">
                <q-field
                  label="取款金额："
                  class="field-normal"
                  :error="$v.drawMoney.$error"
                  :error-label="placeholderLimit" >
                  <q-input
                    v-model="drawMoney"
                    type="number"
                    :placeholder="placeholderLimit"
                    hide-underline
                    clearable
                    :error="$v.drawMoney.$error"
                    @input="triggerTouch(drawMoney)"
                    @blur="$v.drawMoney.$touch" />
                </q-field>
              </q-item>
              <q-item class="">
                <q-field
                  label="取款密码："
                  class="field-normal"
                  :error="$v.drawPassword.$error"
                  error-label="请填写4位数字密码" >
                  <q-input
                    maxlength="4"
                    v-model="drawPassword"
                    type="password"
                    placeholder="4位数字密码"
                    hide-underline
                    clearable
                    :error="$v.drawPassword.$error"
                    @input="triggerTouch(drawPassword)"
                    @blur="$v.drawPassword.$touch" />
                </q-field>
              </q-item>
              <q-item class="col-12">
                <div class="col-12 row justify-center q-mt-md">
                  <q-btn
                    :loading="submitLoading"
                    class="btn-primary btn-lg"
                    icon="icon-bet"
                    @click="submit()"
                    label="确定" />
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
import { required, numeric, minLength, maxLength, between } from 'vuelidate/lib/validators';

export default {
  name: 'withdrawals',
  mixins: [globalMixin],
  data() {
    return {
      submitLoading: false,
      title: '我要提款',
      balance: null,
      memberInfo: {},
      // FIXME: 缺少参数已通知后端
      drawMaxMoney: '',
      drawMinMoney: '',
      drawMoney: null,
      drawPassword: '',
      placeholderLimit: '',
      deductFee: null,
      differenceAmount: null,
      deductStatus: null,
      deductErrLabel: '',
      loadingVisible: false,
    };
  },
  components: {
    memberSideBar,
    memberTitleBar,
  },
  validations() {
    return {
      drawMoney: {
        required,
        numeric,
        between: between(this.drawMinMoney, this.drawMaxMoney),
      },
      drawPassword: {
        required,
        minLength: minLength(4),
        maxLength: maxLength(4),
        numeric,
      },
      validationGroup: ['drawMoney', 'drawPassword'],
    };
  },
  created() {
    this.$store.dispatch('setPageHeaderTitle', this.title);
    if (this.isLoggedIn) {
      this.initWithdrawals();
    } else {
      this.$router.replace(this.getRoutePath('withdrawalsBind'));
    }
    // 更新余额
    this.getMemberBalance();
  },
  methods: {
    // 触发输入匡验证
    triggerTouch(key) {
      if (this.isIE) return;
      this.$v[key].$touch();
    },
    async initWithdrawals() {
      this.loadingVisible = true;
      try {
        const res = await this.withdrawalBankInfo();
        if (!res || res.bindType === null) {
          this.openDialog({
            content: '获取提款必要资讯错误',
            type: 'negative',
            dialogType: 'negative',
          });
          setTimeout(() => {
            this.$router.push('/');
          }, 1000);
          return;
        }
        if (res.bindType === 1) {
          this.$router.replace(this.getRoutePath('withdrawalsBind'));
          return;
        }
        const {
          realName,
          bankName,
          bankCardNo,
          dispMax,
          dispMin,
          audit,
          balance,
        } = { ...res };
        this.memberInfo = {
          realName,
          bankName,
          bankCardNo,
        };
        // 出款上下限
        this.drawMaxMoney = dispMax / 100;
        this.drawMinMoney = dispMin / 100;
        this.placeholderLimit = `取款范围${this.drawMinMoney}元~${this.drawMaxMoney}元`;
        // 稽核相关
        this.deductFee = this.roundAmt(audit.auditDeduction);
        this.differenceAmount = this.roundAmt(audit.differenceAmount);
        this.deductStatus = audit.auditStatus;
        this.deductErrLabel =
        `您投注未达标，本次提款将扣除费用 ￥${this.deductFee}元，若再进行有效投注 ￥${this.differenceAmount} 可免除费用`;
        // 用户余额
        this.balance = this.roundAmt(balance);
        this.loadingVisible = false;
      } catch (err) {
        this.loadingVisible = false;
        this.openDialog({
          content: '未知服务器错误',
          type: 'negative',
          dialogAutoClose: true,
          dialogType: 'negative',
        });
        this.$router.push('/');
      }
    },
    submit() {
      this.submitLoading = true;
      this.$v.$touch();
      if (!this.$v.validationGroup.$error) {
        const realDrawMoney = this.drawMoeny * 100;
        if (realDrawMoney > this.balance) {
          this.openDialog({
            content: '提款余额不足',
            type: 'negative',
            dialogAutoClose: true,
            dialogType: 'negative',
          });
          this.submitLoading = false;
          return;
        }
        if (realDrawMoney <= this.deductFee && this.deductFee > 0) {
          this.openDialog({
            content: '取款金额必须大于扣除费用',
            type: 'negative',
            dialogAutoClose: true,
            dialogType: 'negative',
          });
          this.submitLoading = false;
          return;
        }
        if (this.drawMoney > this.drawMaxMoney || this.drawMoney < this.drawMinMoney) {
          this.openDialog({
            content: '提款金额必须在范围内',
            type: 'negative',
            dialogAutoClose: true,
            dialogType: 'negative',
          });
          this.submitLoading = false;
          return;
        }
        const data = {
          amount: this.drawMoney * 100,
          payPassword: this.drawPassword,
        };
        this.withdrawalsAction(data).then((res) => {
          if (res.apistatus === 1) {
            this.openDialog({
              content: '提款成功',
              type: 'positive',
              dialogAutoClose: true,
              dialogType: 'check',
            });
            // 更新余额
            this.getMemberBalance();
            setTimeout(() => {
              this.$router.replace(this.getRoutePath('accountManage'));
            }, 700);
          } else {
            this.openDialog({
              content: res.errorMsg ? res.errorMsg : res.errorMsgEn,
              type: 'negative',
              dialogAutoClose: true,
              dialogType: 'negative',
            });
          }
          this.submitLoading = false;
        }).catch((err) => {
          this.openDialog({
            content: err.data.errorMsg ? err.data.errorMsg : err.data.errorMsgEn,
            type: 'negative',
            dialogAutoClose: true,
            dialogType: 'negative',
          });
          this.submitLoading = false;
        });
      } else {
        this.submitLoading = false;
      }
    },
  },
};
</script>

<style>
</style>
