import { Cookies, QSpinnerGears } from 'quasar';
import { mapMutations, mapActions } from 'vuex';
import qs from 'qs';
// TODO: new api
// import qs from 'qs';
import { lotteryConst } from 'src/consts/lotteryConst';

export const httpMixin = {
  plugin: [Cookies],
  data() {
    return {
    };
  },
  computed: {
    isLoggedIn() {
      return this.$store.state.isLoggedIn;
    },
  },
  created() {
    // 此 JS 文件属于全局引用，rapidUrl禁止在此实作代码
  },
  mounted() {
    // 此 JS 文件属于全局引用，禁止在此实作代码
  },
  methods: {
    ...mapMutations(['openDialog', 'closeDialog', 'setSysTime', 'toggleLotteryListDialog', 'setMaintainInfo']),
    ...mapMutations('crowd', ['showCrowdfundingIcon', 'setCrowdfundingLottery']),
    ...mapMutations('game', ['setLotteryList']),
    ...mapActions('game', ['setPlayTree']),
    // 设置 cookie
    setCookie(name, value, expire, path = '/') {
      if (expire !== undefined || expire === 0) {
        if (expire === -1) {
          // 保存一年
          expire = 366 * 86400 * 1000;
        } else {
          expire = parseInt(expire, 10);
        }
      }
      this.$q.cookies.set(name, value, {
        secure: false,
        expires: expire,
        path,
      });
    },
    // 获取 cookie
    getCookie(name) {
      if (this.$q.cookies.has(name)) {
        return this.$q.cookies.get(name);
      }
      return '';
    },
    hasCookie(name) {
      return this.$q.cookies.has(name);
    },
    removeCookie(name) {
      return this.$q.cookies.remove(name, { path: '/' });
    },
    // 清除所有 Cookie
    clearCookie() {
      this.$_lodash.keys(this.$q.cookies.all()).forEach((item) => {
        this.removeCookie(item);
      });
    },
    /**
     * 取得 API baseURL
     */
    getApiUrl: (name, url) => {
      const apiUrl = window.location.protocol === 'https:' ?
        process.env.API_URL : process.env.API_URL_HTTP;
      return `${apiUrl[name]}${url}`;
    },
    /**
     * 取得图片网址
     * @param {Sring} pic
     */
    getPicUrl: (pic) => {
      const apiUrl = window.location.protocol === 'https:' ?
        process.env.API_URL : process.env.API_URL_HTTP;
      if (pic) return `${apiUrl.picurl}${pic}/0`;
      return '';
    },
    /**
     * http 请求
     * @param {String} url API url
     * @param {String} method POST, GET, PUT...
     * @param {Boolean} token true 自动带入 token
     * @param {Object} data 传入 POST data 或 GET params
     * @param {Object} headers 传入 Headers
     */
    httpRequest(url, method, token = false, data = {}, headers = {}) {
      if (token) {
        const acToken = this.getCookie('access_pcToken');
        headers.Authorization = acToken;
      }
      let params;
      if (method === 'GET') {
        params = data;
        const isIE = /* @cc_on!@ */false || !!document.documentMode;
        if (isIE) {
          params = {
            ...params,
            time: Date.now(),
          };
        }
      }
      return this.$http({
        method,
        url,
        headers,
        data,
        params,
      }).then((response) => {
        if (this.$_lodash.has(response, 'data.serverTime')) {
          this.setSysTime(response.data.serverTime);
        }
        if (this.$_lodash.get(response, 'data.errorCode', '') !== '') {
          if (url === this.getApiUrl('javaMaintainLog', 'check')) return false;
          if (url !== this.getApiUrl('java', 'member/v1/check/name')) {
            console.info('response.url', response.config.url);
            console.info('response.data', response.data);
            this.openDialog({
              content: response.data.errorMsg,
              dialogType: 'negative',
            });
          }
        }
        if (this.$_lodash.get(response, 'data.errorCode', '') === 1000002) {
          this.errLogin();
        }
        return response.data;
      }).catch((err) => {
        this.errCatchAction(err);
        throw err.response;
      });
    },
    errLogin() {
      this.openDialog({
        content: '登入过期',
        dialogType: 'negative',
      });
      // NOTE: 投注纪录页会使用 当过期登出时需关闭
      if (this.$q.loading.isActive) {
        this.$q.loading.hide();
      }
      this.$store.dispatch('setLoginState', false);
      this.$router.push('/');
    },
    /**
     * Api Error Catch
     * @param {Object} err
     * err.response.state
     * 401 登入逾期
     * 409 在其他装置登入
     */
    errCatchAction(err) {
      // NOTE: 登入过期 token 失效
      if (err.response.statusText === 'Unauthorized') {
        this.errLogin();
      } else if ([409].includes(parseInt(err.response.status, 10))) {
        // NOTE: 重覆登入
        this.openDialog({
          content: err.response.data.message,
          dialogType: 'negative',
        });
        this.$store.dispatch('setLoginState', false);
        this.$router.push('/login');
      } else if ([500, 504].includes(parseInt(err.response.status, 10))) {
        // this.httpLoading();
      } else if ([404].includes(parseInt(err.response.status, 10))) {
        // this.httpLoading();
      } else {
        this.openDialog({
          content: err.response.statusText,
          dialogType: 'negative',
        });
      }

      return '';
    },
    /**
     * @name 掛維護頁確認api
     * 若回傳的apistatus 為1 則再call showMaintainPage
     */
    errMaintain() {
      const mainTainUrl = this.getApiUrl('javaMaintainLog', 'check');
      const data = {
        source: 1,
        time: Date.now(),
      };
      this.httpRequest(mainTainUrl, 'GET', false, data).then((response) => {
        if (response.apistatus === 1) {
          this.showMaintainPage(response.result.cid);
          return;
        }
        // 如果在維護頁，則導回首頁
        if (this.$route.path.includes('/maintained')) {
          this.$router.push('/');
        }
      });
    },

    showMaintainPage(cid) {
      const showMainTainUrl = this.getApiUrl('javaMaintainLog', 'detail');
      const data = {
        cid,
      };
      this.httpRequest(showMainTainUrl, 'GET', false, data).then((response) => {
        if (response.apistatus === 1) {
          this.setMaintainInfo(response.result.maintainEvent);
          this.$router.push('/maintained');
        }
      });
    },

    httpLoading() {
      if (!this.$q.loading.isActive) {
        this.$q.loading.show({
          spinner: QSpinnerGears,
          message: '连线发生异常，请稍后重试',
          messageColor: 'white',
          spinnerSize: 100, // in pixels
          spinnerColor: 'white',
          customClass: 'bg-primary',
        });
      }
    },
    /**
     * 格式转换
     * @param {Object} object
    */
    getFormData(object) {
      const formData = new FormData();
      this.$_lodash.keys(object).forEach(key => formData.append(key, object[key]));
      return formData;
    },
    /** ==========================
     * 注册 API
     *
     * @name 注册登入
    */
    registerLogin(data, clientId) {
      const url = this.getApiUrl('java', 'member/v1/register/login');
      if (!this.$_lodash.has(data, 'promoteCode')) {
        data.promoteCode = '';
      }
      if (!this.$_lodash.has(data, 'bankName')) {
        data.bankName = '';
      }
      const header = {
        clientId,
      };
      return this.httpRequest(url, 'POST', false, data, header).then(answer => answer);
    },
    /**
     * 注册会员帐号是否重覆
     * @param {String} login
     */
    checkMemberAccount(accountName) {
      const AccData = {
        name: accountName,
      };
      const url = this.getApiUrl('java', 'member/v1/check/name');
      return this.httpRequest(url, 'GET', false, AccData).then((response) => {
        if (response.apistatus !== 1) {
          return false;
        }
        return true;
      });
    },
    /**
     * @name 注册时须渲染项目
    */
    getRegisterConfig() {
      const url = this.getApiUrl('java', 'config/v1/register');
      return this.httpRequest(url, 'GET', false, { regType: 1 }).then((response) => {
        if (response.apistatus === 1) {
          return response;
        }
        return false;
      });
    },
    /** ===============
     * @name 银行列表
    */

    getBankList() {
      const url = this.getApiUrl('java', 'payment/v1/member/bank/offline/list');
      return this.httpRequest(url, 'GET').then((response) => {
        if (response.apistatus === 1) {
          response.result.list.forEach((bank) => {
            bank.bankPic = this.getPicUrl(bank.bankPic);
          });
          return response;
        }
        return false;
      });
    },
    /** ==========================
     * 會員 API
     */
    /** ===============
     * @name 試玩登錄
    */
    demoPlay() {
      const url = this.getApiUrl('java', 'member/v1/login/test');
      // const url = 'http://api.baochi888.com/uaa/apid/member/testLogin';
      return this.httpRequest(url, 'POST', false).then((response) => {
        // response = this.oldDemoPlay(response);
        if (response.apistatus === 1) {
        // 把登录token放在cookie里面
          this.setCookie('access_pcToken', response.result.token);
          this.getAccessToken = response.result.token;

          // 把登录用户名放在cookie里面
          this.setCookie('username', response.result.username);
          // 登入时间
          this.setCookie('loginTime', response.serverTime);

          // TODO: 试玩登录成功处理
          this.$store.dispatch('setLoginState', true);
          this.$store.dispatch('setDemoState', true);
          this.removeCookie('isDemoUser');
          this.setCookie('isDemoUser', true);
          this.$router.push('/');
          return true;
        }
        // TODO: 试玩登录失败处理
        return response.errorMsg;
      });
    },

    /**
     * 获取验证码
     */
    getCode() {
      // TODO: new api
      const url = this.getApiUrl('java', 'member/v1/code');
      return this.httpRequest(url, 'GET', false).then((res) => {
        if (res.apistatus === 1) {
          return res.result;
        }
        return false;
      });
      // TODO: old api
      // const url = this.getApiUrl('javaTest', `uaa/apid/member/code/get?time=${Math.random()}`);
      // return this.httpRequest(url, 'GET', false).then((res) => {
      //   if (res.err === 'SUCCESS' && res.data) {
      //     return res.data;
      //   }
      //   return false;
      // });
    },
    /**
     * 會員登入 (暫時)
     * @param data 登入資料
     */
    memberLogin({
      name,
      password,
      code,
      freeLogin,
      clientId,
    }) {
      // TODO: new api
      const data = {
        name,
        password,
        code,
        freeLogin: freeLogin ? 1 : 2,
      };
      const headers = {
        clientId,
      };
      const url = this.getApiUrl('java', 'member/v1/login');
      // 沒UI之前先hardcode資料
      return this.httpRequest(url, 'POST', false, qs.stringify(data), headers)
        .then((response) => {
          if (response.apistatus === 1) {
            // 把登录token放在cookie里面
            this.setCookie('access_pcToken', response.result.token);
            // 把登录用户名放在cookie里面
            this.setCookie('username', response.result.username);
            // 登入时间
            this.setCookie('loginTime', response.serverTime);
            this.$store.dispatch('setLoginState', true);
            this.$store.dispatch('setDemoState', false);
            return true;
          }
          return response.errorMsg;
        });
    },

    memberLogout(data) {
      // TODO: new api
      const url = this.getApiUrl('java', 'member/v1/logout');
      return this.httpRequest(url, 'POST', true, qs.stringify(data)).then((res) => {
        if (res.apistatus === 1) {
          this.$store.dispatch('setLoginState', false);
          return true;
        }
        this.$store.dispatch('setLoginState', false);
        return false;
      });
    },

    /**
     * 取得會員資料
     */
    getMemberInfo() {
      const url = this.getApiUrl('java', 'member/v1/info');
      return this.httpRequest(url, 'GET', true, {}).then((response) => {
        if (response.apistatus === 1) {
          return response.result;
        }
        return false;
      });
    },

    /**
     * 修改會員資料
     * @param data 用户信息可修改的部分email,QQ,wechat
     */
    updateMemberInfo(data) {
      const url = this.getApiUrl('java', 'member/v1/info/update');
      return this.httpRequest(url, 'POST', true, qs.stringify(data))
        .then(response => response);
    },

    /**
     * 密码重置
     * @param type -- 重置登录 / 重置取款
     */
    resetPassword(type, password) {
      let path = '';
      switch (type) {
        case 1:
          // 修改登入密码
          path = 'member/v1/reset/password';
          break;
        case 2:
          // 修改取款密码
          path = 'payment/v1/member/password/reset';
          break;
        default:
          break;
      }
      const url = this.getApiUrl('java', path);
      const param = password;
      return this.httpRequest(url, 'POST', true, qs.stringify(param)).then((response) => {
        if (response.apistatus === 1) {
          return response;
        }
        return response.errorMsg;
      });
    },

    /**
     * 取得个人消息
     * @param page 请求页码
     * @param count 每页数据量
     */
    getMemberNotifications(page, count) {
      const url = this.getApiUrl('java', 'cms/v1/msg/list');
      const param = {
        page: page || 1,
        count: count || 10,
      };
      return this.httpRequest(url, 'GET', true, param).then((response) => {
        if (response.apistatus === 1) {
          return response.result;
        }
        return false;
      });
    },
    getUnreadMailStatus() {
      const url = this.getApiUrl('java', 'cms/v1/msg/status');
      return this.httpRequest(url, 'GET', true).then((response) => {
        if (response.apistatus === 1) {
          this.$store.commit('setUnreadMailStatus', response.result);
        }
      });
    },
    cancelUnreadMailStatus() {
      const url = this.getApiUrl('java', 'cms/v1/msg/read');
      return this.httpRequest(url, 'POST', true).then((response) => {
        if (response.apistatus === 1) {
          this.$store.commit('setUnreadMailStatus', false);
        }
      });
    },

    /**
     * @name 取得网站设定
     * TODO: 还是存cookie? 超过一天才重拿？
     */
    getSiteConfig() {
      // 登錄狀態判斷不需要與服務器進行確認，從initGame里拿出來，單獨進行設置
      this.$store.dispatch('initLoggedState');
      if (!this.$store.state.siteIsGet) {
        const url = this.getApiUrl('java', 'cms/v1/site');
        this.httpRequest(url, 'GET').then((res) => {
          if (res.apistatus === 1) {
            this.$store.dispatch('initGame', res.result);
          }
        });
      }
      if (!this.$store.state.appUrlIsGet) {
        // APP下载链结
        const url = this.getApiUrl('java', 'config/v1/url/app');
        this.httpRequest(url, 'GET').then((res) => {
          if (res.apistatus === 1) {
            this.$store.dispatch('setAppUrl', res.result);
          }
        });
      }
      if (!this.$store.state.custIsGet) {
        // 客户服务链结
        const url = this.getApiUrl('java', 'config/v1/cust');
        this.httpRequest(url, 'GET').then((res) => {
          if (res.apistatus === 1) {
            this.$store.dispatch('setCust', res.result);
          }
        });
      }
      // 將 DemoUser狀態 從cookie存到 veux 內共用
      const DemoUser = this.getCookie('isDemoUser');
      this.$store.dispatch('setDemoState', DemoUser.length === 0 ? false : DemoUser);
    },

    /**
     * @name 获取轮播图
     */
    getCarousel() {
      let resData = [];
      let delayTime = null;
      const url = this.getApiUrl('java', 'cms/v1/carousel');
      return this.httpRequest(url, 'GET').then((res) => {
        if (res.apistatus === 1 && res.result.list) {
          resData = res.result.list.map(item => ({
            cid: item.carouselId,
            picture: this.getPicUrl(item.titlePic),
            link: item.link,
          }));
          this.$q.localStorage.set('carouselList', resData);
          ({ delayTime } = res.result);
        }
        const data = {
          resData,
          // s === ms * 1000
          delayTime: delayTime * 1000,
        };
        return data;
      });
    },
    /**
     * @name 获取跑马灯
     */
    getMarquee() {
      const url = this.getApiUrl('java', 'cms/v1/notices');
      return this.httpRequest(url, 'GET').then(res => res);
    },

    /** ==========================
     * hermes API
     */

    /** ==========================
     * lottery API
     */
    /** ===============
     * @name 彩种奖期（包含：当前销售期，上一期，下一期）
     * @param {int} lotteryId
     * @param accountToken
    */
    getRecentPrize(lotteryId) {
      const url = this.getApiUrl('java', 'lottery/v1/recent/prize');
      const data = { lotteryId };
      return this.httpRequest(url, 'GET', true, data).then((response) => {
        if (response.apistatus === 1) {
          return response.result;
        }
        return false;
      });
    },
    /**
     * @name 获取彩种列表
     */
    getLotterys() {
      let lotteryList = this.$q.localStorage.get.item('lotteryList') || [];
      this.setLotteryList(lotteryList);
      // 向后端抓取彩种列表
      const url = this.getApiUrl('java', 'config/v1/lotterys');
      return this.httpRequest(url, 'GET', false).then((response) => {
        if (response.apistatus === 1) {
          const lotteryListGroup = response.result;
          lotteryList = [];
          lotteryListGroup.forEach((group, groupIndex) => {
            group.lotterys = group.lotterys.map((lottery) => {
              const { url: lotteryUrl } = lotteryConst.lotteryHerf
                .find(item => item.cid === lottery.id) || { url: '/404' };
              if (lotteryUrl !== '/404') {
                lottery.url = lotteryUrl;
                lottery.imgUrl = this.getPicUrl(lottery.imgUrl);
                lottery.group = groupIndex;
                lottery.groupName = group.groupName;
                return lottery;
              }
              return lotteryUrl;
            }).filter(lottery => lottery !== '/404');
            lotteryList = [...lotteryList, ...group.lotterys];
          });
          this.$q.localStorage.set('lotteryList', lotteryList);
          this.setLotteryList(lotteryList);
          return lotteryList;
        }
        return false;
      });
    },
    /** ========================
     * @name 玩法奖期相关
     */
    /**
     * @name 获取玩法树
     * @param {int} lotteryId 彩种ID
     */
    getPlayTree(lotteryId) {
      if (!lotteryId) {
        return false;
      }

      this.setPlayTree(false);

      // 取得网址
      const url = this.getApiUrl('java', 'config/v1/playsTree');
      return this.httpRequest(url, 'GET', true, {
        lotteryId,
      }).then((response) => {
        if (response.apistatus === 1) {
          this.setPlayTree(response.result.childrens);
          return true;
        }
        return false;
      });
    },
    getPayoffMaxLottery() {
      const url = this.getApiUrl('java', 'order/v1/nowday/payoff/maxLottery');
      return this.httpRequest(url, 'GET', false).then((res) => {
        if (res.apistatus === 1) {
          const {
            icon = '',
            lotteryId = 0,
            lotteryName = '',
            payoff = 0,
          } = res.result;
          return {
            icon: this.getPicUrl(icon),
            lotteryId,
            lotteryName,
            payoff,
            label: '当日最大派奖金额',
          };
        }
        return false;
      });
    },
    getPayoffSum() {
      const url = this.getApiUrl('java', 'order/v1/nowday/payoff/sum');
      return this.httpRequest(url, 'GET', false).then((res) => {
        if (res.apistatus === 1) {
          const { payoff = 0 } = res.result;
          return { payoff, label: '当日累计', lotteryName: '派奖' };
        }
        return false;
      });
    },
    /** ===============
     * @name 往期开奖（彩种右侧，只展示 最近八期数据）
     * @param {int} lotteryId
     * @param accountToken
    */
    getPastPrize(lotteryId) {
      const url = this.getApiUrl('java', 'lottery/v1/past/prize');
      const data = { lotteryId };
      return this.httpRequest(url, 'GET', true, data).then((response) => {
        if (response.apistatus === 1) {
          return response.result;
        }
        return false;
      });
    },

    /** ===============
     * @name 彩种页投注记录
     * @param {int} lotteryId
     * @param accountToken
    */
    getBetListHistory(lotteryId) {
      const url = this.getApiUrl('java', 'order/v1/lottery/bet/list');
      if (lotteryId === 0) return;
      const data = { lotteryId };
      this.httpRequest(url, 'GET', true, data).then((response) => {
        if (response.apistatus === 1 && this.$_lodash.has(response, 'result.list')) {
          this.$store.commit('game/setBetListHistory', response.result.list);
        }
      });
    },

    /** ===============
     * @name 露珠
     * @param {int} lotteryId
     * @param accountToken
     */
    getLoadBead(lotteryId) {
      const url = this.getApiUrl('java', 'lottery/v1/loadBead');
      const data = { lotteryId };
      return this.httpRequest(url, 'GET', true, data).then((response) => {
        if (response.apistatus === 1) {
          return response.result;
        }
        return false;
      });
    },

    /** ===============
     * @name 雙面長龍
     * @param {int} lotteryId
     * @param accountToken
    */
    getDoubleLong(lotteryId) {
      const url = this.getApiUrl('java', 'lottery/v1/doubleLong');
      const data = { lotteryId };
      return this.httpRequest(url, 'GET', true, data).then((response) => {
        if (response.apistatus === 1) {
          const returnValue = {
            open: response.result.open,
            unOpen: response.result.unOpen,
          };
          return returnValue;
        }
        return false;
      });
    },

    /** ===============
     * @name 三葉主開獎公告
     * */
    getThreeBossPastLotteryList() {
      const url = this.getApiUrl('java', 'lottery/v1/recent/prize/dataNewlys');
      return this.httpRequest(url, 'GET', false).then((response) => {
        if (response.apistatus === 1) {
          return response.result;
        }
        return false;
      });
    },

    /** ===============
     * 取得投注纪录
     */
    /** ===============
      * @name 投注纪录
      * @param data Query条件参数: 页码，每页数据量，彩种id，彩种状态
    */
    getBetList(data) {
      const url = this.getApiUrl('java', 'order/v1/bet/list');
      return this.httpRequest(url, 'GET', true, data).then((response) => {
        if (response.apistatus === 1) {
          return response.result;
        }
        return false;
      });
    },
    /** ===============
     * 取得今日数据
     */
    /** ===============
      * @name 今日数据
    */
    getTodaySummary() {
      const url = this.getApiUrl('java', 'order/v1/bet/today/getSummary');
      return this.httpRequest(url, 'GET', true).then((response) => {
        if (response.apistatus === 1) {
          return response.result;
        }
        return false;
      });
    },
    /** ===============
     * 取得优惠活动
     */
    /** ===============
     * @param {Number} page 页码
     * @param {Number} count 每页条数 默认10
     */
    getActivity() {
      // TODO: new api
      // const params = { page, count };
      const url = this.getApiUrl('java', 'cms/v1/activity');
      return this.httpRequest(url, 'GET', false).then((res) => {
        if (res.apistatus === 1) {
          return this.httpRequest(url, 'GET', false, { page: 1, count: res.result.total }).then((response) => {
            const list = response.result;
            return list;
          });
        }
        return false;
      });
      // TODO: old api
      // const url = this.getApiUrl('javaTest', 'forseti/apid/cms/activity');
      // return this.httpRequest(url, 'GET', false).then((res) => {
      //   res = res.data;
      //   if (
      //     res.err === 'SUCCESS' &&
      //     res.data !== null &&
      //     res.data.rows !== null
      //   ) {
      //     return res.data.rows;
      //   }
      // });
    },
    /**
     * @name 往期开奖记录/号码走势
     * @param {Number} lotteryId 彩种id
     * @param {Number} countIssue 查询的期数，默认近30期；30 近30期 ，50 近50期 ，0 今日数据
     * @param {Number} page 页码
     * @param {Number} count 每页条数 默认30
     */

    getHistoryPrizeList({
      lotteryId,
      countIssue = 30,
      page,
      count = 30,
    }) {
      const url = this.getApiUrl('java', 'lottery/v1/prize/list');
      return this.httpRequest(url, 'GET', true, {
        lotteryId,
        countIssue,
        page,
        count,
      }).then((response) => {
        if (response.apistatus === 1) {
          return response.result;
        }
        return false;
      });
    },
    getMemberBalance() {
      const url = this.getApiUrl('java', 'member/v1/balance');
      if (!this.isLoggedIn) return false;
      return this.httpRequest(url, 'GET', true).then((res) => {
        if (res.apistatus === 1) {
          this.setCookie('memberBalance', res.result);
          this.$store.commit('setMemberBalance', res.result.balance);
          return res.result;
        }
        return false;
      });
    },

    /** ===============
     * 取得账户明细
     */
    /** ===============
      * @name 账户明细
      * @param data Query条件参数: 类型，开始时间，结束时间，状态，请求页码，每页条数
    */
    getTradeList(data) {
      const url = this.getApiUrl('java', 'payment/v1/member/trade/list');
      return this.httpRequest(url, 'GET', true, data).then((response) => {
        if (response.apistatus === 1) {
          return response.result;
        }
        return false;
      });
    },
    /**
     * @name 获取网站说明文案
     *
     * @param {Int} type 1首页方案，2注册说明，3线上存提方案，4帮助中心
     * @param {Int} code  BT01 新手教程
     *                    BT02 代理加盟
     *                    BT03 佣金方案
     *                    BT04 关于我们
     *                    BT05 充值教程
     *                    AT01 存款弹窗
     *                    AT02 支付宝钱包
     *                    AT03 微信钱包
     *                    AT04 银行转账说明
     */
    getCopyright(type = '', code = '') {
      const url = this.getApiUrl('java', 'cms/v1/about');
      return this.httpRequest(url, 'GET', false, { type, code }).then((response) => {
        if (response.apistatus === 1) {
          return response.result;
        }
        return false;
      });
    },
    /**
     * @name 首页弹屏
     */
    getPopText() {
      const url = this.getApiUrl('java', 'cms/v1/popText');
      return this.httpRequest(url, 'GET', false).then((res) => {
        if (res.apistatus === 1) {
          const indexPopTitle = res.result.list.map(item => item.title).join(',');
          if (this.hasCookie('indexPopTitle')) {
            if (this.getCookie('indexPopTitle').toString() === indexPopTitle) return false;
            this.setCookie('indexPopTitle', indexPopTitle);
            return res.result;
          }
          this.setCookie('indexPopTitle', indexPopTitle);
          return res.result;
        }
        return false;
      });
    },
    /**
     * @name 支付方式列表
     */
    getRapidPayModeList() {
      const url = this.getApiUrl('java', 'payment/v1/member/payMode/list');
      return this.httpRequest(url, 'GET', true, null).then((response) => {
        if (response.apistatus === 1) {
          return response.result;
        }
        return false;
      });
    },
    /**
     * @name 快捷支付链接
     * @param {Number} id 支付方式的id
     */
    // getRapidPayUrl() {
    //   const url = this.getApiUrl('java', 'payment/v1/member/rapidPay/rapidUrl');
    //   return this.httpRequest(url, 'GET', true, {
    //     id: 16,
    //   }).then((response) => {
    //     if (response.apistatus === 1) {
    //       return response.result;
    //     }
    //     return false;
    //   });
    // },
    /**
     * @name 网银支付，银联快捷
     * @param {String} [bankCode=null] 支付银行code
     * @param {Number} flowType 4网银支付 5 银联快捷
     * @param {Number} amount 支付金额
     */
    postRapidPayUrl({
      bankCode = null,
      flowType,
      amount,
    }) {
      const url = this.getApiUrl('java', 'payment/v1/member/rapidPay/save');
      return this.httpRequest(url, 'POST', true, qs.stringify({
        bankCode,
        flowType,
        amount,
      }), {
        'Content-Type': 'application/x-www-form-urlencoded',
      }).then((res) => {
        if (res.apistatus) {
          res.result.qrCode = this.getPicUrl(res.result.qrCode);
          return res.result;
        }
        this.openDialog({
          content: res.errorMsg ? res.errorMsg : res.errorMsgEn,
          type: 'negative',
          dialogType: 'negative',
        });
        return false;
      });
    },
    /**
     * @name 扫码支付列表
     */
    getRapidPayQRcodeList() {
      const url = this.getApiUrl('java', 'payment/v1/member/payMode/qrCode/list');
      return this.httpRequest(url, 'GET', true).then((response) => {
        if (response.apistatus === 1) {
          return response.result;
        }
        return false;
      });
    },
    /**
     * @name 扫码支付
     * @param {Number} id 支付方式id
     * @param {Number} amount 金额
     */
    postRapidPayQRcode({
      id,
      amount,
    }) {
      const url = this.getApiUrl('java', 'payment/v1/member/rapidPay/qrCode/save');
      return this.httpRequest(url, 'POST', true, qs.stringify({
        id,
        amount,
      }), {
        'Content-Type': 'application/x-www-form-urlencoded',
      }).then((response) => {
        if (response.apistatus === 1) {
          return response.result;
        }
        this.openDialog({
          content: response.errorMsg ? response.errorMsg : response.errorMsgEn,
          type: 'negative',
          dialogType: 'negative',
        });
        return false;
      });
    },
    /**
     * @name 网银支付列表
    */

    getBankListOnline() {
      const url = this.getApiUrl('java', 'payment/v1/member/bank/online/list');
      return this.httpRequest(url, 'GET', true).then((response) => {
        if (response.apistatus === 1) {
          if (response.result.list) {
            response.result.list.forEach((bank) => {
              bank.bankPic = this.getPicUrl(bank.bankPic);
            });
          } else {
            response.result.list = [];
          }
          return response;
        }
        return false;
      });
    },
    /**
     * @name 银行转账-收款银行信息
     */
    getTransferPayBankInfo() {
      const url = this.getApiUrl('java', 'payment/v1/member/transferPay/bankInfo');
      return this.httpRequest(url, 'GET', true).then((response) => {
        if (response.apistatus === 1) {
          return response.result;
        }
        return false;
      });
    },
    /**
     * @name 银行转账提交
     * @param {String} bankCode 收款银行code
     * @param {String} bankName 收款银行名称
     * @param {String} bankCardNo 收款卡号
     * @param {String} bankDeposit  收款卡开户行
     * @param {String} cardOwnerName  收款人
     * @param {Timestamp} time  存款时间，13位时间戳
     * @param {Number} type 存款方式
     * @param {String} name 存款人
     * @param {Number} amount 充值金额
     */
    postTransferPay({
      bankCode,
      bankName,
      bankCardNo,
      bankDeposit,
      cardOwnerName,
      time,
      type,
      name,
      amount,
    }) {
      const url = this.getApiUrl('java', 'payment/v1/member/transferPay/save');
      return this.httpRequest(url, 'POST', true, qs.stringify({
        bankCode,
        bankName,
        bankCardNo,
        bankDeposit,
        cardOwnerName,
        time,
        type,
        name,
        amount,
      }), {
        'Content-Type': 'application/x-www-form-urlencoded',
      }).then((response) => {
        if (response.apistatus === 1) {
          return response.result;
        }
        this.openDialog({
          content: response.errorMsg ? response.errorMsg : response.errorMsgEn,
          type: 'negative',
          dialogType: 'negative',
        });
        return false;
      });
    },
    /**
     * @name 扫码支付列表
     */
    getWalletPayWalletInfo() {
      const url = this.getApiUrl('java', 'payment/v1/member/walletPay/walletInfo');
      return this.httpRequest(url, 'GET', true).then((response) => {
        if (response.apistatus === 1) {
          response.result.forEach((walletPatMode) => {
            walletPatMode.qrCode = this.getPicUrl(walletPatMode.qrCode);
          });
          return response.result;
        }
        return false;
      });
    },
    /**
     * @name 钱包支付提交
     * @param {Number} type 支付方式（1 微信 2 支付宝）
     * @param {String} name 收款微信或支付宝账号
     * @param {Number} amount 充值金额
     * @param {Timestamp} time  充值时间
     * @param {String} incomeAccount  充值帐号
     */
    postWalletPay({
      type,
      name,
      amount,
      time,
      incomeAccount,
    }) {
      const url = this.getApiUrl('java', 'payment/v1/member/walletPay/save');
      return this.httpRequest(url, 'POST', true, qs.stringify({
        type,
        name,
        amount,
        time,
        incomeAccount,
      }), {
        'Content-Type': 'application/x-www-form-urlencoded',
      }).then((response) => {
        if (response.apistatus === 1) {
          return response.result;
        }
        this.openDialog({
          content: response.errorMsg ? response.errorMsg : response.errorMsgEn,
          type: 'negative',
          dialogType: 'negative',
        });
        return false;
      });
    },
    /**
     * 获取验证码 代理注册
     */
    getSwitchYzmcode() {
      const url = this.getApiUrl('java', 'user/v1/code');
      return this.httpRequest(url, 'GET');
    },
    /** ==========================
     * config API
     */
    /**
     * @name 三葉主热门彩种
     */
    getThreeBossHotLotteryList() {
      const url = this.getApiUrl('java', 'config/v1/lotteys/hotNew');
      return this.httpRequest(url, 'GET', false).then((response) => {
        if (response.apistatus === 1) {
          return response.result;
        }
        return false;
      });
    },
    /**
     * @name 热门彩种
     */
    getHotLotteryList() {
      const url = this.getApiUrl('java', 'config/v1/lotteys/hot');
      return this.httpRequest(url, 'GET', false).then((response) => {
        if (response.apistatus === 1) {
          // 合买
          response.result.together.imgUrl = this.getPicUrl(response.result.together.imgUrl);
          // 前三彩种
          response.result.countdown = response.result.countdown.map((element) => {
            element.imgUrl = this.getPicUrl(element.imgUrl);
            return element;
          });
          // 热门彩种列表
          response.result.list = response.result.list.map((element) => {
            element.imgUrl = this.getPicUrl(element.imgUrl);
            return element;
          });
          return response.result;
        }
        return false;
      });
    },
    /**
     * @name 热门彩种下注倒计时获取
     * @param {Array} ids id array, 用于查询彩种的下注倒计时
     */
    getHotLotteryCycle({
      ids,
    }) {
      const url = this.getApiUrl('java', 'config/v1/lottery/hot/cycle');
      return this.httpRequest(url, 'GET', false, {
        ids,
      }).then((response) => {
        if (response.apistatus === 1) {
          return response.result;
        }
        return false;
      });
    },
    /**
     * @name 注册配置-代理
     */
    getAgentConfigList() {
      const url = this.getApiUrl('java', 'config/v1/register?regType=2');
      return this.httpRequest(url, 'GET').then((response) => {
        if (response.apistatus === 1) {
          return response;
        }
        return false;
      });
    },
    /** ===============
     * @name 代理人申请
    */
    agentCommit(data, clientId) {
      const url = this.getApiUrl('java', 'user/v1/agent/register');
      const header = {
        // Authorization: 'Basic d2ViX2FwcDo=',
        // 'Content-Type': 'application/json;charset=UTF-8',
        clientId,
      };
      return this.httpRequest(url, 'POST', false, qs.stringify(data), header).then(answer => answer);
    },
    /**
     * @name 检查代理帐号是否重覆
     * @param {String} agentAccount
     */
    checkAgentAccount(name) {
      const url = this.getApiUrl('java', 'user/v1/agent/check/name');
      const params = { name };
      // TODO: 优化改为GET
      return this.httpRequest(url, 'POST', false, qs.stringify(params)).then((response) => {
        if (response.apistatus !== 1) {
          this.openDialog({
            content: '用户名重复',
            dialogType: 'negative',
          });
          return false;
        }
        return true;
      });
    },
    /**
     * @name 取款绑定银行信息
     */
    withdrawalBankInfo() {
      const url = this.getApiUrl('java', 'payment/v1/member/bank/info');
      return this.httpRequest(url, 'GET', true).then((response) => {
        if (response.apistatus === 1) {
          return response.result;
        }
        return false;
      });
    },
    /**
     * @name 提款
     */
    withdrawalsAction(data) {
      const url = this.getApiUrl('java', 'payment/v1/member/draw/save');
      return this.httpRequest(url, 'POST', true, qs.stringify(data)).then(response => response);
    },
    withDrawalsBindCommit(data) {
      const {
        realName,
        bankCardNo,
        bankName,
        bankDeposit,
        mobile,
        bankCode,
      } = { ...data };
      const postData = qs.stringify({
        realName,
        bankCardNo,
        bankName,
        bankDeposit,
        mobile,
        bankCode,
      });
      const url = this.getApiUrl('java', 'payment/v1/member/bank/save');
      return this.httpRequest(url, 'POST', true, postData).then(answer => answer);
    },
    /** =================
     *  @name 投注相关
     */
    /**
     * @name 投注
     *
     * @param {Array} list
     * @param {int} amount //总金额，此金额=所有注单总金额
     * @param {int} lotteryId //彩种id
     * @param {int} operType //下注类型，1下注
     * @param {String} pcode //期次20170925013
     * @param {Date} pdate //日期20170925; 六合彩 0:本周,1:上周,2:上上周
     * @param {String} remark //备注，可用于测试
     * @param {String} source //来源：H5/PC/IOS/Android
     * @param {String} sourceType // 1:pc, 2:h5, 3:IOS, 4:ANDROI
     */
    setBetOrder({
      list = [],
      amount = 0,
      lotteryId = '',
      operType = 0,
      pcode = '',
      pdate = '',
      remark = '无',
      source = 'PC',
      sourceType = 1,
    }) {
      const data = {
        list,
        amount,
        lotteryId,
        operType,
        pcode,
        pdate,
        remark,
        source,
        sourceType,
      };
      const url = this.getApiUrl('java', 'apid/orders/betOrder');
      return this.httpRequest(url, 'POST', true, data); // .then(response => response.data);
    },
    /**
     * @name 取得首頁兩側浮動圖
     */
    getFloatFigure() {
      const url = this.getApiUrl('java', 'cms/v1/floatFigure/view');
      return this.httpRequest(url, 'GET').then((response) => {
        if (response.apistatus === 1) {
          return response.result;
        }
        return false;
      });
    },
    sendPing() {
      const url = this.getApiUrl('java', 'user/v1/ping');
      return this.httpRequest(url, 'GET', true).then((res) => {
        if (res.apistatus === 1) {
          return res;
        }
        return false;
      });
    },
  },
};


export { httpMixin as default };
