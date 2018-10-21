<template>
  <div class="app-download-elements__qrcode">
    <template v-if="getApp.ios && getApp.ios.url">
      <div><img id="iosQrCode" v-qrcode="getApp.ios.url" /></div>
    </template>
    <template v-else>
      <!-- 預設圖 -->
      <img :src="'statics/images/ios@2x.png'"/>
    </template>
    <template v-if="getApp.android && getApp.android.url">
      <div><img id="androidQrCode" v-qrcode="getApp.android.url" /></div>
    </template>
    <template v-else>
      <!-- 預設圖 -->
      <img :src="'statics/images/android@2x.png'"/>
    </template>
  </div>
</template>

<script>
import { openURL } from 'quasar';
import { globalMixin } from 'src/globalMixin';
import { mapGetters, mapState } from 'vuex';

export default {
  name: 'QrCode',
  mixins: [globalMixin],
  computed: {
    ...mapState(['site']),
    ...mapGetters(['getApp', 'logoUrl']),
  },
  methods: {
    openURL,
    openAppDownload(type) {
      if (type === 'ios') {
        this.openURL(this.getApp.ios.url ? this.getApp.ios.url : '*');
      } else if (type === 'android') {
        this.openURL(this.getApp.android.url ? this.getApp.android.url : '*');
      }
    },
  },
};
</script>

