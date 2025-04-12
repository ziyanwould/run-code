import Edit from '@/pages/edit/Index.vue'
import Preview from '@/pages/edit/Preview.vue'
import Embed from '@/pages/embed/Index.vue'
import {
  createRouter,
  createWebHistory,
  createWebHashHistory
} from 'vue-router'
import { routerMode, base } from './config'

const routes = [
  {
    path: '/',
    name: 'Editor',
    component: Edit
  },
  {
    path: '/:id',
    name: 'Edit',
    component: Edit
  },
  {
    path: '/share/:id',
    name: 'Share',
    component: Edit
  },
  {
    path: '/preview/:id?',  // 添加可选的id参数
    name: 'Preview',
    component: Preview,
    props: true  // 允许将路由参数作为props传递给组件
  },
  {
    path: '/embed/:id',
    name: 'Embed',
    component: Embed
  },
  {
    path: '/embed/',
    name: 'QueryEmbed',
    component: Embed
  },
  // 添加本地编辑路由
  {
    path: '/local/:id',
    name: 'LocalEdit',
    component: Edit
  }
]

const router = createRouter({
  history:
    routerMode === 'hash' ? createWebHashHistory(base) : createWebHistory(base),
  routes
})

export default router
