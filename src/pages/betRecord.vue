<template>
  <q-page class="bet-record">

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
          <!-- summary -->
          <div class="row account-manage-info">
            <div class="account-manage-info__item">
              <span class="">今日统计：</span>
            </div>
            <div class="col account-manage-info__item">
              <span class="account-manage-label">
                <q-icon name="icon-bet-label1"></q-icon>
                有效投注额：
              </span>
              <span>{{summaryData.sumBetAmount ? roundAmt(summaryData.sumBetAmount) : 0}}</span>
            </div>
            <div class="col account-manage-info__item">
              <span class="account-manage-label">
                <q-icon name="icon-bet-label2"></q-icon>
                中奖金额：
              </span>
              <span>{{summaryData.sumPayoff ? roundAmt(summaryData.sumPayoff) : 0}}</span>
            </div>
            <div class="col account-manage-info__item">
              <span class="account-manage-label">
                <q-icon name="icon-bet-label3"></q-icon>
                返点金额：
              </span>
              <span>{{summaryData.sumBackAmount ? roundAmt(summaryData.sumBackAmount) : 0}}</span>
            </div>
            <div class="col account-manage-info__item account-manage-info__item--strong">
              <span class="account-manage-label">盈利额：</span>
              <span>{{summaryData.profitAmount ? roundAmt(summaryData.profitAmount) : 0}}</span>
            </div>
          </div>

          <!-- query settig -->
          <div class="table-group">
            <div class="table-header">
              <span class="table-header__item">
                <span class="table-header__label">彩种：</span>
                <select v-model="queryLotteryId">
                  <option :value="0">全部</option>
                  <option v-for="(option, index) in lotteryHerf" :value="option.id" :key="index">
                    {{ option.name }}
                  </option>
                </select>
              </span>
              <span class="table-header__item">
                <span class="table-header__label">类型：</span>
                <q-btn class="btn-table-filter"
                  :class="{ 'active': queryparams.statusType === 1 }"
                  @click="changeQueryParams({statusType:1})" label="全部" />
                <q-btn class="btn-table-filter"
                  :class="{ 'active': queryparams.statusType === 2 }"
                  @click="changeQueryParams({statusType:2})" label="等待开奖" />
                <q-btn class="btn-table-filter"
                  :class="{ 'active': queryparams.statusType === 3 }"
                  @click="changeQueryParams({statusType:3})" label="已中奖" />
                <q-btn class="btn-table-filter"
                  :class="{ 'active': queryparams.statusType === 4 }"
                  @click="changeQueryParams({statusType:4})" label="未中奖" />
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
            </div>
            <!-- query result list -->
            <table class="table">
              <thead>
                <tr>
                  <th>彩种名称</th>
                  <th>期号</th>
                  <th>开奖号码</th>
                  <th>投注内容</th>
                  <th>投注金额</th>
                  <th>返点</th>
                  <th>奖金</th>
                  <th>状态</th>
                  <th>投注时间</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in tableData" :key=index>
                  <td><!-- 彩种名称 -->{{item.lotteryName ? item.lotteryName : '--'}}</td>
                  <td><!--期号 --> {{renderIssueAlias(item)}}</td>
                  <td :title="item.winNumber">
                    <!--开奖号码 --> {{item.winNumber ? methodGetByteLen(item.winNumber) : '--'}}
                  </td>
                  <td><!--投注内容 --> {{item.playName ? item.playName : '--'}}</td>
                  <td><!--投注金额 --> {{item.betAmount ? roundAmt(item.betAmount) : '--'}}</td>
                  <td><!--返点 --> {{item.backAmount ? roundAmt(item.backAmount) : '--'}}</td>
                  <td><!--奖金 --> {{item.payoff ? roundAmt(item.payoff) : '--'}}</td>
                  <!--
                    已派奖：text-positive
                    未中奖：text-tertiary
                    异常：text-negative
                  -->
                  <td :class="item.orderStatus === 31 || item.orderStatus === 1 ? 'text-tertiary' :
                              item.orderStatus === 32 ? 'text-positive' : 'text-negative'" >
                    <!--状态 -->
                    <span class="text-nowrap">
                      {{item.orderStatusName ? item.orderStatusName : '--'}}
                    </span>
                  </td>
                  <td><!--投注时间 --> {{time2Date(item.betTime ? item.betTime : '--')}}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>本页小结</td>
                  <td>{{roundAmt(calculating.betAmount)}}</td>
                  <td>{{roundAmt(calculating.backAmount)}}</td>
                  <td>{{roundAmt(calculating.payoff)}}</td>
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
  name: 'betRecord',
  mixins: [globalMixin],
  data() {
    return {
      title: '投注记录',
      queryparams: {},
      lotteryHerf: [],
      // 存放query result
      queryData: {},
      // 頁面呈現: query summary
      summaryData: {},
      // 頁面呈現: time button
      timeType: '',
      // 頁面呈現: query list
      tableData: [],
      // 頁面呈現: calculate list
      calculating: {},
      // 頁面呈現: pagination
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
  },
  created() {
    let lott = 0;
    if (this.getCookie('fromLottery')) {
      lott = this.getCookie('fromLottery');
      this.removeCookie('fromLottery');
    }
    const queryp = {
      page: 1,
      count: 10,
      lotteryId: lott,
      statusType: 1,
    };
    this.changeQueryParams(queryp);
    // 設定時間區間初始值為今日
    this.timeInterval('today');
    // console.log(this.queryparams);
    this.lotteryHerf = this.$store.state.game.lottery;
    // 更新余额
    this.getMemberBalance();
  },
  computed: {
    queryLotteryId: {
      get() { return this.queryparams.lotteryId; },
      set(l) {
        const queryp = { lotteryId: l };
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
  methods: {
    renderIssueAlias(item) {
      let issueAlias;
      if ([118, 116].includes(item.lotteryId)) {
        issueAlias = '--';
      } else {
        issueAlias = item.issueAlias ? item.issueAlias : '--';
      }
      return issueAlias;
    },
    async query() {
      // console.log(this.queryparams);
      await this.getBetList(this.queryparams).then((result) => {
        this.queryData = result;
        // this.summaryData = Object.assign({}, this.summaryData, { ...this.queryData.summary });
        this.tableData = this.queryData.list;
        this.calculate(this.tableData);
        // 更新共用分页元件参数
        this.paginationConfig.count = this.queryData.count;
        this.paginationConfig.totalNumber = this.queryData.total;
        this.paginationConfig.page = this.queryData.page;
      });
      // 取得今日数据
      await this.getTodaySummary().then((result) => {
        const res = result;
        this.summaryData = Object.assign({}, this.summaryData, { ...res });
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
    // 本页小结计算: 投注金额/返点/奖金
    calculate(list) {
      const c = {
        betAmount: 0,
        backAmount: 0,
        payoff: 0,
      };
      list.forEach((i) => {
        c.betAmount += i.betAmount;
        if (i.backAmount) {
          c.backAmount += i.backAmount;
        }
        if (i.payoff) {
          c.payoff += i.payoff;
          // console.log(i.payoff);
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
    // 限制顯示字數最多五位
    methodGetByteLen(str, len = 5) {
      let result = str;
      const strArray = str.split(',');
      if (strArray.length <= len) {
        // 如果字节的长度小于控制的长度，那么直接返回
        result = str;
      } else {
        // 开奖号码如果超过5位，只显示5位，第5位后加 "..."
        let t = '';
        for (let i = 0; i < len; i += 1) {
          if (i < len - 1) {
            t += `${strArray[i]},`;
          } else {
            t += `${strArray[i]}`;
          }
        }
        result = `${t}...`;
      }
      return result;
    },
  },
};
</script>

<style>
</style>
