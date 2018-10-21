/*
export const someGetter = (state) => {}
 */

import { has } from 'lodash';

export const cusUrl = (state) => {
  if (state.cust === null) {
    return '';
  }
  return state.cust.custUrl;
};
export const logoUrl = state => state.logosrc;

export const getTime = (state) => {
  const time = parseInt((new Date().getTime() / 1000), 10) - state.diffTime;
  return parseInt(`${time}000`, 10);
};

export const getUserName = state => state.userName;

export const getApp = (state) => {
  const app = { android: false, ios: false, downloadUrl: false };
  if (has(state.appUrl, ['androidVersion'])) {
    app.android = {
      name: '安卓',
      info: state.appUrl.androidVersion,
      url: state.appUrl.androidUrl,
      date: state.appUrl.androidTime,
    };
  }
  if (has(state.appUrl, ['iosVersion'])) {
    app.ios = {
      name: 'iOS',
      info: state.appUrl.iosVersion,
      url: state.appUrl.iosUrl,
      date: state.appUrl.iosTime,
    };
  }
  if (has(state.appUrl, ['downloadUrl'])) {
    app.downloadUrl = /^(https?:\/\/)/.test(state.appUrl.downloadUrl) ?
      state.appUrl.downloadUrl :
      `http://${state.appUrl.downloadUrl}`;
  }
  return app;
};
