<template>
  <div id="q-app" :class="bodyClass">
    <router-view />
  </div>
</template>

<script>
import { globalMixin } from 'src/globalMixin';
import { load } from 'protobufjs';

export default {
  name: 'App',
  mixins: [globalMixin],
  plugins: [load],
  created() {
    // this.baochiSocketIo();
    // this.testSocketIo();
    this.loadProto();
    this.checkPlatform();
    this.getSiteConfig();
    this.getLotterys();
    this.getMemberBalance();
    this.appSendPing();
    this.inMaintained();
    console.info(
      '%c device ',
      'background-color:#bf360c;color:#fff',
      this.$q.platform.is.platform,
    );
    this.$store.dispatch('setRouteTree', this.$router.options.routes);
    console.info(
      '%c build ',
      'background-color:#bf360c;color:#fff',
      this.buildDate, 'testenv',
    );
    console.info(
      '%c Style ',
      'background-color:#bf360c;color:#fff',
      this.buildStyleNum,
    );
  },
  watch: {
    isLoggedIn(newVal) {
      if (newVal) {
        this.appSendPing();
      } else {
        this.clearPing();
      }
    },
  },
  methods: {
    checkPlatform() {
      if (this.$q.platform.is.mobile) {
        const pcUrl = `${window.location.protocol}//${window.location.hostname}`;
        window.location.href = pcUrl;
      }
    },
    loadProto() {
      load('/statics/message.proto').then((root) => {
        const messageVO = root.lookupType('MessageVO');
        const message = messageVO.create({
          eventId: 1,
          content: 'Hakuna Matata!哈哭吶 馬踏踏！',
        });
        console.log(`original message = ${JSON.stringify(message)}`);

        const buffer = messageVO.encode(message).finish();
        console.log(buffer);
        console.log(`buffer = ${buffer.toString()}`);

        const decoded = messageVO.decode(buffer);
        console.log(`decoded = ${JSON.stringify(decoded)}`);
      }).catch((err) => {
        throw err;
      });
    },
    // testSocketIo() {
    //   const socketIo = this.$socketIo('ws://socketio.phantomio.jp:2020');
    //   console.log(socketIo);
    //   socketIo.on('new message', (data) => {
    //     console.log(data);
    //   });
    //   socketIo.emit('add user', 'BLC hahaha');
    // },
    // baochiSocketIo() {
    //   load('/statics/message.proto').then((root) => {
    //     const messageVO = root.lookupType('MessageVO');
    //     const socketIo = this.$socketIo('ws://socket.baochi888.com');
    //     console.log(socketIo);
    //     socketIo.on('NOTICE_EVENT', (data) => {
    //       const msg = messageVO.decode(data.data);
    //       console.log(msg);
    //     });
    //   });
    // },
  },
};
</script>

<style lang="stylus">
@import 'statics/app'
.flipclock-label
  display none !important
</style>
<style lang="scss">
@import './node_modules/flipclock/src/flipclock/scss/flipclock.scss';
</style>
