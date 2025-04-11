<template>
  <div class="right">
    <div class="btn" @click="openSetting">
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
        <li class="toolItem" @click="createShareUrl" v-if="isEdit">
          生成分享链接
        </li>
        <li class="toolItem" @click="createEmbedUrl" v-if="isEdit">
          生成嵌入链接
        </li>
        <li class="toolItem" @click="createEmbedCode" v-if="isEdit">
          生成嵌入代码
        </li>
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
        <li class="toolItem" @click="createNew">创建新项目</li>
        <li class="toolItem" @click="showMyGists">我的gist</li>
        <li class="toolItem" @click="showLocalGists">本地项目</li>
        <li class="toolItem" @click="githubToken ? logout() : login()">
          {{ githubToken ? '退出' : '登录' }}
        </li>
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
  defineEmits
} from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { request } from '@/utils/octokit'
import { localDb } from '@/utils/localDb'

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

// 保存
const save = async () => {
  if (githubToken.value === '') {
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
    const cleared = await new Promise((resolve) => {
      proxy.$eventEmitter.emit('clear_all_code', (result) => {
        resolve(result)
      })
    })
    
    console.log('清空结果:', cleared) // 添加日志便于调试
    
    if (cleared) {
      router.replace({
        name: 'Editor',
        query: {}
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
</script>

<style scoped lang="less">
.right {
  display: flex;
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
      width: 220px;
      padding: 10px 0;
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
      z-index: 2;

      &.show {
        opacity: 1;
        visibility: visible;
        transform: scale(1);
      }

      .toolItem {
        width: 100%;
        height: 30px;
        cursor: pointer;
        padding: 0 10px;
        line-height: 30px;
        color: var(--dropdown-color);
        font-size: 14px;

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

    &:hover {
      opacity: 1;
    }

    &:active {
      transform: translateY(1px);
    }

    .icon {
      margin-right: 5px;
    }
  }
}
</style>
