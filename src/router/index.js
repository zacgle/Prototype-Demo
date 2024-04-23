import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/topology/index'
    // children: [
    //   {
    //     path: 'dashboard',
    //     component: () => import('@/views/dashboard/index'),
    //     name: 'Dashboard',
    //     meta: { title: 'Dashboard', icon: 'dashboard' }
    //   }
    // ]
  },
  // {
  //   path: '/documentation',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/documentation/index'),
  //       name: 'Documentation',
  //       meta: { title: 'Documentation', icon: 'documentation' }
  //     }
  //   ]
  // },
  // {
  //   path: '/guide',
  //   component: Layout,
  //   redirect: '/guide/index',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/guide/index'),
  //       name: 'Guide',
  //       meta: { title: 'Guide', icon: 'guide', noCache: true }
  //     }
  //   ]
  // },
  // {
  //   path: '/profile',
  //   component: Layout,
  //   redirect: '/profile/index',
  //   hidden: true,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/profile/index'),
  //       name: 'Profile',
  //       meta: { title: 'Profile', icon: 'user', noCache: true }
  //     }
  //   ]
  // },
  // {
  //   path: '/topology',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/topology/index'),
  //       name: '网络控制台',
  //       meta: { title: '网络控制台', icon: 'excel', noCache: true, explanation: '管理原型网络的创建、删除、连接、断开等操作，制造模拟网络故障。' }
  //     }
  //   ]
  // },
  {
    path: '/topology',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/topology/index'),
        name: '网络控制台',
        meta: { title: '网络控制台', icon: 'excel', noCache: true, explanation: '管理原型网络的创建、删除、连接、断开等操作，制造模拟网络故障。' }
      }
    ],
    name: '管理原型网络的创建、删除、连接、断开等操作，制造模拟网络故障。',
    meta: { title: '网络控制台', icon: 'excel', noCache: true, explanation: '管理原型网络的创建、删除、连接、断开等操作，制造模拟网络故障。' }

  },
  {
    path: '/nodes',
    component: Layout,
    children: [{
      path: 'index',
      component: () => import('@/views/nodes/index'),
      name: '节点信息查询',
      meta: { title: '节点信息查询', icon: 'excel', noCache: true, explanation: '查询原型网络中的节点信息，包括节点的名称、类型、位置、状态等。' }
    }],
    name: '查询原型网络中的节点信息，包括节点的名称、类型、位置、状态等。',
    meta: { title: '节点信息查询', icon: 'excel', noCache: true, explanation: '查询原型网络中的节点信息，包括节点的名称、类型、位置、状态等。' }
  },
  {
    path: '/intent',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/intention/index'),
        name: '意图控制网络',
        meta: { title: '意图控制网络', icon: 'excel', noCache: true, explanation: '通过意图控制网络，实现网络资源自动化编排。' }
      }
    ],
    name: '通过意图控制网络，实现网络资源自动化编排。',
    meta: { title: '意图控制网络', icon: 'excel', noCache: true, explanation: '通过意图控制网络，实现网络资源自动化编排。' }
  },
  {
    path: '/slicing',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/slicing/index'),
        name: '网络资源编排',
        meta: { title: '网络资源编排', icon: 'excel', noCache: true, explanation: '对网络资源进行编排，实现网络切片的创建、删除、等操作，并可监控网络关键指标' }
      }
    ],
    name: '对网络资源进行编排，实现网络切片的创建、删除、等操作，并可监控网络关键指标。',
    meta: { title: '网络资源编排', icon: 'excel', noCache: true, explanation: '对网络资源进行编排，实现网络切片的创建、删除、等操作，并可监控网络关键指标' }
  },
  {
    path: '/knowledge',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/knowledge/index'),
        name: '知识空间展示',
        meta: { title: '知识空间展示', icon: 'excel', noCache: true, explanation: '展示网络各类知识。' }
      }
    ],
    name: '展示网络各类知识。',
    meta: { title: '知识空间展示', icon: 'excel', noCache: true, explanation: '展示网络各类知识。' }
  },
  {
    path: '/policy',
    component: Layout,
    children: [{
      path: 'index',
      component: () => import('@/views/policy/index'),
      name: '策略验证演示',
      meta: { title: '策略验证演示', icon: 'excel', noCache: true, explanation: '演示网络策略的验证，及验证过程的回溯。' }
    }],
    name: '演示网络策略的验证，及验证过程的回溯。',
    meta: { title: '策略验证演示', icon: 'excel', noCache: true, explanation: '演示网络策略的验证，及验证过程的回溯。' }
  },

  {
    path: '/anomaly',
    component: Layout,
    name: '网络异常检测模拟及解决',
    children: [
      {
        path: 'index',
        component: () => import('@/views/demos/aiops'),
        name: 'AIOPS展示',
        meta: {
          title: '网络故障仿真', icon: 'excel', noCache: true
        }
      }],
    meta: { title: '网络异常检测模拟及解决', icon: 'excel', noCache: true, explanation: '展示网络异常检测模拟及解决。' }
  },
  {
    path: '/demos',
    component: Layout,
    name: '展示6G典型应用场景，包括XR、无人机、AIOPS等。',
    children: [
      {
        path: 'vr',
        component: () => import('@/views/vr/index'),
        name: 'XR展示',
        meta: {
          title: '全景视频', icon: 'excel', noCache: true }
      },
      { path: 'meeting',
        component: () => import('@/views/meeting/index'),
        name: '无人机展示',
        meta: {
          title: '沉浸式会议', icon: 'excel', noCache: true
        }
      },
      // { path: 'digibot',
      //   component: () => import('@/views/digital-robot/index'),
      //   name: '数字人展示',
      //   meta: {
      //     title: '数字人展示', icon: 'excel', noCache: true
      //   }
      // },
      { path: 'drone',
        component: () => import('@/views/demos/drone'),
        name: '无人机展示',
        meta: {
          title: '无人机演示', icon: 'excel', noCache: true
        }
      }
    ],
    meta: { title: '典型应用', icon: 'excel', noCache: true, explanation: '展示6G典型应用场景，包括XR、无人机、AIOPS等。' }
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  // {
  //   path: '/permission',
  //   component: Layout,
  //   redirect: '/permission/page',
  //   alwaysShow: true, // will always show the root menu
  //   name: 'Permission',
  //   meta: {
  //     title: 'Permission',
  //     icon: 'lock',
  //     roles: ['admin', 'editor'] // you can set roles in root nav
  //   },
  //   children: [
  //     {
  //       path: 'page',
  //       component: () => import('@/views/permission/page'),
  //       name: 'PagePermission',
  //       meta: {
  //         title: 'Page Permission',
  //         roles: ['admin'] // or you can only set roles in sub nav
  //       }
  //     },
  //     {
  //       path: 'directive',
  //       component: () => import('@/views/permission/directive'),
  //       name: 'DirectivePermission',
  //       meta: {
  //         title: 'Directive Permission'
  //         // if do not set roles, means: this page does not require permission
  //       }
  //     },
  //     {
  //       path: 'role',
  //       component: () => import('@/views/permission/role'),
  //       name: 'RolePermission',
  //       meta: {
  //         title: 'Role Permission',
  //         roles: ['admin']
  //       }
  //     }
  //   ]
  // },

  // {
  //   path: '/icon',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/icons/index'),
  //       name: 'Icons',
  //       meta: { title: 'Icons', icon: 'icon', noCache: true }
  //     }
  //   ]
  // },

  // /** when your routing map is too long, you can split it into small modules **/
  // componentsRouter,
  // chartsRouter,
  // nestedRouter,
  // tableRouter,

  // {
  //   path: '/example',
  //   component: Layout,
  //   redirect: '/example/list',
  //   name: 'Example',
  //   meta: {
  //     title: 'Example',
  //     icon: 'el-icon-s-help'
  //   },
  //   children: [
  //     {
  //       path: 'create',
  //       component: () => import('@/views/example/create'),
  //       name: 'CreateArticle',
  //       meta: { title: 'Create Article', icon: 'edit' }
  //     },
  //     {
  //       path: 'edit/:id(\\d+)',
  //       component: () => import('@/views/example/edit'),
  //       name: 'EditArticle',
  //       meta: { title: 'Edit Article', noCache: true, activeMenu: '/example/list' },
  //       hidden: true
  //     },
  //     {
  //       path: 'list',
  //       component: () => import('@/views/example/list'),
  //       name: 'ArticleList',
  //       meta: { title: 'Article List', icon: 'list' }
  //     }
  //   ]
  // },

  // {
  //   path: '/tab',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/tab/index'),
  //       name: 'Tab',
  //       meta: { title: 'Tab', icon: 'tab' }
  //     }
  //   ]
  // },

  // {
  //   path: '/error',
  //   component: Layout,
  //   redirect: 'noRedirect',
  //   name: 'ErrorPages',
  //   meta: {
  //     title: 'Error Pages',
  //     icon: '404'
  //   },
  //   children: [
  //     {
  //       path: '401',
  //       component: () => import('@/views/error-page/401'),
  //       name: 'Page401',
  //       meta: { title: '401', noCache: true }
  //     },
  //     {
  //       path: '404',
  //       component: () => import('@/views/error-page/404'),
  //       name: 'Page404',
  //       meta: { title: '404', noCache: true }
  //     }
  //   ]
  // },

  // {
  //   path: '/error-log',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'log',
  //       component: () => import('@/views/error-log/index'),
  //       name: 'ErrorLog',
  //       meta: { title: 'Error Log', icon: 'bug' }
  //     }
  //   ]
  // },

  // {
  //   path: '/excel',
  //   component: Layout,
  //   redirect: '/excel/export-excel',
  //   name: 'Excel',
  //   meta: {
  //     title: 'Excel',
  //     icon: 'excel'
  //   },
  //   children: [
  //     {
  //       path: 'export-excel',
  //       component: () => import('@/views/excel/export-excel'),
  //       name: 'ExportExcel',
  //       meta: { title: 'Export Excel' }
  //     },
  //     {
  //       path: 'export-selected-excel',
  //       component: () => import('@/views/excel/select-excel'),
  //       name: 'SelectExcel',
  //       meta: { title: 'Export Selected' }
  //     },
  //     {
  //       path: 'export-merge-header',
  //       component: () => import('@/views/excel/merge-header'),
  //       name: 'MergeHeader',
  //       meta: { title: 'Merge Header' }
  //     },
  //     {
  //       path: 'upload-excel',
  //       component: () => import('@/views/excel/upload-excel'),
  //       name: 'UploadExcel',
  //       meta: { title: 'Upload Excel' }
  //     }
  //   ]
  // },

  // {
  //   path: '/zip',
  //   component: Layout,
  //   redirect: '/zip/download',
  //   alwaysShow: true,
  //   name: 'Zip',
  //   meta: { title: 'Zip', icon: 'zip' },
  //   children: [
  //     {
  //       path: 'download',
  //       component: () => import('@/views/zip/index'),
  //       name: 'ExportZip',
  //       meta: { title: 'Export Zip' }
  //     }
  //   ]
  // },

  // {
  //   path: '/pdf',
  //   component: Layout,
  //   redirect: '/pdf/index',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/pdf/index'),
  //       name: 'PDF',
  //       meta: { title: 'PDF', icon: 'pdf' }
  //     }
  //   ]
  // },
  // {
  //   path: '/pdf/download',
  //   component: () => import('@/views/pdf/download'),
  //   hidden: true
  // },

  // {
  //   path: '/theme',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/theme/index'),
  //       name: 'Theme',
  //       meta: { title: 'Theme', icon: 'theme' }
  //     }
  //   ]
  // },

  // {
  //   path: '/clipboard',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/clipboard/index'),
  //       name: 'ClipboardDemo',
  //       meta: { title: 'Clipboard', icon: 'clipboard' }
  //     }
  //   ]
  // },

  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://github.com/PanJiaChen/vue-element-admin',
  //       meta: { title: 'External Link', icon: 'link' }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
