import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import gameModule from './game';
import crowdModule from './crowd';

import state from './state';
import * as getters from './getters';
import * as mutations from './mutations';
import * as actions from './actions';


const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  modules: {
    game: gameModule,
    crowd: crowdModule,
  },
});

export default store;
