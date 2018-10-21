<template>
  <div
    :class="[betClass,'bet-item', disableItem]"
    :active="checkBet"
  >
    <div
      @click="betPlayItem(item, parent)"
      class="bet-item__text">
      <span class="bet-item__name"
      v-html="setName(item)"
      >
      </span>
      <span
        v-if="item.oddsData" class="bet-item__payoff"
      >
        {{item.payoffFormat}}
      </span>
      <span v-if="item.key" class="bet-item__name">
        <span
        v-for="(key, k) in item.key"
        :key="`key_${k}`"
        :class="`bead-lottery-${lotteryId} num_${key.name}`">{{key.name}}</span>
      </span>
    </div>
    <div
      class="bet-item__input">
      <input
        v-if="showInput"
        type="number"
        v-model="itemAmount"
        @input="checkInput"
      />
    </div>
  </div>
</template>

<script>
import betOrderMixin from 'src/betOrderMixin';
import { globalMixin } from 'src/globalMixin';
import { mapState, mapMutations } from 'vuex';

export default {
  mixins: [betOrderMixin, globalMixin],
  props: ['parent', 'item'],
  data() {
    return {
      ballStyleGroupIds: [
        83000, 84000, 42000, 43000, 22000, 122000,
        182000, 382000, 383000, 402000, 403000,
      ],
      ballStyleParentIds: [
        1011100, 1012100, 1031100,
        1051100, 1052100, 1053100, 1054100, 1055100, 1056100,
        1061100, 1062100, 1063100, 1064100, 1065100, 1066100,
      ],
      disable: false,
    };
  },
  computed: {
    ...mapState('game', [
      'playLayoutType',
    ]),
    showInput() {
      if (this.isCrowd) {
        return false;
      }
      if (this.playType !== '') {
        return false;
      }
      return true;
    },
    betClass() {
      let parentClass = this.getClass(this.item.parentId);
      if (!parentClass) {
        parentClass = this.getClass(this.item.cid);
      }
      return parentClass || 'bet-item-column--4';
    },
    betName() {
      const group = this.$_lodash.get(this.item, 'group', '');
      return `${group}${this.item.cid}${this.item.name}`;
    },
    checkBet() {
      return this.bet.includes(this.betName);
    },
    itemAmount: {
      get() {
        if (this.checkBet) { // 不能修改金额
          if (this.item.amount) {
            return this.item.amount;
          }
          return this.$store.state.game.betAmount;
        }
        return '';
      },
      set(data) {
        this.item.amount = parseInt(data, 10);
        if (this.checkBet) {
          this.betItem(this.item, false);
        }
        this.betItem(this.item, false);
      },
    },
    disableItem() {
      let check = false;
      if (this.playType === 'k10group') {
        this.betData.forEach((bet) => {
          if (
            `${this.item.cid}${this.item.name}` === `${bet.cid}${bet.name}`
            && bet.group !== this.item.group
          ) {
            check = true;
          }
        });
      }
      return check ? 'disable-item' : false;
    },
  },
  methods: {
    ...mapMutations('game', ['setBetData']),
    checkInput() {
      if (this.itemAmount <= 0) {
        this.itemAmount = '';
      }
      this.itemAmount = parseInt(this.itemAmount, 10);
    },
    betPlayItem(item, parent) {
      if (this.disableItem) return;
      this.betItem(item, parent);
    },
    setName(item) {
      // k3
      if (this.playLayoutType === 'k3') {
        if (['全骰', '大', '小'].includes(item.name) || this.playGroupId === 64000) {
          return `<span>${item.name}</span>`;
        }
        return item.name.split(',')
          .map(m => this.getSpan(m, 'bead-small'))
          .join('');
      }
      // pk10
      if (this.ballStyleGroupIds.includes(this.playGroupId)) {
        return this.getSpan(item.name);
      }
      // lhc
      if (this.ballStyleParentIds.includes(item.parentId)) {
        return this.getSpan(item.name);
      }
      // 自选不中
      if ([1170000].includes(this.playGroupId)) {
        return this.getSpan(item.name);
      }

      return item.name;
    },
    /**
     * @name 取得payoff内容样式
     */
    getPayOff(child) {
      if (child.key) {
        return child.key
          .map(m => this.getSpan(m.name))
          .join('');
      }
      // // 自选不中不显示
      // if ([1170000].includes(this.playGroupId)) return '';

      // 没有oddsData.payoff就不显示
      if (!this.$_lodash.has(child, 'payoffFormat')) return '';

      // 連碼 (数字太多需缩小字型)
      if ([1061100, 1062100, 1063100, 1064100, 1065100, 1066100].includes(child.parentId)) {
        return `<span class="bet-item__payoff--small">${child.payoffFormat}</span>`;
      }

      // default
      return child.payoffFormat;
    },
    /**
     * @name 取得数字样式
     */
    getSpan(name, className = '') {
      return `<span class="num_${name} bead-lottery-${this.lotteryId} ${className}">${name}</span>`;
    },
  },
};
</script>
