/*
export const someAction = (state) => {}
 */
import { Cookies } from 'quasar';
import { keys } from 'lodash';

export const setLoginState = ({
  commit,
}, data = false) => {
  commit('setIsLogin', data);

  if (data === false) {
    keys(Cookies.all()).forEach((item) => {
      Cookies.remove(item, { path: '/' });
    });
    commit('setUserName', '');
    commit('setLoginTime', null);
    commit('setDemoState', data);
    return;
  }
  commit('setUserName', Cookies.get('username'));
  commit('setLoginTime', Cookies.get('loginTime'));
};
export const setDemoState = ({
  commit,
}, data = false) => {
  commit('setDemoState', data);
};
export const initGame = ({
  commit,
}, data) => {
  commit('setProduct', data);
};
export const initLoggedState = ({
  commit,
}) => {
  if (Cookies.has('access_pcToken')) {
    setLoginState({ commit }, true);
  }
};
export const setBankList = ({
  commit,
}, data) => {
  commit('setBankList', data);
};

export const setSysTime = ({
  commit,
}, data) => {
  commit('setSysTime', data);
};
export const setAppUrl = ({
  commit,
}, data) => {
  commit('setAppUrl', data);
};
export const setCust = ({
  commit,
}, data) => {
  commit('setCust', data);
};

export const setPageHeaderTitle = ({
  commit,
}, data = true) => {
  commit('setPageHeaderTitle', data);
};
export const setIndexPage = ({
  commit,
}) => {
  commit('setIndexPage');
};
export const setHideHeadMenu = ({
  commit,
}) => {
  commit('setHideHeadMenu');
};
export const setLotteryMenu = ({
  commit,
}) => {
  commit('setLotteryMenu');
};
export const setRouteTree = ({
  commit,
}, route) => {
  const treeMap = new Map();
  function getTreeNode(root, pathHead) {
    root.forEach((treeNode) => {
      const { path, name, children } = treeNode;
      const absolutePath = `${pathHead}/${path}`.replace(/^\/*/, '/');
      if (name !== undefined) treeMap.set(name, absolutePath);
      if (children && children.length) getTreeNode(treeNode.children, absolutePath);
    });
  }
  getTreeNode(route, '');
  commit('setRouteTree', treeMap);
};
