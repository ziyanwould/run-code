<template>
  <div class="left">
    <h1 @click="openAppInNewWindow" class="logo-text">CodeFlux</h1>
  </div>
</template>

<script setup>
import { openAppInNewWindow } from '@/utils'
</script>

<style scoped lang="less">
.left {
  flex-shrink: 0;

  @media screen and (max-width: 980px) {
    h1 {
      display: none;
    }
  }

  h1 {
    color: var(--header-logo-color);
    cursor: pointer;
  }
}

.logo-text {
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    text-shadow: 0px 0px 0px var(--header-logo-color);
    transform: scale(1.05);
  }

  &::before {
    content: '';
    position: absolute;
    top: -150%;
    left: -100%;
    width: 40%;
    height: 400%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.4),
      transparent
    );
    transform: rotate(45deg);
    transition: 0.5s;
  }

  &:hover::before {
    left: 200%;
    top: -150%;
    transition: all 0.8s ease-in-out;
  }
}
</style>
