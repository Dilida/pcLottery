<template>
  <q-page class="agent row layout-page">
    <div class="layout-page-side">
        <!-- side menu -->
        <helpCenterSideBar></helpCenterSideBar>
    </div>
    <div class="layout-page-main">
      <!-- Title bar -->
      <helpCenterTitleBar :title="title"></helpCenterTitleBar>
      <div class="layout-page-content" :class="defaultGlobal.includes(styleName) ? 'row' : ''">
        <div class="help-block form-content">
          <q-item
            v-if="item.ifView === 1"
            :key="item.item"
            class="account-manage__item"
            v-for="item in registerConfigList">
            <q-field
              :label="label[item.item] + '：'"
              class="field-normal"
              :class="{'field-code': item.item === 'code'}"
              :error="$v.inputForm[item.item].$error"
              :error-label="errorLabel[item.item]"
            >
              <q-input
                v-if="item.item !== 'bankId'"
                v-model="inputForm[item.item]"
                :type="item.type"
                :placeholder="placeHolder[item.item]"
                clearable
                hide-underline
                :error="$v.inputForm[item.item].$error"
                @blur="triggerTouch(item.item)"
                @input="triggerTouch(item.item)"
              ></q-input>
              <q-select
                v-if="item.item === 'bankId'"
                v-model="inputForm[item.item]"
                :type="item.type"
                :options="bankList"
                :placeholder="placeHolder[item.item]"
                clearable
                hide-underline
                :error="$v.inputForm[item.item].$error"
                @blur="triggerTouch(item.item)"
                @change="triggerTouch(item.item)" />
              <div class="field-code__img" v-if="item.item === 'code'">
                <img
                  :src="`data:image/png;base64,${verifyImgSrc}`"
                  class="c-input-code"
                  @click="getVerifyImgSrc">
              </div>
            </q-field>
          </q-item>
          <div class="col-12 agent-check">
            <q-checkbox
              v-model="protocolCheck"
              checked-icon="check_box"
              unchecked-icon="check_box_outline_blank"
            >
              <span>我已届满合法博彩年龄，且已阅读并同意
                <a @click.stop="openProtocolModal">《代理注册协议》</a>
              </span>
            </q-checkbox>
          </div>
          <div class="col-12 agent-btn">
            <q-btn
              :disable="!protocolCheck"
              icon="icon-check"
              class="btn-primary btn-lg"
              @click.prevent="commitForm()"
              label="立即申请"
            />
          </div>
        </div>
      </div>
    </div>
    <q-modal
      v-model="IsModalShow"
      class="modal modal--agent"
    >
        <div class="modal__header">
          <div class="modal__header-title">{{modalTitle}}</div>
          <q-btn
            v-close-overlay
            icon="icon-tool icon-close"
            class="modal__close" />
        </div>
        <div class="modal__body">
          <div class="agent-agreement">
              <h3>一. 注册规约</h3>
              <p>1. 为有效防止非诚信合作商滥用本网站所提供的代理优惠制度，
                公司审查部门将严格审核每位代理商注册时提供的个人资料
                （包括姓名，邮件及电话等）若经审核发现代理商有任何不良营利企图，
                或与其他代理商、会员进行合谋套利等不诚信行为，
                本网站将关闭该合作代理商之账户并收回该代理商的所有佣金与优惠。</p>
              <p>2. 同一IP/同一姓名/同一收款账号的会员只能是一个合作商的下线，
                合作商自已不能成为自已及其他合作商的下线会员。同一IP/同一姓名/
                同一收款账号只能申请一个合作伙伴账号。</p>
              <h3>二、权责条款</h3>
              <strong>1.合作伙伴的权利和义务</strong>
              <p>1.1. 合作伙伴需尽其责任积极销售及推广本网站以求双方利润最大化
                。合作伙伴必须在不违反法律的前提下，进行正面宣传、销售及推广本网站。
                由此产生的宣传、销售及推广时所产生的费用需由合作伙伴自行承担。</p>
              <p>1.2. 合作伙伴不得私自转载、公开、分发包括主页、域名、logo、报表
                、游戏画面、图文等在内的相关资料。另外，在推广时，
                合作伙伴要保障本网站的利益，任何有损公司声誉的行为，
                一经发现立即终止合作关系。</p>
              <strong>2.本网站对合作伙伴的权利与义务</strong>
              <p> 2.1. 本网站的客服代表将会协助合作伙伴给下线办理开户业务并观察其
                投注状况。代理商及会员皆须同意并遵守本网站的会员条例、政策及操作进程。
                伴可随时登录管理后台了解其下线会员的账户报表。</p>
              <p>2.2. 本网站保留所有对合作代理商或会员之账户加以拒绝或冻结的权利。</p>
              <p>2.3. 在某些情况下经过认真审查本网站保留单方面修改合作协议上的任何条款的权利，
                会在网站刊登修改情况告知合作伙伴。修改内容可能包括：佣金范围、付款进程、
                及其它条例。如合作伙伴对于修改表示反对，合作伙伴可终止合约。修改后合作伙伴不作任何异议，
                便视作默认接受和对新协议表示认可。</p>
          </div>
        </div>
        <div class="modal__footer">
          <q-btn
            class="btn-primary btn-lg"
            @click="modalConfirm()"
            label="确认" />
        </div>
    </q-modal>
  </q-page>
</template>

<script>
import globalMixin from 'src/globalMixin';

import helpCenterSideBar from 'components/helpCenterSideBar';
import helpCenterTitleBar from 'components/helpCenterTitleBar';

import { required, minLength, maxLength, sameAs, numeric } from 'vuelidate/lib/validators';
import {
  validatePhoneNumber,
  validateRealName,
  validateEngNumUnderline,
  checkEmail,
  checkWechat,
  checkqq,
  checkRequired,
} from 'src/consts/validators';
import { setTimeout } from 'timers';

export default {
  mixins: [globalMixin],
  data() {
    return {
      title: '代理注册',
      modalTitle: '代理注册协议',
      IsModalShow: false,
      registerConfigList: [],
      bankList: [],
      // 驗證碼
      verifyImgSrc: '',
      clientId: null,
      initReg: true,
      protocolCheck: false,
      timeOutId: null,
      inputForm: {
        name: '',
        password: '',
        confirmPassword: '',
        realName: '',
        bankCardNo: '',
        bankId: null,
        bankDeposit: '',
        mobile: '',
        qq: '',
        wechat: '',
        email: '',
        code: '',
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
        qq: '请输入QQ号',
        wechat: '请输入微信号',
        email: '请输入电子邮箱',
        code: '请输入验证码',
      },
      label: {
        name: '账号',
        password: '密码',
        confirmPassword: '确认密码',
        realName: '真实姓名',
        bankCardNo: '银行卡号',
        bankId: '选择银行',
        bankDeposit: '开户行',
        mobile: '手机号码',
        qq: 'QQ',
        wechat: '微信',
        email: '电子邮箱',
        code: '验证码',
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
        qq: '请输入正确的QQ号',
        wechat: '请输入正确的微信账号',
        email: '请输入正确的邮箱地址',
        code: '必填',
      },
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
              // 每次触发检查，清除前一次的timeout
              clearTimeout(this.timeOutId);
              return new Promise((resolve) => {
                this.timeOutId = setTimeout(() => {
                  this.checkAgentAccount(value).then((response) => {
                    if (!response) {
                      this.errorLabel.name = '代理账号重复';
                    }
                    resolve(response);
                  });
                }, 1000);
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
        code: {
          validateRequired(value) {
            return this.pageCheckRequired('code', value);
          },
        },
      },
    };
  },
  watch: {
  },
  created() {
    this.methodsGetBankList();
    this.localGetRegister();
  },
  components: {
    helpCenterSideBar,
    helpCenterTitleBar,
  },
  methods: {
    openProtocolModal() {
      this.IsModalShow = true;
    },
    modalConfirm() {
      this.protocolCheck = true;
      this.closeModal();
    },
    modalCancel() {
      this.protocolCheck = false;
      this.closeModal();
    },
    closeModal() {
      this.IsModalShow = false;
    },
    commitForm() {
      const data = {};
      let canCommit = true;
      this.registerConfigList.forEach((item) => {
        if (item.ifView === 1) {
          if (this.$_lodash.has(this.$v.inputForm[item.item], '$touch')) {
            this.triggerTouch(item.item);
            if (this.$v.inputForm[item.item].$error) {
              // 假如其中一个有错就不提交
              canCommit = false;
            }
          }
          // 密码确认不需要传
          if (item.item !== 'confirmPassword' && item.item !== 'bankId') {
            data[item.item] = this.inputForm[item.item];
          }
        }
      });
      if (canCommit) {
        // 假如后端接口要求返回bankId, bankCode和bankName也给
        if (this.$v.inputForm.bankId.$dirty) {
          const { bankCode, bankName } =
            this.bankList.find((obj => obj.value === this.inputForm.bankId));
          data.bankCode = bankCode;
          data.bankName = bankName;
        }
        this.agentCommit(data, this.clientId).then((res) => {
          if (res.apistatus === 1) {
            this.$store.commit('openDialog', {
              title: '提示',
              content: '注册成功',
              dialogCloseCallback: this.methodInitAgent(),
              dialogAutoClose: true,
              dialogType: 'check',
            });
            // 重新載入
            // setTimeout(() => {
            //   window.location.reload();
            // }, 700);
          } else {
            this.$store.commit('openDialog', {
              title: '提示',
              content: res.errorMsg,
              dialogType: 'negative',
            });
            this.getVerifyImgSrc();
          }
        });
      } else {
        this.$store.commit('openDialog', {
          title: '提示',
          content: '请依照错误提示填写',
          dialogType: 'negative',
        });
      }
    },
    // 验证输入框
    triggerTouch(key) {
      this.$v.inputForm[key].$touch();
    },
    // 确认是否输入框必填
    pageCheckRequired(key, value) {
      let test = false;
      this.registerConfigList.forEach((item) => {
        if (item.item === key && item.ifRequired === 1) {
          test = true;
        }
      });
      return checkRequired(test, value);
    },
    // 代理註冊初始化
    localGetRegister() {
      if (this.initReg) {
        Promise.all([this.getVerifyImgSrc(), this.methodGetAgentConfigList()]).then(() => {
          this.reg = true;
          this.initReg = false;
        });
      }
      // 代理註冊顯示
      this.reg = true;
    },
    // 获取代理注册渲染选项
    methodGetAgentConfigList() {
      this.getAgentConfigList().then((res) => {
        const list = res.result;
        // 验证码為必填, 所以api不会给config值, 自己加上去
        const codeObj = {
          ifDisabled: 1,
          ifRequired: 1,
          ifView: 1,
          item: 'code',
        };
        list.push(codeObj);
        // 加上label
        list.forEach((item) => {
          if (item.item === 'password' || item.item === 'confirmPassword') {
            item.type = 'password';
          } else if (item.item === 'bankId') {
            item.type = 'select';
          } else {
            item.type = 'text';
          }
        });
        this.registerConfigList = list;
      });
    },
    // 获取验证码
    getVerifyImgSrc() {
      return this.getSwitchYzmcode().then((res) => {
        if (res.result.code && res.result.clientId) {
          this.verifyImgSrc = res.result.code;
          this.clientId = res.result.clientId;
        }
      });
    },
    // 获取银行列表
    async methodsGetBankList() {
      const res = await this.getBankList();
      const resList = res.result.list;
      this.$_lodash.forEach(resList, (obj, index) => {
        const { bankName, id } = { ...obj };
        resList[index] = { ...obj, label: bankName, value: id };
      });
      this.bankList = resList;
    },
    // 初始化頁面
    methodInitAgent() {
      this.inputForm = {
        name: '',
        password: '',
        confirmPassword: '',
        realName: '',
        bankCardNo: '',
        bankId: null,
        bankDeposit: '',
        mobile: '',
        qq: '',
        wechat: '',
        email: '',
        code: '',
      };
      this.$v.inputForm.$reset();
      this.protocolCheck = false;
      this.getVerifyImgSrc();
    },
  },
};
</script>

<style lang="stylus" scoped>
</style>
