<template>
  <q-page class="lobby">
    <!--时时彩票-->
    <template v-if="sscIndex.includes(styleName) || sscIndex.includes(styleNameNumber)">
      <div class="row items-stretch index-main">
        <div class="layout-side">
          <LotteryLeftSide :showCrowdFunding="true"/>
        </div>
        <div class="layout-main">
          <Carousel />
          <Marquee />
          <div class="row lobby-promo-wrap">
            <!-- 推荐彩种(有倒计时) -->
            <LotteryTop />
            <!-- 往期开奖 -->
            <div class="lobby-pastview">
              <div class="tabs-panel">
                <div class="tabs-panel__title">开奖公告</div>
                <q-btn @click="$router.push('/history')">更多</q-btn>
              </div>
              <LotteryRightSide :slidesToShow="3"/>
            </div>
          </div>
        </div>
      </div>
      <div class="row items-start index-main">
        <div class="layout-side">
          <WinnerList
          v-if="testData.prizeRankingListIs"
          :getType="'富豪榜'" :testData="testData['richestRanking']" />
        </div>
        <div class="layout-main">
          <!-- 推荐彩种 -->
            <LotteryBottom />
          <!-- end 推荐彩种 -->
          <Activity :activity="activity"
          v-if="activity.length"/>
        </div>
      </div>
    </template>

    <!--default 版本-->
    <template
      v-else-if="defaultIndex.includes(styleName) || defaultIndex.includes(styleNameNumber)">
      <div class="row">
        <div class="col-3 layout-side-left">
          <LotteryLeftSide :showCrowdFunding="true"/>
          <MoreGame :lotteryGroup="lotteryGroup" :slider="false" :hover="true"/>
        </div>
        <div class="col-9 row index-main">
          <Marquee />
          <div class="col-8 layout-main">
            <Carousel />
            <CrowdFunding />
            <LotteryTop />
            <LotteryBottom />
            <Activity :activity="activity"
            v-if="activity.length"/>
            <QrCode v-if="defaultIndex.includes(styleName)" />
          </div>
          <div class="col-4 layout-side-right">
            <div class="lobby-pastview">
              <div class="tabs-panel">
                <div class="site-panel__header">
                  <div class="tabs-panel__title">
                    <q-icon v-if="defaultIndex.includes(styleName)"
                    name="icon-tool icon-badge" />
                    开奖公告
                  </div>
                </div>
                <q-btn @click="$router.push('/history')">更多</q-btn>
              </div>
              <LotteryRightSide :slidesToShow="2"/>
            </div>
            <WinnerScroll v-if="!$_lodash.isEmpty(testaxios)" :data="testaxios"/>
            <div class="lobby-winner__tag">
              <q-btn
              v-if="testData.prizeRankingListIs"
              :class="nowTag ? 'tag':''"
              label="彩神榜"
              @click.prevent="if(testData.richestRankingIs){changeTag(true)}"/>
              <q-btn
              v-if="testData.richestRankingIs"
              :class="!nowTag ? 'tag':''"
              label="富豪榜"
              @click.prevent="if (testData.richestRankingIs){changeTag(false)}"/>
            </div>
            <WinnerList
            v-if="nowTag && testData.prizeRankingListIs ||
            !nowTag && testData.richestRankingIs"
            :getType="nowTag ? '彩神榜' : '富豪榜'"
            :testData="testData[nowTag ? 'prizeRankingList' : 'richestRanking']" />
          </div>
        </div>
      </div>
    </template>

    <!--其他-->
    <template v-else>
    <div class="lobby-ad">
      <Carousel />
      <Marquee />
    </div>
    <div class="row jackpot">
      <div
        class="col row jackpot-wrap"
        v-for="(item, index) in jackpot"
        :key="`jackpot-${index}`" >
        <div class="jackpot-item">
          <div class="jackpot-item__img">
            <img :src="item.icon || 'statics/images/count-cup.png'">
          </div>
          <div class="jackpot-label">
            {{item.label || ''}}
            <span class="lobby-primary-text">{{item.lotteryName || ''}}</span>
          </div>
          <div class="jackpot-money">{{currencies(roundAmt(item.payoff)) || 0}}</div>
        </div>
      </div>
    </div>
    <div class="row items-start index-main">
      <div class="layout-main">
        <CrowdFunding />
        <BillBoard :isTag="false"/>
        <HotGame />
        <MoreGame :lotteryGroup="lotteryGroup"  :slider="true" :hover="false"/>
        <Activity :activity="activity"
        v-if="activity.length"/>
      </div>
      <div class="layout-side">
        <WinnerScroll v-if="!$_lodash.isEmpty(testaxios)" :data="testaxios"/>
        <WinnerList
        v-if="testData.prizeRankingListIs"
        :getType="'彩神榜'" :testData="testData['prizeRankingList']" />
        <WinnerList
        v-if="testData.richestRankingIs"
        :getType="'富豪榜'" :testData="testData['richestRanking']" />
      </div>
    </div>
    </template>
    <!-- 左浮动广告 -->
    <div v-if="!$_lodash.isEmpty(floadAdLeftData)"
      class="float-ad-left" :class="{'hide':!floadAdLeft}">
      <div class="float-ad-wrap">
        <a :href="$_lodash.isEmpty(item.link) ? '#' : item.link"
          :style="$_lodash.isEmpty(item.link) ? 'cursor:default' : ''"
          v-for="(item, i) in floadAdLeftData" :key="i">
          <img :src="item.src">
        </a>
      </div>
      <q-btn @click="floadAdLeft = false" class="float-ad-close">
        <img :src="'statics/images/close.png'">
      </q-btn>
    </div>
    <!-- 右浮动广告 -->
    <div v-if="!$_lodash.isEmpty(floadAdRightData)"
      class="float-ad-right" :class="{'hide':!floadAdRight}">
      <div class="float-ad-wrap">
        <a :href="$_lodash.isEmpty(item.link) ? '#' : item.link"
          :style="$_lodash.isEmpty(item.link) ? 'cursor:default' : ''"
          v-for="(item, i) in floadAdRightData" :key="i">
          <img :src="item.src">
        </a>
      </div>
      <q-btn @click="floadAdRight = false" class="float-ad-close">
        <img :src="'statics/images/close.png'">
      </q-btn>
    </div>
    <!-- 首頁弹窗 -->
    <Pop
      v-model="popIsShow"
      :popContent="popContent"
      class="lobby-post" />
    <WebSocketAlert :wsVisible="wsVisible" :wsMessage="wsMessage" />
  </q-page>
</template>

<style>
</style>

<script>
import CrowdFunding from 'components/lobbyCrowdFunding';
import BillBoard from 'components/lobbyBillBoard';
import Carousel from 'components/lobbyCarousel';
import HotGame from 'components/lobbyHotGame';
import Marquee from 'components/lobbyMarquee';
import MoreGame from 'components/lobbyMoreGame';
import WinnerScroll from 'components/lobbyWinnerScroll';
import WinnerList from 'components/lobbyWinnerList';
import Activity from 'components/lobbyActivity';
import QrCode from 'components/lobbyQrCode';
import Pop from 'components/lobbyPop';
import WebSocketAlert from 'components/webSocketAlert';
// specail three boss component
import LotteryBottom from 'components/specialLobby/lobbyThreeBottomLottery';
import LotteryTop from 'components/specialLobby/lobbyThreeTopLottery';
import LotteryLeftSide from 'components/specialLobby/lobbyLeftLotteryList';
import LotteryRightSide from 'components/specialLobby/lobbyRightPastLottery';
import { mapState, mapGetters } from 'vuex';
import { globalMixin } from 'src/globalMixin';
import { crowdFundingMixin } from 'src/crowdFundingMixin';
import { load } from 'protobufjs';

export default {
  name: 'Home',
  mixins: [globalMixin, crowdFundingMixin],
  plugins: [load],
  components: {
    CrowdFunding,
    BillBoard,
    Carousel,
    HotGame,
    Marquee,
    MoreGame,
    WinnerScroll,
    WinnerList,
    Activity,
    QrCode,
    Pop,
    LotteryBottom,
    LotteryTop,
    LotteryLeftSide,
    LotteryRightSide,
    WebSocketAlert,
  },
  data() {
    return {
      payoffMaxLottery: {},
      jackpot: [],
      activity: [],
      testaxios: [],
      testPrizeRankingData: [],
      testRichesRankingData: [],
      testData: [],
      popIsShow: false,
      popContent: [],
      routeQuery: null,
      floadAdRight: true,
      floadAdLeft: true,
      floadAdRightData: [],
      floadAdLeftData: [],
      nowTag: true,
      wsVisible: false,
      wsMessage: '',
    };
  },
  computed: {
    ...mapState(['isLoggedIn', 'isDemoUser']),
    ...mapGetters({
      lotteryGroup: 'game/getLotteryGroup',
    }),
  },
  created() {
  },
  mounted() {
    // 奖池初始化
    this.methodGetJackPot();
    // 优惠活动
    this.methodGetActivity();
    // 富豪榜
    this.getCrowdFundingInfo();
    // 左右兩側廣告
    this.getFloatFun();
    // websocket
    // this.testSocketIo();
    this.baochiSocketIo();
  },
  // 離開當前首頁路由的用戶檢查，處理非直接跳路由情況的用戶限制
  beforeRouteLeave(to, from, next) {
    if (to.matched.some(record => record.meta.loginCheck)) {
      if (!this.isLoggedIn) {
        this.routeCheckCallback(
          { invalid: true, isDemoUser: false },
          () => { this.$emit('openLogin'); },
        );
        return;
      }
      if (to.matched.some(record => record.meta.demoPlayCheck) && this.isDemoUser) {
        this.routeCheckCallback(
          { invalid: true, isDemoUser: true },
          () => { this.$router.push(this.getRoutePath('reg')); },
        );
        return;
      }
      next();
    }
    next();
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      const { invalid = false, isDemoUser = false } = to.query;
      vm.routeQuery = { invalid, isDemoUser };
    });
  },
  watch: {
    routeQuery(newVal) {
      if (newVal) this.routeCheckCallback(newVal);
      this.routeQuery = null;
    },
    isLoggedIn: {
      // 首頁彈屏，登入後才跳出
      handler(newVal) {
        if (newVal) {
          this.getPopText().then((res) => {
            if (res && !this.$_lodash.isEmpty(res.list)) {
              this.popContent = res.list;
              this.popIsShow = true;
            }
          });
          // 登入后依据token获取信件状态
          this.getUnreadMailStatus();
        }
      },
      immediate: true,
    },
  },
  methods: {
    /**
     * 前端Demo UI:http://socket.baochi888.com:8080/index
     * 發送訊息的URL:
     * http://socket.baochi888.com:8080/test2
     * receiveBody 接收者帳號前後用逗號包裝。ex: ,Phantom,
     * platInfoId 平台商Id
     * msg        傳送訊息
     * example:
     * http://socket.baochi888.com:8080/test2?receiveBody=,Phantom,&platInfoId=126&msg=TestMsg
     */
    baochiSocketIo() {
      load('/statics/message.proto').then((root) => {
        let $options = {};
        const $acToken = this.$q.cookies.get('access_pcToken');
        if ($acToken) {
          $options = {
            transportOptions: {
              polling: {
                extraHeaders: {
                  Authorization: $acToken,
                },
              },
            },
          };
        }
        console.log($options);
        const messageVO = root.lookupType('MessageVO');
        const socketIo = this.$socketIo('ws://socket.baochi888.com', $options);
        console.log(socketIo);
        socketIo.on('NOTICE_EVENT', (data) => {
          const msg = messageVO.decode(data.data);
          this.wsVisible = true;
          this.wsMessage = msg;
          console.log(msg);
        });
      });
    },
    async getFloatFun() {
      const res = await this.getFloatFigure();
      this.floadAdRightData =
        res.right && res.right.map(x => ({ src: this.getPicUrl(x.pictureKey), link: x.link }));
      this.floadAdLeftData =
        res.left && res.left.map(x => ({ src: this.getPicUrl(x.pictureKey), link: x.link }));
    },
    async methodGetJackPot() {
      let res = null;
      res = await this.getPayoffMaxLottery();
      if (res) this.jackpot.push(res);
      res = await this.getPayoffSum();
      if (res) this.jackpot.push(res);
    },
    async methodGetActivity() {
      const res = await this.getActivity({ page: 1, count: 3 });
      this.activity = res.list.map((activity) => {
        const { cid, titlePic, title } = activity;
        return { cid, title, titlePic: this.getPicUrl(titlePic) };
      });
    },
    async getCrowdFundingInfo() {
      this.testaxios = await this.getRankingListMarquee();
      this.testData = await this.getCrowdFundingIndexRanking();
      this.nowTag = this.testData.prizeRankingListIs;
    },
    changeTag(labelBoolean) {
      this.nowTag = labelBoolean;
    },
  },
};
</script>
