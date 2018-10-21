<template>
  <div class="member-side-bar">
    <div class="sub-nav">
      <div class="sub-nav__item" v-for="m in menuList" :key="m.item">
        <div class="sub-nav__item-tilte">
          <q-icon :name="m.icon"></q-icon>
          {{ m.item }}
        </div>
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
import { globalMixin } from 'src/globalMixin';

export default {
  name: 'memberSideBar',
  mixins: [globalMixin],
  computed: {
    menuList() {
      return [
        {
          item: '账户管理',
          icon: 'icon-leftnav-account',
          child: [
            {
              subItem: '个人资料',
              path: this.getRoutePath('accountManage'),
              icon: 'icon-personal',
            },
            {
              subItem: '密码管理',
              path: this.getRoutePath('accountPasswordManage'),
              icon: 'icon-edit-pw',
            },
          ],
        },
        {
          item: '投注管理',
          icon: 'icon-leftnav-bet',
          child: [
            {
              subItem: '投注记录',
              path: this.getRoutePath('betRecord'),
              icon: 'icon-bet-record',
            },
            {
              subItem: '账户明细',
              path: this.getRoutePath('accountInfo'),
              icon: 'icon-account-detail',
            },
          ],
        },
        {
          item: '资金管理',
          icon: 'icon-leftnav-funding',
          child: [
            {
              subItem: '我要充值',
              path: this.getRoutePath('deposit'),
              icon: 'icon-deposit',
            },
            {
              subItem: '我要提款',
              path: this.getRoutePath('withdrawals'),
              icon: 'icon-withdrawals',
            },
          ],
        },
        {
          item: '公告管理',
          icon: 'icon-leftnav-message',
          child: [
            {
              subItem: '个人消息',
              path: this.getRoutePath('accountNotification'),
              icon: 'icon-news',
            },
          ],
        },
      ];
    },
  },
};
</script>

