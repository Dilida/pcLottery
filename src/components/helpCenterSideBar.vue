<template>
  <div class="help-center-side-bar">
    <div class="sub-nav">
      <div class="sub-nav__item" v-for="m in menuList" :key="m.item">
        <router-link :to="{ path: m.path }">
          <div class="sub-nav__item-tilte">
            <q-icon :name="m.icon"></q-icon>
            {{ m.item }}
          </div>
        </router-link>
        <div class="sub-nav__child" v-for="list in m.child" :key="list.subItem">
          <router-link class="sub-nav__child-link" :to="{ path: list.path }">
            <q-icon :name="list.icon"></q-icon>
            {{ list.subItem }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import globalMixin from 'src/globalMixin';

export default {
  mixins: [globalMixin],
  name: 'helpCenterSideBar',
  data() {
    return {
    };
  },
  computed: {
    // 獲取相應路由路徑，需要在computed执行
    menuList() {
      return [
        {
          item: '帮助中心',
          icon: 'icon-leftnav-help',
          child: [
            {
              subItem: '新手教程',
              icon: 'icon-help-1',
              path: this.getRoutePath('helpCenterTutorial'),
            },
            {
              subItem: '充值教程',
              icon: 'icon-help-2',
              path: this.getRoutePath('helpCenterRecharge'),
            },
            {
              subItem: '代理加盟',
              icon: 'icon-help-3',
              path: this.getRoutePath('helpCenterJoin'),
            },
            {
              subItem: '佣金方案',
              icon: 'icon-help-4',
              path: this.getRoutePath('helpCentercommission'),
            },
            {
              subItem: '代理注册',
              icon: 'icon-help-5',
              path: this.getRoutePath('agent'),
            },
          ],
        },
        {
          item: '关于我们',
          icon: 'icon-leftnav-aboutus',
          path: this.getRoutePath('helpCenterAbout'),
        },
      ];
    },
  },
};
</script>
