import moment from 'moment';

export default ({ Vue }) => {
  Vue.prototype.$moment = moment;
};
