<template>
  <q-page class="crowdfunding-myinfo layout-full">
    <CrowdFundingHeader
      @openPopupListModal="openPopupListModal"
      @openGameDescriptionModal="openGameDescriptionModal"/>
    <!-- content -->

    <div class="crowdfunding-filter">
      <q-btn class="btn-secondary btn-sm"
      :class="{active:selectedID===1}"  @click="changeID(1)">我的参与</q-btn>
      <q-btn class="btn-secondary btn-sm"
      :class="{active:selectedID===2}"  @click="changeID(2)">我的发起</q-btn>
    </div>

    <!--清單-->
    <div><!--这是壳，里面是list-->
      <table class="table-normal">
        <CrowdFundingMyList
          :selectedID = selectedID
          :list="myList"
          @showSelect="openSelect"
        />
      </table>
      <!-- pagination -->
      <pagination
        :paginationConfig="paginationConfig"
        @requestData="page"></pagination>
    </div>
    <!-- 眾籌詳情彈跳視窗 -->
    <CrowdFundingDetail
      v-if="detailModalShow"
      :modalShow="detailModalShow"
      :data="myList[selectShow]"
      :selectedID = selectedID
      modalTitle="众筹详情"
      @closeModal="closeDetailModal"/>
    <!-- 眾籌彩彩種彈跳視窗 -->
    <CrowdFundingPopupList
      v-if="popupListModalShow"
      :modalShow="popupListModalShow"
      modalTitle="发起众筹"
      @closeModal="closePopupListModal"/>
    <!-- 眾筹玩法说明弹跳视窗 -->
    <CrowdFundingGameDescription
      v-if="gameDescriptionModalShow"
      :modalShow="gameDescriptionModalShow"
      modalTitle="玩法说明"
      @closeModal="closeGameDescriptionModal"/>
  </q-page>
</template>

<script>
import { globalMixin } from 'src/globalMixin';
import { crowdFundingMixin } from 'src/crowdFundingMixin';

import CrowdFundingHeader from 'components/crowdFunding/crowdFundingHeader';
import CrowdFundingMyList from 'components/crowdFunding/crowdFundingMyList';
import CrowdFundingDetail from 'components/crowdFunding/crowdFundingDetail';
import CrowdFundingPopupList from 'components/crowdFunding/crowdFundingPopupList';
import CrowdFundingGameDescription from 'components/crowdFunding/crowdFundingGameDescription';
import pagination from 'components/pagination';

export default {
  // name: 'PageName',
  components: {
    CrowdFundingHeader,
    CrowdFundingMyList,
    CrowdFundingDetail,
    CrowdFundingPopupList,
    CrowdFundingGameDescription,
    pagination,
  },
  mixins: [globalMixin, crowdFundingMixin],
  data() {
    return {
      selectedID: 1,
      myList: [],
      // 共用分页元件参数
      paginationConfig: {
        totalNumber: 0,
        count: 20,
        page: 1,
      },
      requestKey: '',
      // 弹窗
      detailModalShow: false,
      popupListModalShow: false,
      gameDescriptionModalShow: false,
      selectShow: '',
    };
  },
  created() {
  },
  watch: {
    selectedID() {
      this.resetLoad();
    },
  },
  mounted() {
    this.resetLoad();
  },
  methods: {
    async resetLoad() {
      let res;
      if (this.selectedID === 1) {
      // 取得我的參與列表
        res = await this.getCrowdFundingMyParticipate({
          index: this.paginationConfig.page,
          rows: this.paginationConfig.count,
          requestKey: this.requestKey,
        });
      } else {
        res = await this.getCrowdFundingMystart({
          index: this.paginationConfig.page,
          rows: this.paginationConfig.count,
          requestKey: this.requestKey,
        });
      }
      this.myList = res.userCrowdFundings;
      // this.paginationConfig.count = res.rows;
      this.paginationConfig.totalNumber = res.total;
      this.paginationConfig.page = res.index;
    },
    changeID(i) {
      this.selectedID = i;
      this.paginationConfig.page = 1;
    },
    // 共用分页切换
    page(value) {
      window.scrollTo(0, 0);
      this.paginationConfig.page = value.page;
      this.resetLoad();
    },

    openSelect(val) {
      this.selectShow = val;
      this.openDetailModal();
    },
    openDetailModal() {
      this.detailModalShow = true;
    },
    openPopupListModal() {
      this.popupListModalShow = true;
    },
    openGameDescriptionModal() {
      this.gameDescriptionModalShow = true;
    },
    closeDetailModal() {
      this.detailModalShow = false;
    },
    closePopupListModal() {
      this.popupListModalShow = false;
    },
    closeGameDescriptionModal() {
      this.gameDescriptionModalShow = false;
    },
  },
};
</script>

<style>
</style>
