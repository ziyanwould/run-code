<template>
  <div class="setting-initial-code">
    <div class="setting-section">
      <div class="setting-header">
        <h3>初始代码设置</h3>
        <div class="setting-actions">
          <el-button size="small" @click="handleClearAll">清空代码</el-button>
          <el-button size="small" type="primary" @click="handleResetDefault"
            >恢复默认</el-button
          >
        </div>
      </div>

      <div class="code-editors">
        <div
          v-for="type in ['HTML', 'CSS', 'JS']"
          :key="type"
          class="code-editor-item"
        >
          <div class="editor-header">{{ type }}</div>
          <el-input
            v-model="codeContent[type]"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 2 }"
            :placeholder="`请输入${type}初始代码`"
            resize="vertical"
            @change="val => handleCodeChange(type, val)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { ElMessageBox, ElMessage, ElButton, ElInput } from 'element-plus'
import defaltCode from '@/config/defaltCode'

const store = useStore()
const codeContent = ref({
  HTML: defaltCode.HTML.content,
  CSS: defaltCode.CSS.content,
  JS: defaltCode.JS.content
})

// 初始化代码内容
onMounted(() => {
  try {
    const savedInitialCode = localStorage.getItem('codeRun:initialCode')
    if (savedInitialCode) {
      const parsedCode = JSON.parse(savedInitialCode)
      Object.keys(codeContent.value).forEach(type => {
        codeContent.value[type] = parsedCode[type].content
      })
    } else {
      Object.keys(codeContent.value).forEach(type => {
        codeContent.value[type] = defaltCode[type].content
      })
    }
  } catch (e) {
    console.error('初始化代码内容失败:', e)
  }
})

// 代码变更处理
const handleCodeChange = (type, content) => {
  store.commit('setInitialCode', { type, content })
}

// 清空所有代码
const handleClearAll = async () => {
  try {
    await ElMessageBox.confirm('确定要清空所有初始代码吗？', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    Object.keys(codeContent.value).forEach(type => {
      codeContent.value[type] = ''
      store.commit('setInitialCode', { type, content: '' })
    })

    ElMessage.success('已清空所有代码')
  } catch {
    // 用户取消操作
  }
}

// 恢复默认代码
const handleResetDefault = async () => {
  try {
    await ElMessageBox.confirm('确定要恢复默认代码吗？', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    store.commit('resetInitialCode')
    Object.keys(codeContent.value).forEach(type => {
      codeContent.value[type] = defaltCode[type].content
    })

    ElMessage.success('已恢复默认代码')
  } catch {
    // 用户取消操作
  }
}
</script>

<style scoped lang="less">
.setting-initial-code {
  width: 100%;
  height: 100%;

  .setting-section {
    margin-bottom: 20px;
    width: 100%;
  }

  .setting-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h3 {
      margin: 0;
      color: var(--el-text-color-primary);
    }

    .setting-actions {
      display: flex;
      gap: 10px;
    }
  }

  .code-editors {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;

    .code-editor-item {
      width: 100%;

      .editor-header {
        margin-bottom: 8px;
        color: var(--el-text-color-secondary);
        font-weight: 500;
      }
    }
  }
}
</style>
