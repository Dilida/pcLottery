<template>
  <div></div>
</template>

<script>
import httpMixin from 'src/httpMixin';
import { forOwn } from 'lodash';
import globalMixin from 'src/globalMixin';

export default {
  // name: 'PageName',
  mixins: [globalMixin, httpMixin],
  data() {
    return {};
  },
  async created() {
    const reg = /this\.httpRequest/;
    await forOwn(httpMixin.methods, async (value, key) => {
      if (reg.test(value)) {
        const res = await value();
      }
    });
  },
};
</script>

<style>
</style>
