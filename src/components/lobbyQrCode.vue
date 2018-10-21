<template>
  <div class="col-12 row lobby-activity lobby-qrcode">
    <div class="lobby-titlebar">
      <span class="lobby-titlebar__icon">
        <q-icon name="icon-tool icon-game"></q-icon>
      </span>
      <span class="lobby-titlebar__text">扫码下载</span>
    </div>
    <div class="col-12 lobby-qrcode-content">
      <p>
        <span>安卓火热下载</span>
        <span>IOS抢先下载</span>
      </p>
      <ShowQrCode/>
    </div>
  </div>
</template>

<script>
import { globalMixin } from 'src/globalMixin';
import ShowQrCode from './qrCode';

export default {
  name: 'lobbyQrCode',
  mixins: [globalMixin],
  components: { ShowQrCode },
  methods: {
  },
};
</script>

<style>
</style>
