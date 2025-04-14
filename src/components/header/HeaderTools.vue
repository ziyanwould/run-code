<template>
  <div class="right">
    <!-- 在PC端显示设置按钮 -->
    <div class="btn" @click="openSetting" v-if="!isMobile">
      <span class="icon iconfont icon-shezhitianchong"></span> 设置
    </div>
    <div class="btn" @click="openTemplate">
      <span class="icon iconfont icon-moban"></span> 模板
    </div>
    <div class="dropdownBtn" @click.stop>
      <div class="btn" @click="toggleToolsList()">
        <span class="icon iconfont icon-gongju"></span> 工具
      </div>
      <ul class="toolList" :class="{ show: showToolsList }">
        <li class="toolItem" @click="exportZipFile">导出zip</li>
        <li class="toolItem" @click="exportMarkdown">导出 Markdown</li>
        <li class="toolItem" @click="copyMarkdown">复制 Markdown</li>
        
        <li class="divider" v-if="isEdit"></li>
        <li class="toolItem" @click="createShareUrl" v-if="isEdit">
          生成分享链接
        </li>
        <li class="toolItem" @click="createEmbedUrl" v-if="isEdit">
          生成嵌入链接
        </li>
        <li class="toolItem" @click="createEmbedCode" v-if="isEdit">
          生成嵌入代码
        </li>
        
        <li class="divider"></li>
        <li class="toolItem" @click="clearAllCode">清空代码</li>
      </ul>
    </div>
    <div class="btn" @click="run">
      <span class="icon iconfont icon-shuaxin"></span> 运行
    </div>
    <div class="btn" @click="save" v-loading="loading">
      <span class="icon iconfont icon-w_yunduan"></span> 保存
    </div>
    <div class="dropdownBtn" @click.stop>
      <div class="btn" @click="toggleMoreList()">
        <span class="icon iconfont icon-gengduo"></span>
      </div>
      <ul class="toolList" :class="{ show: showMoreList }">
        <li class="toolItem" @click="openAppInNewWindow">新开窗口</li>
        <li class="toolItem" @click="createNew">新建项目</li>
        <li class="toolItem" @click="openPreviewInNewWindow">新窗预览</li>
        <li class="divider"></li>
        <li class="toolItem" @click="showLocalGists">本地项目</li>
        <li class="toolItem" @click="showMyGists">我的Gist</li>
        <li class="toolItem" @click="githubToken ? logout() : login()">
          {{ githubToken ? '退出Gist' : '登录Gist' }}
        </li>
        <!-- 在移动端显示设置按钮 -->
        <li class="divider" v-if="isMobile"></li>
        <li class="toolItem" @click="openSetting" v-if="isMobile">系统设置</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  onBeforeUnmount,
  getCurrentInstance,
  defineProps,
  defineEmits,
  nextTick,
  onMounted,
  onUnmounted
} from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { request } from '@/utils/octokit'
import { localDb } from '@/utils/localDb'
import saveAs from '@/utils/FileSaver'
import { writeToClipboard } from '@/utils/clipboard'
import { openAppInNewWindow } from '@/utils'
import { base, routerMode } from '@/config'
import { isMobileDevice } from '@/utils'

const props = defineProps({
  isEdit: Boolean,
  loading: Boolean
})

const emit = defineEmits([
  'open-setting',
  'open-template',
  'export-zip',
  'login',
  'logout',
  'show-gists',
  'show-local-gists',
  'create-share-url',
  'create-embed-url',
  'create-embed-code'
])

const { proxy } = getCurrentInstance()
const store = useStore()
const router = useRouter()
const route = useRoute()

// 添加移动端判断
const isMobile = isMobileDevice()

// 判断是否为 Mac 系统
const isMac = /macintosh|mac os x/i.test(navigator.userAgent)

// 处理快捷键保存
const handleKeyDown = (e) => {
  // Mac: Command + S
  // Windows: Ctrl + S
  if ((isMac ? e.metaKey : e.ctrlKey) && e.key.toLowerCase() === 's') {
    e.preventDefault() // 阻止浏览器默认保存行为
    save()
  }
}

// 添加和移除事件监听
onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
})

// 下拉菜单
const showToolsList = ref(false)
const showMoreList = ref(false)

const toggleToolsList = value => {
  showToolsList.value = value !== undefined ? value : !showToolsList.value
  hideAllList(showToolsList)
}

const toggleMoreList = value => {
  showMoreList.value = value !== undefined ? value : !showMoreList.value
  hideAllList(showMoreList)
}

const hideAllList = extra => {
  ;[showToolsList, showMoreList]
    .filter(item => item !== extra)
    .forEach(item => {
      item.value = false
    })
}

document.body.addEventListener('click', hideAllList)
onBeforeUnmount(() => {
  document.body.removeEventListener('click', hideAllList)
})

// github token
const githubToken = computed(() => {
  return store.state.githubToken
})

// 运行
const run = () => {
  proxy.$eventEmitter.emit('run')
  const layout = store.state.editData.config.layout
  if (layout === 'newWindowPreview') {
    proxy.$eventEmitter.emit('preview_window_run')
  }
}

const lastSaveTime = ref(0)
const SAVE_COOLDOWN = 2000

// 保存
const save = async () => {
  // 检查是否在冷却时间内
  const now = Date.now()
  if (now - lastSaveTime.value < SAVE_COOLDOWN) {
    ElMessage.warning('保存太频繁，请稍后再试')
    return
  }
  
  // 更新最后保存时间
  lastSaveTime.value = now

  // 在移动端下弹出标题确认框
  if (window.innerWidth <= 980) {
    const { value: title } = await ElMessageBox.prompt('请输入标题', '保存', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputValue: store.state.editData.title,
      inputValidator: value => {
        if (!value.trim()) {
          return '标题不能为空'
        }
        return true
      }
    })
    if (title && title.trim()) {
      store.commit('setCodeTitle', title.trim())
    }
  }

  if (!githubToken.value || route.name === 'LocalEdit') {
    // 未登录时保存到本地
    try {
      store.commit('setLoading', true)
      let fileData = createData()
      if (route.name === 'LocalEdit' && route.params.id) {
        await localDb.updateGist(Number(route.params.id), fileData)
      } else {
        const id = await localDb.saveGist(fileData)
        router.replace({
          name: 'LocalEdit',
          params: { id }
        })
      }
      store.commit('setLoading', false)
      ElMessage.success('保存成功')
    } catch (error) {
      if (error === 'cancel') return // 用户取消操作
      console.log(error)
      store.commit('setLoading', false)
      ElMessage.error('保存失败')
    }
    return
  }

  // 已登录时保存到 Gist
  try {
    store.commit('setLoading', true)
    let fileData = createData()
    let id = route.params.id
    let method = 'POST'
    let path = ''
    if (props.isEdit) {
      method = 'PATCH'
      path = '/' + id
      fileData.gist_id = id
    }
    let { data } = await request(`${method} /gists${path}`, fileData)
    store.commit('setLoading', false)
    ElMessage.success('保存成功，请注意：保存不是一个同步的过程！')
    router.replace({
      name: 'Edit',
      params: {
        id: data.id
      }
    })
  } catch (error) {
    if (error === 'cancel') return // 用户取消操作
    console.log(error)
    store.commit('setLoading', false)
    ElMessage.error('保存失败，请检查此token的权限是否包含创建gist')
  }
}

const createData = () => {
  let data = {
    description: store.state.editData.title,
    files: {},
    public: true
  }
  data.files['coderun.json'] = {
    content: JSON.stringify(store.state.editData)
  }
  return data
}

// 其他操作
const openSetting = () => emit('open-setting')
const openTemplate = () => emit('open-template')
const exportZipFile = () => {
  emit('export-zip')
  toggleToolsList(false)
}
const login = () => emit('login')
const logout = () => emit('logout')
const showMyGists = () => {
  if (githubToken.value === '') {
    emit('login')
    return
  }
  emit('show-gists')
}
const createNew = async () => {
  try {
    // 修改事件发送方式，使用回调函数接收结果
    const cleared = await new Promise(resolve => {
      proxy.$eventEmitter.emit('clear_all_code', result => {
        resolve(result)
      })
    })

    console.log('清空结果:', cleared) // 添加日志便于调试

    if (cleared) {
      router.replace({
        name: 'Editor',
        query: {
          blank: true
        }
      })

      toggleMoreList(false)

      ElMessage.success('创建新项目成功')
    }
  } catch (error) {
    console.error('创建新项目失败:', error)
    ElMessage.error('创建新项目失败')
  }
}
const createShareUrl = () => emit('create-share-url')
const createEmbedUrl = () => emit('create-embed-url')
const createEmbedCode = () => emit('create-embed-code')

// 普通的清空代码操作不需要等待结果
const clearAllCode = () => {
  proxy.$eventEmitter.emit('clear_all_code')
  toggleToolsList(false)
}

// 添加显示本地项目方法
const showLocalGists = () => {
  emit('show-local-gists')
  toggleMoreList(false)
}

// 提取生成 Markdown 内容的逻辑到单独的函数
const generateMarkdown = () => {
  const { title, code } = store.state.editData || {}

  // 如果没有数据，返回空字符串
  if (!code) {
    return ''
  }

  let markdown = `# ${title || '未命名代码'}\n\n`

  // 添加 HTML 代码块
  if (code.HTML?.content) {
    markdown += '## HTML\n\n```html\n'
    markdown += code.HTML.content
    markdown += '\n```\n\n'
  }

  // 添加 CSS 代码块
  if (code.CSS?.content) {
    markdown += '## CSS\n\n```css\n'
    markdown += code.CSS.content
    markdown += '\n```\n\n'
  }

  // 添加 JavaScript 代码块
  if (code.JS?.content) {
    markdown += '## JavaScript\n\n```javascript\n'
    markdown += code.JS.content
    markdown += '\n```\n\n'
  }

  // 如果是 Vue 布局，添加 Vue 代码块
  if (code.VUE?.content) {
    markdown += '## Vue\n\n```vue\n'
    markdown += code.VUE.content
    markdown += '\n```\n\n'
  }

  return markdown
}

// 导出 Markdown 文件
const exportMarkdown = () => {
  const markdown = generateMarkdown()

  // 如果没有任何代码内容，提示错误并返回
  if (
    !markdown ||
    markdown === `# ${store.state.editData?.title || '未命名代码'}\n\n`
  ) {
    ElMessage.error('没有可导出的代码内容')
    return
  }

  // 创建 Blob 对象
  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' })

  // 下载文件
  saveAs(blob, `${store.state.editData?.title || 'code'}.md`)

  // 关闭工具菜单
  toggleToolsList(false)

  // 提示成功
  ElMessage.success('Markdown 文件导出成功')
}

// 复制 Markdown 内容
const copyMarkdown = async () => {
  const markdown = generateMarkdown()

  // 如果没有任何代码内容，提示错误并返回
  if (
    !markdown ||
    markdown === `# ${store.state.editData?.title || '未命名代码'}\n\n`
  ) {
    ElMessage.error('没有可复制的代码内容')
    return
  }

  try {
    const success = await writeToClipboard(markdown)
    if (success) {
      toggleToolsList(false)
      ElMessage.success('Markdown 内容已复制到剪贴板')
    } else {
      throw new Error('所有复制方法都失败了')
    }
  } catch (err) {
    console.error('复制失败:', err)
    ElMessage.error('复制失败')
  }
}

// 在新窗口打开预览
const openPreviewInNewWindow = () => {
  try {
    let previewUrl = ''
    const isRelativePath = base === './'
    const baseUrl = isRelativePath
      ? window.location.origin
      : `${window.location.origin}${base}`

    // 如果路由有id参数(包括Edit和LocalEdit)
    if (route.params.id) {
      previewUrl = `${baseUrl}${
        routerMode === 'hash'
          ? '#/preview/' + route.params.id
          : 'preview/' + route.params.id
      }`
    }
    // 如果url有data查询参数
    else if (route.query.data) {
      // 重新编码data参数，确保与URL中的格式一致
      const encodedData = encodeURIComponent(route.query.data)
      previewUrl = `${baseUrl}${
        routerMode === 'hash'
          ? '#/preview/?data=' + encodedData
          : 'preview/?data=' + encodedData
      }`
    }
    // 其他情况
    else {
      ElMessage.info('当前状态无法预览，请先保存或分享')
      return
    }

    if (previewUrl) {
      window.open(previewUrl, '_blank')
      toggleMoreList(false)
    }
  } catch (error) {
    console.error('打开预览失败:', error)
    ElMessage.error('打开预览失败')
  }
}
</script>

<style scoped lang="less">
.right {
  display: flex;
  justify-content: flex-end;
  flex-shrink: 0;

  .dropdownBtn {
    position: relative;

    .btn {
      .icon {
        margin-right: 0;
      }
    }

    .toolList {
      position: absolute;
      right: 0;
      top: 50px;
      // width: 220px;
      min-width: 80px;
      max-width: 220px;
      padding: 10px 10px;
      white-space: nowrap;
      opacity: 0;
      visibility: hidden;
      background: var(--dropdown-background);
      border-radius: 6px 0 6px 6px;
      border: 1px solid var(--dropdown-box-border-color);
      transform: scale(0.5);
      transform-origin: top right;
      transition: all 0.2s ease-in-out;
      list-style: none;
      z-index: 12;

      @media screen and (max-width: 980px) {
        padding: 6px 6px;
        min-width: 70px;
      }

      &.show {
        opacity: 1;
        visibility: visible;
        transform: scale(1);
      }

      .divider {
        height: 1px;
        margin: 2px 0;
        // background-color: var(--dropdown-box-border-color);
        background-color: #d8d8d8;
        opacity: 0.15;
      }

      .toolItem {
        width: 100%;
        height: 30px;
        cursor: pointer;
        padding: 0 10px;
        line-height: 30px;
        color: var(--dropdown-color);
        font-size: 14px;

        @media screen and (max-width: 980px) {
          height: 28px;
          line-height: 28px;
          font-size: 12px;
          padding: 0 8px;
        }

        &:hover {
          background: var(--dropdown-hover-background);
          color: var(--dropdown-hover-color);
        }
      }
    }
  }

  .btn {
    background: var(--header-btn-background);
    border: 1px solid var(--header-btn-border-color);
    color: var(--header-btn-color);
    min-width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0px 14px;
    margin: 0 10px 0 0;
    position: relative;
    border-radius: 4px;
    text-overflow: ellipsis;
    text-decoration: none !important;
    font-weight: 400 !important;
    cursor: pointer;
    transition: all 0.3s;
    opacity: 0.7;
    user-select: none;
    font-size: 14px;

    @media screen and (max-width: 980px) {
      min-width: 32px;
      height: 32px;
      padding: 0 10px;
      margin: 0 6px 0 0;
      font-size: 12px;

      .icon {
        font-size: 12px;
      }
    }

    &:hover {
      opacity: 1;
    }

    &:active {
      transform: translateY(1px);
    }

    .icon {
      margin-right: 5px;

      @media screen and (max-width: 980px) {
        margin-right: 3px;
      }
    }
  }
}
</style>
