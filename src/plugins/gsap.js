import { TweenMax, TimelineLite, Bounce } from 'gsap';

export default ({ Vue }) => {
  Vue.prototype.$TweenMax = TweenMax;
  Vue.prototype.$Bounce = Bounce;
  Vue.prototype.$TimelineLite = TimelineLite;
};
