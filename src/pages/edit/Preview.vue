<template>
  <div class="previewContainer">
    <Drag
      :number="showConsole ? 2 : 1"
      dir="v"
      :config="
        showConsole ? [{ min: 0 }, { min: 48, default: 48 }] : [{ min: 0 }]
      "
    >
      <DragItem :index="0" :disabled="true" :showTouchBar="false">
        <Preview ref="previewRef"></Preview>
      </DragItem>
      <DragItem v-if="showConsole" :index="1" :disabled="false" title="控制台">
        <Console></Console>
      </DragItem>
    </Drag>
  </div>
</template>

<script setup>
import Preview from '@/components/Preview.vue'
import Console from '@/components/Console.vue'
import Drag from '@/components/Drag.vue'
import DragItem from '@/components/DragItem.vue'
import { defaultViewThemeConfig } from '@/config/constants'
import { getThemeValue } from '@/utils'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { onMounted, ref, computed, watch, nextTick } from 'vue'
import { localDb } from '@/utils/localDb'
import { ElMessage } from 'element-plus'
import nprogress from 'nprogress'

const store = useStore()
const route = useRoute()
const previewRef = ref(null)

// 计算是否显示控制台
const showConsole = computed(() => {
  // 如果不是作为路由使用（没有route.name），或者既没有id也没有data参数，则显示控制台
  return !route.name || (!route.params.id && !route.query.data)
})

// 数据获取逻辑
const getData = async () => {
  if (route.name !== 'Preview' || (!route.params.id && !route.query.data)) {
    return
  }

  try {
    nprogress.start()

    let parseData = null

    if (route.params.id) {
      try {
        const localData = await localDb.getGist(Number(route.params.id))
        if (localData) {
          parseData = JSON.parse(localData.files['coderun.json'].content)
          await store.commit('setEditData', parseData)
        }
      } catch (error) {
        console.error('本地存储数据解析失败:', error)
      }
    }

    if (!parseData) {
      await store.dispatch('getData', {
        id: route.params.id,
        data: route.query.data
      })
    }

    // 等待 store 更新完成
    await nextTick()

    if (previewRef.value) {
      previewRef.value.forceRerender()

      await nextTick()

      setTimeout(async () => {
        await previewRef.value.run(true)
      }, 100)
    }

    nprogress.done()
  } catch (error) {
    console.error(error)
    nprogress.done()
    ElMessage.error('获取数据失败')
  }
}

// 界面主题处理
const useTheme = () => {
  let pageThemeSyncCodeTheme = true
  let themeData = null
  const updateTheme = () => {
    Object.keys(defaultViewThemeConfig).forEach(item => {
      document.documentElement.style.setProperty(
        item,
        getThemeValue(item, themeData, pageThemeSyncCodeTheme)
      )
    })
  }
  updateTheme()
  window.addEventListener('message', ({ data = {} }) => {
    if (data.type === 'preview') {
      pageThemeSyncCodeTheme = data.data.config.pageThemeSyncCodeTheme
      themeData = data.data.config.themeData
      updateTheme()
    }
  })
}

onMounted(() => {
  getData()
})

// 优化路由监听，确保数据变化时重新获取
watch(
  () => ({
    id: route.params.id,
    data: route.query.data
  }),
  async (newVal, oldVal) => {
    if (newVal.id !== oldVal.id || newVal.data !== oldVal.data) {
      await getData()
    }
  }
)

useTheme()
</script>

<style scoped lang="less">
.previewContainer {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
</style>
