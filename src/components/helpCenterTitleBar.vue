<template>
  <div class="bread-crumbs">
    <span class="bread-crumbs__item">{{ title }}</span>
  </div>
</template>

<script>
export default {
  name: 'helpCenterTitleBar',
  props: ['title'],
};
</script>
