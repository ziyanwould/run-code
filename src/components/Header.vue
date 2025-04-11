<template>
  <div class="header">
    <!-- logo -->
    <HeaderLogo />
    
    <!-- 标题输入栏 -->
    <HeaderTitle />
    
    <!-- 工具栏 -->
    <HeaderTools 
      :isEdit="isEdit" 
      :loading="loading"
      @open-setting="settingDialogVisible = true"
      @open-template="templateDialogVisible = true"
      @export-zip="handleExportZip"
      @login="githubTokenInputDialogVisible = true"
      @logout="logout"
      @show-gists="drawer = true"
      @show-local-gists="localDrawer = true"
      @create-share-url="createShareUrl"
      @create-embed-url="createEmbedUrl"
      @create-embed-code="createEmbedCode"
    />
    
    <!-- 模板弹窗 -->
    <TemplateDialog v-model="templateDialogVisible" />
    
    <!-- 设置弹窗 -->
    <SettingDialog v-model="settingDialogVisible" />
    
    <!-- 导出弹窗 -->
    <ExportDialog ref="exportDialog" v-model="exportNameInputDialogVisible" />
    
    <!-- token弹窗 -->
    <GithubTokenDialog v-model="githubTokenInputDialogVisible" />
    
    <!-- 我的gists -->
    <GistDrawer v-model="drawer" />
    
    <!-- 分享弹窗 -->
    <Share ref="ShareComp" :isEdit="isEdit"></Share>
    
    <!-- 剪贴板检测器 -->
    <ClipboardDetector />
    
    <!-- 添加本地项目抽屉 -->
    <LocalGistDrawer v-model="localDrawer" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'

// 导入拆分的组件
import HeaderLogo from './header/HeaderLogo.vue'
import HeaderTitle from './header/HeaderTitle.vue'
import HeaderTools from './header/HeaderTools.vue'
import TemplateDialog from './header/TemplateDialog.vue'
import SettingDialog from './header/SettingDialog.vue'
import ExportDialog from './header/ExportDialog.vue'
import GithubTokenDialog from './header/GithubTokenDialog.vue'
import GistDrawer from './header/GistDrawer.vue'
import Share from './Share.vue'
import ClipboardDetector from './ClipboardDetector.vue'
import LocalGistDrawer from './header/LocalGistDrawer.vue'

const store = useStore()
const router = useRouter()
const route = useRoute()

// 状态管理
const loading = ref(false)
const templateDialogVisible = ref(false)
const settingDialogVisible = ref(false)
const exportNameInputDialogVisible = ref(false)
const githubTokenInputDialogVisible = ref(false)
const drawer = ref(false)
const localDrawer = ref(false)

// 引用
const ShareComp = ref(null)
const exportDialog = ref(null)

// 计算属性
const hasQueryData = computed(() => {
  return route.name === 'Editor' && !!route.query.data
})

const isEdit = computed(() => {
  return (route.name === 'Edit' && !!route.params.id) || hasQueryData.value
})

// 方法
const logout = () => {
  store.dispatch('saveGithubToken', null)
  router.replace({
    name: 'Editor'
  })
}

const handleExportZip = () => {
  exportNameInputDialogVisible.value = true
  exportDialog.value.open()
}

const createShareUrl = () => {
  ShareComp.value.createShareUrl(hasQueryData.value ? encodeURIComponent(route.query.data) : null)
}

const createEmbedUrl = () => {
  ShareComp.value.createEmbedUrl(hasQueryData.value ? encodeURIComponent(route.query.data) : null)
}

const createEmbedCode = () => {
  ShareComp.value.createEmbedCode(hasQueryData.value ? encodeURIComponent(route.query.data) : null)
}
</script>

<style scoped lang="less">
.header {
  background: var(--header-background);
  width: 100%;
  height: 65px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-grow: 0;
  flex-shrink: 0;
  padding: 0 20px;
  border-bottom: 1px solid var(--touch-bar-background);
  box-shadow: 0px 0 4px var(--touch-bar-background);
}
</style>
