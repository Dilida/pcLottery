<template>
  <div :class="classArr" class="row">
    <div
      class="layout-btn-group"
      v-for="(btn, btnIndex) in buttonGroupList"
      :key="`btn-${btnIndex}`" >
      <template v-if="btn.type === 'dropdown'">
        <!-- @mouseenter.native="dropdownShowing(true)" -->
        <!-- @mouseleave.native="dropdownShowing(false)" -->
        <q-btn-dropdown
          content-class="lottery-entry-wrap"
          :label="btn.label"
          :icon="btn.icon"
          @click="dropdownShowing(true)"
          v-model="showing" >
          <!-- @mouseenter.native="dropdownShowing(true)" -->
          <!-- @mouseleave.native="dropdownShowing(false)" -->
          <q-list
            link class="lottery-entry-group">
            <q-item
              class="lottery-entry row"
                v-for="(l, groupIndex) in lotteryEntryList"
                :key="`lottery-group-${groupIndex}`" >
              <div class="col-12 lottery-entry__title">
                <q-icon name="icon-tool icon-lottery"></q-icon>
                {{ l.groupName }}
              </div>
              <div class="col-12 lottery-entry__wrap">
                <q-item
                  v-for="(subL, itemIndex) in l.list"
                  @click.native="jumpLotteryPage(subL)"
                  :key="`list-item-${itemIndex}`" >
                  <q-btn class="lottery-entry-btn">
                    <img :src="subL.imgUrl" />
                    {{subL.name}}
                  </q-btn>
                </q-item>
              </div>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </template>
      <template v-else>
        <q-btn
          flat
          :icon="btn.icon"
          :class="methodRegExp(btn.value) ? 'active':''"
          @click="methodBtnClick(btn)">
          {{btn.label}}
          <q-chip v-if="btn.chip" floating>{{btn.chip}}</q-chip>
        </q-btn>
      </template>
    </div>
  </div>
</template>

<script>
import globalMixin from 'src/globalMixin';
import { isFunction } from 'lodash';
import { mapGetters } from 'vuex';

export default {
  name: 'btnGroup',
  props: ['classArr', 'buttonGroupList'],
  mixins: [globalMixin],
  data() {
    return {
      showing: false,
      showingDelay: {
        triggerType: false,
        delayId: null,
      },
    };
  },
  computed: {
    ...mapGetters('game', {
      lotteryEntryList: 'getLotteryGroup',
    }),
  },
  methods: {
    methodBtnClick(btn) {
      // 执行function
      if (isFunction(btn.value)) btn.value();
      // 跳转路由
      else this.$router.push(btn.value);
    },
    methodRegExp(url) {
      if (typeof url !== 'string' || !url) return false;
      url = url.replace(/\//g, '\\/');
      url = `${url}$`;
      return !!this.$route.path.match(RegExp(url));
    },
    jumpLotteryPage(obj) {
      this.dropdownShowing(false);
      this.setLotteryId(obj.id);
      this.$router.push(obj.url);
    },
    dropdownShowing(type) {
      this.showingDelay.triggerType = type;
      // if (!this.showingDelay.delayId) {
      //   this.showingDelay.delayId = setTimeout(() => {
      //     this.showing = this.showingDelay.triggerType;
      //   }, 300);
      // } else {
      //   clearTimeout(this.showingDelay.delayId);
      //   this.showingDelay.delayId = setTimeout(() => {
      //     this.showing = this.showingDelay.triggerType;
      //   }, 300);
      // }
    },
  },
};
</script>
