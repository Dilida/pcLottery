<template>
  <q-page class="deposit">
    <div class="col-12 row layout-page">
      <!-- side menu -->
      <div class="layout-page-side">
        <memberSideBar></memberSideBar>
      </div>

      <!-- Title bar -->
      <div class="layout-page-main relative-position">
        <memberTitleBar :title="title"></memberTitleBar>
        <!-- content list -->
        <div class="layout-page-content">
          <q-tabs
            inverted
            no-pane-border
            v-model="qTabsNumber"
            class="tabs" >
            <q-tab
              v-for="(item, index) in tabTitle"
              :key="index"
              class="tabs__tab"
              :default="item.default"
              :name="String(item.id)"
              slot="title"
              @select="methodsChangeTabs(item.id,item.url)" >
              {{item.rsName}}
            </q-tab>

            <!-- 扫码支付 -->
            <q-tab-pane name="15" class="tabs__content">
              <div class="deposit-wrap" v-if="!chooseQRcode">
              <!-- 选择QRcode -->
                <div class="row">
                  <div class="col-3 deposit-pay-item"
                    v-for="(payMode,index) in QRcodeList"
                    :key="index">
                    <q-btn
                      class="btn-pay"
                      :class="QRcodeId === payMode.id ? 'active' : ''"
                      :icon="'icon-pay icon-pay-'+payMode.id"
                      @click="QRcodeId = payMode.id" >
                      <!-- <q-icon :name="`icon-pay icon-pay-wechat`"></q-icon> -->
                      <div>{{payMode.name}}</div>
                    </q-btn>
                  </div>
                </div>
              <!-- 输入金额 -->
                <div v-if="defaultIndex.includes(styleName)"
                  class="deposit-full-input inputAndButton">
                  <div class="col-12 row deposit-list__block">
                    <q-item class="col-6 deposit-list__item">
                      <q-field
                        class="field-normal"
                        label="充值金额："
                        :error="$v.paymount.$error"
                        error-label="请输入正确的存款金额" >
                        <q-input
                          type='text'
                          clearable
                          hide-underline
                          placeholder="请输入充值金额"
                          :error="$v.paymount.$error"
                          @blur="$v.paymount.$touch"
                          @input="$v.paymount.$touch"
                          @keyup="methodsClearFrontZero()"
                          v-model.trim="paymount" />
                      </q-field>
                    </q-item>
                    <q-item class="col-6 deposit-list__item">
                      <div class="layout-page-btn">
                        <q-btn
                            class="btn-primary btn-lg"
                            icon="icon-check"
                            :loading="subBankAtmStatus"
                            @click="methodsPostRapidPayQRcode()"
                            label="提交" />
                      </div>
                    </q-item>
                  </div>
                </div>
                <div v-else class="deposit-full-input">
                  <q-field
                    class="field-normal"
                    label="充值金额："
                    :error="$v.paymount.$error"
                    error-label="请输入正确的存款金额" >
                    <q-input
                      type='text'
                      clearable
                      hide-underline
                      placeholder="请输入充值金额"
                      :error="$v.paymount.$error"
                      @blur="$v.paymount.$touch"
                      @input="triggerTouch()"
                      @keyup="methodsClearFrontZero()"
                      v-model.trim="paymount" />
                  </q-field>
                  <div class="layout-page-btn">
                    <q-btn
                          class="btn-primary btn-lg"
                          icon="icon-check"
                          :loading="subBankAtmStatus"
                          @click="methodsPostRapidPayQRcode()"
                          label="提交" />
                  </div>
                </div>
              </div>
              <!-- 显示QRcode -->
              <div class="deposit-qrcode" v-if="chooseQRcode">
                  <div class="col-12 q-mb-sm text-strong">扫码支付</div>
                  <div class="col-12 q-mb-sm">
                    支付金额：
                    <span>{{paymount}}</span>
                  </div>
                  <div class="col-12 q-mb-sm">
                    <img v-if="QRcodeImg" :src="QRcodeImg" alt="" class="col-12">
                    <div v-if="QRcodeGenImg" class="col-12">
                      <img id="chooseQRcode" v-qrcode="QRcodeGenImg" />
                    </div>
                  </div>
              </div>
            </q-tab-pane>
            <!-- 银行转账 -->
            <q-tab-pane name="9" class="tabs__content">
              <div class="row">
                <!-- 上栏 -->
                <div class="">
                  <q-list class="row deposit-list">
                    <div class="col-12 deposit-list__title">1.请转账到以下银行卡</div>
                    <div class="col-12 row deposit-list__block">
                      <q-item class="col-6 deposit-list__item">
                        <q-item-side>银行名称：</q-item-side>
                        <q-item-main>
                          {{userInfo.bankName}}
                        </q-item-main>
                        <q-btn right
                          @click.native="copy(userInfo.bankName)"
                          class="btn-copy"
                          label="复制" />
                      </q-item>
                      <q-item class="col-6 deposit-list__item">
                        <q-item-side>收款人：</q-item-side>
                        <q-item-main>{{userInfo.cardOwnerName}}</q-item-main>
                        <q-btn right
                          label="复制"
                          class="btn-copy"
                          @click.native="copy(userInfo.cardOwnerName)" />
                      </q-item>
                      <q-item class="col-6 deposit-list__item">
                        <q-item-side>开户行：</q-item-side>
                        <q-item-main>{{userInfo.bankDeposit}}</q-item-main>
                        <q-btn right
                          @click.native="copy(userInfo.bankDeposit)"
                          class="btn-copy"
                          label="复制" />
                      </q-item>
                      <q-item class="col-6 deposit-list__item">
                        <q-item-side>银行账号：</q-item-side>
                        <q-item-main>{{userInfo.bankCardNo}}</q-item-main>
                        <q-btn right
                          @click.native="copy(userInfo.bankCardNo)"
                          class="btn-copy"
                          label="复制" />
                      </q-item>
                    </div>
                    <div class="col-12 deposit-list__title">2.请填写您的转账信息</div>
                    <div class="col-12 row deposit-list__block">
                      <q-item class="col-6 deposit-list__item">
                        <q-field
                          class="field-normal"
                          label="充值金额："
                          :error="$v.paymount.$error"
                          error-label="请输入正确的充值金额" >
                          <q-input
                            type='text'
                            clearable
                            hide-underline
                            placeholder="请输入充值金额"
                            :error="$v.paymount.$error"
                            @blur="$v.paymount.$touch"
                            @input="triggerTouch()"
                            @keyup="methodsClearFrontZero()"
                            v-model.trim="paymount" />
                        </q-field>
                      </q-item>
                      <q-item class="col-6 deposit-list__item">
                        <q-field
                          class="field-normal"
                          label="存款时间：">
                          <q-datetime
                            type="datetime"
                            format="YYYY/MM/DD HH:mm"
                            format-model="number"
                            format24h
                            v-model="payDate"
                            hide-underline />
                        </q-field>
                      </q-item>
                      <q-item class="col-6 deposit-list__item">
                        <q-field
                          class="field-normal"
                          label="存款人："
                          :error="$v.bankSave.name.$error"
                          :error-label="bankSaveNameErrMsg">
                          <q-input type='text'
                            clearable
                            hide-underline
                            placeholder="请输入存款人姓名"
                            v-model.trim="bankSave.name" />
                        </q-field>
                      </q-item>
                      <q-item class="col-6 deposit-list__item">
                        <q-field label="存款方式："
                          class="field-normal"
                          :error="$v.bankSave.payType.$error"
                          :error-label="payTypeErrMsg">
                          <q-select v-model="bankSave.payType"
                            hide-underline
                            :options="payTypeOptions" />
                        </q-field>
                      </q-item>
                    </div>
                    <div class="layout-page-btn">
                      <q-btn
                        class="btn-primary btn-lg"
                        icon="icon-check"
                        :loading="subBankAtmStatus"
                        @click="methodsPostTransferPay()"
                        label="提交" />
                    </div>
                  </q-list>
                </div>
                <!-- 下栏 -->
                <div class="deposit-wrap-bg">
                  <div class="row">
                    <div class="col-12 text-strong">
                      {{bankTransferDescription.title}}
                    </div>
                    <div class="col-12" v-html="bankTransferDescription.content"></div>
                  </div>
                </div>
              </div>
            </q-tab-pane>
            <!-- 钱包支付 -->
            <q-tab-pane name="11" class="tabs__content">
              <div class="row">
                <q-tabs
                  inverted
                  no-pane-border
                  class="tabs-sub" >
                  <q-tab
                    v-for="(walletMode, index) in bankWallet"
                    :key="index"
                    class="tabs-sub__tab"
                    :default="index === 0"
                    :name="String(walletMode.type)"
                    slot="title"
                    @select="methodsChangeTabs(walletMode.id)" >
                    {{bankWalletTitle[walletMode.type - 1]}}
                  </q-tab>
                  <!-- 微信 -->
                  <q-tab-pane
                    v-for="(walletMode, index) in bankWallet"
                    :key="index"
                    :name="String(walletMode.type)"
                    class="row deposit-wrap-bg">
                    <!-- 左栏 -->
                    <div class="col-7 deposit-list">
                      <div class="deposit-list__title">
                        1.请转账到以下{{bankWalletTitle[walletMode.type - 1]}}账户，或通过扫码支付
                      </div>
                      <div class="deposit-list__black">
                        <q-item class="deposit-list__item" v-if="walletMode.name">
                          <q-item-side>账号：</q-item-side>
                          <q-item-main>
                            {{ walletMode.name }}
                          </q-item-main>
                          <q-item-side
                            right
                            @click.native="copy(walletMode.name)" >
                            <q-btn
                              class="btn-copy"
                              label="复制" />
                          </q-item-side>
                        </q-item>
                        <q-item v-if="walletMode.nickName" class="deposit-list__item">
                          <q-item-side>昵称：</q-item-side>
                          <q-item-main>
                            {{walletMode.nickName}}</q-item-main>
                        </q-item>
                        <q-item v-if="walletMode.realName" class="deposit-list__item">
                          <q-item-side>真实姓名：</q-item-side>
                          <q-item-main>{{walletMode.realName }}</q-item-main>
                        </q-item>
                      </div>
                      <div class="deposit-list__title">
                        2.请填写您的转账信息
                      </div>
                      <q-list class="deposit-list__black">
                        <q-item class="deposit-list__item">
                          <q-field
                            class="field-normal deposit-list__item"
                            label="充值金额："
                            :error="$v.paymount.$error"
                            error-label="请输入正确的存款金额" >
                            <q-input
                              type='text'
                              clearable
                              hide-underline
                              placeholder="请输入充值金额"
                              :error="$v.paymount.$error"
                              @blur="$v.paymount.$touch"
                              @input="isIE() ? '' :$v.paymount.$touch"
                              @keyup="methodsClearFrontZero()"
                              v-model.trim="paymount" />
                          </q-field>
                        </q-item>
                        <q-item class="deposit-list__item">
                          <q-field class="field-normal" label="充值日期：">
                            <q-datetime
                              type="datetime"
                              format="YYYY/MM/DD HH:mm"
                              format-model="number"
                              format24h
                              hide-underline
                              v-model="payDate"
                              :after="[{icon:'icon-tool icon-tool--calendar'}]" />
                          </q-field>
                        </q-item>
                        <q-item class="col-12">
                          <q-field
                            class="field-normal"
                            :label="walletMode.type === 2 ?
                            `真实姓名：` : `${bankWalletTitle[walletMode.type - 1]}昵称：` " >
                            <q-input
                              type="text"
                              hide-underline
                              v-model="walletPayAccountName"
                              :placeholder="walletMode.type === 2 ?
                              `请输入您使用${bankWalletTitle[walletMode.type - 1]}的真实姓名` :
                              `请输入您的${bankWalletTitle[walletMode.type - 1]}昵称`"
                              />
                          </q-field>
                        </q-item>
                        <div class="layout-page-btn">
                          <q-btn :loading="walletLoading"
                            class="btn-primary btn-lg"
                            icon="icon-check"
                            @click="methodsPostWalletPay(walletMode.type, walletMode.name)"
                            label="提交" />
                        </div>
                        <div class="deposit-msg text-strong">
                          扫码转账请一定在支付备注中填写本平台的会员账号，因未填写备注造成的任何损失与本平台无关。
                        </div>
                      </q-list>
                    </div>
                    <!-- 右栏 -->
                    <div class="col-5 deposit-msg deposit-list">
                      <q-item class="col-12">
                        <img
                          :src="walletMode.qrCode"
                          class="qr-code"
                          alt="" >
                      </q-item>
                      <div class="row">
                        <div class="text-strong col-12">
                          {{bankWalletDescription[walletMode.type - 1].title}}
                        </div>
                        <div v-html="bankWalletDescription[walletMode.type - 1].content"></div>
                      </div>
                      <!--  -->
                    </div>
                  </q-tab-pane>
                </q-tabs>
              </div>
            </q-tab-pane>
            <!-- 网银支付 -->
            <q-tab-pane name="10" class="tabs__content">
              <!-- 输入金额 -->
              <div class="deposit-wrap" v-if="!chooseBank">
                <div v-if="defaultIndex.includes(styleName)"
                  class="deposit-full-input inputAndButton">
                  <div class="col-12 row deposit-list__block">
                    <q-item class="col-6 deposit-list__item">
                      <q-field
                        class="field-normal"
                        label="充值金额："
                        :error="$v.paymount.$error"
                        error-label="请输入正确的存款金额" >
                        <q-input
                          type='text'
                          clearable
                          hide-underline
                          placeholder="请输入充值金额"
                          :error="$v.paymount.$error"
                          @blur="$v.paymount.$touch"
                          @input="triggerTouch()"
                          @keyup="methodsClearFrontZero()"
                          v-model.trim="paymount" />
                      </q-field>
                    </q-item>
                    <q-item class="col-6 deposit-list__item">
                      <div class="layout-page-btn">
                        <q-btn
                            class="btn-primary btn-lg"
                            icon="icon-check"
                            :loading="subBankAtmStatus"
                            @click="methodsGetBankList()"
                            label="提交" />
                      </div>
                    </q-item>
                  </div>
                </div>
                <div v-else
                  class="deposit-full-input">
                      <q-field
                        class="field-normal"
                        label="充值金额："
                        :error="$v.paymount.$error"
                        error-label="请输入正确的存款金额" >
                        <q-input
                          type='text'
                          clearable
                          hide-underline
                          placeholder="请输入充值金额"
                          :error="$v.paymount.$error"
                          @blur="$v.paymount.$touch"
                          @input="triggerTouch()"
                          @keyup="methodsClearFrontZero()"
                          v-model.trim="paymount" />
                      </q-field>
                  <div class="layout-page-btn">
                    <q-btn
                          class="btn-primary btn-lg"
                          icon="icon-check"
                          :loading="subBankAtmStatus"
                          @click="methodsGetBankList()"
                          label="提交" />
                    </div>
                </div>
              </div>
              <!-- 选择银行 -->
              <div class="deposit-wrap" v-if="chooseBank">
                <div class="row">
                  <div class="col-3 deposit-pay-item"
                      v-for="(bank,index) in bankList"
                      :key="index">
                    <q-btn
                      class="btn-pay"
                      @click="methodsPostRapidPay(4, bank.bankCode)" >
                      <img :src="bank.bankPic" alt="">
                      <div>{{bank.bankName}}</div>
                    </q-btn>
                  </div>
                  <div v-if="bankList.length===0">暂无数据</div>
                </div>
              </div>
            </q-tab-pane>
            <!-- 银联快捷 -->
            <q-tab-pane name="12" class="tabs__content">
              <div class="deposit-wrap">
                <div v-if="defaultIndex.includes(styleName)"
                  class="deposit-full-input inputAndButton">
                  <div class="col-12 row deposit-list__block">
                    <q-item class="col-6 deposit-list__item">
                      <q-field
                        class="field-normal"
                        label="充值金额："
                        :error="$v.paymount.$error"
                        error-label="请输入正确的存款金额" >
                        <q-input
                          type='text'
                          clearable
                          hide-underline
                          placeholder="请输入充值金额"
                          :error="$v.paymount.$error"
                          @blur="$v.paymount.$touch"
                          @input="$v.paymount.$touch"
                          @keyup="methodsClearFrontZero()"
                          v-model.trim="paymount" />
                      </q-field>
                    </q-item>
                    <q-item class="col-6 deposit-list__item">
                      <div class="layout-page-btn">
                        <q-btn
                            class="btn-primary btn-lg"
                            icon="icon-check"
                            :loading="subBankAtmStatus"
                            @click="methodsPostRapidPay(5)"
                            label="提交" />
                      </div>
                    </q-item>
                  </div>
                </div>
                <div v-else class="deposit-full-input">
                  <q-field
                    class="field-normal"
                    label="充值金额："
                    :error="$v.paymount.$error"
                    error-label="请输入正确的存款金额" >
                    <q-input
                      type='text'
                      clearable
                      hide-underline
                      placeholder="请输入充值金额"
                      :error="$v.paymount.$error"
                      @blur="$v.paymount.$touch"
                      @input="triggerTouch()"
                      @keyup="methodsClearFrontZero()"
                      v-model.trim="paymount" />
                  </q-field>
                  <div class="layout-page-btn">
                    <q-btn
                          class="btn-primary btn-lg"
                          icon="icon-check"
                          :loading="subBankAtmStatus"
                          @click="methodsPostRapidPay(5)"
                          label="提交" />
                  </div>
                </div>
              </div>
            </q-tab-pane>
            <!-- 用户自行添加的支付方式 -->
            <!-- <q-tab-pane name="16" class="tabs__content">
              <div class="deposit-wrap">
                <div class="deposit-full-input">
                  <p>頁面自行跳轉</p>
                  <div class="layout-page-btn">
                    <q-btn
                          class="btn-primary btn-lg"
                          icon="icon-bet"
                          :loading="subBankAtmStatus"
                          @click="methodsGetRapidPay()"
                          label="开启支付页面" />
                  </div>
                </div>
              </div>
            </q-tab-pane> -->
            <q-inner-loading :visible="loadingVisible">
              <q-spinner-gears size="50px" color="primary" />
            </q-inner-loading>
          </q-tabs>
        </div>
      </div>
    </div>
    <!-- 提示弹窗 -->
    <globalAlertDialog></globalAlertDialog>
  </q-page>
</template>

<script>
import { globalMixin } from 'src/globalMixin';

import globalAlertDialog from 'components/dialog/globalAlertDialog';
import memberSideBar from 'components/member/memberSideBar';
import memberTitleBar from 'components/member/memberTitleBar';

import { keys } from 'lodash';
import { required, minLength, maxLength } from 'vuelidate/lib/validators';


export default {
  mixins: [globalMixin],
  components: {
    globalAlertDialog,
    memberSideBar,
    memberTitleBar,
  },
  data() {
    return {
      title: '充值',
      loadingVisible: false,
      tabTitle: [],
      // NOTE: 错误讯息
      payFixMsg: '充值渠道暂时维护中，请选择其他方式充值',
      bankSaveNameErrMsg: '请输入正确的存款人姓名！',
      payTypeErrMsg: '请选择存款方式！',
      payOutOfRangMsg: '充值金额不在范围内',
      errorMsg: '充值失败，请联系客服',

      // loading
      subBankAtmStatus: false,
      walletLoading: false,
      // NOTE: VALUE
      bankWallet: {},
      bankWalletTitle: ['微信', '支付宝'],
      bankWalletDescription: [{ title: '', content: '' }, { title: '', content: '' }],
      // 个人资讯
      userInfo: {},
      // 充值通路
      payWayLists: [],
      // 银行列表
      bankList: [],
      // 充值金额
      paymount: null,
      // 付款类型 bankval
      payType: 0,
      payTypeOptions: [
        '请选择', '网银存款', '支付宝电子支付', '微信电子支付',
        '柜员机现金存款', '柜员机转帐', '银行柜台存款', '其他支付',
      ].map((item, i) => ({ label: item, value: (i === 0 ? '' : i) })),
      // 存款人姓名
      bankSave: {
        name: '',
        payType: '',
      },
      bankInfo: {
        code: '', // 默认工商银行
      },
      // 扫码：二维码/图片
      scanImg: '',
      scanid: '',
      scanint: '',
      // 钱包秒充
      walletApi: '',
      walletPayAccountName: '',
      walletPayOrderNumber: '',
      //
      wallePayBtn: 'weiXin',
      interval: null,
      // 页面更换禁用input框
      // isChangePage: false,
      // 选择QRcode
      chooseQRcode: false,
      // 选择银行
      chooseBank: false,
      // 扫码支付列表
      QRcodeList: [],
      // 扫码支付的id
      QRcodeId: null,
      // QRcode圖片
      QRcodeImg: null,
      // QRcode產生圖片
      QRcodeGenImg: null,
      // tabs model
      qTabsNumber: null,
      bankTransferDescription: {
        title: '',
        content: '',
      },
      payDate: Date.now(),
    };
  },
  computed: {
    payTypeLabel() {
      const { label } = this.payTypeOptions.find(i => i.value === this.bankSave.payType);
      return label;
    },
  },
  validations() {
    return {
      paymount: {
        required,
      },
      bankSave: {
        name: {
          required,
          minLength: minLength(2),
          maxLength: maxLength(13),
          realName(val) {
            return this.trueName(val);
          },
        },
        payType: {
          required,
        },
      },
    };
  },
  watch: {
    wallePayBtn(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.setWallePayType(newValue);
      }
    },
  },
  async created() {
    // 设定header title
    // this.$store.dispatch('setPageHeaderTitle', this.title);

    // 活动弹窗
    const res = await this.getCopyright(3, 'AT01');
    if (res && keys(res).length > 0) {
      this.$store.commit('openDialog', {
        title: res.clientTitle,
        caption: res.title,
        htmlContent: res.content,
        dialogAutoClose: false,
        dialogType: 'negative',
      });
    }

    // 取得银行充值可用列表
    // this.getThirdBankList().then((res) => {
    //   if (res === false) {
    //     this.bankList = [];
    //     return [];
    //   }
    //   this.bankList = res;
    //   return true;
    // });
  },
  mounted() {
    this.loadingVisible = true;
    this.methodsGetPayModeList();
    // 更新余额
    this.getMemberBalance();
  },
  methods: {
    // 触发输入匡验证
    triggerTouch() {
      if (this.isIE) return;
      this.$v.paymount.$touch();
    },
    /**
     * @name 栏位验证
     * 参考讯息
     */
    checkPaymount() {
      this.triggerTouch();
      if (!this.$v.paymount.$error) {
        return true;
      }
      this.$store.commit('openDialog', {
        content: '请输入正确的存款金额',
        dialogAutoClose: true,
        dialogType: 'negative',
      });
      return false;
    },
    checkBankSaveName() {
      this.$v.bankSave.name.$touch();
      if (this.$v.bankSave.name.$error) {
        this.openDialog({
          content: '请输入正确的存款人姓名！',
          type: 'negative',
          dialogType: 'negative',
        });
      }
    },
    checkPayType() {
      this.$v.bankSave.payType.$touch();
      if (this.$v.bankSave.payType.$error) {
        this.openDialog({
          content: '请选择存款方式！',
          type: 'negative',
          dialogType: 'negative',
        });
      }
    },
    checkGreaterThanZero(amount) {
      if (Number(amount) <= 0) {
        this.$store.commit('openDialog', {
          content: '请输入大于零的数值',
          dialogAutoClose: true,
          dialogType: 'negative',
        });
        return false;
      }
      return true;
    },
    checkQRcodeSelected() {
      if (!this.QRcodeId) {
        this.$store.commit('openDialog', {
          content: '请选择扫码支付方式',
          dialogAutoClose: true,
          dialogType: 'negative',
        });
        return false;
      }
      return true;
    },
    checkBankSave() {
      this.$v.bankSave.$touch();
      if (this.$v.bankSave.$error) {
        this.$store.commit('openDialog', {
          content: '请输入正确资料',
          dialogAutoClose: true,
          dialogType: 'negative',
        });
        return false;
      }
      return true;
    },
    checkAmountRange(amount) {
      // 检查是否在通路限制金额范围内
      if (
        amount.maxDepositAmount != null &&
        amount.minDepositAmount != null &&
        (
          this.paymount * 100 > amount.maxDepositAmount ||
          this.paymount * 100 < amount.minDepositAmount
        )
      ) {
        this.$store.commit('openDialog', {
          content: '充值金额不在范围内',
          dialogAutoClose: true,
          dialogType: 'negative',
        });
        this.loadingVisible = false;
        return false;
      }
      return true;
    },

    methodsClearFrontZero() {
      if (this.paymount === 0) {
        this.paymount = '';
        return;
      }
      let num;
      if (this.qTabsNumber === '9') {
        [num] = this.paymount.match(/^\d*(\.?\d{0,2})/g);
        this.paymount = num;
        return;
      }
      [num] = this.paymount.match(/^\d*/g);
      this.paymount = num;
    },

    /**
     * @name 支付方式列表
     */
    async methodsGetPayModeList() {
      const res = await this.getRapidPayModeList();
      const checkDuplicateId = [];
      if (res && Array.isArray(res.list)) {
        res.list.forEach((payMode, index) => {
          payMode.default = !!payMode.details;
          const result = checkDuplicateId.find(item => item === payMode.id);
          if (result === undefined) {
            checkDuplicateId.push(payMode.id);
          } else {
            payMode.id = `${payMode.id}${index}`;
          }
        });
        this.tabTitle = res.list;
        this.loadingVisible = false;
      } else {
        this.loadingVisible = true;
      }
    },
    /**
     * @name 快捷支付链接
     */
    // async methodsGetRapidPay() {
    //   const res = await this.getRapidPayUrl();
    //   if (res) {
    //     const url = /http:\/\//.test(res.url) ? res.url : `http://${res.url}`;
    //     this.methodCleadInputData();
    //     openURL(url);
    //   }
    // },
    /**
     * @name 网银支付，银联快捷
     */
    async methodsPostRapidPay(flowType, bankCode = null) {
      if (this.checkPaymount() && this.checkGreaterThanZero(this.paymount)) {
        this.newWindow = this.openGame();
        this.loadingVisible = true;
        const params = {
          bankCode,
          flowType,
          amount: this.paymount * 100,
        };
        const res = await this.postRapidPayUrl(params);
        if (res) {
          if (res.dataType === 1) {
            this.newWindow.document.write(res.html);
          } else if (res.dataType === 2) {
            this.newWindow.location.href = res.url;
          }
          this.loadingVisible = false;
        } else {
          this.newWindow.close();
          this.loadingVisible = false;
        }
      }
    },
    /**
     * @name 银行转账-收款银行信息
     */
    async methodsGetBankList() {
      if (this.checkPaymount() && this.checkGreaterThanZero(this.paymount)) {
        // TODO: this.paymount
        const res = await this.getBankListOnline();
        this.bankList = res.result.list;

        this.chooseBank = true;
      }
    },
    /**
     * @name 扫码支付列表
     */
    async methodsGetRapidPayQRcodeList() {
      const res = await this.getRapidPayQRcodeList();
      this.QRcodeList = res.list;
    },
    /**
     * @name 扫码支付
     */
    async methodsPostRapidPayQRcode() {
      if (this.checkPaymount() &&
        this.checkGreaterThanZero(this.paymount) &&
        this.checkQRcodeSelected()) {
        this.newWindow = this.openGame();
        this.loadingVisible = true;
        const params = {
          id: this.QRcodeId,
          amount: this.paymount * 100,
        };
        const res = await this.postRapidPayQRcode(params);
        if (res) {
          const dataType = Number(res.dataType);
          if (dataType === 2) {
            this.newWindow.location.href = res.qrCode;
            // this.paymount = '';
            this.loadingVisible = false;
          } else if (dataType === 3) {
            // 返回的是二维码
            this.QRcodeGenImg = res.qrCode;
            this.chooseQRcode = true;
            this.loadingVisible = false;
            this.newWindow.close();
          } else if (dataType === 5) {
            // 直接返回的是图片
            this.QRcodeImg = res.qrCode;
            this.chooseQRcode = true;
            this.loadingVisible = false;
            this.newWindow.close();
          }
        } else {
          this.loadingVisible = false;
          this.newWindow.close();
        }
      }
    },
    /**
     * @name 银行转账-收款银行信息
     */
    async methodsGetTransferPayBankInfo() {
      const res = await this.getTransferPayBankInfo();
      this.userInfo = res;
    },
    /**
     * @name 银行转账提交
     */
    async methodsPostTransferPay() {
      if (this.checkGreaterThanZero(this.paymount) &&
        this.checkPaymount() &&
        this.checkBankSave()) {
        const params = {
          bankCode: this.userInfo.bankCode,
          bankName: this.userInfo.bankName,
          bankCardNo: this.userInfo.bankCardNo,
          bankDeposit: this.userInfo.bankDeposit,
          cardOwnerName: this.userInfo.cardOwnerName,
          time: this.payDate,
          type: this.bankSave.payType,
          name: this.bankSave.name,
          amount: this.paymount * 100,
        };
        if (!params.bankCode) {
          this.$store.commit('openDialog', {
            htmlContent: '后台尚未配置银行',
            dialogAutoClose: false,
            dialogType: 'negative',
          });
        } else {
          const res = await this.postTransferPay(params);
          if (res) {
            // 更新余额
            this.getMemberBalance();
            this.$store.commit('openDialog', {
              caption: '存款申请已提交，请牢记以下信息',
              htmlContent: `<span>订单号</span><span>${res.id}</span>`,
              dialogAutoClose: false,
              dialogCloseCallback: this.methodCleadInputData,
              dialogType: 'check',
            });
          }
        }
      }
    },
    /**
     * @name 钱包支付信息接口
     */
    async methodsGetWalletPayWalletInfo() {
      const res = await this.getWalletPayWalletInfo();
      if (res && Array.isArray(res)) {
        this.bankWallet = res;
      }
    },
    /**
     * @name 银行转账提交
     */
    async methodsPostWalletPay(type, name) {
      if (this.checkGreaterThanZero(this.paymount) &&
        this.checkPaymount()) {
        this.loadingVisible = true;
        const params = {
          type,
          name,
          amount: this.paymount * 100,
          time: this.payDate,
          incomeAccount: this.walletPayAccountName,
        };
        const res = await this.postWalletPay(params);
        this.loadingVisible = false;
        if (res) {
          // 更新余额
          this.getMemberBalance();
          this.$store.commit('openDialog', {
            caption: '存款申请已提交，请牢记以下信息',
            htmlContent: `
<div class="row">
  <div class="col-4">${res.type === 1 ? '微信昵称' : '真实姓名'}</div>
  <div class="col-8">${res.incomeAccount}</div>
</div>
<div class="row">
  <div class="col-4">订单号</div>
  <div class="col-8">${res.orderId}</div>
</div>
<div class="row">
  <div class="col-4">充值时间</div>
  <div class="col-8">${this.time2Date(res.time ? res.time : 0)}</div>
</div>
<div class="row">
  <div class="col-4">存款方式</div>
  <div class="col-8">${res.type === 1 ? '微信' : '支付宝'}</div>
</div>
<div class="row">
  <div class="col-4">充值金额</div>
  <div class="col-8">${this.paymount}</div>
</div>
`,
            dialogAutoClose: false,
            dialogCloseCallback: this.methodCleadInputData,
            dialogType: 'check',
          });
        } else {
          this.loadingVisible = false;
        }
      }
    },
    /**
     * @name 重置tabs里面的资料
     */
    async methodsChangeTabs(payModeId, url = null) {
      this.paymount = '';
      this.$v.paymount.$reset();
      this.$v.bankSave.name.$reset();
      this.$v.bankSave.payType.$reset();
      this.chooseQRcode = false;
      this.chooseBank = false;
      this.QRcodeId = null;
      let res = null;
      this.payDate = Date.now();
      if (payModeId === undefined) return;
      switch (payModeId) {
        // 扫码支付
        case 15:
          this.methodsGetRapidPayQRcodeList();
          break;
        // 银行转账
        case 9:
          this.methodsGetTransferPayBankInfo();
          res = await this.getCopyright(3, 'AT04');
          this.bankTransferDescription.title = res.title;
          this.bankTransferDescription.content = res.content;
          break;
        // 钱包支付
        case 11:
          this.methodsGetWalletPayWalletInfo();
          // 微信钱包
          res = await this.getCopyright(3, 'AT03');
          this.bankWalletDescription[0].title = res.title;
          this.bankWalletDescription[0].content = res.content;
          // 支付宝钱包
          res = await this.getCopyright(3, 'AT02');
          this.bankWalletDescription[1].title = res.title;
          this.bankWalletDescription[1].content = res.content;

          break;
        case 10:
        case 12:
          break;

        // 用户自行添加的支付方式
        default:
          if (url !== null) {
            url = url.replace(/^(?!http:\/\/)/, 'http://');
          }
          // 預設跳回第一個tab
          // this.qTabsNumber = String(this.tabTitle[0].id);
          window.open(url, '_blank');
          break;
      }
    },
    methodCleadInputData() {
      this.paymount = '';
      this.$v.paymount.$reset();
      this.$v.bankSave.name.$reset();
      this.$v.bankSave.payType.$reset();
      // 扫码支付
      this.QRcodeList = [];
      this.chooseQRcode = false;
      this.QRcodeImg = null;
      this.QRcodeGenImg = null;
      // 银行转账
      this.bankSave = {
        name: '',
        payType: '',
      };
      // 钱包支付
      this.walletPayAccountName = '';
      // 网银支付
      this.chooseBank = false;
      this.bankList = [];

      this.loadingVisible = false;
    },

    // /**
    //  * @name 设定扫码支付轮询接口
    //  * @param {int} scanTime 重复轮询间隔时间(ms)
    //  */
    // setCheckScanStatus(scanTime = 2000) {
    //   this.scanint = setInterval(() => {
    //     this.getPayScanState(this.scanId).then((res) => {
    //       if (res === true) {
    //         clearInterval(this.scanint);
    //         this.openDialog({
    //           content: '支付成功！',
    //           type: 'positive',
    //         });
    //         setTimeout(() => {
    //           this.$router.go('/deposit');
    //         }, 2000);
    //       }
    //     });
    //   }, scanTime);
    // },
  },
  destroyed() {
    // clearInterval(this.scanint);
  },
};
</script>

<style lang="stylus" scoped>
img.qr-code {
  max-width: 100%;
}
</style>
