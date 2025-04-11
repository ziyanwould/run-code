<template>
  <div class="left">
    <h1 @click="handleClick">CodeFlux</h1>
  </div>
</template>

<script setup>
import { base } from '@/config'

const handleClick = () => {
  // 如果是相对路径('./')，使用当前域名
  // 如果是绝对路径('/xxx/')，则基于当前域名拼接
  const isRelativePath = base === './'
  const url = isRelativePath 
    ? window.location.origin 
    : `${window.location.origin}${base}`
  
  window.open(url, '_blank')
}
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
