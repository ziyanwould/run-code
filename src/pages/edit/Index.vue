<template>
  <div class="editContainer">
    <Header v-if="!embed"></Header>
    <div class="content" v-if="showContent">
      <component :is="activeLayout" :key="layout" :layout="layout"></component>
    </div>
  </div>
</template>

<script setup>
import Header from '@/components/Header.vue'
import {
  computed,
  watch,
  getCurrentInstance,
  onUnmounted,
  ref,
  defineProps,
  toRaw
} from 'vue'
import { useStore } from 'vuex'
import { layoutMap, defaultViewThemeConfig } from '@/config/constants'
import { useRouter, useRoute } from 'vue-router'
import { initMonacoEditor } from '@/utils/monacoEditor'
import nprogress from 'nprogress'
import { getThemeValue, utoa } from '@/utils'

const props = defineProps({
  // 是否是嵌入模式
  embed: {
    type: Boolean,
    default: false
  }
})

// hooks定义部分
const useInit = () => {
  const store = useStore()
  const proxy = getCurrentInstance().proxy
  const showContent = ref(false)
  const init = async callback => {
    // 初始化编辑器
    await initMonacoEditor()
    callback()
    showContent.value = true
  }
  const route = useRoute()
  // 获取当前编辑数据
  const getData = async () => {
    try {
      nprogress.start()
      await store.dispatch('getData', {
        id: route.params.id, 
        data: route.query.data
      })
      proxy.$eventEmitter.emit('reset_code')
      nprogress.done()
    } catch (error) {
      nprogress.done()
    }
  }
  // 监听路由变化
  watch(
    () => {
      return route.params
    },
    (newVal, oldVal) => {
      if (newVal.id !== oldVal.id) {
        getData()
      }
    }
  )
  getData()
  return {
    store,
    showContent,
    proxy,
    router: useRouter(),
    init
  }
}

// 将数据保存到query里
const useQueryStore = (store, router) => {
  watch(() => {
    return store.state.editData
  },() => {
    if (store.state.githubToken) {
      return
    }
    let data = utoa(JSON.stringify(store.state.editData))
    router.replace({
      name: 'Editor',
      query: {
        data
      }
    })
  }, {
    deep: true
  })
}

// 布局
const useLayout = ({ store }) => {
  const layout = computed(() => {
    return store.state.editData.config.layout
  })
  const activeLayout = computed(() => {
    return props.embed ? layoutMap['embed'] : layoutMap[layout.value]
  })
  return {
    layout,
    activeLayout
  }
}

// 新窗口预览
const useWindowPreview = ({ store, layout, router, proxy, themeData }) => {
  // 预览窗口
  let previewWindow = null
  // 通知预览窗口进行刷新
  const editData = computed(() => store.state.editData)
  const previewWindowRun = () => {
    previewWindow &&
      previewWindow.postMessage({
        type: 'preview',
        data: {
          config: {
            ...editData.value.config,
            themeData: toRaw(themeData.value)
          },
          code: {
            HTML: {
              language: editData.value.code.HTML.language,
              content: editData.value.code.HTML.content
            },
            CSS: {
              language: editData.value.code.CSS.language,
              content: editData.value.code.CSS.content,
              resources: editData.value.code.CSS.resources.map(item => {
                return {
                  ...item
                }
              })
            },
            JS: {
              language: editData.value.code.JS.language,
              content: editData.value.code.JS.content,
              resources: editData.value.code.JS.resources.map(item => {
                return {
                  ...item
                }
              }),
              importMap: editData.value.code.JS.importMap || ''
            },
            VUE: {
              language: editData.value.code.VUE.language,
              content: editData.value.code.VUE.content
            }
          }
        }
      })
  }
  proxy.$eventEmitter.on('preview_window_run', previewWindowRun)
  onUnmounted(() => {
    proxy.$eventEmitter.off('preview_window_run', previewWindowRun)
  })

  // 创建和销毁预览窗口
  const previewLayoutHandle = () => {
    // 新窗口预览模式
    if (layout.value === 'newWindowPreview') {
      if (!previewWindow) {
        let previewUrl = router.resolve({
          name: 'Preview'
        })
        previewWindow = window.open(previewUrl.href)
        previewWindow.onload = () => {
          previewWindowRun()
        }
      }
    } else {
      if (previewWindow) {
        previewWindow.close()
        previewWindow = null
      }
    }
  }
  watch(
    () => {
      return layout.value
    },
    () => {
      previewLayoutHandle()
    }
  )

  return {
    previewLayoutHandle,
    previewWindowRun
  }
}

// 界面主题，设置css变量
const useTheme = ({ proxy, store, layout }) => {
  // 主题同步设置
  const pageThemeSyncCodeTheme = computed(() => {
    return store.state.editData.config.pageThemeSyncCodeTheme
  })
  const themeData = ref(null)
  let lastThemeData = null
  // 更新主题变量
  const updateTheme = data => {
    themeData.value = data
    lastThemeData = data
    Object.keys(defaultViewThemeConfig).forEach(item => {
      document.documentElement.style.setProperty(
        item,
        getThemeValue(item, data, pageThemeSyncCodeTheme.value)
      )
    })
    if (layout.value === 'newWindowPreview') {
      proxy.$eventEmitter.emit('preview_window_run')
    }
  }
  updateTheme()
  watch(pageThemeSyncCodeTheme, () => {
    updateTheme(lastThemeData)
  })
  proxy.$eventEmitter.on('set-theme', updateTheme)
  onUnmounted(() => {
    proxy.$eventEmitter.off('set-theme', updateTheme)
  })

  return {
    themeData
  }
}

// created部分
const { proxy, router, store, init, showContent } = useInit()
useQueryStore(store, router)
const { layout, activeLayout } = useLayout({ store })
const { themeData } = useTheme({ proxy, store, layout })
const { previewLayoutHandle } = useWindowPreview({
  store,
  layout,
  router,
  proxy,
  themeData
})
init(() => {
  previewLayoutHandle()
})
</script>

<style scoped lang="less">
.editContainer {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .content {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
}
</style>
<style lang="less">
#nprogress .bar {
  background: var(--header-btn-color) !important;
}
#nprogress .peg {
  box-shadow: 0 0 10px var(--header-btn-color), 0 0 5px var(--header-btn-color) !important;
}
#nprogress .spinner-icon {
  border-top-color: var(--header-btn-color) !important;
  border-left-color: var(--header-btn-color) !important;
}

// 设置弹窗相关的全局样式
.el-dialog {
  background-color: var(--editor-background);
  border: 1px solid var(--dropdown-box-border-color);
  
  .el-dialog__header {
    background-color: var(--header-background);
  }
  
  .el-dialog__title {
    color: var(--header-logo-color);
  }
  
  .el-dialog__headerbtn .el-dialog__close {
    color: var(--header-logo-color);
  }
  
  .el-dialog__footer {
    background-color: var(--editor-background);
  }
}

// 下拉菜单样式
.el-select-dropdown {
  background-color: var(--dropdown-background) !important;
  border-color: var(--dropdown-box-border-color) !important;
  
  .el-select-dropdown__item {
    color: var(--dropdown-color) !important;
    
    &.hover, &:hover {
      background-color: var(--dropdown-hover-background) !important;
      color: var(--dropdown-hover-color) !important;
    }
    
    &.selected {
      color: var(--dropdown-hover-color) !important;
    }
  }
}

// 输入框样式
.el-input__inner {
  background-color: var(--editor-background) !important;
  color: var(--dropdown-color) !important;
  border-color: var(--dropdown-box-border-color) !important;
}

// 开关样式
.el-switch__core {
  border-color: var(--dropdown-box-border-color) !important;
}

// 按钮样式
.el-button {
  background-color: var(--header-btn-background) !important;
  border-color: var(--header-btn-border-color) !important;
  color: var(--header-btn-color) !important;
  
  &:hover, &:focus {
    color: var(--dropdown-hover-color) !important;
    border-color: var(--dropdown-hover-color) !important;
  }
  
  &--primary {
    background-color: var(--header-btn-color) !important;
    border-color: var(--header-btn-color) !important;
    color: var(--editor-background) !important;
    
    &:hover, &:focus {
      background-color: var(--dropdown-hover-color) !important;
      border-color: var(--dropdown-hover-color) !important;
    }
  }
}

// 增强弹窗边界效果
.el-dialog {
  background-color: var(--editor-background) !important;
  border: 2px solid var(--editor-header-title-color) !important;
  box-shadow: 0 0 4px var(--editor-header-title-color) !important; // 添加阴影

  .el-dialog__body {
    background-color: var(--editor-background) !important;
  }
  
  .el-dialog__header {
    background-color: var(--header-background) !important;
    border-bottom: 2px solid var(--editor-header-title-color) !important; // 增加标题栏底部边框
  }
  
  .el-dialog__title {
    color: var(--header-logo-color) !important;
  }
  
  .el-dialog__headerbtn .el-dialog__close {
    color: var(--header-logo-color) !important;
  }
  
  .el-dialog__footer {
    background-color: var(--editor-background) !important;
    border-top: 1px solid var(--editor-header-title-color) !important; // 添加底部边框
  }
}

// 弹窗蒙层样式增强
.v-modal {
  opacity: 0.6 !important; // 增加蒙层不透明度
  background-color: #000 !important; // 确保蒙层颜色为黑色
}

// 消息弹窗样式适配
.el-message-box {
  background-color: var(--editor-background) !important;
  border: 2px solid var(--editor-header-title-color) !important;
  box-shadow: 0 0 4px var(--editor-header-title-color) !important;
  
  .el-message-box__header {
    background-color: var(--header-background) !important;
    border-bottom: 2px solid var(--editor-header-title-color) !important;
    padding: 15px 20px !important;
  }
  
  .el-message-box__title {
    color: var(--header-logo-color) !important;
    font-weight: bold !important;
  }
  
  .el-message-box__headerbtn .el-message-box__close {
    color: var(--header-logo-color) !important;
    
    &:hover {
      color: var(--dropdown-hover-color) !important;
    }
  }
  
  .el-message-box__content {
    background-color: var(--editor-background) !important;
    color: var(--dropdown-color) !important;
    padding: 20px !important;
  }
  
  .el-message-box__message p {
    color: var(--dropdown-color) !important;
  }
  
  .el-message-box__btns {
    background-color: var(--editor-background) !important;
    border-top: 1px solid var(--editor-header-title-color) !important;
    padding: 12px 20px !important;
  }
  
  .el-message-box__status {
    color: var(--header-btn-color) !important;
    
    &.el-icon-warning {
      color: #E6A23C !important;
    }
    
    &.el-icon-success {
      color: #67C23A !important;
    }
    
    &.el-icon-error {
      color: #F56C6C !important;
    }
    
    &.el-icon-info {
      color: var(--header-btn-color) !important;
    }
  }
}

.el-table {
  background-color: var(--editor-background) !important;
  color: var(--dropdown-color) !important;
  
  &::before {
    background-color: var(--dropdown-box-border-color) !important;
  }
  
  th.el-table__cell {
    background-color: var(--header-background) !important;
    color: var(--header-logo-color) !important;
    border-bottom: 1px solid var(--dropdown-box-border-color) !important;
  }
  
  td.el-table__cell {
    background-color: var(--editor-background) !important;
    color: var(--dropdown-color) !important;
    border-bottom: 1px solid var(--dropdown-box-border-color) !important;
  }
  
  tr:hover > td.el-table__cell {
    background-color: var(--dropdown-hover-background) !important;
  }
  
  .el-table__empty-text {
    color: var(--dropdown-color) !important;
  }

  .el-table__empty-block {
    background-color: var(--editor-background) !important;
    border: 1px dashed var(--dropdown-box-border-color) !important;
  }

  .el-table__fixed-right::before, .el-table__fixed::before {
    background-color: var(--editor-background)!important;
  }
}

// 加载状态样式
.el-loading-mask {
  background-color: rgba(0, 0, 0, 0.7) !important;
  
  .el-loading-spinner {
    .path {
      stroke: var(--header-btn-color) !important;
    }
    
    .el-loading-text {
      color: var(--header-btn-color) !important;
    }
  }
}

// 表格加载中的文字提示
.el-table__body-wrapper .el-loading-text {
  color: var(--header-btn-color) !important;
}

.el-pagination {
  color: var(--dropdown-color) !important;
  
  .btn-prev, .btn-next {
    background-color: var(--editor-background) !important;
    color: var(--dropdown-color) !important;
    
    &:disabled {
      color: var(--editor-header-color) !important;
    }
    
    &:hover:not(:disabled) {
      color: var(--dropdown-hover-color) !important;
    }
  }
  
  .el-pager li {
    background-color: var(--editor-background) !important;
    color: var(--dropdown-color) !important;
    
    &.active {
      color: var(--header-btn-color) !important;
    }
    
    &:hover:not(.active) {
      color: var(--dropdown-hover-color) !important;
    }
  }
}

.el-drawer {
  background-color: var(--editor-background) !important;
  border-left: 2px solid var(--editor-header-title-color) !important;
  // box-shadow: -5px 0 15px rgba(0, 0, 0, 0.3) !important;
  box-shadow: 0 0 4px var(--editor-header-title-color) !important; // 添加阴影
  
  .el-drawer__header {
    background-color: var(--header-background) !important;
    color: var(--header-logo-color) !important;
    border-bottom: 2px solid var(--editor-header-title-color) !important;
    box-shadow: 0 0 4px var(--editor-header-title-color) !important; // 添加阴影
    margin-bottom: 0 !important;
    padding: 15px 20px !important;
    font-weight: bold !important;
  }
  
  .el-drawer__close-btn {
    color: var(--header-logo-color) !important;
    
    &:hover {
      color: var(--dropdown-hover-color) !important;
    }
  }
  
  .el-drawer__body {
    background-color: var(--editor-background) !important;
    color: var(--dropdown-color) !important;
    padding: 0 !important;
  }
}

.el-drawer__body {
  overflow: hidden !important;

  .gistBox {
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    background-color: var(--editor-background);

    .paginationBox {
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--editor-background);
      border-top: 1px solid var(--dropdown-box-border-color);
    }
  }
}

</style>
