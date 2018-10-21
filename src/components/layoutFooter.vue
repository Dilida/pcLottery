<template>
  <q-layout-footer class="row footer">
    <div class="col-12 footer-nav">
      <div class="layout-width footer-nav__wrap">
        <div
        v-for="(item, i) in memuList"
        :key="i"
        class="col-3 footer-nav__list" >
          <div class="footer-nav__title">{{item.label}}<small>{{item.sublabel}}</small></div>
          <div
            class="row footer-nav__item-group"
            :class="!!item.value ? 'cursor-pointer' : ''"
            @click="item.value ? $router.push(item.value) : null" >
            <div
              v-for="(subItem, s) in item.list"
              :key="s"
              :id="`item_${i}_${s}`"
              @mouseenter="iconInAnimation(`item_${i}_${s} i`)"
              @mouseleave="iconOutAnimation(`item_${i}_${s} i`)"
              @click="subItem.url ? customService(subItem.url) : $router.push(subItem.value)"
              class="col footer-nav__item"
              :class="!!subItem.value ? 'cursor-pointer' : ''" >
              <q-icon :name="subItem.icon"></q-icon>
              <p>{{subItem.label}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="layout-width column layout-copyright">
      <btnGroup
      :classArr="`footer-link justify-center`"
      :buttonGroupList="subMenuList"
      />
      <div class="footer-copyright">
        <p>Copyright © 2010-{{thisYear}} {{this.$store.state.productName}} 保留所有权利</p>
      </div>
    </div>
  </q-layout-footer>
</template>

<script>
import { globalMixin } from 'src/globalMixin';
import { mapGetters } from 'vuex';
import btnGroup from 'components/layoutBtnGroup';

export default {
  // name: 'ComponentName',
  mixins: [globalMixin],
  components: {
    btnGroup,
  },
  computed: {
    ...mapGetters(['cusUrl', 'getApp']),
    memuList() {
      return [
        {
          label: '充值方式',
          sublabel: 'Recharge Method',
          value: this.getRoutePath('deposit'),
          list: [
            { value: '', label: '支付宝', icon: 'icon-footer icon-footer-alipay' },
            { value: '', label: '微信', icon: 'icon-footer icon-footer-wechatpay' },
            { value: '', label: '银联支付', icon: 'icon-footer icon-footer-unionpay' },
          ],
        },
        {
          label: '移动端下载',
          sublabel: 'APP Download',
          list: [
            {
              value: !(/https?:\/\//.test(this.customAppdownload())) && this.customAppdownload(),
              url: /https?:\/\//.test(this.customAppdownload()) ? this.customAppdownload() : false,
              label: 'Android',
              icon: 'icon-footer icon-footer-android',
            },
            {
              value: !(/https?:\/\//.test(this.customAppdownload())) && this.customAppdownload(),
              url: /https?:\/\//.test(this.customAppdownload()) ? this.customAppdownload() : false,
              label: 'IOS',
              icon: 'icon-footer icon-footer-ios',
            },
          ],
        },
        {
          label: '在线客服',
          sublabel: 'Business Cooperation',
          list: [
            // { value: '', label: 'skype', icon: 'icon-footer icon-footer-skype' },
            // { value: '', label: 'QQ', icon: 'icon-footer icon-footer-qq' },
            {
              url: this.cusUrl,
              label: '在线客服',
              icon: 'icon-footer icon-footer-service',
            },
          ],
        },
        {
          label: '商务合作',
          sublabel: 'Service Online',
          list: [
            { value: this.getRoutePath('helpCenterJoin'), label: '代理加盟', icon: 'icon-footer icon-footer-agent' },
            { value: this.getRoutePath('helpCentercommission'), label: '佣金方案', icon: 'icon-footer icon-footer-agent-money' },
            { value: this.getRoutePath('agent'), label: '代理注册', icon: 'icon-footer icon-footer-agent-reg' },
          ],
        },
      ];
    },
    subMenuList() {
      return [
        { value: this.getRoutePath('helpCenterTutorial'), label: '新手教程' },
        { value: this.getRoutePath('helpCenterJoin'), label: '代理加盟' },
        { value: this.getRoutePath('helpCenterTutorial'), label: '帮助中心' },
        { value: this.getRoutePath('helpCenterAbout'), label: '关于我们' },
      ];
    },
  },
  data() {
    return {
      thisYear: new Date().getFullYear(),
      ddtest: '',
    };
  },
  methods: {
    customService(url) {
      const win = window.open(url, '_blank');
      win.focus();
    },
    customAppdownload() {
      return this.getApp.downloadUrl ? this.getApp.downloadUrl : this.getRoutePath('appDownload');
    },
    iconInAnimation(target) {
      // console.log('In');
      const el = document.querySelector(`#${target}`);
      // console.log(el);
      this.$TweenMax.to(el, 0.5, { scale: 1.5, ease: this.$Bounce.easeOut });
      // console.log(this.$TweenMax);
    },
    iconOutAnimation(target) {
      const el = document.querySelector(`#${target}`);
      this.$TweenMax.to(el, 0.2, { scale: 1 });
    },
  },
};
</script>

<style>
</style>
