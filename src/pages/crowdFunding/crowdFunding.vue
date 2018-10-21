<template>
  <q-page class="crowdfunding layout-full">

    <CrowdFundingHeader
      @openPopupListModal="openPopupListModal"
      @openGameDescriptionModal="openGameDescriptionModal"/>
    <!-- content -->
    <div class="crowdfunding-filter"> <!-- 筛选列-->
      <!-- 要改成 q-select -->
      <!-- <span class="select q-mr-sm">
        <select v-model="crowdFundingFilterID">
          <option value="999">全部</option>
          <option v-for="(item,index) in selectOptions"
          :key="index" v-bind:value="item.id">{{item.name}}</option>
        </select>
      </span> -->
      <q-select
        hide-underline
        :options="selectOptionsForQ"
        v-model="crowdFundingFilterID">
      </q-select>
      <q-btn
        v-for="(item, index) in filterLists"
        :key="index"
        :class="['btn-secondary btn-sm',activeList[index]]"
        @click.native="getCrowdFundingList(index + 1)"
      >{{item.title}}
        <div class="crowdfunding-filter__icon" v-if="item.order">
          <i :class="['fas fa-sort-down',orderByActiveAsc]"></i>
          <i :class="['fas fa-sort-up',orderByActiveDesc]"></i>
        </div>
      </q-btn>
    </div>
    <div><!--这是壳，里面是list-->
    <table class="table-normal">
      <thead>
        <tr>
            <th>彩种名称</th>
            <th>期号</th>
            <th>剩余份数</th>
            <th>发起时间</th>
            <th>截止时间</th>
            <th>众筹盈利统计</th>
            <th>累计众筹奖金</th>
            <th>发起人</th>
        </tr>
      </thead>
      <tbody>
        <CrowdFundingMainList
          v-for="(item, index) in myList"
          :key="index"
          :list="item"
          @showSelect="openSelect"
        />
      </tbody>
    </table>
    <!-- pagination -->
    <pagination
      :paginationConfig="paginationConfig"
      @requestData="page"></pagination>
    </div>
    <!-- 眾籌詳情彈跳視窗 -->
    <CrowdFundingPopupParticipate
      v-if="detailModalShow"
      :modalShow="detailModalShow"
      :selectShow="selectShow"
      modalTitle="众筹详情"
      @submitModal="openConfirmDialog"
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
      modalTitle="众筹彩规则说明"
      @closeModal="closeGameDescriptionModal"/>
    <!-- 眾筹参与确认弹跳视窗 -->
    <CrowdFundingPopupParticipateConfirm
      v-show="popupConfirmShow"
      modalTitle="确认"
      :data="participateData"
      @closeModal="closeParticipateConfirmDialog"/>
  </q-page>
</template>

<script>
import { globalMixin } from 'src/globalMixin';
import { crowdFundingMixin } from 'src/crowdFundingMixin';

import CrowdFundingHeader from 'components/crowdFunding/crowdFundingHeader';
import CrowdFundingMainList from 'components/crowdFunding/crowdFundingMainList';
import CrowdFundingPopupParticipate from 'components/crowdFunding/crowdFundingPopupParticipate';
import CrowdFundingPopupParticipateConfirm from 'components/crowdFunding/crowdFundingPopupParticipateConfirm';
import CrowdFundingPopupList from 'components/crowdFunding/crowdFundingPopupList';
import CrowdFundingGameDescription from 'components/crowdFunding/crowdFundingGameDescription';
import pagination from 'components/pagination';

export default {
  // name: 'PageName',
  mixins: [globalMixin, crowdFundingMixin],
  components: {
    CrowdFundingHeader,
    CrowdFundingMainList,
    CrowdFundingPopupParticipate,
    CrowdFundingPopupList,
    CrowdFundingGameDescription,
    CrowdFundingPopupParticipateConfirm,
    pagination,
  },
  data() {
    return {
      myList: [],
      rows: 20,
      sortTopic: 1,
      activeList: ['active', '', '', '', ''],
      filterLists: [
        { title: '中奖率', order: false },
        { title: '剩余份数', order: true },
        { title: '奖金', order: false },
        { title: '发起时间', order: false },
        { title: '截止时间', order: false },
      ],
      remainOrderBy: 'null',
      isResponseData: false,
      isFilterDataEmpty: false,
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
      popupConfirmShow: false,
      selectShow: '',
      participateData: [],
      // selectOptions: [],
      crowdFundingFilterID: '999',
      selectOptionsForQ: [],
    };
  },
  computed: {
    // 剩余份数 遞增顯示
    orderByActiveAsc() {
      if (this.remainOrderBy === false) {
        return 'active';
      }
      return '';
    },
    // 剩余份数 遞減顯示
    orderByActiveDesc() {
      if (this.remainOrderBy === true) {
        return 'active';
      }
      return '';
    },
    // 決定 剩余份数 要遞增或遞減
    orderBy() {
      if (this.remainOrderBy === false) {
        return 'desc';
      } else if (this.remainOrderBy === true || this.sortTopic === 5) {
        return 'asc';
      }
      return 'desc';
    },
  },
  mounted() {
    this.getSelectOptions();
  },
  created() {
    this.init({
      filter: true,
    });
  },
  watch: {
    crowdFundingFilterID(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.crowdFundingFilterID = newValue;
        this.init({
          filter: true,
          selectedID: (newValue === '999') ? '' : this.crowdFundingFilterID,
        });
      }
    },
  },
  methods: {
    getSelectOptions() {
      const selectOptions = this.$q.sessionStorage.get.item('crowdFundingLottery');
      const optionAll = [{
        value: '999',
        label: '全部',
        imgUrl: '',
      }];
      const optionElse = selectOptions.map(({ name, id, lotteryImgUrl }) => ({
        value: id,
        label: name,
        imgUrl: lotteryImgUrl,
      }));
      this.selectOptionsForQ = optionAll.concat(optionElse);
    },
    /**
     * 取得新的眾籌彩種id後，重新傳送lotteryID
     */
    init({ filter, selectedID }) {
      this.getCrowdFundingProcessing({
        index: this.$_lodash.isBoolean(filter) ? this.paginationConfig.page : filter,
        rows: this.rows,
        sortTopic: this.sortTopic,
        orderBy: this.orderBy,
        lotteryId: selectedID === '999' ? '' : selectedID,
      }).then((res) => {
        if (!res || this.$_lodash.isEmpty(res.crowdFundings)) {
          this.isResponseData = true;
          this.isFilterDataEmpty = true;
          this.myList = [];
          return;
        }
        this.isFilterDataEmpty = false;
        this.isResponseData = false;
        this.myList = res.crowdFundings;
        this.paginationConfig.count = this.rows;
        this.paginationConfig.totalNumber = res.total;
        this.paginationConfig.page = res.index;
        this.requestKey = res.requestKey;
      });
    },
    /**
     * @name 取得正在進行的眾籌清單
     */
    getCrowdFundingList(sortTopic) {
      // 如果已經是自己了，就不執行任何事
      if (sortTopic !== 2 && sortTopic === this.sortTopic) {
        return;
      }
      this.myList = [];

      if (sortTopic) {
        this.sortTopic = sortTopic;
      }

      // 更改filter list 的active
      for (let i = 0; i <= this.activeList.length - 1; i += 1) {
        this.activeList[i] = '';
      }
      this.activeList[this.sortTopic - 1] = 'active';

      // 如果是 剩余份数 的話，會有orderBy的需求
      if (this.sortTopic === 2) {
        if (this.remainOrderBy === 'null') {
          this.remainOrderBy = true;
        } else {
          this.remainOrderBy = !this.remainOrderBy;
        }
      } else {
        this.remainOrderBy = 'null';
      }
      this.paginationConfig.page = 1;
      this.init({
        filter: true,
      });
    },
    // 共用分页切换
    page(value) {
      window.scrollTo(0, 0);
      this.paginationConfig.page = value.page;
      this.init({
        filter: true,
        selectedID: this.crowdFundingFilterID,
      });
    },

    openConfirmDialog(value) {
      this.participateData = value;
      this.closeDetailModal();
      this.openParticipateConfirmDialog();
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
    openParticipateConfirmDialog() {
      this.popupConfirmShow = true;
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
    closeParticipateConfirmDialog() {
      this.popupConfirmShow = false;
      this.init({
        filter: true,
      });
    },
  },
};
</script>

<style>
</style>
