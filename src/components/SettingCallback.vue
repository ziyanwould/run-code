<template>
  <div class="setting-callback">
    <div class="setting-section">
      <div class="setting-header">
        <h3>保存回调设置</h3>
        <div class="setting-actions">
          <el-button size="small" @click="handleClear">清空脚本</el-button>
          <el-button size="small" type="primary" @click="handleTest">测试运行</el-button>
        </div>
      </div>

      <div class="callback-editor">
        <el-input
          v-model="callbackScript"
          type="textarea"
          :rows="10"
          :placeholder="placeholder"
          @change="handleScriptChange"
        />
      </div>

      <div class="callback-tips">
        <p>说明:</p>
        <ul>
          <li>脚本将在保存成功后执行，以便跟外部系统联动或拓展个性化能力</li>
          <li>可以通过 saveInfo 参数获取保存相关信息:</li>
          <li>- type: 保存类型 ('local'/'gist')</li>
          <li>- id: 保存后的ID</li>
          <li>- data: 完整的保存数据</li>
          <li>- mode: 保存模式 ('create'/'update')</li>
          <li>- routeName: 路由名称</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox, ElInput, ElButton } from 'element-plus'

const store = useStore()

const placeholder = `// 示例脚本:
function onSaveSuccess(saveInfo) {
  const { type, id, data, mode } = saveInfo
  console.log('保存类型:', type)
  console.log('保存ID:', id)
  
  // 可以执行自定义操作
  if (type === 'gist') {
    // 处理 Gist 保存
    console.log('Gist保存成功，ID:', id)
  } else {
    // 处理本地保存
    console.log('本地保存成功，ID:', id)
  }
}

// 或者直接编写代码:
console.log('保存成功:', saveInfo.type, saveInfo.id);
`

const callbackScript = ref(store.state.privateConfig.saveCallback || '')

const handleScriptChange = (value) => {
  store.commit('setSaveCallback', value)
}

const handleClear = async () => {
  try {
    await ElMessageBox.confirm('确定要清空回调脚本吗？', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    callbackScript.value = ''
    store.commit('setSaveCallback', '')
    ElMessage.success('已清空回调脚本')
  } catch {
    // 用户取消操作
  }
}

const handleTest = () => {
  try {
    const testSaveInfo = {
      type: 'local',
      id: 'test-id',
      data: { title: 'Test' },
      mode: 'create',
      routeName: 'LocalEdit'
    }
    
    const scriptContent = callbackScript.value.trim()
    if (!scriptContent) {
      ElMessage.warning('脚本内容为空')
      return
    }

    // 直接执行测试代码
    const fn = new Function('saveInfo', 'console', 'alert', `
      try {
        ${scriptContent}
        
        if (typeof onSaveSuccess === 'function') {
          onSaveSuccess(saveInfo);
        }
      } catch (error) {
        console.error('回调执行错误:', error);
        throw error;
      }
    `)

    fn(testSaveInfo, console, alert)
    ElMessage.success('测试运行成功')
  } catch (error) {
    ElMessage.error(`测试运行失败: ${error.message}`)
  }
}
</script>

<style scoped lang="less">
.setting-callback {
  .setting-section {
    margin-bottom: 20px;
  }

  .setting-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;

    h3 {
      margin: 0;
      color: var(--header-logo-color);
    }
  }

  .callback-editor {
    margin-bottom: 15px;

    :deep(.el-textarea__inner) {
      font-family: monospace;
      background-color: var(--editor-background);
      color: var(--dropdown-color);
      border-color: var(--editor-header-border-bottom-color);
    }
  }

  .callback-tips {
    font-size: 12px;
    color: var(--dropdown-color);
    opacity: 0.8;

    ul {
      padding-left: 20px;
      margin: 5px 0;
    }
  }
}
</style>
