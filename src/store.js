import { createStore } from 'vuex'
import { generateUUID, atou } from '@/utils'
import { create, request } from '@/utils/octokit'
import { ElMessage } from 'element-plus'
// 存储github token的本地存储的key
const githubTokenSaveKey = 'codeRun:githubToken'
// 添加配置存储key
const configSaveKey = 'codeRun:config'

// 默认配置常量
const DEFAULT_CONFIG = {
  codeTheme: 'OneDarkPro',
  pageThemeSyncCodeTheme: false,
  openAlmightyConsole: false,
  autoRun: true,
  layout: 'default',
  keepPreviousLogs: true,
  codeFontSize: 16
}

// 从localStorage获取保存的配置
const getSavedConfig = () => {
  try {
    const savedConfig = localStorage.getItem(configSaveKey)
    return savedConfig ? JSON.parse(savedConfig) : null
  } catch (e) {
    console.error('读取配置失败:', e)
    return null
  }
}

// 生成默认编辑数据
const createDefaultData = () => {
  // 获取保存的配置
  const savedConfig = getSavedConfig()
  
  return {
    config: savedConfig || { ...DEFAULT_CONFIG },
    title: '未命名',
    code: {
      HTML: {
        language: 'html',
        content: ``
      },
      CSS: {
        language: 'css',
        content: ``,
        resources: []
      },
      JS: {
        language: 'javascript',
        content: ``,
        resources: []
      },
      VUE: {
        language: 'vue2',
        content: ``,
        resources: []
      }
    }
  }
}

const store = createStore({
  state() {
    return {
      uuid: generateUUID(),
      editData: createDefaultData(),
      githubToken: '',
      previewDoc: ''
    }
  },
  mutations: {
    /**
     * @Desc: 设置编辑数据
     */
    setEditData(state, data) {
      state.editData = data
    },

    /**
     * @Desc: 设置代码内容
     */
    setCodeContent(state, { type, code }) {
      state.editData.code[type].content = code
    },

    /**
     * @Desc: 设置代码预处理器
     */
    setCodePreprocessor(state, { type, preprocessor }) {
      state.editData.code[type].language = preprocessor
    },

    /**
     * @Desc: 设置资源
     */
    setCodeResource(state, { type, resources }) {
      state.editData.code[type].resources = resources
    },

    /**
     * @Desc: 设置import map
     */
    setImportMap(state, importMap) {
      state.editData.code.JS.importMap = importMap
    },

    /**
     * @Desc: 设置代码数据
     */
    setCode(state, data) {
      state.editData.code = data
    },

    /**
     * @Desc: 设置代码主题
     */
    setCodeTheme(state, theme) {
      state.editData.config.codeTheme = theme
      this.commit('saveConfig')
    },

    /**
     * @Desc: 设置自动运行的状态
     */
    setAutoRun(state, autoRun) {
      state.editData.config.autoRun = autoRun
      this.commit('saveConfig')
    },

    /**
     * @Desc: 设置全能调试
     */
    setOpenAlmightyConsole(state, openAlmightyConsole) {
      state.editData.config.openAlmightyConsole = openAlmightyConsole
      this.commit('saveConfig')
    },

    /**
     * @Desc: 设置布局
     */
    setLayout(state, layout) {
      state.editData.config.layout = layout
      this.commit('saveConfig')
    },

    /**
     * @Desc: 设置是否保留之前的日志
     */
    setKeepPreviousLogs(state, keepPreviousLogs) {
      state.editData.config.keepPreviousLogs = keepPreviousLogs
      this.commit('saveConfig')
    },

    /**
     * @Desc: 设置编辑器字号
     */
    setCodeFontSize(state, codeFontSize) {
      state.editData.config.codeFontSize = codeFontSize
      this.commit('saveConfig')
    },

    setPageThemeSyncCodeTheme(state, pageThemeSyncCodeTheme) {
      state.editData.config.pageThemeSyncCodeTheme = pageThemeSyncCodeTheme
      this.commit('saveConfig')
    },

    setGithubToken(state, githubToken) {
      state.githubToken = githubToken || ''
      create(githubToken)
    },

    setCodeTitle(state, title) {
      state.editData.title = title
    },

    setPreviewDoc(state, previewDoc) {
      state.previewDoc = previewDoc
    },

    // 保存配置到localStorage
    saveConfig(state) {
      try {
        localStorage.setItem(configSaveKey, JSON.stringify(state.editData.config))
      } catch (e) {
        console.error('保存配置失败:', e)
      }
    },

    // 添加重置配置的mutation
    resetToDefaultSettings(state) {
      state.editData.config = { ...DEFAULT_CONFIG }
      this.commit('saveConfig')
    }
  },
  actions: {
    getData(ctx, { id, data }) {
      return new Promise(async (resolve, reject) => {
        try {
          let parseData = createDefaultData()
          if (id) {
            let { data } = await request(`GET /gists/${id}`, {
              gist_id: id
            })
            parseData = JSON.parse(data.files['coderun.json'].content)
          } else if (data) {
            parseData = JSON.parse(atou(data))
          }
          ctx.commit('setEditData', parseData)
          resolve()
        } catch (e) {
          console.log(e)
          ElMessage.error('请求失败')
          reject(e)
        }
      })
    },

    saveGithubToken(ctx, githubToken) {
      ctx.commit('setGithubToken', githubToken)
      if (githubToken) {
        localStorage.setItem(githubTokenSaveKey, githubToken)
      } else {
        localStorage.removeItem(githubTokenSaveKey)
      }
    },

    getGithubToken(ctx) {
      let githubToken = localStorage.getItem(githubTokenSaveKey)
      ctx.commit('setGithubToken', githubToken)
    },
    
    clearAllCode(ctx) {
      const currentData = JSON.parse(JSON.stringify(ctx.state.editData))
      
      Object.keys(currentData.code).forEach(key => {
        currentData.code[key].content = ''
      })
      
      ctx.commit('setEditData', currentData)
      
      return Promise.resolve()
    }
  }
})

export default store
