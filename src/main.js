import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { eventBus } from './utils/eventBus'
import { createShortcutHandler } from './config/shortcuts'
import './assets/style/monolisa.css'
import 'element-plus/dist/index.css'
import './assets/style/element-theme.less'
import { ElLoadingDirective } from 'element-plus'
import 'nprogress/nprogress.css'
import './assets/iconfont/iconfont.css'

const create = () => {
  const app = createApp(App)
  
  // 将 eventBus 挂载到 app.config.globalProperties
  app.config.globalProperties.$eventEmitter = eventBus
  
  // 使用 eventBus 注册全局快捷键处理器
  document.addEventListener('keydown', createShortcutHandler(eventBus))

  app.use(router)
  app.use(store)
  app.directive('loading', ElLoadingDirective)
  app.mount('#app')
}

const init = () => {
  store.dispatch('getGithubToken')
  create()
}
init()
