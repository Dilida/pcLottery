<template>
  <q-modal class="modal modal--lobbypop" v-model="isShow">
    <div class="modal__header">
      <div class="modal__header-title">平台公告</div>
      <q-btn
        class="modal__close"
        icon="icon-tool icon-close"
        @click="closeDialog()"
      />
    </div>
    <div class="modal__body row">
      <div class="col-3 lobby-pop__nav">
      <q-btn
        v-for="(item, index) in popContent"
        :key="index"
        class="lobby-pop__nav-item"
        :class="index === currentPopIndex ? 'active' : ''"
        @click="methodChangePopItem(index)">
        {{item.title}}
        </q-btn>
      </div>
      <QScrollArea class="col-9 lobby-pop__content">
        <div
          v-if="popContent[currentPopIndex] && popContent[currentPopIndex].popType === 2"
          v-html="currentContent">
        </div>
        <div v-if="popContent[currentPopIndex] && popContent[currentPopIndex].popType === 1">
          <img :src="getPicUrl(currentContent)" @click="clickImgUrl()">
        </div>
      </QScrollArea>
    </div>
  </q-modal>
</template>

<script>
import { isArray } from 'lodash';
import { globalMixin } from 'src/globalMixin';
import { openURL } from 'quasar';

export default {
  name: 'lobbyPop',
  mixins: [globalMixin],
  model: {
    prop: 'popIsShow',
    event: 'isShowChange',
  },
  props: ['popIsShow', 'popContent'],
  data() {
    return {
      isShow: this.popIsShow,
      currentPopIndex: 0,
    };
  },
  watch: {
    popIsShow(val) {
      if (val !== this.isShow) {
        this.isShow = this.popIsShow;
      }
    },
    isShow(val) {
      if (!val && val !== this.popIsShow) {
        this.$emit('isShowChange', val);
      }
    },
  },
  computed: {
    currentContent() {
      if (isArray(this.popContent) && this.popContent.length) {
        return this.popContent[this.currentPopIndex].content;
      }
      return '';
    },
  },
  mounted() {
  },
  methods: {
    openURL,
    closeDialog() {
      this.$emit('isShowChange', false);
    },
    methodChangePopItem(index) {
      this.currentPopIndex = index;
    },
    clickImgUrl() {
      if (!this.$_lodash.isEmpty(this.popContent[this.currentPopIndex].imgPath)) {
        this.openURL(this.popContent[this.currentPopIndex].imgPath);
      }
    },
  },
};
</script>
