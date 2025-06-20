import Edit from '@/pages/edit/Index.vue'
import Preview from '@/pages/edit/Preview.vue'
import Embed from '@/pages/embed/Index.vue'
import AuthPage from '@/components/AuthPage.vue' // 导入授权页面组件
import {
  createRouter,
  createWebHistory,
  createWebHashHistory
} from 'vue-router'
import { routerMode, base } from './config'

const routes = [
  {
    path: '/auth', // 添加授权页面路由
    name: 'Auth',
    component: AuthPage
  },
  {
    path: '/',
    name: 'Editor',
    component: Edit,
    meta: { requiresAuth: true } // 标记此路由需要授权
  },
  {
    path: '/:id',
    name: 'Edit',
    component: Edit,
    meta: { requiresAuth: true } // 标记此路由需要授权
  },
  {
    path: '/share/:id?',
    name: 'Share',
    component: Preview,
    props: true,
    meta: { requiresAuth: true } // 标记此路由需要授权 (根据需求，分享页面是否也需要授权)
  },
  {
    path: '/preview/:id?',
    name: 'Preview',
    component: Preview,
    props: true,
    meta: { requiresAuth: true } // 标记此路由需要授权 (根据需求，预览页面是否也需要授权)
  },
  {
    path: '/embed/:id',
    name: 'Embed',
    component: Embed,
    meta: { requiresAuth: true } // 标记此路由需要授权
  },
  {
    path: '/embed/',
    name: 'QueryEmbed',
    component: Embed,
    meta: { requiresAuth: true } // 标记此路由需要授权
  },
  // 添加本地编辑路由
  {
    path: '/local/:id',
    name: 'LocalEdit',
    component: Edit,
    meta: { requiresAuth: true } // 标记此路由需要授权
  }
]

const router = createRouter({
  history:
    routerMode === 'hash' ? createWebHashHistory(base) : createWebHistory(base),
  routes
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  const isAuthorized = sessionStorage.getItem('isAuthorized') === 'true';
  // 检查路由是否需要授权
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthorized) {
      // 如果用户未授权，并且目标路由不是Auth页面本身（防止无限重定向）
      if (to.name !== 'Auth') {
        next({ name: 'Auth' }); // 重定向到授权页面
      } else {
        next(); // 如果已经是Auth页面，则允许访问
      }
    } else {
      next(); // 如果已授权，则允许访问
    }
  } else {
    // 如果路由不需要授权，或者用户已授权且要访问Auth页面（例如手动输入/auth），则允许访问
    // 如果已授权，并且用户尝试访问 /auth 页面，可以考虑重定向到首页
    if (isAuthorized && to.name === 'Auth') {
      next({ name: 'Editor' });
    } else {
      next();
    }
  }
});

export default router
