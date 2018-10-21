<template>
  <q-btn-dropdown :label="btnLabel">
    <!-- dropdown content -->
    <q-list link>
      <q-item
        v-for="(item, i) in dropdownList"
        :key="`menu${i}`"
        v-close-overlay
        @click.native="clickBtn(item)" >
        <q-item-main>
          <q-item-tile label>
            <q-icon
              v-if="item.btnIcon"
              :name="item.btnIcon" />
            {{item.label}}
          </q-item-tile>
        </q-item-main>
      </q-item>
    </q-list>
    <q-list v-if="defaultIndex.includes(styleName) || defaultIndex.includes(styleNameNumber)"
      class="logout-button">
      <q-btn class="btn-logout" @click="methodCheckLogout">登出</q-btn>
      <div>{{time2Date(loginTime)}}</div>
    </q-list>
  </q-btn-dropdown>
</template>

<script>
import globalMixin from 'src/globalMixin';
import { mapState } from 'vuex';

export default {
  name: 'layoutBtnDropdown',
  props: ['btnLabel', 'dropdownList', 'btnIcon'],
  mixins: [globalMixin],
  data() {
    return {};
  },
  computed: {
    ...mapState(['loginTime']),
  },
  methods: {
    methodCheckLogout() {
      this.memberLogout({ name: this.userName }).then((res) => {
        if (res) this.$router.push(this.getRoutePath('Home'));
      });
    },
  },
};
</script>

<style>
</style>
