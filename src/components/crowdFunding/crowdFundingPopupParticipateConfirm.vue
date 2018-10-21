<template>
  <q-modal
    class="modal modal--md"
    >
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
        请核对您的众筹信息
        <p>参与众筹份数 {{data.selectCopies}}</p>
        <p>总金额{{roundAmt(data.selectCopies * data.copyAmount)}}</p>
    </div>
    <div class="modal__footer">
      <q-btn
        class="btn-primary btn-lg"
        @click="confirmParticipate()">确认</q-btn>
      <q-btn
        class="btn-cancel btn-lg"
        @click="closeModal()">取消</q-btn>
    </div>
  </q-modal>
</template>

<script>
import { globalMixin } from 'src/globalMixin';
import { crowdFundingMixin } from 'src/crowdFundingMixin';

import { mapState } from 'vuex';

export default {
  mixins: [globalMixin, crowdFundingMixin],
  props: ['modalShow', 'modalTitle', 'data'],
  data() {
    return {
      newList: [],
      realTime: '',
      username: this.$q.cookies.get('username') ? this.$q.cookies.get('username') : null,
      acType: this.isDemoUser ? 2 : 1,
    };
  },
  computed: {
    ...mapState(['memberBalance', 'isDemoUser']),
  },
  watch: {
  },
  created() {
    // console.log(`${this.modalTitle} modalCreated`);
  },
  destroyed() {
    // console.log(`${this.modalTitle} modalDestroyed`);
  },
  methods: {
    confirmParticipate() {
      const totalFee = this.data.selectCopies * this.data.copyAmount;
      if (!this.checkMemberBalance(totalFee, this.memberBalance)) {
        this.$emit('closeModal', false);
        return;
      }
      const res = this.postCrowdFundingParticipate(
        this.acType,
        this.data.selectCopies * this.data.copyAmount,
        this.data.copyCommission,
        this.data.selectCopies,
        this.data.crowdFundingNum,
      );
      if (!res) return;
      this.openDialog({
        title: '提示',
        content: `您已经成功支付，
                  请随时关注开奖信息`,
        icon: 'check',
        dialogType: 'check',
      });
      setTimeout(() => {
        this.$emit('closeModal', false);
      }, 1500);
    },
    closeModal() {
      this.$emit('closeModal', false);
    },
  },
};
</script>

<style>
</style>
