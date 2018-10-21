<template>
  <q-modal
    class="modal modal--md"
    v-model="showing">
    <div class="modal__header">
      <div class="modal__header-title">
        {{ modalTitle }}
      </div>
      <q-btn
        class="modal__close"
        icon="icon-tool icon-close"
        @click="closeModal()"/>
    </div>
    <div class="modal__body">
      <div class="crowdfunding-popup-list">
        <!-- <div class="crowdfunding-popup-list__title">选择彩种</div> Double: 设计稿没有标题-->
        <div class="row crowdfunding-popup-list__list">
          <div class="col-3 crowdfunding-popup-list__item"
            v-for="(lottery,index) in data"
            :key="`cr-${index}`">
            <router-link class="to_lottery" :to="lottery.url">
              <div class="crowdfunding-popup-list__icon">
                <img :src="lottery.lotteryImgUrl">
                <div>{{lottery.name}}</div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="modal__footer">
      <q-btn
        class="btn-primary btn-lg"
        @click="closeModal()">关闭</q-btn>
    </div> Double: 设计稿没有关闭按钮-->
  </q-modal>
</template>

<script>
import { crowdFundingMixin } from 'src/crowdFundingMixin.js';

export default {
  props: ['modalShow', 'modalTitle'],
  mixins: [crowdFundingMixin],
  data() {
    return {
      showing: this.modalShow,
      data: this.$q.sessionStorage.get.item('crowdFundingLottery'),
    };
  },
  watch: {
    showing(val) {
      this.$emit('closeModal', val);
    },
  },
  created() {
    // console.log(`${this.modalTitle} modalCreated`);
  },
  destroyed() {
    // console.log(`${this.modalTitle} modalDestroyed`);
  },
  methods: {
    closeModal() {
      this.showing = false;
    },
  },
};
</script>

<style>
</style>
