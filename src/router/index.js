import Vue from 'vue';
import VueRouter from 'vue-router';
import { Cookies } from 'quasar';

import routes from './routes';

Vue.use(VueRouter);

const Router = new VueRouter({
  /*
   * NOTE! Change Vue Router mode from quasar.conf.js -> build -> vueRouterMode
   *
   * If you decide to go with "history" mode, please also set "build.publicPath"
   * to something other than an empty string.
   * Example: '/' instead of ''
   */

  // Leave as is and change from quasar.conf.js instead!
  mode: process.env.VUE_ROUTER_MODE,
  base: process.env.VUE_ROUTER_BASE,
  scrollBehavior: () => ({ y: 0 }),
  routes,
});

Router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.loginCheck)) {
    if (!Cookies.has('access_pcToken')) {
      next({
        path: '/',
        query: { invalid: true, isDemoUser: false },
      });
    }
    next();
  }
  // 上层layout设定套用到下层url
  if (to.matched.some(record => record.meta.layoutShow)) {
    to.matched.forEach((url) => {
      if (!to.meta.layoutShow) to.meta.layoutShow = [];
      if (url.meta.layoutShow) {
        to.meta.layoutShow = [
          ...to.meta.layoutShow,
          ...url.meta.layoutShow.filter(f => !to.meta.layoutShow.includes(f)),
        ];
      }
    });
  }
  next();
});

export default Router;
