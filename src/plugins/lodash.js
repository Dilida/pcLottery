import lodash from 'lodash';

export default ({ Vue }) => {
  Vue.prototype.$_lodash = lodash;
};
