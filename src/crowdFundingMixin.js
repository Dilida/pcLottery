import { Cookies } from 'quasar';
// import qs from 'qs';
import { httpMixin } from './httpMixin';
import { mapState, mapMutations } from 'vuex';

export const crowdFundingMixin = {
  plugin: [Cookies],
  mixins: [
    httpMixin,
  ],
  data() {
    return {
      // 玩法说明
      playingruleDialog: false,
      // 篩選
    };
  },
  computed: {
    ...mapState('crowd', [
      'hideCrowdFilter',
      'showCrowdDialog',
      'showCrowdDialogAmount',
      'closeCrowdDialog',
    ]),
    // route page name
    startCrowdFunding() {
      return this.$route.meta.startCrowdFunding || '';
    },
    showCrowdFooter() {
      return this.$route.meta.showCrowdFooter || '';
    },
    showCrowdFilter() {
      if (!this.hideCrowdFilter) return this.hideCrowdFilter;
      return this.$route.meta.showCrowdFilter || '';
    },
  },
  created() {
    // 此 JS 文件属于全局引用，禁止在此实作代码
  },
  mounted() {
    // 此 JS 文件属于全局引用，禁止在此实作代码
  },
  methods: {
    ...mapMutations(['openDialog', 'closeDialog']),
    ...mapMutations('crowd', [
      'setCrowdFundingDialog',
      'hideCrowdFilterFun',
      'setIssueAlias',
    ]),

    /**
     * http 请求
     * @param {String} url API url
     * @param {String} method POST, GET, PUT...
     * @param {Boolean} token true 自动带入 token
     * @param {Object} data 传入 POST data 或 GET params
     * @param {Object} headers 传入 Headers
     */
    httpRequestCrowdFunding(url, method, token = false, data = {}, headers = {}) {
      if (token) {
        const acToken = this.$q.cookies.get('access_pcToken');
        headers.Authorization = acToken;
        headers.UserAccount = this.$q.cookies.get('username') ? this.$q.cookies.get('username') : null;
      }
      let params;
      if (method === 'GET') {
        params = data;
      }
      return this.$http({
        method,
        url,
        headers,
        data,
        params,
      })
        .then((response) => {
          if (response.data.code === 0) {
            return response;
          } else if (response.data.code > 0) {
            this.showCrowdFundingMsg(response.data);
            return response;
          }
          this.errCatchActionCrowdFunding(response.data);
          return response;
        })
        .catch((err) => {
          this.errCatchActionCrowdFunding(err.response.data);
          throw err.response.data;
        });
    },

    showCrowdFundingMsg(res) {
      this.openDialog({
        content: res.msg,
        type: 'positive',
        dialogType: 'negative',
      });

      if (res.code === 4016 || res.code === 4015
        || res.code === 4032) { // 4016/4032眾籌時間到期 4015後端傳回的剩餘份數不足
        setTimeout(() => {
          this.closeDialog();
        }, 1000);
      }
    },

    errCatchActionCrowdFunding(err) {
      let showMsg = err.msg;
      if (err.data) {
        showMsg = err.data.msg;
      }
      this.openDialog({
        content: showMsg,
        dialogType: 'negative',
      });
    },

    /**
     * 取得 API baseURL
     */
    getCrowdApiUrl: (name, url) => {
      const apiUrl = window.location.protocol === 'https:' ?
        process.env.API_URL : process.env.API_URL_HTTP;
      return `${apiUrl[name]}${url}?source=pc`;
    },

    /**
     * @name 眾籌馀额不足
     * @param {Int} totalAmount 众筹总金额
     * @param {Int} memberBalance 帐户馀额
     */
    checkMemberBalance(totalAmount, memberBalance) {
      if (totalAmount > memberBalance) {
        this.openDialog({
          content: '余额不足',
          type: 'negative',
          dialogType: 'negative',
        });
        return false;
      }
      return true;
    },
    /** ==========================
     * crowdfunding API
     */
    /** ===============
     * @name 首頁的眾籌彩排行榜
    */
    getCrowdFundingIndexRanking() {
      const url = this.getCrowdApiUrl('goLang', 'ranking');
      return this.httpRequest(url, 'GET', false).then((response) => {
        if (response.code === 0) {
          if (response.data === null) {
            return new Error();
          }
          response.data.prizeRankingListIs = !this.$_lodash.isEmpty(response.data.prizeRankingList);
          response.data.richestRankingIs = !this.$_lodash.isEmpty(response.data.richestRanking);
          // 因為頻繁使用 lodash判斷陣列資料是否為空，所以直接存在 response.data 一併回傳
          return response.data;
        }
        return new Error();
      });
    },

    /** ===============
     * @name 首頁跑馬燈中獎通知
    */
    getCrowdFundingIndexScrolling() {
      const url = this.getCrowdApiUrl('goLang', 'scrollwin');
      return this.httpRequest(url, 'GET', false).then((response) => {
        if (response.data.code === 0) {
          return response.data.data;
        }
        return false;
      });
    },

    /** ===============
     * @name 正在進行的眾籌清單
     * @param {Int} index 頁碼
     * @param {Int} rows 筆數
     * @param {Int} crowdFundingNum 眾籌編號 取單筆資料再傳入
     * @param {Int} sortTopic 依主題 1.中獎率,
     *                              2.剩餘份數,
     *                              3.獎金,
     *                              4.發起時間,
     *                              5.截止時間
     * @param {String} orderBy asc, desc. 預設:asc
     * @param {String} lotteryId 樂透彩編號 篩選，和sortTopic其實是一樣的
    */
    getCrowdFundingProcessing({
      index,
      rows,
      crowdFundingNum = null,
      sortTopic,
      orderBy = 'asc',
      UserAccount = null,
      lotteryId,
    }) {
      const params = {
        index,
        rows,
        crowdFundingNum,
        sortTopic,
        orderBy,
        UserAccount,
        lotteryId,
      };
      const url = this.getCrowdApiUrl('goLang', 'processing');
      return this.httpRequestCrowdFunding(url, 'GET', true, params).then((response) => {
        if (response.data.code === 0) {
          return response.data.data;
        }
        return false;
      });
    },


    /** ===============
     * @name 正在進行的眾籌清單
     * @param {Int} index 頁碼
     * @param {Int} rows 筆數
     * @param {Int} crowdFundingNum 眾籌編號 取單筆資料再傳入
    */
    getCrowdFundingProcessingDetail({
      UserAccount,
      crowdfundingNum,
    }) {
      const params = {
        UserAccount,
        crowdfundingNum,
      };
      const detailUrl = `processing/${params.crowdfundingNum}`;
      const url = this.getCrowdApiUrl('goLang', detailUrl);
      return this.httpRequestCrowdFunding(url, 'GET', true, params).then((response) => {
        if (response.data.code === 0) {
          return response.data.data;
        }
        return false;
      });
    },


    /** ===============
     * @name 我發起的-我發起眾籌單詳細資料
     * @param {*} index頁碼
    */
    getCrowdFundingMystart({
      index,
      rows,
      requestKey,
    }) {
      const params = {
        index,
        rows,
        requestKey,
      };
      const url = this.getCrowdApiUrl('goLang', 'start');
      return this.httpRequestCrowdFunding(url, 'GET', true, params).then((response) => {
        if (response.data.code === 0) {
          return response.data.data;
        }
        return false;
      });
    },

    /** ===============
     * @name 我的參與-我參加的眾籌
    */
    getCrowdFundingMyParticipate({
      index,
      rows,
      requestKey,
    }) {
      const params = {
        index,
        rows,
        requestKey,
      };
      const url = this.getCrowdApiUrl('goLang', 'participate');
      return this.httpRequestCrowdFunding(url, 'GET', true, params).then((response) => {
        if (response.data.code === 0) {
          return response.data.data;
        }
        return false;
      });
    },

    /** ===============
     * @name 眾籌彩彩種列表
    */
    getCrowdFundingLottery() {
      const url = this.getCrowdApiUrl('goLang', 'lottery');
      return this.httpRequestCrowdFunding(url, 'GET', true).then((response) => {
        if (response.data.code === 0) {
          this.$q.cookies.remove('crowdFundingStartType');
          this.$q.cookies.set('crowdFundingStartType', response.data.data.startType);
          return response.data.data;
        }
        return false;
      });
    },

    /** ===============
     * @name 參與眾籌
     * @param {*} acType 账户类型
     * @param {*} callAmount資料
     * @param {*} callCommission 眾籌傭金
     * @param {*} callCopies 份數資料
     * @param {*} crowfundingNum 眾籌編號
    */
    postCrowdFundingParticipate(
      acType,
      callAmount,
      callCommission,
      callCopies,
      crowfundingNum,
      sourceName = 'PC',
      sourceType = 1,
    ) {
      const sendData = {
        acType,
        callAmount,
        callCommission,
        callCopies,
        crowfundingNum,
        sourceName,
        sourceType,
      };
      const url = this.getCrowdApiUrl('goLang', 'participate');
      return this.httpRequestCrowdFunding(url, 'POST', true, sendData).then((response) => {
        if (response.data.code === 0) {
          return response.data.data;
        }
        return false;
      });
    },

    /** ===============
     * @name 發起眾籌
     * @param {*} acType 账户类型
     * @param {Int} betAmount 彩种编号一次只能捉一种
     * @param {*} betContent 页数，从1开始
     * @param {*} betCount 每页行数
     * @param {*} lotteryId
     * @param {*} multiple 查询类型，1为投注记录查询，2为追号查询
     * @param {*} playId 彩票类型：1 官彩，2 双面彩
    */
    postCrowdFundingStart(data) {
      const url = this.getCrowdApiUrl('goLang', 'start');
      return this.httpRequestCrowdFunding(url, 'POST', true, data).then((response) => {
        if (response.data.code === 0) {
          return response.data.data;
        }
        return false;
      });
    },
    /** ===============
     * @name 取得从筹排名列表之跑马灯字段
    */
    getRankingListMarquee() {
      const url = this.getCrowdApiUrl('goLang', 'scrollwin');
      return this.httpRequestCrowdFunding(url, 'GET', false).then((response) => {
        if (response.data.code === 0) {
          if (response.data.data === null) {
            return new Error();
          }
          return response.data.data;
        }
        return new Error();
      });
    },
    /** ===============
     * @name 取得首頁眾籌合買人數
    */
    getCrowdStats() {
      const url = this.getCrowdApiUrl('goLang', 'stats');
      return this.httpRequestCrowdFunding(url, 'GET', false).then((response) => {
        if (response.data.code === 0) {
          return response.data.data;
        }
        return false;
      });
    },
    /** ===============
     * @name 登錄後首頁眾籌合買人數
    */
    getLoginedCrowdStats() {
      const url = this.getCrowdApiUrl('goLang', 'hotlottery');
      return this.httpRequestCrowdFunding(url, 'GET', true).then((response) => {
        if (response.data.code === 0) {
          return response.data.data;
        }
        return false;
      });
    },
    /**
     * @name 玩法说明
     */
    openLotteryPlayingDocModal() {
      this.playingruleDialog = true;
    },
    closeLotteryPlayingDocModal() {
      this.playingruleDialog = false;
    },

    openLotteryFilterModal() {
      this.setRightDrawer();
      this.toggleDrawer('setDownDrawer', false);
    },
  },
};

export { crowdFundingMixin as default };
