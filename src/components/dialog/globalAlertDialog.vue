<template>
  <q-modal class="modal modal--free"
    v-model="isShow">
    <div class="modal__header">
      <div class="modal__header-title">{{ title }}</div>
      <q-btn
        class="modal__close"
        icon="icon-tool icon-close"
        @click="$store.commit('closeDialog')"
      />
    </div>
    <div class="modal__body">
      <!-- 標準提示彈窗內容區塊-->
      <div>
        <q-icon
        v-if="dialogType && defaultGlobal.includes(styleName)"
        class="dialogIcon"
        :name="iconIs(dialogType)" />
        <div v-if="caption">{{ caption }}</div>
        <div v-if="content">{{ checkContent(content) }}</div>
        <div v-if="htmlContent" v-html="htmlContent"></div>
      </div>

      <div v-if="dialogType === 'confirmBetDialog'">
        <div v-for="(data, i) in confirmBetData.list" :key="i">
          【{{data.title}}】
          @{{data.payoff}}
          X {{data.value}}
        </div>
        【總計】總注數：{{confirmBetData.totalBet}}
        總金額: {{confirmBetData.totalAmount}}
      </div>
      <!-- 客製化提示彈窗內容區塊, 以component方式引入 ?? -->
      <div>

      </div>
    </div>
    <div class="modal__footer">
      <q-btn
        v-if="isRegHint"
        class="btn-primary btn-md"
        @click="cancel()">取消</q-btn>
      <q-btn v-if="!defaultGlobal.includes(styleName)"
        class="btn-primary"
        :class="isRegHint?'btn-md':'btn-lg'"
        @click="closeDialog()">{{ isRegHint ? '确定' : '关闭'}}</q-btn>
    </div>
  </q-modal>
</template>

<script>
import { mapState } from 'vuex';
import { isFunction } from 'lodash';
import { globalMixin } from 'src/globalMixin';

export default {
  name: 'globalAlertDialog',
  mixins: [globalMixin],
  data() {
    return {
      opened: false,
    };
  },
  computed: {
    // 依據功能再延展
    ...mapState({
      title: 'dialogTitle',
      // 主要提示內容字串
      content: 'dialogContent',
      // 副标
      caption: 'dialogCaption',
      // 主要提示內容，html形式
      htmlContent: 'dialogHtmlContent',
      dialogCloseCallback: 'dialogCloseCallback',
      dialogAutoClose: 'dialogAutoClose',
      dialogAutoClosePeriod: 'dialogAutoClosePeriod',
      dialogType: 'dialogType',
      // 作為Icon呈現的判斷
      // 'negative' = 驚訝號
      // 'check' = 勾勾
      // '' = 空字串不顯示Icon
      confirmBetData: 'confirmBetData',
    }),
    isShow: {
      get() {
        return this.$store.state.dialogShow;
      },
      set() {
        this.closeDialog();
      },
    },
    isRegHint() {
      return this.content === '游客不能访问该功能，是否注册会员？';
    },
  },
  methods: {
    cancel() {
      this.$store.commit('closeDialog');
    },
    closeDialog() {
      this.$store.commit('closeDialog');
      if (this.dialogCloseCallback && isFunction(this.dialogCloseCallback)) {
        this.dialogCloseCallback();
      }
    },
    iconIs(dialogType) {
      let icon = '';
      if (dialogType === 'check') {
        icon = 'icon-tool icon-confirm';
      } else if (dialogType === 'negative') {
        icon = 'icon-tool icon-error';
      }
      return icon;
    },
    checkContent(msg) {
      const reg = /(^([^\u4e00-\u9fa5]+)$)|(error)|(null)|(?=.*(status){1})(?=.*(500){1})/i;
      if (reg.test(msg)) return '服务器目前忙碌中，请稍后重试';
      return msg;
    },
  },
};
</script>
