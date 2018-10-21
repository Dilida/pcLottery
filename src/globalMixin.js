import { httpMixin } from './httpMixin';
import { LocalStorage, Cookies, Loading, openURL } from 'quasar';
import { lotteryConst } from 'src/consts/lotteryConst';
import LotteryGroup from 'src/consts/LotteryGroup';
import { mapMutations, mapGetters, mapState } from 'vuex';
import { load } from 'protobufjs';

export const globalMixin = {
  plugin: [
    LocalStorage, Cookies, Loading, load,
  ],
  mixins: [
    httpMixin,
  ],
  metaInfo() {
    return {
      title: this.productName,
      meta: [{
        description: this.productName,
        publishDate: this.buildDate,
      }],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: `${this.$store.state.iconsrc}` },
      ],
    };
  },
  computed: {
    buildDate() {
      return this.time2Date(process.env.PUBLISH_DATE);
    },
    buildStyleNum() {
      return process.env.STYLE_NAME + process.env.STYLE_NUMBER;
    },
    // 返回是否为开发环境
    isDev: () => {
      if (process.env.NODE_ENV === 'development') {
        return true;
      }
      return false;
    },
    // route page name
    bodyClass() {
      return this.$route.meta.bodyClass || '';
    },
    layoutShow() {
      return this.$route.meta.layoutShow || [];
    },
    styleName() {
      // 為切版便利，手動切换styleName
      if (this.isDev) {
        // return 'king';
      }
      return process.env.STYLE_NAME;
    },
    styleNumber() {
      // 為切版便利，手動切换styleName
      if (this.isDev) {
        // return '001';
      }
      return process.env.STYLE_NUMBER;
    },
    styleNameNumber() {
      return `${this.styleName}${this.styleNumber}`;
    },
    /**
     * @name 确认是否为众筹页
     */
    isCrowd() {
      return this.$route.path.includes('/crowd');
    },
    isIE() {
      return /* @cc_on!@ */false || !!document.documentMode;
    },
    kingNav() {
      return [];
    },
    defaultNav() {
      return ['default'];
    },
    sscNav() {
      return ['king', 'style901', 'style902', 'style903'];
    },
    sscIndex() {
      return ['king', 'style901', 'style902', 'style903'];
    },
    defaultIndex() {
      return ['default'];
    },
    defaultGlobal() {
      return ['default'];
    },
    sscLottery() {
      return ['king', 'style901', 'style902', 'style903'];
    },
    kingToolbar() {
      return ['king', 'style901', 'style902', 'style903'];
    },
    defaultToolbar() {
      return ['default'];
    },
    // 返回是否为已登录状态
    ...mapState([
      'isLoggedIn',
      'productName',
      'treeMap',
      'diffTime',
      'isDemoUser',
    ]),
    ...mapState('game', [
      'lotteryId',
      'lotteryName',
      'lottery',
    ]),
    ...mapState({
      pageTitle: 'pageHeaderTitle',
    }),
    ...mapGetters({
      userName: 'getUserName',
    }),
    ...mapGetters('game', {
      lotteryLists: 'getLotteryUrlList',
    }),
  },
  created() {
    // 此 JS 文件属于全局引用，禁止在此实作代码
  },
  mounted() {
    // 此 JS 文件属于全局引用，禁止在此实作代码
  },
  methods: {
    openURL,
    clickBtn(item) {
      if (item) {
        if ('type' in item) {
          this.openURL(item.value);
        } else {
          this.$router.push(item.value);
        }
      }
    },
    ...mapMutations(['setLeftDrawer', 'setBalanceStatus',
      'setRightDrawer', 'setDownDrawer', 'setPageHeaderTitle',
      'setMemberBalance', 'setLotteryLeftDrawer', 'openDialog']),
    ...mapMutations('game', [
      'setLotteryId',
    ]),
    inMaintained() {
      this.errMaintain();
      setInterval(() => {
        this.errMaintain();
      }, 1000 * 60);
    },
    appSendPing() {
      if (!this.appPing && this.isLoggedIn) {
        this.sendPing();
        this.appPing = window.setInterval(() => {
          this.sendPing();
        }, 60000); // 一分钟一次
      }
    },
    clearPing() {
      window.clearInterval(this.appPing);
      this.appPing = null;
    },
    checkHeaderStyle() {
      return lotteryConst.headerOpacityStyleLists.includes(this.styleNameNumber);
    },
    /**
     * 取得彩种别名
     * @param {Int} lotteryId
     */
    getLotterySubName(data) {
      if (!this.lotteryLists) return data.lotteryId;
      const lottery = this.lotteryLists.find(f => f.cid === data.lotteryId);
      if (lottery) return lottery.name;
      return data.lotteryName;
    },
    /**
     * @name 倒数计时
     */
    setNowTime() {
      if (!this.interval) {
        this.interval = window.setInterval(() => {
          let time = parseInt((new Date().getTime() / 1000), 10) - this.diffTime;
          time = parseInt(`${time}000`, 10);
          this.nowTime = time;
        }, 1000);
      }
    },
    /**
     * @name 倒數計時
     * @param {mstimestamp} countTime
     * @param {String} showText 小于当下的自定义回传值
     * 全站使用 往期开奖倒数需 hh:mm:ss 自行补充格式
     */
    getNowToTime(countTime, showText = '') {
      if (!countTime) return '';
      const nowToMs = countTime - this.nowTime;
      if (nowToMs < 0) return showText;
      const nowToTime = this.$moment.duration(nowToMs);
      const dd = nowToTime.days().toString();
      const hh = nowToTime.hours().toString().padStart(2, 0);
      const mm = nowToTime.minutes().toString().padStart(2, 0);
      const ss = nowToTime.seconds().toString().padStart(2, 0);
      if (dd > 0) {
        return `${dd}天${hh}:${mm}:${ss}`;
      }
      if (hh > 0) {
        return `${hh}:${mm}:${ss}`;
      }
      return `${mm}:${ss}`;
    },
    /**
     * @name 由网址取得lotteryCid
     *
     * @param {String} url
     */
    getLotteryIdByUrl() {
      const { params } = this.$route;
      const url = `/${params.type}/${params.lottery}`;
      const { cid } = this.lotteryLists.find(item => item.url.includes(url)) || { cid: 0 };
      return cid;
    },
    // 转换日期为时间戳
    date2Time(dateString, pattern = 'YYYY/MM/DD HH:mm:ss') {
      return this.$moment(dateString, pattern).valueOf();
    },
    // 转换时间戳为日期
    time2Date(timestamp, pattern = 'YYYY/MM/DD HH:mm:ss') {
      return this.$moment(parseInt(timestamp, 10)).format(pattern);
    },
    //
    currencies(v) {
      const reg = /\B(?=(\d{3})+(?!\d))/g;
      v = (v || 0).toString().replace(reg, ',');
      return v;
    },
    openGame(url) {
      if (url) {
        return window.open(url, 'game', 'width=800, height=1200');
      }
      // return window.open('', 'game', 'width=1200, height=800').document.write(loadStr);
      return window.open('', 'game', 'width=800, height=1200');
    },
    /** =================================================================================
     * @desc 字符格式化
     * @param {Int} s：要格式化的数字
     * @param {Int} n：保留几位小数
     */
    fmoney(s, n) {
      n = n > 0 && n <= 20 ? n : 2;
      s = `${parseFloat((`${s}`).replace(/[^[0-9]\.-]/g, '')).toFixed(n)}`;
      const l = s.split('.')[0].split('').reverse();
      const r = s.split('.')[1];
      let t = '';
      l.forEach((item, i) => {
        t += item + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? ',' : '');
      });
      return `${t.split('').reverse().join('')}.${r}`;
    },
    // 金额转换,分转成元
    roundAmt(v) {
      return (v / 100).toFixed(2);
    },
    /**
     * 格式化赔率
     * @param {String, Number} val
     */
    payoffFormat(val) {
      return (Number(val) / 10000).toFixed(3);
    },
    /**
     * 金额转换，支持实数, 元转成分
     * @param {Number} num
     */
    monAmt(num) {
      return /^[-+]?\d+(\.\d*)?$/.test(num) ? num * 100 : '';
    },
    /**
     * 验证英文与数字或者下划线，帐号验证和密码验证
     * @param {String} val 英数下划线混合
     */
    positiveEngNum(val) {
      const re = /^[A-Za-z0-9|_|]+$/;
      return re.test(val);
    },
    /**
     * 验证英文与数字或，密码验证
     * @param {String} val 英数混合
     */
    acceptOnlyEngNum(val) {
      const re = /^[A-Za-z0-9]+$/;
      return re.test(val);
    },
    /**
     * 验证真实姓名，中文字符
     * @param {String} val 中文字符
     */
    trueName(val) {
      const re = /^[\u4e00-\u9fa5]+$/;
      return re.test(val);
    },
    /**
     * 验证手机号码
     * @param {String} val 手机号码
     */
    phoneNum(val) {
      const re = /^1[3|4|5|7|8|][0-9]{9}$/;
      return re.test(val);
    },
    /**
     * 验证邮箱
     * @param {String} val email
     */
    checkEmail(val) {
      const re = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
      return re.test(val);
    },
    /**
     * 验证微信
     * @param {String} val 微信账号
     */
    checkWechat(val) {
      const re = /^[\w\-@]{2,30}$/;
      return re.test(val);
    },
    /**
     * 验证qq
     * @param {String} val qq账号
     */
    checkqq(val) {
      const re = /^[1-9][0-9]{4,20}$/;
      return re.test(val);
    },
    copy(text) {
      if (!text) {
        return;
      }
      this.$copyText(text).then(() => {
        this.$store.commit('openDialog', {
          content: '复制成功！',
          dialogAutoClose: true,
          dialogType: 'check',
        });
      }, () => {
        this.$store.commit('openDialog', {
          content: '浏览器不支持自动复制，请手动复制！',
          dialogAutoClose: true,
          dialogType: 'negative',
        });
      });
    },
    /** toggle Drawer
     * @param {String} v left: setLeftDrawer right: setRightDrawer
     */
    toggleDrawer(v) {
      this.$store.commit(v);
    },
    /**
     * @name 樂透過往資料重整
     * @param {int} lotteryId
     * @param {object} preData
     */
    newPreData(lotteryId, preData) {
      let blockChainList;
      if (lotteryConst.blockChainList.has(lotteryId)) {
        blockChainList = lotteryConst.blockChainList.get(lotteryId);
      }
      const lotteryPre = this.setWinNumber({
        ...preData,
        lotteryId,
        blockChainList,
      });
      return lotteryPre;
    },
    /**
     * 初始化 winNumber 格式
     * @param {Object} obj 传入奖期对象
     */
    setWinNumber(obj) {
      if (!obj) return { winNumberArr: [] };
      if (!obj.winNumber || obj.winNumber === '') {
        const lotteryId = obj.lotteryId ? obj.lotteryId.toString() : this.lotteryId.toString();
        switch (lotteryId) {
          /**
           * 8: 北京pk10
           * 108: 秒速赛车
           * 24: 幸运飞艇
           */
          case '8':
          case '108':
          case '24':
            obj.winNumber = '20,20,20,20,20,20,20,20,20,20';
            break;

          /**
           * 6: 江苏K3
           * 20: 安徽K3
           * 22: 湖北K3
           * 106: 秒速k3
           */
          case '6':
          case '20':
          case '22':
          case '106':
            obj.winNumber = '20,20,20';
            break;
          default:
            obj.winNumber = '-,-,-,-,-';
            break;
        }
      }
      obj.winNumberArr = obj.winNumber.split(',').filter(f => f !== '-').map((m) => {
        // 号码显示要补0
        if (lotteryConst.appendZeroLotteryList.includes(parseInt(obj.lotteryId, 10))) {
          return m.toString().padStart(2, 0);
        }
        return m;
      });

      // 10,110: 六合彩, 30: 幸运28 切出最后一个数字
      if (lotteryConst.isolatedWinNumberLotteryIds.includes(parseInt(obj.lotteryId, 10))) {
        const last = obj.winNumberArr.pop() || '';
        obj.winNumberArr = { first: obj.winNumberArr, last };
      }
      return obj;
    },
    /**
     * @name 获取彩票种类id分区
     * @param {Array} groupSelector - 同类lotteryId选择器
     * 示范用列:
     * this.getLotteryListMap(
     *   [8, 24, 108],    选择器 1
     *   [6, 20, 22, 106],    选择器 2
     * )
     */
    getLotteryListMap(...groupSelector) {
      return new LotteryGroup(this.lotteryLists, groupSelector);
    },
    getLotteryPlayingDoc(lotteryId, docSelector) {
      let title = '';
      if (lotteryId === 116) {
        title = '<h3>一、开奖说明</h3>';
      } else {
        title = '<h3>一、开奖与结束时间</h3>';
      }
      const subtitle = `<p>${lotteryConst.lotteryPlayingtimeDoc.get(lotteryId)}</p>`;
      const content = lotteryConst.lotteryPlayingruleDoc[docSelector - 1];
      return `${title}${subtitle}${content}`;
    },
    /**
     * @name 显示更多游戏清单
     */
    openLeftGameDrawer() {
      if (this.isLoggedIn) {
        this.setLotteryLeftDrawer(true);
      } else {
        this.openDialog({
          content: '请先登入',
          type: 'confirm',
          enter: 'login',
          dialogType: 'negative',
        });
      }
    },

    openDialog2(message = '', type = 'negative') {
      this.$q.notify({ message, type, position: 'top-right' });
    },

    changeBalanceStatus(status) {
      this.setBalanceStatus(status);
    },
    methodToLottery(lotteryId) {
      if (this.getRouteLotteryPath(lotteryId)) {
        this.$router.push(this.getRouteLotteryPath(lotteryId));
      }
    },
    /**
     * 獲取相應路由路徑
     * @param {String} name - 路由名字
     */
    getRoutePath(name) {
      if (this.treeMap) {
        return this.treeMap.get(name);
      }
      return false;
    },
    getRouteLotteryPath(id) {
      let res;
      if (id === 998) {
        res = { url: '/crowdFunding' };
      } else {
        res = this.lottery.find(item => item.id === id);
      }
      if (res) {
        const { url } = res;
        return url;
      }
      return false;
    },
    routeCheckCallback(query, callback) {
      if (query && query.invalid) {
        if (query.isDemoUser) {
          setTimeout(() => {
            this.openDialog({
              content: '游客不能访问该功能，是否注册会员？',
              dialogCloseCallback: callback,
              dialogType: 'negative',
            });
          }, 200);
        } else {
          setTimeout(() => {
            this.openDialog({
              content: '请先登入',
              dialogCloseCallback: callback,
              dialogType: 'negative',
            });
          }, 200);
        }
      }
    },
  },
  filters: {
    roundAmt: function roundAmt(v) {
      return (v / 100).toFixed(2);
    },
  },
};

export { globalMixin as default };
