<template>
  <div class="left">
    <h1 @click="openAppInNewWindow">CodeFlux</h1>
  </div>
</template>

<script setup>
import { openAppInNewWindow } from '@/utils'
</script>

<style scoped lang="less">
.left {
  flex-shrink: 0;

  h1 {
    color: var(--header-logo-color);
    cursor: pointer;
  }
}
</style>
