<template>
    <div class="crowdfunding-tabs">
      <div class="crowdfunding-tabs__group">
        <div class="crowdfunding-tabs__btn" :class="{active:selectedID===0}"
          @click="$router.push('/crowdFunding')">众筹列表</div>
        <div class="crowdfunding-tabs__btn" :class="{active:selectedID===1}"
          @click="$router.push('/crowdFundingMyInfo')">我的众筹</div>
      </div>
      <div class="crowdfunding-tabs__group">
        <q-btn class="btn-secondary btn-sm" @click="openGameDescriptionModal">
          <q-icon name="icon-info"></q-icon>
          玩法说明
        </q-btn>
        <q-btn class="btn-primary" @click="openPopupListModal">
          <q-icon name="icon-plus"></q-icon>
          发起众筹
        </q-btn>
      </div>
    </div>

</template>

<script>
import { lotteryConst } from 'src/consts/lotteryConst';
import { crowdFundingMixin } from 'src/crowdFundingMixin';

export default {
  mixins: [crowdFundingMixin],
  data() {
    return {
      selectedID: this.$route.path === '/crowdFundingMyInfo' ? 1 : 0,
    };
  },
  created() {
    this.initCrowdfundingLottery();
  },
  methods: {
    initCrowdfundingLottery() {
      this.getCrowdFundingLottery().then((response) => {
        if (response) {
          this.setCrowdfundingLottery(response);
        }
      });
    },
    openPopupListModal() {
      this.$emit('openPopupListModal');
    },
    openGameDescriptionModal() {
      this.$emit('openGameDescriptionModal');
    },
    setCrowdfundingLottery(data) {
      if (!data) {
        return;
      }
      const crowdFundingLottery = data.list.map((x) => {
        const herf = lotteryConst.lotteryHerf
          .find(item => item.cid === x.lotteryId) || { url: '/404' };
        // const crowdHref = '?crowdfunding=1';
        const link = herf.url;
        return {
          name: x.name,
          lotteryImgUrl: this.getPicUrl(x.imgLeftUrl),
          id: x.lotteryId,
          url: `/crowd/${link.replace('/lottery/', '')}`,
        };
      });
      this.$q.sessionStorage.set('crowdFundingLottery', crowdFundingLottery);
    },
  },
};
</script>

<style>
</style>
