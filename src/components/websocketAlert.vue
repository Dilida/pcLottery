<template>
  <transition
    enter-active-class="animated bounceInLeft"
    leave-active-class="animated bounceOutRight"
    appear
  >
    <q-alert
      v-if="wsVisible"
      color="secondary"
      icon="cloud"
      appear
      class="q-mb-sm"
    >
      {{wsMessage}}
    </q-alert>
  </transition>
</template>

<script>
export default {
  name: 'websocketAlert',
  props: ['wsVisible', 'wsMessage'],
};
</script>
