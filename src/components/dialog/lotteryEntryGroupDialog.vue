<template>
  <q-modal
    class="lottery-entry-group"
    :content-css="{ width: '700px', minHeight: '70vh' }"
    v-model="isLotteryListShow" >
    <div class="row lottery-entry"
    v-for="(l, groupIndex) in lotteryEntryList" :key="`lottery-group-${groupIndex}`">
      <div class="col-12 lottery-entry__title">
        <q-icon name="icon-tool icon-lottery"></q-icon>
        {{ l.groupName }}
      </div>
      <div class="col-12 lottery-entry__wrap">
        <q-item
          class="lobby-game-item"
          v-for="(subL, itemIndex) in l.list"
          @click.native="goLotteryPage(subL)"
          :key="`list-item-${itemIndex}`" >
          <q-btn>{{subL.name}}</q-btn>
        </q-item>
      </div>
    </div>
  </q-modal>
</template>

<script>
import { globalMixin } from 'src/globalMixin';
import { mapGetters } from 'vuex';

export default {
  name: 'lotteryEntryGroupDialog',
  mixins: [globalMixin],
  data() {
    return {
    };
  },
  computed: {
    ...mapGetters('game', {
      lotteryEntryList: 'getLotteryGroup',
    }),
    isLotteryListShow: {
      get() {
        return this.$store.state.LotteryListDialogShow;
      },
      set() {
        this.$store.commit('toggleLotteryListDialog', false);
      },
    },
  },
  created() {
  },
  methods: {
    goLotteryPage(obj) {
      this.setLotteryId(obj.id);
      this.isLotteryListShow = false;
      this.$router.push(obj.url);
    },
  },
};
</script>

