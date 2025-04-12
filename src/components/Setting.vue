<template>
  <div>
    <div class="settingRow">
      <div class="content">
        <span class="name">自动运行</span>
        <div class="control">
          <el-switch v-model="autoRun" @change="autoRunChange"></el-switch>
        </div>
      </div>
      <div class="desc">停止输入后1秒自动运行</div>
    </div>
    <div class="settingRow">
      <div class="content">
        <span class="name">保留之前的日志</span>
        <div class="control">
          <el-switch
            v-model="keepPreviousLogs"
            @change="keepPreviousLogsChange"
          ></el-switch>
        </div>
      </div>
      <div class="desc">关闭后每次重新运行都会清空日志</div>
    </div>
    <div class="settingRow">
      <div class="content">
        <span class="name">开启全能调试</span>
        <div class="control">
          <el-switch
            v-model="openAlmightyConsole"
            @change="openAlmightyConsoleChange"
          ></el-switch>
        </div>
      </div>
      <div class="desc">
        预览页面右下角会出现一个按钮，点击即可打开全能调试控制台
      </div>
    </div>
    
    <!-- 添加恢复默认设置按钮 -->
    <div class="settingRow resetSection">
      <el-button type="danger" @click="handleResetSettings">恢复默认设置</el-button>
      <div class="desc">将所有设置恢复到默认状态</div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useStore } from 'vuex'
import { ElSwitch, ElButton, ElMessageBox, ElMessage } from 'element-plus'

// hooks定义部分

// 初始化
const useInit = () => {
  const store = useStore()
  return {
    store,
    config: store.state.editData.config
  }
}

// 保留日志设置
const usePreviousLogs = ({ store, config }) => {
  // 保留之前的日志
  const keepPreviousLogs = ref(false)
  keepPreviousLogs.value = config.keepPreviousLogs
  watch(
    () => {
      return config.keepPreviousLogs
    },
    value => {
      keepPreviousLogs.value = value
    }
  )

  // 切换是否保留之前的日志
  const keepPreviousLogsChange = e => {
    store.commit('setKeepPreviousLogs', e)
  }

  return {
    keepPreviousLogs,
    keepPreviousLogsChange
  }
}

// 自动运行设置
const useAutoRun = ({ store, config }) => {
  // 自动运行
  const autoRun = ref(false)
  autoRun.value = config.autoRun
  watch(
    () => {
      return config.autoRun
    },
    value => {
      autoRun.value = value
    }
  )

  // 切换自动运行
  const autoRunChange = e => {
    store.commit('setAutoRun', e)
  }

  return {
    autoRun,
    autoRunChange
  }
}

// 全能调试设置
const useAlmightyConsole = ({ store, config }) => {
  // 开启全能调试
  const openAlmightyConsole = ref(false)
  openAlmightyConsole.value = config.openAlmightyConsole
  watch(
    () => {
      return config.openAlmightyConsole
    },
    value => {
      openAlmightyConsole.value = value
    }
  )

  // 切换全能调试
  const openAlmightyConsoleChange = e => {
    store.commit('setOpenAlmightyConsole', e)
  }

  return {
    openAlmightyConsole,
    openAlmightyConsoleChange
  }
}

const useResetSettings = ({ store }) => {
  const handleResetSettings = async () => {
    try {
      await ElMessageBox.confirm(
        '确定要将所有设置恢复到默认状态吗？此操作不可撤销。',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
      
      store.commit('resetToDefaultSettings')
      ElMessage.success('已恢复默认设置')
    } catch {
      // 用户取消操作，不做任何处理
    }
  }

  return {
    handleResetSettings
  }
}

// created部分
const { store, config } = useInit()
const { keepPreviousLogs, keepPreviousLogsChange } = usePreviousLogs({
  store,
  config
})
const { autoRun, autoRunChange } = useAutoRun({ store, config })
const { openAlmightyConsole, openAlmightyConsoleChange } = useAlmightyConsole({
  store,
  config
})
const { handleResetSettings } = useResetSettings({ store })
</script>

<style scoped lang="less">
.settingRow {
  margin-bottom: 20px;

  .content {
    display: flex;
    align-items: center;

    .name {
      margin-right: 10px;
      color: var(--dropdown-color);
    }
  }

  .desc {
    font-size: 12px;
    color: var(--editor-header-color);
    margin-top: 5px;
  }
}

.resetSection {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid var(--editor-header-border-bottom-color);
}
</style>
