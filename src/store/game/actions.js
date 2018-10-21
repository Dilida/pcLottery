/*
export const someAction = (state) => {}
 */

import _ from 'lodash';
import {
  playTree,
  flattenTree,
  filterPlayDatas,
  filterPlayTabNames,
} from 'src/consts/BetOrder';
import { LocalStorage } from 'quasar';


export const setPlay = () => {
};
/**
 * @name 玩法树
 */
export const setPlayTree = ({ commit, state }, tree) => {
  let playKinds = LocalStorage.get.item(`playTree${state.lotteryId}`) || [];
  commit('setPlayTree', playKinds);

  if (tree) {
    tree = flattenTree(tree);
    playKinds = playTree.find(f => f.cids.includes(state.lotteryId));
    playKinds.kinds.forEach((kind) => {
      kind.tabs = filterPlayTabNames(kind.tabIds || false, tree);
      kind.groups = filterPlayDatas(kind.groupIds, tree);
    });
    LocalStorage.set(`playTree${state.lotteryId}`, playKinds);
    commit('setPlayTree', playKinds);
  }

  commit('setPlayGroupId', _.get(playKinds, 'kinds.0.cid', ''));
};
