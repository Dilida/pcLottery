<template>
  <div>
    <div
      @click="openHelpDialog"
      class="appeal">
      <div class="appeal__title">平台问题申诉</div>
      <div class="appeal__content">无法出款/网络不顺等</div>
    </div>
    <q-modal class="modal modal--sm"
      v-model="isShow">
      <div class="modal__header">
        <div class="modal__header-title">平台申诉通道</div>
        <q-btn
          class="modal__close"
          icon="icon-tool icon-close"
          @click="closeDialog"
        />
      </div>
      <div class="modal__body">
        <div class="help-dialog-text">
          遇该站点 无法出款、账变金额错误、游戏开启慢、黑屏、异常缓慢等情况，可通过以下方式联系技术平台客服。
        </div>
      </div>
      <div class="modal__footer modal__footer--appeal row">
        <!-- <div class="col-6">
          <q-icon name="icon-appeal icon-appeal-qq"></q-icon>
          <div class="appeal-item-name">QQ: 61693588</div>
          <q-btn
            class="btn-primary btn-lg"
          ><a href="tencent://message/?uin=61693588&Site=&menu=yes"
          >联系QQ客服</a></q-btn>
        </div> 20180828说不要Dilida-->
        <div class="col-12">
          <q-icon name="icon-appeal icon-appeal-mail"></q-icon>
          <div class="appeal-item-name">邮箱: jidu61606@gmail.com</div>
          <q-btn
            @click="copyMail('jidu61606@gmail.com')"
            class="btn-primary btn-lg"
          >复制邮箱地址</q-btn>
        </div>
      </div>
    </q-modal>
  </div>
</template>

<script>

export default {
  data() {
    return {
      dialogShow: false,
    };
  },
  computed: {
    isShow: {
      get() {
        return this.dialogShow;
      },
      set() {
        this.closeDialog();
      },
    },
  },
  methods: {
    openHelpDialog() {
      this.dialogShow = true;
    },
    closeDialog() {
      this.dialogShow = false;
    },
    copyMail(text) {
      if (!text) {
        return;
      }
      this.$copyText(text).then(() => {
        this.$store.commit('openDialog', {
          content: '复制成功！',
          dialogAutoClose: true,
          dialogType: 'check',
        });
      }, () => {
        this.$store.commit('openDialog', {
          content: '浏览器不支持自动复制，请手动复制！',
          dialogAutoClose: true,
          dialogType: 'negative',
        });
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
</style>
