<template>
  <q-page class="help">
    <div class="row col-12 layout-page">
      <div class="layout-page-side">
        <div class="member-side-bar">
          <div class="sub-nav">
            <div
              class="sub-nav__item"
              @click="activeTabId = i"
              v-for="(item, i) in items" :key="i">
              <!-- <div class="sub-nav__item-tilte">群组标题</div> -->
              <div class="sub-nav__child">
                <div class="sub-nav__child-link">
                  <q-icon :name="item.icon"></q-icon>
                  {{item.label}}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="layout-page-main">
        <div>{{items[activeTabId].label}}</div>
        <div v-html="items[activeTabId].content"></div>
      </div>
    </div>
</q-page>
</template>

<script>
import { helpCenterInfo } from 'src/consts/helpCenter';

export default {
  data() {
    return {
      activeTabId: 0,
      items: [
        {
          label: '帮助中心',
          icon: '',
          content: helpCenterInfo.helpInfo[0],
        },
        {
          label: '新手教程',
          icon: 'icon-help-1',
          content: helpCenterInfo.helpInfo[0],
        },
        {
          label: '充值教程',
          icon: 'icon-help-2',
          content: helpCenterInfo.helpInfo[1],
        },
        {
          label: '代理加盟',
          icon: 'icon-help-3',
          content: helpCenterInfo.helpInfo[2],
        },
        {
          label: '佣金方案',
          icon: 'icon-help-4',
          content: helpCenterInfo.helpInfo[3],
        },
        {
          label: '代理注册',
          icon: 'icon-help-5',
          content: 'aaa',
        },
        {
          label: '关于我们',
          icon: '',
          content: helpCenterInfo.helpInfo[4],
        },
      ],
    };
  },
  components: {
  },
};
</script>

<style lang="stylus">
</style>
