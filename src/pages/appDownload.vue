<template>
    <q-page class="app-download layout-page">
      <div class="bread-crumbs">
        <span class="bread-crumbs__item">{{title}}</span>
      </div>
      <div class="">
        <div class="app-download-content">
          <div class="app-download-elements">
            <div class="app-download-elements__brand-logo">
              <img :src="logoUrl">
            </div>
            <ShowQrCode/>
            <div class="app-download-elements__buttons">
              <q-btn
                label="IOS客户端下载"
                class="app-download-elements__buttons--ios"
                @click="openAppDownload('ios')"
              />
              <q-btn
                label="Android客户端下载"
                class="app-download-elements__buttons--android"
                @click="openAppDownload('android')"
              />
            </div>
          </div>
        </div>
      </div>
    </q-page>
</template>

<script>
import globalMixin from 'src/globalMixin';
import ShowQrCode from '../components/qrCode';

export default {
  name: 'appDownload',
  mixins: [globalMixin],
  components: { ShowQrCode },
  data() {
    return {
      title: '手机投注',
    };
  },
  created() {
    this.setPageHeaderTitle(this.title);
  },

};
</script>

<style>
</style>
