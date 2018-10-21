<template>
  <q-page class="account-manage">
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
          <div class="row account-manage-info">
            <div class="col account-manage-info__item">
              <span class="account-manage-label">用户名：</span>
              <span>{{ memberInfo.memberInfo.name }}</span>
            </div>
            <div class="col account-manage-info__item">
              <span class="account-manage-label">账户余额：</span>
              <span>{{ memberInfo.memberInfo.balance | roundAmt}}</span>
              <q-btn
                class="btn-warning"
                @click="$router.push(getRoutePath('deposit'))" >
                <q-icon name="icon-deposit-light" class="icon-deposit-light on-left" />
                立即充值
              </q-btn>
            </div>
          </div>
          <!-- 传统版改tab方式 -->
          <template v-if="sscIndex.includes(styleName) || sscIndex.includes(styleNameNumber)">
            <q-tabs
              inverted
              no-pane-border
              class="tabs">
              <q-tab class="tabs__tab" name="accountSave" slot="title" default>账号安全</q-tab>
              <q-tab class="tabs__tab" name="accountInfo" slot="title">个人信息</q-tab>
              <q-tab-pane class="tabs__content" name="accountSave" keep-alive>
                <div class="col-12 form-content account-manage__list">
                  <q-item class="account-manage__item">
                    <span>真实姓名：</span>
                    <span>{{memberInfo.bankInfo.realName}}</span>
                  </q-item>
                  <q-item class="account-manage__item">
                    <span>银行名称：</span>
                    <span>{{memberInfo.bankInfo.bankName}}</span>
                  </q-item>
                  <q-item class="account-manage__item">
                    <span>开户行：</span>
                    <span>{{memberInfo.bankInfo.bankDeposit}}</span>
                  </q-item>
                  <q-item class="account-manage__item">
                    <span>银行卡号：</span>
                    <span>{{memberInfo.bankInfo.bankCardNo}}</span>
                  </q-item>
                  <q-item class="account-manage__item">
                    <span>手机号码：</span>
                    <span>{{memberInfo.bankInfo.mobile}}</span>
                  </q-item>
                </div>
              </q-tab-pane>
              <q-tab-pane class="tabs__content" name="accountInfo" keep-alive>
                <div class="col-12 form-content account-manage__list">
                  <q-field
                  label="微信："
                  :class="isEditMode?'editable':'disable'"
                  class="field-normal">
                    <q-input
                      v-model="memberInfo.memberInfo.wechat"
                      :disable="!isEditMode"
                      hide-underline
                      ></q-input>
                  </q-field>
                  <q-field
                  label="QQ："
                  :class="isEditMode?'editable':'disable'"
                  class="field-normal">
                    <q-input
                      v-model="memberInfo.memberInfo.qq"
                      :disable="!isEditMode"
                      hide-underline
                      ></q-input>
                  </q-field>
                  <q-field
                  label="电子邮箱："
                  :class="isEditMode?'editable':'disable'"
                  class="field-normal">
                    <q-input
                      v-model="memberInfo.memberInfo.email"
                      :disable="!isEditMode"
                      hide-underline
                      ></q-input>
                  </q-field>
                </div>
                <div class="layout-page-footer">
                  <q-btn
                    class="btn-primary btn-lg"
                    :loading="loading"
                    @click="enableUpdate()"
                  >
                    <q-icon name="icon-check" class="on-left"></q-icon>
                    {{btnLabel}}
                  </q-btn>
                </div>
              </q-tab-pane>
            </q-tabs>

          </template>
          <!-- 除了传统版 -->
          <template v-else>
            <div class="account-manage-content">
              <div class="account-manage-header">
                <q-icon name="icon-account-save"></q-icon>
                账号安全
              </div>
              <div class="col-12 form-content account-manage__list"
              :class="defaultIndex.includes(styleName) ? 'row' : ''">
                <q-item class="col-6 account-manage__item">
                  <span>真实姓名：</span>
                  <span>{{memberInfo.bankInfo.realName}}</span>
                </q-item>
                <q-item class="col-6 account-manage__item">
                  <span>银行名称：</span>
                  <span>{{memberInfo.bankInfo.bankName}}</span>
                </q-item>
                <q-item class="col-6 account-manage__item">
                  <span>开户行：</span>
                  <span>{{memberInfo.bankInfo.bankDeposit}}</span>
                </q-item>
                <q-item class="col-6 account-manage__item">
                  <span>银行卡号：</span>
                  <span>{{memberInfo.bankInfo.bankCardNo}}</span>
                </q-item>
                <q-item class="col-6 account-manage__item">
                  <span>手机号码：</span>
                  <span>{{memberInfo.bankInfo.mobile}}</span>
                </q-item>
              </div>
            </div>
            <div class="account-manage-content">
              <div class="account-manage-header">
                <q-icon name="icon-account-info"></q-icon>
                个人信息
              </div>
              <div class="col-12 form-content account-manage__list"
              :class="defaultIndex.includes(styleName) ? 'row' : ''">
                <q-item class="col-6 account-manage__item">
                  <q-field
                  label="微信："
                  :class="isEditMode?'editable':'disable'"
                  class="field-normal">
                    <q-input
                      v-model="memberInfo.memberInfo.wechat"
                      :disable="!isEditMode"
                      hide-underline
                      ></q-input>
                  </q-field>
                </q-item>
                <q-item class="col-6 account-manage__item">
                  <q-field
                  label="QQ："
                  :class="isEditMode?'editable':'disable'"
                  class="field-normal">
                    <q-input
                      v-model="memberInfo.memberInfo.qq"
                      :disable="!isEditMode"
                      hide-underline
                      ></q-input>
                  </q-field>
                </q-item>
                <q-item class="col-6 account-manage__item">
                  <q-field
                  label="电子邮箱："
                  :class="isEditMode?'editable':'disable'"
                  class="field-normal">
                    <q-input
                      v-model="memberInfo.memberInfo.email"
                      :disable="!isEditMode"
                      hide-underline
                      ></q-input>
                  </q-field>
                </q-item>
              </div>
              <div class="layout-page-footer">
                <q-btn
                  class="btn-primary btn-lg"
                  :loading="loading"
                  @click="enableUpdate()"
                >
                  <q-icon name="icon-check" class="on-left"></q-icon>
                  {{btnLabel}}
                </q-btn>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { globalMixin } from 'src/globalMixin';

import memberSideBar from 'components/member/memberSideBar';
import memberTitleBar from 'components/member/memberTitleBar';

export default {
  name: 'accountManage',
  mixins: [globalMixin],
  data() {
    return {
      title: '个人资料',
      memberInfo: {
        memberInfo: {},
        bankInfo: {},
      },
      loading: false,
      isEditMode: false,
      btnLabel: '修改',
    };
  },
  components: {
    memberSideBar,
    memberTitleBar,
  },
  created() {
    // this.memberLogin();
    this.getMemberInfo().then((res) => {
      this.memberInfo = res;
    });
  },
  methods: {
    enableUpdate() {
      if (this.isEditMode) {
        const { wechat = '', qq = '', email = '' } = this.memberInfo.memberInfo;
        const data = { wechat, qq, email };
        this.updateMemberInfo(data).then((res) => {
          if (res.apistatus === 1) {
            this.btnLabel = '修改';
            this.isEditMode = false;
          }
        });
      } else {
        this.btnLabel = '保存';
        this.isEditMode = true;
      }
    },
  },
};
</script>

<style>
</style>
