<template>
  <q-page class="account-notification">
    <div class="col-12 row layout-page">
      <div class="layout-page-side">
        <!-- side menu -->
        <memberSideBar></memberSideBar>
      </div>
      <div class="layout-page-main">
        <!-- Title bar -->
        <memberTitleBar :title="title"></memberTitleBar>
        <!-- Content -->
        <div class="layout-page-content">
          <table class="table-normal">
            <thead>
              <tr>
                <th width="60%">主题</th>
                <th>发件时间</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(n, i) in ncData.list" :key="i"
              @click="showContent(n)"
              >
                <td>{{ n.title }}</td>
                <td>{{ n.createTime }}</td>
              </tr>
            </tbody>
          </table>
          <pagination
            :paginationConfig="paginationConfig"
            @requestData="getNCresult"></pagination>
        </div>
      </div>
    </div>
    <!-- 提示彈窗 -->
    <globalAlertDialog></globalAlertDialog>
  </q-page>
</template>

<script>
import { httpMixin } from 'src/httpMixin';
import { globalMixin } from 'src/globalMixin';

import memberSideBar from 'components/member/memberSideBar';
import memberTitleBar from 'components/member/memberTitleBar';
import pagination from 'components/pagination';
import globalAlertDialog from 'components/dialog/globalAlertDialog';

export default {
  name: 'accountNotification',
  mixins: [httpMixin, globalMixin],
  data() {
    return {
      title: '个人消息',
      ncData: {},
      paginationConfig: {
        totalNumber: 0,
        count: 10,
        page: 1,
      },
    };
  },
  components: {
    memberSideBar,
    memberTitleBar,
    pagination,
    globalAlertDialog,
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.cancelUnreadMailStatus();
    });
  },
  created() {
    this.getNCresult();
  },
  methods: {
    showContent(data) {
      this.openDialog({
        title: data.title,
        caption: data.content,
        type: 'confirm',
        enter: 'close',
        dialogType: 'negative',
      });
    },
    getNCresult(data) {
      const queryData = {
        page: this.paginationConfig.page,
        count: this.paginationConfig.count,
      };
      if (data) {
        queryData.page = data.page;
        queryData.count = data.count;
      }
      this.getMemberNotifications(queryData.page, queryData.count).then((res) => {
        res.list.forEach((ele) => {
          ele.createTime = this.time2Date(ele.createTime);
        });
        this.ncData = res;
        this.paginationConfig.count = this.ncData.count;
        this.paginationConfig.totalNumber = this.ncData.total;
        this.paginationConfig.page = this.ncData.page;
      });
    },
  },
};
</script>

<style>
</style>
