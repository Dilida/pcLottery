
export default [
  {
    path: '/',
    component: () => import('layouts/default'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('pages/index'),
        meta: { layoutShow: ['helpDialog'], bodyClass: 'page-index' },
      },
      {
        path: 'appDownload',
        name: 'appDownload',
        component: () => import('pages/appDownload'),
      },
      {
        path: 'reg',
        name: 'reg',
        component: () => import('pages/reg'),
      },
      {
        path: 'restrictAccess',
        name: 'restrictAccess',
        component: () => import('pages/restrictAccess'),
      },
      {
        path: 'about',
        name: 'about',
        component: () => import('pages/about'),
        meta: { bodyClass: 'page--about', layoutShow: [] },
      },
      {
        path: 'activity',
        name: 'activity',
        component: () => import('pages/activity'),
        meta: { bodyClass: 'page--activity', layoutShow: [] },
      },
      {
        path: 'pastView',
        name: 'pastView',
        component: () => import('pages/pastView'),
        meta: { layoutShow: ['footerNav'] },
      },
      {
        path: 'betRecord',
        name: 'betRecord',
        component: () => import('pages/betRecord'),
        meta: { layoutShow: ['helpDialog'] },
      },
      {
        path: 'crowdFunding',
        name: 'crowdFunding',
        component: () => import('pages/crowdFunding/crowdFunding'),
        meta: { demoPlayCheck: true, layoutShow: [], loginCheck: true },
      },
      {
        path: 'crowdFundingMyInfo',
        name: 'crowdFundingMyInfo',
        component: () => import('pages/crowdFunding/crowdFundingMyInfo'),
      },
      {
        path: 'history',
        name: 'history',
        component: () => import('pages/history'),
        meta: { layoutShow: [] },
      },
      {
        path: 'browserNotSupport',
        name: 'browserNotSupport',
        component: () => import('pages/browserNotSupport'),
        meta: { demoPlayCheck: true, layoutShow: [] },
      },
    ],
  },
  {
    path: '/member',
    component: () => import('layouts/default'),
    meta: { loginCheck: true, layoutShow: ['helpDialog'] },
    children: [
      {
        path: 'accountManage',
        name: 'accountManage',
        component: () => import('pages/accountManage'),
        meta: { demoPlayCheck: true, layoutShow: [] },
      },
      {
        path: 'accountInfo',
        name: 'accountInfo',
        component: () => import('pages/accountInfo'),
        meta: { demoPlayCheck: true, layoutShow: [] },
      },
      {
        path: 'accountInfoDetail',
        name: 'accountInfoDetail',
        component: () => import('pages/accountInfoDetail'),
        meta: { demoPlayCheck: true, layoutShow: [] },
        props: route => ({ query: route.query.q }),
      },
      {
        path: 'accountNotification',
        name: 'accountNotification',
        component: () => import('pages/accountNotification'),
        meta: { demoPlayCheck: true, layoutShow: [] },
      },
      {
        path: 'accountPasswordManage',
        name: 'accountPasswordManage',
        component: () => import('pages/accountPasswordManage'),
        meta: { demoPlayCheck: true, layoutShow: [] },
      },
      {
        path: 'deposit',
        name: 'deposit',
        component: () => import('pages/deposit'),
        meta: { demoPlayCheck: true, layoutShow: [] },
      },
      {
        path: 'withdrawals',
        name: 'withdrawals',
        component: () => import('pages/withdrawals'),
        meta: { demoPlayCheck: true, layoutShow: [] },
      },
      {
        path: 'withdrawalsBind',
        name: 'withdrawalsBind',
        component: () => import('pages/withdrawalsBind'),
        meta: { demoPlayCheck: true, layoutShow: [] },
      },
    ],
  },
  {
    path: '/helpCenter',
    component: () => import('layouts/default'),
    children: [
      {
        path: 'helpCenterTutorial',
        name: 'helpCenterTutorial',
        component: () => import('pages/helpCenterTutorial'),
        meta: { demoPlayCheck: true, layoutShow: [] },
      },
      {
        path: 'helpCenterRecharge',
        name: 'helpCenterRecharge',
        component: () => import('pages/helpCenterRecharge'),
        meta: { demoPlayCheck: true, layoutShow: [] },
      },
      {
        path: 'helpCenterJoin',
        name: 'helpCenterJoin',
        component: () => import('pages/helpCenterJoin'),
        meta: { demoPlayCheck: true, layoutShow: [] },
      },
      {
        path: 'helpCentercommission',
        name: 'helpCentercommission',
        component: () => import('pages/helpCentercommission'),
        meta: { demoPlayCheck: true, layoutShow: [] },
      },
      {
        path: 'agent',
        name: 'agent',
        component: () => import('pages/agent'),
        meta: { demoPlayCheck: true, layoutShow: [] },
      },
      {
        path: 'helpCenterAbout',
        name: 'helpCenterAbout',
        component: () => import('pages/helpCenterAbout'),
        meta: { demoPlayCheck: true, layoutShow: [] },
      },
    ],
  },
  {
    path: '/lottery',
    component: () => import('layouts/lottery'),
    meta: { loginCheck: true, demoPlayCheck: false, layoutShow: ['lotteryLeftOptions'] },
    children: [
      {
        path: ':type/:lottery',
        component: () => import('pages/lottery'),
      },
    ],
  },
  {
    path: '/crowd',
    component: () => import('layouts/lottery'),
    meta: { demoPlayCheck: false, layoutShow: ['lotteryLeftOptions'] },
    children: [
      {
        path: ':type/:lottery',
        component: () => import('pages/lottery'),
      },
    ],
  },
  {
    path: '/maintained',
    component: () => import('pages/maintained'),
    meta: { bodyClass: 'page-plus' },
  },
  {
    path: '/develop',
    component: () => import('layouts/block'),
    children: [
      {
        // 切版时参考档案
        path: 'ui',
        component: () => import('layouts/ui'),
      },
      // {
      //   path: 'postman',
      //   component: () => import('pages/postman'),
      // },
    ],
  },
  { // Always leave this as last one
    path: '*',
    component: () => import('pages/404'),
  },
];
