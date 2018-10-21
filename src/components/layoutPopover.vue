<template>
  <div
  :class="classArr"
  >
    <q-btn icon="icon-avatar" @click="popoverShow = true" :label="labelName" />
    <q-popover class="account-popover" :class="`${classArr}-popover`" v-model="popoverShow">
      <slot></slot>
    </q-popover>
  </div>
</template>

<script>
export default {
  name: 'layoutPopover',
  props: ['classArr', 'labelName'],
  data() {
    return {
      popoverShow: false,
    };
  },
};
</script>

<style>
</style>
