<template>
  <q-page class="account-info">

    <div class="col-12 row layout-page">
      <!-- side menu -->
      <div class="layout-page-side">
        <memberSideBar></memberSideBar>
      </div>
      <!-- Title bar -->
      <div class="layout-page-main">
        <memberTitleBar :title="title"></memberTitleBar>
        <!-- content list -->
        <div class="layout-page-content">
          <!-- query settig -->
          <div class="table-group">
            <div class="table-header">
              <span class="table-header__item">
                <span class="table-header__label">类型：</span>
                <q-btn class="btn-table-filter"
                  :class="{ 'active': queryparams.searchType === 1 }"
                  @click="changeQueryParams({searchType:1})" label="全部" />
                <q-btn class="btn-table-filter"
                  :class="{ 'active': queryparams.searchType === 2 }"
                  @click="changeQueryParams({searchType:2})" label="充值" />
                <q-btn class="btn-table-filter"
                  :class="{ 'active': queryparams.searchType === 3 }"
                  @click="changeQueryParams({searchType:3})" label="提款" />
                <q-btn class="btn-table-filter"
                  :class="{ 'active': queryparams.searchType === 4 }"
                  @click="changeQueryParams({searchType:4})" label="优惠" />
              </span>
              <span class="table-header__item">
                <span class="table-header__label">时间：</span>
                <q-btn class="btn-table-filter"
                  :class="{'active': timeType === 'today'}"
                  @click="timeInterval('today')" label="今日"  />
                <q-btn class="btn-table-filter"
                  :class="{'active': timeType === 'yesterday'}"
                  @click="timeInterval('yesterday')" label="昨日" />
                <q-btn class="btn-table-filter"
                  :class="{'active': timeType === 'last3days'}"
                  @click="timeInterval('last3days')" label="近三日" />
                <q-btn class="btn-table-filter"
                  :class="{'active': timeType === 'last7days'}"
                  @click="timeInterval('last7days')" label="近七日" />
              </span>
              <span class="table-header__item">
                <span class="table-header__label">状态：</span>
                <select v-model="queryStatus">
                  <option v-for="(option, index) in statusHerf" :value="option.id" :key="index">
                    {{ option.name }}
                  </option>
                </select>
              </span>
            </div>
            <!-- query result list -->
            <table class="table">
              <thead>
                <tr>
                  <th>编号</th>
                  <th>账变方式</th>
                  <th>收入金额</th>
                  <th>支出金额</th>
                  <th>账户余额</th>
                  <th>状态</th>
                  <th>时间</th>
                  <th>备注</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in tableData" :key=index>
                  <td><!--编号-->{{item.orderNo ? item.orderNo : ''}}</td>
                  <td><!--账变方式--> {{item.tradeTypeName ? item.tradeTypeName : ''}}</td>
                  <td><!--收入金额-->
                    <span v-if="parseInt(item.operationType, 10)===1" >
                      +{{item.tradeAmount ? roundAmt(item.tradeAmount) : 0}}
                    </span>
                  </td>
                  <td><!--支出金额-->
                    <span v-if="parseInt(item.operationType, 10)===2" >
                      -{{item.tradeAmount ? roundAmt(item.tradeAmount) : 0}}
                    </span>
                  </td>
                  <td><!--账户余额--> {{item.balance ? roundAmt(item.balance) : '--'}}</td>
                  <!--
                    處理中 >>> 灰色 text-tertiary
<<<<<<< HEAD
                    成功 >>> 綠色 text-positive
=======
                    成功 >>> 藍色 text-positive
>>>>>>> testenv
                    失敗 >>> 紅色 text-negative
                  -->
                  <!--状态  0-处理中，3-失败 4-成功-->
                  <td :class="item.state === 0 ? 'text-tertiary' :
                          item.state === 4 ? 'text-positive' : 'text-negative'" >
                    {{item.statusName ? item.statusName : ''}}
                  </td>
                  <td><!--时间--> {{time2Date(item.createTime ? item.createTime : 0)}}</td>
                  <td><!--备注 --> {{item.remark ? item.remark : ''}}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td></td>
                  <td>本页小结</td>
                  <td>+{{roundAmt(calculating.plusTradeAmount)}}</td>
                  <td>-{{roundAmt(calculating.minusTradeAmount)}}</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
          <!-- pagination -->
          <pagination
            :paginationConfig="paginationConfig"
            @requestData="page"></pagination>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { globalMixin } from 'src/globalMixin';

import memberSideBar from 'components/member/memberSideBar';
import memberTitleBar from 'components/member/memberTitleBar';
import pagination from 'components/pagination';

export default {
  name: 'accountInfo',
  mixins: [globalMixin],
  components: {
    memberSideBar,
    memberTitleBar,
    pagination,
  },
  data() {
    return {
      title: '账户明细',
      queryparams: {
        searchType: 1,
        startTime: '',
        endTime: '',
        status: 1,
        page: 1,
        count: 10,
      },
      statusHerf: [
        { id: 1, name: '全部' },
        { id: 2, name: '处理中' },
        { id: 3, name: '失败' },
        { id: 4, name: '成功' },
      ],
      // 存放query result
      queryData: {},
      // 頁面呈現: time button
      timeType: 'today',
      // 頁面呈現: query list
      tableData: [],
      // 頁面呈現: calculate list
      calculating: {
      },
      // 共用分页元件参数
      paginationConfig: {
        totalNumber: 0,
        count: 10,
        page: 1,
      },
    };
  },
  computed: {
    queryStatus: {
      get() { return this.queryparams.status; },
      set(s) {
        const queryp = { status: s };
        this.changeQueryParams(queryp);
      },
    },
  },
  watch: {
    queryparams: {
      handler() {
        this.query();
      },
      deep: true,
    },
  },
  created() {
    const queryp = {
      searchType: 1,
      page: 1,
    };
    this.changeQueryParams(queryp);
    // 設定時間區間初始值為今日
    this.timeInterval('today');
    // 更新余额
    this.getMemberBalance();
  },
  methods: {
    async query() {
      // console.log(this.queryparams);
      await this.getTradeList(this.queryparams).then((result) => {
        this.queryData = result;
        this.tableData = this.queryData.list;
        this.calculate(this.tableData);
        // 更新共用分页元件参数
        this.paginationConfig.count = this.queryData.count;
        this.paginationConfig.totalNumber = this.queryData.total;
        this.paginationConfig.page = this.queryData.page;
      });
    },
    // 只在此改变Query参数
    changeQueryParams(queryp) {
      if (typeof queryp.page === 'undefined') {
        const p = { page: 1 };
        Object.assign(queryp, p);
      }
      this.queryparams = Object.assign({}, this.queryparams, { ...queryp });
    },
    // 改变时间参数
    timeInterval(type) {
      this.timeType = type;
      // 當下日期
      const date = new Date();
      const queryp = {
        endTime: date,
      };
      // 一個月中的當天(1~31)
      const dayOfMonth = date.getDate();
      // 一年中的當月(1~12)
      const MonthOfYear = date.getMonth();
      // 當年
      const year = (date.getYear() < 1900) ? (1900 + date.getYear()) : date.getYear();

      switch (type) {
        case 'today':
          queryp.startTime = new Date(year, MonthOfYear, dayOfMonth);
          break;
        case 'yesterday':
          queryp.startTime = new Date(year, MonthOfYear, dayOfMonth - 1);
          queryp.endTime = new Date(year, MonthOfYear, dayOfMonth - 1, 23, 59, 59, 999);
          break;
        case 'last3days':
          queryp.startTime = new Date(year, MonthOfYear, dayOfMonth - 2);
          break;
        case 'last7days':
          queryp.startTime = new Date(year, MonthOfYear, dayOfMonth - 6);
          break;
        default:
      }
      queryp.startTime = this.date2Time(queryp.startTime);
      queryp.endTime = this.date2Time(queryp.endTime);
      // console.log(type, queryp);
      this.changeQueryParams(queryp);
    },
    // 本页小结计算: 收入金额/支出金额
    calculate(list) {
      const c = {
        plusTradeAmount: 0,
        minusTradeAmount: 0,
      };
      list.forEach((i) => {
        if (parseInt(i.operationType, 10) === 1) {
          c.plusTradeAmount += i.tradeAmount;
        }
        if (parseInt(i.operationType, 10) === 2) {
          c.minusTradeAmount += i.tradeAmount;
        }
      });
      this.calculating = Object.assign({}, c);
    },
    // 共用分页切换
    page(p) {
      if (p) {
        const queryp = { page: p.page, count: p.count };
        this.changeQueryParams(queryp);
      }
    },
  },
};
</script>

<style>
</style>
