<template>
  <div class="user-purse"  v-if="isLoggedIn">
    <div class="user-purse__balance">
      <q-icon name="icon-tool icon-money"/>
      <span class="user-purse__label">目前余额</span>
      <template v-if="balanceShow">
        <span class="user-purse-amt">{{roundAmt(memberBalance)}}</span>
        <q-btn class="btn-balance-show" @click="changeBalanceStatus(false)">隐藏</q-btn>
      </template>
      <template v-else>
        <span class="user-purse-amt">******</span>
        <q-btn class="btn-balance-show" @click="changeBalanceStatus(true)">显示</q-btn>
      </template>
    </div>
  </div>
</template>

<script>
import globalMixin from 'src/globalMixin';
import { mapState } from 'vuex';

export default {
  name: 'layoutBalance',
  mixins: [globalMixin],
  computed: {
    ...mapState(['memberBalance', 'balanceShow']),
  },
  created() {
    this.getMemberBalance();
  },
};
</script>

<style>
</style>
