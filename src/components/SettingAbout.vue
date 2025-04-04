<template>
  <div class="about-container">
    <h2>CodeFlux</h2>
    <p>{{ packageInfo.description }}</p>

    <div class="links">
      <div class="link-item">
        <span class="link-label">GitHub:</span>
        <a :href="packageInfo.repository.url" target="_blank">{{
          packageInfo.repository.url
        }}</a>
      </div>
      <div class="link-item">
        <span class="link-label">官网:</span>
        <a :href="packageInfo.homepage" target="_blank">{{
          packageInfo.homepage
        }}</a>
      </div>
    </div>

    <div class="version-info">
      <p>
        当前版本: <a :href="packageInfo.repository.url">{{ packageInfo.version }}</a>
      </p>
    </div>
  </div>
</template>

<script setup>
// 导入 package.json 信息
import packageInfo from '../../package.json'
</script>

<style scoped lang="less">
.about-container {
  padding: 0px 20px 20px 20px;

  h2 {
    margin-top: 0;
    margin-bottom: 20px;
    color: var(--header-btn-color);
  }

  a {
    color: var(--header-btn-color);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  .links {
    margin: 30px 0;

    .link-item {
      margin-bottom: 15px;
      display: flex;
      align-items: center;

      .link-label {
        font-weight: bold;
        margin-right: 10px;
        min-width: 59px;
        text-align: right;
      }
    }
  }

  .version-info {
    margin-top: 40px;
    font-size: 14px;
    color: var(--dropdown-color);
    opacity: 0.5;
  }
}
</style>