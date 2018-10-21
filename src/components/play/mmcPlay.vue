<template>
  <!--秒秒彩开奖弹屏-->
  <div class="mmc-tool"
    :class="{'pk10-mmc-tool':(lotteryId===118)}"
    v-show="showMMCPlay" >
      <div class="mmc-tool_machine">
          <!-- 开奖动画 -->
          <div v-if="lotteryId===116" id="res"></div>
          <div class="mmc-tool_number">
            <template v-if="lotteryId===118">
              <div class="pk10-mmc_marquee">
                  <span v-for="n in 10" :key="n" :class="[`num_${n}`]">{{n}}</span>
              </div>
              <div class="mmc_num_box">
                  <div v-for="n in 10" :key="n" class="mmc_num pk10mmc_num"></div>
              </div>
            </template>
            <template v-else>
              <div class="mmc_num_box">
                  <div v-for="n in 5" :key="n" class="mmc_num cqmmc_num"></div>
              </div>
            </template>
          </div>
          <!-- 开奖后 -->
          <div class="mmc-tool_draw" v-show="showResult">
              <!--中奖标题-->
              <div class="mmc-tool_title mmc-tool_title-win" v-if="winStatus">
                  <p>总计<span>{{roundAmt(totalPayoff)}}</span>元</p>
              </div>
              <!--没中奖标题-->
              <div class="mmc-tool_title mmc-tool_title-lose" v-if="!winStatus">
              </div>
              <!--投注清单-->
              <div class="mmc-tool_list">
                  <ul>
                      <li v-for="(item, index) in betDataList" :key="index">
                          【{{item.playName}} - {{item.name}}】
                          @{{item.payoffFormat}} x {{betAmount}}<span
                          :class="item.winpay?'status-win':'status-lose'" v-html=
                          "item.winpay?'已派彩：' + roundAmt(item.winpay) + '元':'未中奖'"></span>
                      </li>
                  </ul>
              </div>
          </div><!-- end 开奖后 -->
          <!--按钮-->
          <div class="mmc-tool_btn">
            <a href="javascript:;" class="btn_reset mmc-btn"
            :class="{'disable': !showResult}"
            @click="selectAgain"></a>
            <a href="javascript:;" class="btn_replay mmc-btn"
            :class="{'disable': !showResult}"
            @click="betAgain"></a>
          </div>
      </div>
  </div>
  <!--end 重庆秒秒彩开奖弹屏-->
</template>

<script>
import betOrderMixin from 'src/betOrderMixin';
import { animate, easing } from 'quasar';
import { mapGetters } from 'vuex';

export default {
  name: 'mmcSscPlay',
  mixins: [
    betOrderMixin,
  ],
  props: ['winNumbers', 'listOrder'],
  data() {
    return {
      gameResult: [],
      showResult: false,
      totalPayoff: 0,
      showSlot: false,
      savedData: null,
      eachAmount: null,
      winStatus: false,
      showMMCPlay: false,
      betResult: [],
      wattingTime: 6000,
      documentWidth: false,
      unit: 105.5,
      animateIdx: 0,
    };
  },
  watch: {
    winNumbers(val) {
      // this.showMMCPlay = true; // 显示老虎机
      this.gameResult = val; // 设定开奖号码
      this.spinAction(); // , this.unit); // 转动老虎机
    },
    showMMCPlay(val) {
      if (val) {
        return;
      }
      this.$emit('closeBetConfirm');
      this.clearBetData(true);
      this.showList = false;
      this.showSlot = false;
      this.showResult = false;
      this.showLoseResult = false;
      this.showWinResult = false;
      this.savedData = null;
      this.gameResult = null;
    },
    listOrder(arr) {
      this.totalPayoff = 0;
      this.winStatus = false;
      const winPlays = arr.filter(item => item.orderStatus === 32);
      if (!winPlays) return;

      this.betDataList.forEach((item) => {
        item.winpay = 0;
        winPlays.forEach((winPlay) => {
          if (winPlay.playId === item.playId) {
            item.winpay = winPlay.payoff;
            this.totalPayoff += winPlay.payoff;
            this.winStatus = true;
          }
        });
      });
    },
  },
  computed: {
    ...mapGetters('game', {
      betDataList: 'getConfirmBetDataList',
    }),
    numberClassName() {
      if (this.lotteryId === 116) {
        return '.cqmmc_num';
      }
      return '.pk10mmc_num';
    },
  },
  methods: {
    selectAgain() {
      if (!this.showResult) return;
      this.showMMCPlay = false;
      this.clearBetData(true);
    },
    betAgain() {
      if (!this.showResult) return;
      this.$emit('betOrder');
    },
    spinAction() {
      const elms = document.querySelectorAll(this.numberClassName);
      this.showResult = false;
      this.wattingTime = (600 * elms.length) + 3000;
      const self = this;
      [...elms].reverse().forEach((elm, idx) => {
        elm.style.backgroundPositionY = '0px';
        setTimeout(() => {
          animate.start({
            from: 0,
            to: self.getOffset(idx),
            duration: 3000 + (idx * 10),
            apply(pos) {
              elm.style.backgroundPositionY = `${pos}px`;
            },
            done() {
              self.animateIdx = idx;
              self.setNumberOffset();
              if (idx + 1 === elms.length) {
                setTimeout(() => {
                  self.updatePriod();
                }, 1000);
              }
            },
            easing: easing.standard,
          });
        }, idx * 600);
      });
    },
    updatePriod() {
      this.showResult = true;
      this.getNowPriodData(this.lotteryId);
      this.getMemberBalance();
    },
    setNumberOffset() {
      const elms = document.querySelectorAll(this.numberClassName);
      const self = this;
      [...elms].reverse().forEach((elm, i) => {
        if (self.animateIdx < i) return;
        elm.style.backgroundPositionY = `${self.getOffset(i)}px`;
      });
    },
    getOffset(idx) {
      const offsetNumber = this.lotteryId === 118 ? 1 : 0;
      const numArr = [...this.gameResult]
        .map(x => (parseInt(x, 10) - offsetNumber).toString())
        .reverse();
      return Math.floor((this.unit * 60) - (this.unit * Number(numArr[idx])));
    },
  },
};
</script>

<style lang="stylus" scoped>
// 动态import 写在这没用
</style>
